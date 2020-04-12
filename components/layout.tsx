import { Facebook } from "./facebook";
import { useContext } from "react";
import { UserContext } from "../utils/user";

export const Layout = ({ children }) => {
  const user = useContext(UserContext);

  return (
    <div className="">
      <div className="bg-teal-500 p-6">
        <nav className="container mx-auto flex items-center justify-between flex-wrap border-bottom-black text-white">
          <div className="flex-grow">
            <a href="/">C-19 Action</a>
          </div>
          <div>{user ? <div>hello, {user.name}</div> : <Facebook />}</div>
        </nav>
      </div>
      <div className="container mx-auto">{children}</div>
    </div>
  );
};
