<script setup lang="ts">
import { useUserSession } from '@/shared/hooks'

const emits = defineEmits(['tabChanged'])
const { route } = useUserSession()
const profilePageName = 'profile'
const profileFavoritesPageName = 'profile-favorites'
</script>

<template>
  <div class="articles-toggle">
    <ul class="nav nav-pills outline-active">
      <li class="nav-item">
        <router-link
          data-test="my-articles-link"
          :to="{ name: profilePageName, params: { username: route.params.username } }"
          class="nav-link"
          :class="{ active: route.name === profilePageName }"
          @click="emits('tabChanged', profilePageName)"
        >
          My Articles
        </router-link>
      </li>
      <li class="nav-item">
        <router-link
          data-test="favorited-articles-link"
          :to="{ name: profileFavoritesPageName, params: { username: route.params.username } }"
          class="nav-link"
          :class="{ active: route.name === profileFavoritesPageName }"
          @click="emits('tabChanged', profileFavoritesPageName)"
        >
          Favorited Articles
        </router-link>
      </li>
    </ul>
  </div>
</template>
