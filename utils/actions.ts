import { getEntities, BaseEntity } from "./events";

export const getActions = async (apiHeaders: HeadersInit) => {
  const { entities, users } = await getEntities(apiHeaders, { type: "action" });
  return { actions: entities, users };
};

export const getAction = async (apiHeaders: HeadersInit, id: string) => {
  const { entities, users } = await getEntities<Action>(apiHeaders, {
    type: "action",
    id
  });
  return { action: entities[0], users };
};

export type Action = BaseEntity & {
  title: string;
  description: string;
};
