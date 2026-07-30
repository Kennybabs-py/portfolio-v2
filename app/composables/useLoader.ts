export function useLoader() {
  const { $loader } = useNuxtApp();

  return {
    isLoading: $loader.isLoading,
    loaderFinished: $loader.loaderFinished,
    finishLoader: $loader.finishLoader,
    resetLoader: $loader.resetLoader,
  };
}
