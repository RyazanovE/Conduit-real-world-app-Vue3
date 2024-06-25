<script setup lang="ts">
import type { LocationQueryRaw } from 'vue-router'
import { useRouter } from 'vue-router'
import { useUserSession } from '@/shared/hooks'

const router = useRouter()

const { currentUser, route } = useUserSession()

function navigate(query?: LocationQueryRaw) {
  router.push({ ...route, query })
}
</script>

<template>
  <form @submit.prevent>
    <div class="feed-toggle">
      <ul class="nav nav-pills outline-active">
        <li v-if="currentUser !== null" class="nav-item">
          <button
            class="nav-link"
            :class="{ active: route.query.source === 'my-feed' }"
            @click="navigate({ source: 'my-feed' })"
          >
            Your Feed
          </button>
        </li>
        <li class="nav-item">
          <button
            class="nav-link"
            :class="{ active: !route.query.tag && !route.query.source }"
            @click="navigate({ source: undefined })"
          >
            Global Feed
          </button>
        </li>
        <li v-if="!!route.query.tag" class="nav-item">
          <span class="nav-link active">
            <i class="ion-pound" /> {{ route.query.tag }}
          </span>
        </li>
      </ul>
    </div>
  </form>
</template>
