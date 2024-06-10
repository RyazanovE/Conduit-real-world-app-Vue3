import { ref, Ref } from 'vue';

interface FetchState<T> {
  result: Ref<T | null>;
  error: Ref<Error | null>;
  isLoading: Ref<boolean>;
  fetchData: (tag?: string) => Promise<void>
}

export function useFetch<T>(fetchFunc: (tag?: string) => Promise<T>): FetchState<T> {
  const result: Ref<T | null> = ref(null);
  const error = ref<Error | null>(null);
  const isLoading = ref<boolean>(false);

  const fetchData = async (tag?: string) => {
    isLoading.value = true;
    try {
      const res = await fetchFunc(tag);
      result.value = res;
    } catch (err) {
      error.value = err as Error;
    } finally {
      isLoading.value = false;
    }
  };

  fetchData();

  return {
    result,
    error,
    isLoading,
    fetchData
  };
}
