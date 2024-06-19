import { User } from '@/pages/sign-in';
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

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

  onMounted(() => {
    updateUserFromSession()
  })

  watch(() => route.name, () => {
    updateUserFromSession()
  })

  return {
    route,
    currentUser,
    setUser,
  }
}