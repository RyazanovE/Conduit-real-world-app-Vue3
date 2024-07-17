<script setup lang="ts">
import { useRoute } from 'vue-router'
import { feedApiService } from '@/shared/api'
import { useFetch } from '@/shared/hooks'

const route = useRoute()

const { result: tagsResult } = useFetch(feedApiService.getTags)
</script>

<template>
  <div class="sidebar">
    <p>Popular Tags</p>
    <div class="tag-list">
      <router-link
        v-for="tag in tagsResult?.data?.tags"
        :key="tag"
        :to="{ name: 'feed', query: { ...route.query, source: undefined, tag, page: 1 } }"
        class="tag-pill tag-default"
        data-test="popular-tag"
      >
        {{ tag }}
      </router-link>
    </div>
  </div>
</template>
