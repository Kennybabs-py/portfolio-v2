export default defineNuxtPlugin(() => {
  const isLoading = ref(true);

  function finishLoader() {
    isLoading.value = false;
  }

  return {
    provide: {
      loader: {
        isLoading,
        finishLoader,
      },
    },
  };
});
