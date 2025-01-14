export const SECRET_API_KEY = process.env.SUPERTOKENS_SECRET_API_KEY;
if (!SECRET_API_KEY) {
  throw new Error("SECRET_API_KEY is required");
}
export const CORE_API_KEY = process.env.SUPERTOKENS_SECRET_CORE_API_KEY;
export const CONNECTION_URI =
  process.env.SUPERTOKENS_CONNECTION_URI || "https://try.supertokens.com";
export const ANOMALY_DETECTION_API_URL =
  "https://security-us-east-1.aws.supertokens.io/v1/security";
