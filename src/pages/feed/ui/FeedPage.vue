<script setup lang="ts">
import { useRoute } from 'vue-router'
import { watchEffect } from 'vue'
import PopularTags from './PopularTags.vue'
import Tabs from './Tabs.vue'
import { useFetch } from '@/shared/hooks'
import { feedApiService } from '@/shared/api'
import type { Article } from '@/shared/models'
import { ArticlePreview } from '@/features/article-preview'
import { Pagination } from '@/shared/ui'

const route = useRoute()

const { result: articlesResult, fetchData: fetchArticles } = useFetch(feedApiService.getArticles, true)

function updateArticles() {
  articlesResult.value = null

  const page = Number(route.query.page ?? 1)
  const tag = route.query.tag ? String(route.query.tag) : undefined
  const source = route.query.source ? String(route.query.source) : undefined

  fetchArticles({ page, tag, source })
}

function toggleFavorite({ slug, favorited }: Partial<Article>) {
  const articles = articlesResult.value?.data.articles
  const index = articles?.findIndex(article => article.slug === slug)

  if (articles && index !== undefined && index !== -1) {
    articles[index].favorited = !!favorited
    articles[index].favoritesCount = favorited ? articles[index].favoritesCount + 1 : articles[index].favoritesCount - 1
  }
}

watchEffect(() => {
  updateArticles()
})
</script>

<template>
  <div class="home-page">
    <div class="banner">
      <div class="container">
        <h1 class="logo-font">
          conduit
        </h1>
        <p>A place to share your knowledge.</p>
      </div>
    </div>
    <div class="container page">
      <div class="row">
        <div class="col-md-9">
          <Tabs />
          <ArticlePreview
            v-for="article in articlesResult?.data.articles"
            :key="article.slug"
            :article="article"
            @favorited="toggleFavorite"
          />
          <Pagination
            :pages-amount="articlesResult?.data.articlesCount"
            page-name="feed"
          />
        </div>
        <div class="col-md-3">
          <PopularTags />
        </div>
      </div>
    </div>
  </div>
</template>
