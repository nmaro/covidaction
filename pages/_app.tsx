import "../css/tailwind.css";
import { APIHeadersContext } from "../utils/api";
import { UserContext, UsersContext } from "../utils/user";
import { createContext, useState } from "react";

export const PageStateContext = createContext<(state: any) => void>(undefined);

export default ({ Component, pageProps }) => {
  const [pageState, setPageState] = useState(pageProps);
  return (
    <PageStateContext.Provider
      value={async getState => setPageState(await getState(pageState))}
    >
      <UsersContext.Provider value={pageState.users}>
        <APIHeadersContext.Provider value={pageState.apiHeaders}>
          <UserContext.Provider value={pageState.user}>
            <Component {...pageState} />
          </UserContext.Provider>
        </APIHeadersContext.Provider>
      </UsersContext.Provider>
    </PageStateContext.Provider>
  );
};
