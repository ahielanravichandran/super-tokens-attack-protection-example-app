import EmailPassword from "supertokens-auth-react/recipe/emailpassword";
import { getRequestId } from "./security";
import { getWebsiteDomain } from "./config/domains";
import { getApiDomain } from "./config/domains";
import { GetRedirectionURLContext } from "supertokens-auth-react/lib/build/types";
import Session from "supertokens-auth-react/recipe/session";
import PasswordlessLogin from "supertokens-auth-react/recipe/passwordless";

export const SuperTokensConfig = {
  appInfo: {
    appName: "SuperTokens Demo App",
    apiDomain: getApiDomain(),
    websiteDomain: getWebsiteDomain(),
  },
  // recipeList contains all the modules that you want to
  // use from SuperTokens. See the full list here: https://supertokens.com/docs/guides
  recipeList: [
    EmailPassword.init({
      preAPIHook: async (context) => {
        const url = context.url;
        const requestInit = context.requestInit;
        const action = context.action;
        if (
          action === "EMAIL_PASSWORD_SIGN_IN" ||
          action === "EMAIL_PASSWORD_SIGN_UP" ||
          action === "SEND_RESET_PASSWORD_EMAIL"
        ) {
          const requestId = await getRequestId();
          const body = context.requestInit.body;
          if (body !== undefined) {
            const bodyJson = JSON.parse(body as string);
            bodyJson.requestId = requestId;
            requestInit.body = JSON.stringify(bodyJson);
          }
        }
        return {
          requestInit,
          url,
        };
      },
    }),
    PasswordlessLogin.init({
      contactMethod: "PHONE",
    }),
    Session.init(),
  ],
  getRedirectionURL: async (context: GetRedirectionURLContext) => {
    if (context.action === "SUCCESS" && context.newSessionCreated) {
      return "/dashboard";
    }
  },
};
