import { getEntities, BaseEntity } from "./events";

export const getComments = async (
  apiHeaders: HeadersInit,
  targetId: string
) => {
  const { entities, users } = await getEntities<Comment>(apiHeaders, {
    type: "comment",
    targetId
  });
  return { comments: entities, users };
};

export type Comment = BaseEntity & {
  content: string;
};
