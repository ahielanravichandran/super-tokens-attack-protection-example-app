import EmailPassword from "supertokens-node/recipe/emailpassword";
import Session from "supertokens-node/recipe/session";
import { TypeInput } from "supertokens-node/types";
import Dashboard from "supertokens-node/recipe/dashboard";
import UserRoles from "supertokens-node/recipe/userroles";
import { handleSecurityChecks } from "security/securityChecks";
import { getBruteForceConfig } from "security/securityChecks";
import { getIpFromRequest } from "security/securityChecks";
import { CONNECTION_URI, CORE_API_KEY } from "security/constants";

export function getApiDomain() {
  const apiPort = process.env.VITE_APP_API_PORT || 3001;
  const apiUrl = process.env.VITE_APP_API_URL || `http://localhost:${apiPort}`;
  return apiUrl;
}

export function getWebsiteDomain() {
  const websitePort = process.env.VITE_APP_WEBSITE_PORT || 3000;
  const websiteUrl =
    process.env.VITE_APP_WEBSITE_URL || `http://localhost:${websitePort}`;
  return websiteUrl;
}

export const SuperTokensConfig: TypeInput = {
  supertokens: {
    // this is the location of the SuperTokens core.
    connectionURI: CONNECTION_URI,
    apiKey: CORE_API_KEY,
  },
  appInfo: {
    appName: "SuperTokens Demo App",
    apiDomain: getApiDomain(),
    websiteDomain: getWebsiteDomain(),
  },
  // recipeList contains all the modules that you want to
  // use from SuperTokens. See the full list here: https://supertokens.com/docs/guides
  recipeList: [
    // Initialize SuperTokens with email password configuration
    EmailPassword.init({
      override: {
        apis: (originalImplementation) => {
          return {
            ...originalImplementation,
            signUpPOST: async function (input) {
              const requestId = (await input.options.req.getJSONBody())
                .requestId;
              if (!requestId) {
                return {
                  status: "GENERAL_ERROR",
                  message: "Request ID is required",
                };
              }
              const actionType = "emailpassword-sign-up";
              const ip = getIpFromRequest(input.options.req);
              const email = input.formFields.find((f) => f.id === "email")
                ?.value as string;
              const password = input.formFields.find((f) => f.id === "password")
                ?.value as string;
              const bruteForceConfig = getBruteForceConfig(
                email,
                ip,
                actionType
              );
              const securityCheckResponse = await handleSecurityChecks({
                requestId,
                email,
                password,
                bruteForceConfig,
                actionType,
              });
              if (securityCheckResponse) {
                return securityCheckResponse;
              }
              return originalImplementation.signUpPOST!(input);
            },
            signInPOST: async function (input) {
              const requestId = (await input.options.req.getJSONBody())
                .requestId;
              if (!requestId) {
                return {
                  status: "GENERAL_ERROR",
                  message: "Request ID is required",
                };
              }
              const actionType = "emailpassword-sign-in";
              const ip = getIpFromRequest(input.options.req);
              const email = input.formFields.find((f) => f.id === "email")
                ?.value as string;
              const bruteForceConfig = getBruteForceConfig(
                email,
                ip,
                actionType
              );
              const securityCheckResponse = await handleSecurityChecks({
                requestId,
                email,
                bruteForceConfig,
                actionType,
              });
              if (securityCheckResponse) {
                return securityCheckResponse;
              }
              return originalImplementation.signInPOST!(input);
            },
          };
        },
      },
    }),
    Session.init(),
    Dashboard.init(),
    UserRoles.init(),
  ],
};
