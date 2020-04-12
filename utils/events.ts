import { apiFetch } from "./api";

export const getEvents = async (
  apiHeaders: HeadersInit
): Promise<{ events: Event[]; users: User[] }> =>
  await apiFetch(apiHeaders, "/events");

type Primitive = string | number | boolean;

export type CreateEvent = {
  id: string;
  key: string;
  value: Primitive;
};

export type User = {
  _id: string;
  name: string;
};

export type Event = CreateEvent & {
  _id: string;
  date: number;
  userId: string;
};

export const postEvents = async (
  apiHeaders: HeadersInit,
  events: CreateEvent[]
) =>
  await apiFetch(apiHeaders, "/events", {
    method: "POST",
    body: JSON.stringify(events)
  });

export const set = async (
  apiHeaders: HeadersInit,
  id: string,
  values: { [key: string]: Primitive }
) =>
  await postEvents(
    apiHeaders,
    Object.keys(values).map(key => ({
      id,
      key,
      value: values[key]
    }))
  );

export type BaseEntity = {
  id: string;
  userId: string;
  created: number;
};

export type Entity = BaseEntity & {
  [key: string]: Primitive;
};

export const getEntities = async <T extends BaseEntity>(
  apiHeaders: HeadersInit,
  filters: { [key: string]: Primitive }
): Promise<{ entities: T[]; users: User[] }> => {
  const { events, users } = await getEvents(apiHeaders);

  const entitiesById = {};
  let entities: T[] = [];

  for (const event of events) {
    const entityId = `${event.userId}:${event.id}`;
    if (!entitiesById[entityId]) {
      entitiesById[entityId] = {
        id: entityId,
        userId: event.userId,
        created: event.date
      };
      entities.push(entitiesById[entityId]);
    }
    entitiesById[entityId][event.key] = event.value;
  }

  entities = entities.filter(entity => {
    for (const key of Object.keys(filters)) {
      if (entity[key] !== filters[key]) {
        return false;
      }
    }
    return true;
  });

  return { entities, users };
};
