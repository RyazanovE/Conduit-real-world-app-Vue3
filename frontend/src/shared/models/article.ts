import { components } from '../api/v1';

export type SingleArticleResponse = components["responses"]["SingleArticleResponse"]['content']['application/json'];
export type MultipleCommentsResponse = components["responses"]["MultipleCommentsResponse"]['content']['application/json']
export type EmptyOkResponse = components["responses"]["EmptyOkResponse"]['content']
export type NewCommentRequest = components["requestBodies"]["NewCommentRequest"]['content']['application/json']
export type UpdateArticleRequest = components["requestBodies"]["UpdateArticleRequest"]['content']['application/json']
export type SingleCommentResponse = components["responses"]["SingleCommentResponse"]['content']['application/json']
export type MultipleArticlesResponse = components["responses"]["MultipleArticlesResponse"]['content']['application/json'];
export type TagsResponse = components["responses"]["TagsResponse"]['content']['application/json'];
export type Article = components["schemas"]["Article"];
export type NewArticleRequest = components["requestBodies"]["NewArticleRequest"]['content']['application/json'];

