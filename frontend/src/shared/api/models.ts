import type { components } from "./v1";

export type Article = components["schemas"]["Article"];
export type MultipleArticlesResponse = components["responses"]["MultipleArticlesResponse"]['content']['application/json'];
export type TagsResponse = components["responses"]["TagsResponse"]['content']['application/json'];
export type User = components["schemas"]["User"];
