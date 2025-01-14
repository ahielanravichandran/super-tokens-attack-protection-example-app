export type RequestIdModule = {
  load: (config: { endpoint: string[] }) => Promise<{
    get: (params: {
      tag: { environmentId: string };
    }) => Promise<{ requestId: string }>;
  }>;
  defaultEndpoint: string;
};

export type SecurityResponse = {
  status: "GENERAL_ERROR";
  message: string;
};
