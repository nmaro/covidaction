import { NextPageContext } from "next";

import { getAction, Action } from "../../utils/actions";
import { getApiHeaders, APIHeadersContext } from "../../utils/api";
import { getUser, UsersContext } from "../../utils/user";
import { Markdown } from "../../components/markdown";
import { Layout } from "../../components/layout";
import { getComments, Comment } from "../../utils/comments";
import { useContext, useRef } from "react";
import moment from "moment";
import { Button } from "../../components/button";
import { ulid } from "ulid";
import { set, User } from "../../utils/events";
import { PageStateContext } from "../_app";

type BaseProps = {
  id: string;
  apiHeaders: HeadersInit;
};
type State = BaseProps & {
  user: User;
  action: Action;
  comments: Comment[];
  users: User[];
};

const getProps = async ({ id, apiHeaders }: BaseProps): Promise<State> => {
  const user = await getUser(apiHeaders);

  const { action, users } = await getAction(apiHeaders, id);
  if (!action) {
    throw new Error("Not found");
  }

  const { comments, users: commentUsers } = await getComments(apiHeaders, id);

  return {
    id,
    user,
    apiHeaders,
    action,
    comments,
    users: [...users, ...commentUsers]
  };
};

const ActionComponent = ({
  action,
  comments
}: {
  action: Action;
  comments: Comment[];
  setPageState: (state: State) => void;
}) => {
  const users = useContext(UsersContext);
  const user = users.find(user => user._id === action.userId);
  return (
    <Layout>
      <div>
        <div>
          <h1>{action.title}</h1>
        </div>
        <div>{moment(action.created).format("YYYY-MM-DD")}</div>
        <div>{user.name}</div>
        <div>
          <Markdown content={action.description} />
        </div>
        <Button>Done</Button>
      </div>
      {comments.map(comment => (
        <CommentComponent key={comment.id} comment={comment} />
      ))}
      <CreateComment action={action} />
    </Layout>
  );
};

ActionComponent.getInitialProps = async (ctx: NextPageContext) => {
  const apiHeaders = getApiHeaders(ctx);
  return await getProps({ id: ctx.query.id as string, apiHeaders });
};

export default ActionComponent;

const CommentComponent = ({ comment }: { comment: Comment }) => {
  const users = useContext(UsersContext);
  const user = users.find(user => user._id === comment.userId);

  return (
    <div>
      <div>{moment(comment.created).format("YYYY-MM-DD")}</div>
      <div>{user.name}</div>
      <div>
        <Markdown content={comment.content} />
      </div>
    </div>
  );
};

const CreateComment = ({ action }: { action: Action }) => {
  const content = useRef(null);
  const apiHeaders = useContext(APIHeadersContext);
  const setPageState = useContext(PageStateContext);

  return (
    <form
      onSubmit={async e => {
        e.preventDefault();
        const id = ulid();
        await set(apiHeaders, id, {
          type: "comment",
          targetId: action.id,
          content: content.current.value
        });
        setPageState(getProps);
        content.current.value = "";
      }}
    >
      <textarea ref={content}></textarea>
      <Button>Comment</Button>
    </form>
  );
};
