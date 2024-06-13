<script setup lang="ts">
  import { useFetch } from '@/shared/hooks';
  import ArticlePreview from './ArticlePreview.vue';
  import { useRoute } from 'vue-router';
  import { computed, ref, watch } from 'vue';
  import { Pagination, LIMIT, feedApiService } from '../api';

  const route = useRoute();
  const pagination = ref<Pagination>({
    tag: null,
    page: 1,
    limit: LIMIT,
  })

  const { result: articlesResult, fetchData: fetchArticles } = useFetch((...args) => feedApiService.getArticles(...args));
  const { result: tagsResult } = useFetch(() => feedApiService.getTags());

  const pages = computed(() => {
    const articlesCount = articlesResult.value?.data?.articlesCount;
    const length = articlesCount ? Math.ceil(articlesCount / pagination.value.limit) : 1;

    return Array.from({ length }, (_, index) => index + 1);
  })

  watch(() => route.query, (newQuery) => {
    if (newQuery.tag) {
      pagination.value.page = 1;
      pagination.value.tag = String(newQuery.tag);
    }
    if (newQuery.page) {
      pagination.value.page = Number(newQuery.page);
    }
    if (newQuery.limit) {
      pagination.value.limit = Number(newQuery.limit)
    }
    
    const { tag, limit, page} = pagination.value;
    fetchArticles(page, tag, limit)
  }, {deep: true});
  
</script>

<template>
  <div class="home-page">
    <div class="banner">
      <div class="container">
        <h1 class="logo-font">conduit</h1>
        <p>A place to share your knowledge.</p>
      </div>
    </div>
    <div class="container page">
      <div class="row">
        <div class="col-md-9">
          <ArticlePreview 
            v-for="article in articlesResult?.data?.articles" 
            :key="article.slug" 
            :article="article" 
          />
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
                  v-if="pagination.page === page"  
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
                    :to="{ name: 'feed', query: { tag: pagination.tag, page, limit: pagination.limit } }"
                  >
                    {{ page }}
                  </router-link>
                </li>
              </template>
            </ul>
          </form>
        </div>
        <div class="col-md-3">
          <div class="sidebar">
            <p>Popular Tags</p>
            <div class="tag-list">
              <router-link
                v-for="tag in tagsResult?.data?.tags"
                :key="tag"
                :to="{ name: 'feed', query: { tag, page: pagination.page, limit: pagination.limit } }"
                class="tag-pill tag-default"
              >
                {{ tag }}
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
