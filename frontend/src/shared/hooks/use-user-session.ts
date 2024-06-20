import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { User } from '../models';

export const useUserSession = () => {
  const currentUser = ref<User | null>(null);
  const route = useRoute();

  const updateUserFromSession = () => {
    const userData = localStorage.getItem('user');

    if (userData) {
      const user = JSON.parse(userData);
      currentUser.value = user
    } else {
      currentUser.value = null;
    }
  }

  const setUser = (user: User) => {
    localStorage.setItem('user', JSON.stringify(user));

  }

  const deleteUser = () => {
    localStorage.removeItem('user');
  }

  onMounted(() => {
    updateUserFromSession()
  })

  watch(() => route.name, () => {
    updateUserFromSession()
  })

  return {
    deleteUser,
    route,
    currentUser,
    setUser,
  }
}