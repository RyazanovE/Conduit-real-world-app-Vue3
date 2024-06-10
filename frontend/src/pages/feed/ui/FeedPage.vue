<script setup lang="ts">
  import { useFetch } from '@/shared/hooks';
  import ArticlePreview from './ArticlePreview.vue';
  import { useRoute } from 'vue-router';
  import { watch } from 'vue';
  import { feedApiService } from '../api';

  const route = useRoute();

  const { result: articlesResult, fetchData: fetchArticles } = useFetch((tag) => feedApiService.getArticles(tag));
  const { result: tagsResult } = useFetch(() => feedApiService.getTags());

  watch(() => route.query.tag, (newTag) => fetchArticles(newTag as string || undefined));
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
        </div>
        <div class="col-md-3">
          <div class="sidebar">
            <p>Popular Tags</p>
            <div class="tag-list">
              <router-link
                v-for="tag in tagsResult?.data?.tags"
                :key="tag"
                :to="{ name: 'feed', query: { tag } }"
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
