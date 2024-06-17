import { AxiosError } from 'axios';
import { ref, Ref } from 'vue';

interface FetchState<T, P extends any[]> {
  result: Ref<T | null>;
  error: Ref<AxiosError | null>;
  isLoading: Ref<boolean>;
  isError: Ref<boolean>;
  fetchData: (...params: P) => Promise<void>;
}

export function useFetch<T, P extends unknown[]>(
  fetchFunc: (...params: P) => Promise<T>,
  manual = false
): FetchState<T, P> {
  const result: Ref<T | null> = ref(null);
  const error = ref<AxiosError | null>(null);
  const isLoading = ref<boolean>(false);
  const isError = ref<boolean>(false);

  const fetchData = async (...args: P) => {
    isLoading.value = true;
    isError.value = false;

    try {
      const res = await fetchFunc(...args);
      result.value = res;
    } catch (err) {
      isError.value = true;
      error.value = err as AxiosError;
    } finally {
      isLoading.value = false;
    }
  };

  if (!manual) {
    // @ts-ignore
    fetchData();
  }

  return {
    result,
    error,
    isLoading,
    isError,
    fetchData
  };
}
