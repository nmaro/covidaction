import { NextPageContext } from "next";
import fetch from "isomorphic-unfetch";
import React from "react";

export const apiFetch = async (
  apiHeaders: HeadersInit,
  path: string,
  init?: RequestInit
) => {
  const result = await fetch(`${process.env.ORIGIN}/api${path}`, {
    ...init,
    headers: {
      ...init?.headers,
      "content-type": "application/json",
      ...apiHeaders
    }
  });
  return await result.json();
};

export const getApiHeaders = ({ req }: NextPageContext): HeadersInit =>
  process.browser ? {} : { cookie: req.headers.cookie };

export const APIHeadersContext = React.createContext(undefined);
