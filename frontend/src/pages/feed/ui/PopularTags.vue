<script setup lang="ts">
  import { useFetch } from '@/shared/hooks';
  import { LIMIT, feedApiService } from '..';
  import { useRoute } from 'vue-router';

  const route = useRoute();

  const { result: tagsResult } = useFetch(feedApiService.getTags);
</script>

<template>
  <div class="sidebar">
    <p>Popular Tags</p>
    <div class="tag-list">
      <router-link
        v-for="tag in tagsResult?.data?.tags"
        :key="tag"
        :to="{ name: 'feed', query: { ...route.query, source: undefined, tag, page: 1, limit: route.query.limit ?? LIMIT } }"
        class="tag-pill tag-default"
      >
        {{ tag }}
      </router-link>
    </div>
  </div>
</template>
