<script setup lang="ts">
  import { useFetch } from '@/shared/hooks';
  import ArticlePreview from './ArticlePreview.vue';
  import { Article, LIMIT, feedApiService } from '..';
  import PopularTags from './PopularTags.vue';
  import Pagination from './Pagination.vue';
  import { useRoute } from 'vue-router';
  import { onMounted, watch } from 'vue';
  import Tabs from './Tabs.vue';

  const route = useRoute();

  const { result: articlesResult, fetchData: fetchArticles } = useFetch(feedApiService.getArticles, true);

  const updateArticles = () => {
    fetchArticles(
      Number(route.query.page ?? 1), 
      route.query.tag ? String(route.query.tag) : null, 
      Number(route.query.limit ?? LIMIT), 
      route.query.source ? String(route.query.source) : undefined
    )
  }

  onMounted(() => {
    updateArticles();
  })

  watch(() => route.query, () => {
    updateArticles();
  }, { deep: true });

  const toggleFavorite = ({slug, favorited}: Partial<Article>) => {
    const articles = articlesResult.value?.data.articles
    const index = articles?.findIndex(article => article.slug === slug);

    if (articles && index !== undefined && index !== -1) {
      articles[index].favorited = !!favorited
      articles[index].favoritesCount = favorited ? articles[index].favoritesCount + 1 : articles[index].favoritesCount - 1
    }
  }

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
          <Tabs />

          <ArticlePreview 
            v-for="article in articlesResult?.data?.articles" 
            :key="article.slug" 
            :article="article" 
            @favourited='toggleFavorite'
          />
          <Pagination :articles-count='articlesResult?.data.articlesCount'/>
        </div>
        <div class="col-md-3">
          <PopularTags />
        </div>
      </div>
    </div>
  </div>
</template>
