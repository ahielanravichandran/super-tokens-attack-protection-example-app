import { RequestIdModule } from "./types";

const ENVIRONMENT_ID = import.meta.env.VITE_APP_SUPERTOKENS_ENV_ID;
const PUBLIC_API_KEY = import.meta.env.VITE_APP_SUPERTOKENS_PUBLIC_KEY;

let supertokensRequestIdPromise: Promise<{
  get: (params: {
    tag: { environmentId: string };
  }) => Promise<{ requestId: string }>;
}>;

export async function initRequestIdGenerator() {
  if (!supertokensRequestIdPromise) {
    supertokensRequestIdPromise = import(
      "https://deviceid.supertokens.io/PqWNQ35Ydhm6WDUK/k9bwGCuvuA83Ad6s?apiKey=" +
        PUBLIC_API_KEY
    ).then((RequestId: RequestIdModule) =>
      RequestId.load({
        endpoint: [
          "https://deviceid.supertokens.io/PqWNQ35Ydhm6WDUK/CnsdzKsyFKU8Q3h2",
          RequestId.defaultEndpoint,
        ],
      })
    );
  }
  return supertokensRequestIdPromise;
}

export async function getRequestId() {
  const sdk = await initRequestIdGenerator();
  const result = await sdk.get({
    tag: {
      environmentId: ENVIRONMENT_ID,
    },
  });
  return result.requestId;
}
