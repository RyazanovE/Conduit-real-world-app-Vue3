import { components } from '@/shared/api/v1';

export type LoginUserRequest = components["requestBodies"]["LoginUserRequest"]['content']["application/json"];
export type NewUserRequest = components["requestBodies"]["NewUserRequest"]['content']["application/json"];
export type UpdateUserRequest = components["requestBodies"]["UpdateUserRequest"]['content']["application/json"];
export type UserResponse = components["responses"]["UserResponse"]['content']["application/json"];
export type User = components["schemas"]["User"]
export type UpdateUser = components["schemas"]["UpdateUser"]
