<script setup lang="ts">
  import { computed } from 'vue';
  import { LIMIT } from '../api';
  import { useRoute } from 'vue-router';

  const route = useRoute();
  
  const props = defineProps<{ articlesCount?: number }>()
  const emits = defineEmits((['onPaginationChange']))

  const pages = computed(() => {
    const articlesCount = props.articlesCount;
    const length = articlesCount ? Math.ceil(articlesCount / Number(route.query.limit ?? LIMIT)) : 1;

    return Array.from({ length }, (_, index) => index + 1);
  })
</script>

<template>
  <form>
    <ul 
      v-if='pages.length > 1' 
      class="pagination"
    >
      <template 
        v-for='page of pages'
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
            :to="{ name: 'feed', query: { ...route.query, page, tag: route.query.tag, limit: route.query.limit ?? LIMIT } }"
          >
            {{ page }}
          </router-link>
        </li>
      </template>
    </ul>
  </form>
</template>
