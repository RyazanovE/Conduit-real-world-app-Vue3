import { components } from '@/shared/api/v1';

export type MultipleArticlesResponse = components["responses"]["MultipleArticlesResponse"]['content']['application/json'];
export type TagsResponse = components["responses"]["TagsResponse"]['content']['application/json'];
export type Article = components["schemas"]["Article"];
