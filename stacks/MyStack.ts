import { StackContext, Api, EventBus, StaticSite, Table } from "sst/constructs";

export function API({ stack }: StackContext) {
  const bus = new EventBus(stack, "bus", {
    defaults: {
      retries: 10,
    },
  });

  const contactsTable = new Table(stack, "Contacts", {
    fields: {
      id: "string",
    },
    primaryIndex: { partitionKey: "id" },
  });

  const site= new StaticSite(stack, "website", {
    path:"public"
  })

  const api = new Api(stack, "api", {
    defaults: {
      function: {
        bind: [bus, contactsTable],
      },
    },
    routes: {
      "GET /": "packages/functions/src/lambda.handler",
      "GET /todo": "packages/functions/src/todo.list",
      "POST /todo": "packages/functions/src/todo.create",
      "POST /contact": {
        function: {
           handler: "packages/functions/src/contact.handler",
           bind: [contactsTable],
        },
      },
    },
  });

  bus.subscribe("todo.created", {
    handler: "packages/functions/src/events/todo-created.handler",
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
    siteUrl: site.url
  });
}
