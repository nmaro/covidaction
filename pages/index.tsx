import moment from "moment";
import { NextPageContext } from "next/dist/next-server/lib/utils";
import { useContext } from "react";

import { AnchorButton } from "../components/button";
import { Layout } from "../components/layout";
import { Action, getActions } from "../utils/actions";
import { getApiHeaders } from "../utils/api";
import { getUser, UserContext, UsersContext } from "../utils/user";

const EXCERPT_LENGTH = 50;

const Home = ({ actions }: { actions: Action[] }) => {
  const user = useContext(UserContext);
  return (
    <Layout>
      {user && <AnchorButton href="/action/create">Create Action</AnchorButton>}
      {actions.map(action => (
        <ActionComponent key={action.id} action={action} />
      ))}
    </Layout>
  );
};

Home.getInitialProps = async (ctx: NextPageContext) => {
  const apiHeaders = getApiHeaders(ctx);
  const user = await getUser(apiHeaders);
  const { actions, users } = await getActions(apiHeaders);
  return { apiHeaders, user, actions, users };
};

export default Home;

const ActionComponent = ({ action }: { action: Action }) => {
  const users = useContext(UsersContext);
  console.log(action, users);
  const user = users.find(user => user._id === action.userId);

  return (
    <div>
      <div>
        <h2>
          <a href={`/action/${action.id}`}>{action.title}</a>
        </h2>
      </div>
      <div>{moment(action.created).format("YYYY-MM-DD")}</div>
      <div>{user.name}</div>
      <div>
        <a href={`/action/${action.id}`}>
          {action.description.length > EXCERPT_LENGTH
            ? `${action.description.substr(0, EXCERPT_LENGTH)}...`
            : action.description}
        </a>
      </div>
    </div>
  );
};
