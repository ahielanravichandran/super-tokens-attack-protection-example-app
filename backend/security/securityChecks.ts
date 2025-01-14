import axios from "axios";
import { createHash } from "crypto";
import {
  SecurityInputType,
  SecurityRequestBody,
  SecurityResponse,
} from "./types";
import { BaseRequest } from "supertokens-node/lib/build/framework/request";
import { ANOMALY_DETECTION_API_URL, SECRET_API_KEY } from "./constants";

export async function handleSecurityChecks(
  input: SecurityInputType
): Promise<SecurityResponse> {
  const requestBody: SecurityRequestBody = {};

  if (input.requestId !== undefined) {
    requestBody.requestId = input.requestId;
  }

  let passwordHash: string | undefined;
  if (input.password !== undefined) {
    const shasum = createHash("sha1");
    shasum.update(input.password);
    passwordHash = shasum.digest("hex");
    requestBody.passwordHashPrefix = passwordHash.slice(0, 5);
  }

  requestBody.bruteForce = input.bruteForceConfig;
  requestBody.email = input.email;
  requestBody.phoneNumber = input.phoneNumber;
  requestBody.actionType = input.actionType;

  try {
    const response = await axios.post(ANOMALY_DETECTION_API_URL, requestBody, {
      headers: {
        Authorization: `Bearer ${SECRET_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    const responseData = response.data;

    if (responseData.bruteForce?.detected) {
      return {
        status: "GENERAL_ERROR",
        message: "Too many attempts. Please try again later.",
      };
    }

    if (responseData.requestIdInfo?.isUsingTor) {
      return {
        status: "GENERAL_ERROR",
        message: "Tor activity detected. Please use a regular browser.",
      };
    }

    if (responseData.requestIdInfo?.vpn?.result) {
      return {
        status: "GENERAL_ERROR",
        message: "VPN activity detected. Please use a regular network.",
      };
    }

    if (responseData.requestIdInfo?.botDetected) {
      return {
        status: "GENERAL_ERROR",
        message: "Bot activity detected.",
      };
    }

    if (responseData?.passwordBreaches && passwordHash) {
      const suffix = passwordHash.slice(5).toUpperCase();
      if (responseData.passwordBreaches[suffix]) {
        return {
          status: "GENERAL_ERROR",
          message:
            "This password has been detected in a breach. Please use a different password.",
        };
      }
    }

    return undefined;
  } catch (err) {
    console.error("Security check failed:", err);
    return undefined;
  }
}

export function getIpFromRequest(req: BaseRequest): string {
  return (
    req.getHeaderValue("x-forwarded-for")?.toString() ||
    req.original.ip ||
    "127.0.0.1"
  );
}

export const getBruteForceConfig = (
  userIdentifier: string,
  ip: string,
  prefix?: string
) => [
  {
    key: `${prefix ? `${prefix}-` : ""}${userIdentifier}`,
    maxRequests: [
      { limit: 5, perTimeIntervalMS: 60 * 1000 }, // 5 attempts per minute
      { limit: 15, perTimeIntervalMS: 60 * 60 * 1000 }, // 15 attempts per hour
    ],
  },
  {
    key: `${prefix ? `${prefix}-` : ""}${ip}`,
    maxRequests: [
      { limit: 5, perTimeIntervalMS: 60 * 1000 },
      { limit: 15, perTimeIntervalMS: 60 * 60 * 1000 },
    ],
  },
];
