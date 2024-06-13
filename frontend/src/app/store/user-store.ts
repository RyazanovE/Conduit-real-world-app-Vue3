import { User } from '@/shared/api/models';
import { reactive } from 'vue';

export interface IUserState {
  user: User | null
}

export const userState = reactive<IUserState>({
  user: null
});

export const setUser = (user: User) => {
  userState.user = user;
};