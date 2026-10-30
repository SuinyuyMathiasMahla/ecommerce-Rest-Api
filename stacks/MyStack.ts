import { Api, Table, StaticSite, StackContext } from "sst/constructs";

export function MyStack({ stack }: StackContext) {
  const table = new Table(stack, "EcommerceTable", {
    fields: {
      pk: "string",
      sk: "string",
    },
    primaryIndex: { partitionKey: "pk", sortKey: "sk" },
  });

  const api = new Api(stack, "Api", {
    defaults: {
      function: {
        bind: [table],
        nodejs: {
          esbuild: {
            external: ["aws-sdk"],
          },
        },
      },
    },
    routes: {
      "POST /products": "packages/functions/src/products/create.main",
      "GET /products/{productId}": "packages/functions/src/products/get.main",
      "GET /products": "packages/functions/src/products/list.main",
      "POST /cart": "packages/functions/src/cart/add.main",
      "GET /cart/{userId}": "packages/functions/src/cart/list.main",
      "POST /cart/{userId}/checkout": "packages/functions/src/orders/checkout.main",
      "GET /order/{userId}": "packages/functions/src/orders/history.main",
    },
  });

  const site = new StaticSite(stack, "FreshMart", {
    path: "packages/frontend",
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
    SiteUrl: site.url,
  });
}
