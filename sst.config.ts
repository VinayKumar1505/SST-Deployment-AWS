export default {
  config(_input) {
    return {
      name: "SST-Deployment",
      region: "us-east-1",
    };
  },
  async stacks(app) {
    const { API } = await import("./stacks/MyStack");
    app.stack(API);
  },
} satisfies import("sst").SSTConfig;
 