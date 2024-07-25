<script setup lang="ts">
import { RouteNames } from '@/app/routes'
</script>

<template>
  <footer>
    <div class="container">
      <router-link :to="{ name: RouteNames.FEED }" class="logo-font">
        conduit
      </router-link>
      <span class="attribution">
        An interactive learning project from <a href="https://thinkster.io">Thinkster</a>. Code &amp;
        design licensed under MIT.
      </span>
    </div>
  </footer>
</template>
