import SuperTokens, { SuperTokensWrapper } from "supertokens-auth-react";
import {
  AuthRecipeComponentsOverrideContextProvider,
  getSuperTokensRoutesForReactRouterDom,
} from "supertokens-auth-react/ui";
import { SessionAuth } from "supertokens-auth-react/recipe/session";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import * as ReactRouter from "react-router-dom";
import Dashboard from "./Dashboard";
import { SuperTokensConfig } from "./config";
import Home from "./Home";
import { PreBuiltUIList } from "./config/recipe";
import { BruteForceButton } from "../components/BruteForceButton";

// Initialize SuperTokens - ideally in the global
SuperTokens.init(SuperTokensConfig);

export const ComponentWrapper = (props: {
  children: JSX.Element;
}): JSX.Element => {
  return props.children;
};

function App() {
  return (
    <SuperTokensWrapper>
      <AuthRecipeComponentsOverrideContextProvider
        components={{
          AuthPageFooter_Override: ({ DefaultComponent, ...props }) => {
            return (
              <>
                <DefaultComponent {...props} />
                <BruteForceButton targetEmail="test@protect.com" />
              </>
            );
          },
        }}
      >
        <header>
          <div className="header-container">
            <a href="/">
              <img src="/ST.svg" alt="SuperTokens" />
            </a>
          </div>
          <div className="header-container-right">
            <a
              href="https://supertokens.com/docs/guides/getting-started/react"
              target="_blank"
            >
              Docs
            </a>
            <a
              href="https://github.com/supertokens/create-supertokens-app"
              target="_blank"
            >
              CLI Repo
            </a>
          </div>
        </header>
        <ComponentWrapper>
          <div className="App app-container">
            <BrowserRouter>
              <div className="fill">
                <Routes>
                  <Route path="/" element={<Home />} />
                  {/* This shows the login UI on "/auth" route */}
                  {getSuperTokensRoutesForReactRouterDom(
                    ReactRouter,
                    PreBuiltUIList
                  )}

                  {/* This protects the "/" route so that it shows
                            <Dashboard /> only if the user is logged in.
                            Else it redirects the user to "/auth" */}
                  <Route
                    path="/dashboard"
                    element={
                      <SessionAuth>
                        <Dashboard />
                      </SessionAuth>
                    }
                  />
                </Routes>
              </div>
            </BrowserRouter>
          </div>
        </ComponentWrapper>
      </AuthRecipeComponentsOverrideContextProvider>
    </SuperTokensWrapper>
  );
}

export default App;
