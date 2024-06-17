import { User } from '@/pages/sign-in';
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

export const useUserSession = () => {
  const currentUser = ref<User | null>(null);
  const route = useRoute();

  const updateUserFromSession = () => {
    const userData = sessionStorage.getItem('user');

    if (userData) {
      const user = JSON.parse(userData);
      currentUser.value = user
    } else {
      currentUser.value = null;
    }
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
  }
}