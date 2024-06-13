<script setup lang="ts">
  import { provide } from 'vue';
  import { userState } from './app/store';
  import Header from './shared/ui/Header.vue';

  provide('userState', userState);
</script>

<template>
  <Header />
  <router-view/>
</template>

<style scoped>

</style>
