export default defineNuxtPlugin((nuxtApp) => {
  const isLoading = ref(true);
  const loaderFinished = ref(false);

  function finishLoader() {
    isLoading.value = false;

    setTimeout(() => {
      loaderFinished.value = true;
    }, 150);
  }

  function resetLoader() {
    isLoading.value = true;
    loaderFinished.value = false;
  }

  return {
    provide: {
      loader: {
        isLoading,
        loaderFinished,
        finishLoader,
        resetLoader,
      },
    },
  };
});
