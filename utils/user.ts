import jwt from "jsonwebtoken";
import { NextPageContext } from "next";
import { apiFetch } from "./api";
import React from "react";
import { User } from "./events";

export const UserContext = React.createContext<User>(undefined);

export const UsersContext = React.createContext<User[]>(undefined);

export const getUser = async (apiHeaders: HeadersInit) => {
  const { user } = await apiFetch(apiHeaders, "/user");
  return user;
};

export const getUserId = ({ req }: NextPageContext) => {
  let jwtline;
  if (process.browser) {
    jwtline = document.cookie
      .split("\n")
      .map(line => line.split("="))
      .find(([key]) => key === "jwt");
  } else {
    if (req.headers["cookie"]) {
      jwtline = req.headers["cookie"]
        .split(";")
        .map(line => line.trim().split("="))
        .find(([key]) => key === "jwt");
    }
  }
  if (!jwtline) {
    return;
  }
  const token = jwtline[1];
  const user = jwt.decode(token);
  return user["_id"];
};
