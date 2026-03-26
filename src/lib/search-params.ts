import {
  createLoader,
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
} from "nuqs/server";

import { CATEGORIES, SORT_OPTIONS, STATUSES } from "./feed-constants";

const statusValues = STATUSES.map((s) => s.value);
const categoryValues = CATEGORIES.map((c) => c.value);
const sortValues = SORT_OPTIONS.map((s) => s.value);

export const feedSearchParams = {
  status: parseAsStringLiteral(statusValues).withDefault("all"),
  category: parseAsStringLiteral(categoryValues).withDefault("all"),
  sort: parseAsStringLiteral(sortValues).withDefault("trending"),
  search: parseAsString.withDefault(""),
  page: parseAsInteger.withDefault(1),
};

export const loadFeedSearchParams = createLoader(feedSearchParams);

export type ParsedFeedSearchParams =
  ReturnType<typeof loadFeedSearchParams> extends Promise<infer T> ? T : never;
