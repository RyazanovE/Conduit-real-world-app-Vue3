<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { LIMIT } from '../api/feed-api-service'

const props = defineProps<{ pagesAmount?: number, pageName: string }>()

const route = useRoute()

const pages = computed(() => {
  const amount = props.pagesAmount
  const length = amount ? Math.ceil(amount / Number(route.query.limit ?? LIMIT)) : 1

  return Array.from({ length }, (_, index) => index + 1)
})
</script>

<template>
  <form>
    <ul
      v-if="pages.length > 1"
      class="pagination"
    >
      <template
        v-for="page of pages"
        :key="page"
      >
        <li
          v-if="Number(route.query.page ?? 1) === page"
          class="page-item active"
        >
          <span class="page-link">{{ page }}</span>
        </li>
        <li
          v-else
          class="page-item"
        >
          <router-link
            class="page-link"
            :to="{ name: props.pageName, query: { ...route.query, page }, params: { ...route.params } }"
          >
            {{ page }}
          </router-link>
        </li>
      </template>
    </ul>
  </form>
</template>
