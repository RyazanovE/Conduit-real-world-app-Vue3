<script setup lang="ts">
  import { useUserSession } from '@/shared/hooks';
  
  const { route } = useUserSession()
</script>

<template>
  <div class="articles-toggle">
    <ul  class="nav nav-pills outline-active">
      <li class="nav-item">
        <router-link 
          :to="{name: 'profile', params: { username: route.params.username }}" 
          class="nav-link"
          :class="{ active: route.name === 'profile' }"
        >
          My Articles
        </router-link>
      </li>
      <li class="nav-item">
        <router-link 
          :to="{ name: 'profile-favorites', params: { username: route.params.username }}" 
          class="nav-link"
          :class="{ active: route.name === 'profile-favorites' }"
        >
          Favorited Articles
        </router-link>
      </li>
    </ul>
  </div>
</template>
