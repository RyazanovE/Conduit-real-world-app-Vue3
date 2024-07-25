<script setup lang="ts">
import { RouteNames } from '@/app/routes'
import { useUserSession } from '@/shared/hooks'

const emits = defineEmits(['tabChanged'])
const { route } = useUserSession()
</script>

<template>
  <div class="articles-toggle">
    <ul class="nav nav-pills outline-active">
      <li class="nav-item">
        <router-link
          data-test="my-articles-link"
          :to="{ name: RouteNames.PROFILE, params: { username: route.params.username } }"
          class="nav-link"
          :class="{ active: route.name === RouteNames.PROFILE }"
          @click="emits('tabChanged', RouteNames.PROFILE)"
        >
          My Articles
        </router-link>
      </li>
      <li class="nav-item">
        <router-link
          data-test="favorited-articles-link"
          :to="{ name: RouteNames.PROFILE_FAVORITES, params: { username: route.params.username } }"
          class="nav-link"
          :class="{ active: route.name === RouteNames.PROFILE_FAVORITES }"
          @click="emits('tabChanged', RouteNames.PROFILE_FAVORITES)"
        >
          Favorited Articles
        </router-link>
      </li>
    </ul>
  </div>
</template>
