<script setup lang="ts">
  import { useUserSession } from '@/shared/hooks';
  import { LocationQueryRaw, useRouter } from 'vue-router';

  const router = useRouter();

  const { currentUser, route } = useUserSession()

  const navigate = (query?: LocationQueryRaw) => {
    router.push({ ...route, query: { ...route.query, ...query } });
  };
</script>

<template>
  <form @submit.prevent>
    <div class="feed-toggle">
      <ul class="nav nav-pills outline-active">
        <li class="nav-item" v-if="currentUser !== null">
          <button
            class='nav-link'
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
        <li class="nav-item" v-if="!!route.query.tag">
          <span class="nav-link active">
            <i class="ion-pound"></i> {{ route.query.tag }}
          </span>
        </li>
      </ul>
    </div>
  </form>
</template>
