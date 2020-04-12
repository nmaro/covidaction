import { Layout } from "../../components/layout";
import { NextPageContext } from "next";
import { getUser, UserContext } from "../../utils/user";
import { Button } from "../../components/button";
import { useRef, useContext } from "react";
import { ulid } from "ulid";
import { set } from "../../utils/events";
import { getApiHeaders, APIHeadersContext } from "../../utils/api";

const CreateAction = () => {
  const user = useContext(UserContext);
  const title = useRef(null);
  const description = useRef(null);
  const apiHeaders = useContext(APIHeadersContext);

  return (
    <Layout>
      <form
        onSubmit={async e => {
          e.preventDefault();
          const id = ulid();
          await set(apiHeaders, id, {
            type: "action",
            title: title.current.value,
            description: description.current.value
          });
          document.location.href = `${process.env.ORIGIN}/action/${user._id}:${id}`;
        }}
      >
        <input ref={title} />
        <textarea ref={description}></textarea>
        <Button>Create</Button>
      </form>
    </Layout>
  );
};

CreateAction.getInitialProps = async (ctx: NextPageContext) => {
  const apiHeaders = getApiHeaders(ctx);
  const user = await getUser(apiHeaders);

  if (!user) {
    throw new Error("Forbidden");
  }

  return { user, apiHeaders };
};

export default CreateAction;
