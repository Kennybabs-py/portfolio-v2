export function useLoader() {
  const { $loader } = useNuxtApp();

  return {
    isLoading: $loader.isLoading,
    finishLoader: $loader.finishLoader,
  };
}
