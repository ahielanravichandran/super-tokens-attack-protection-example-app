export type BruteForceConfig = {
  key: string;
  maxRequests: {
    limit: number;
    perTimeIntervalMS: number;
  }[];
};

export type SecurityInputType = {
  actionType?: string;
  email?: string;
  phoneNumber?: string;
  password?: string;
  requestId?: string;
  bruteForceConfig?: BruteForceConfig[];
};

export type SecurityRequestBody = {
  requestId?: string;
  passwordHashPrefix?: string;
  bruteForce?: BruteForceConfig[];
  email?: string;
  phoneNumber?: string;
  actionType?: string;
};

export type SecurityResponse =
  | {
      status: "GENERAL_ERROR";
      message: string;
    }
  | undefined;
