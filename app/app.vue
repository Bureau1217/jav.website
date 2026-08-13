<template>
  <div class="v-app">
    <TheHeader />
    <TheScrollingBanner />
    <main>
      <NuxtPage/>
    </main>
    <TheFooter />
    <TheFloatingPromo />
  </div>
</template>

<style lang="scss">
.v-app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  main {
    flex: 1;
  }
}
</style>
