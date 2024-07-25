<script setup lang='ts'>
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { profileApiService } from '../api'
import UserInfo from './UserInfo.vue'
import ProfileTabs from './ProfileTabs.vue'
import { useFetch } from '@/shared/hooks'
import { ArticlePreview } from '@/features/article-preview'
import { Pagination } from '@/shared/ui'
import type { Article } from '@/shared/models'
import { feedApiService } from '@/shared/api'

type tabNames = 'profile' | 'profile-favorites'

const route = useRoute()

const { result: articlesResult, fetchData: fetchArticles } = useFetch(feedApiService.getArticles, true)
const { result: profileResult, fetchData: fetchProfile } = useFetch(profileApiService.getProfile, true)

onMounted(() => {
  updatePage()
})

watch(() => route.params.username, () => {
  updatePage()
})

watch(() => route.query.page, () => {
  updateArticles()
})

async function updatePage() {
  profileResult.value = null
  articlesResult.value = null

  await fetchProfile(String(route.params.username))
  updateArticles()
}

function updateArticles(tabName: tabNames = 'profile') {
  articlesResult.value = null

  const page = Number(route.query.page ?? 1)
  const author = tabName === 'profile' ? profileResult.value?.data.profile.username : undefined
  const favorited = tabName === 'profile-favorites' ? profileResult.value?.data.profile.username : undefined

  fetchArticles({ page, author, favorited })
}

function onTabChanged(tabName: tabNames) {
  updateArticles(tabName)
}

function onAuthorFollowed(following: boolean) {
  if (profileResult.value) {
    profileResult.value.data.profile.following = following
  }
}

function onFavorited({ slug, favorited }: Partial<Article>) {
  const articles = articlesResult.value?.data.articles ?? []
  const index = articles.findIndex(article => article.slug === slug)

  if (articles && index !== -1) {
    articles[index].favorited = !!favorited
    articles[index].favoritesCount = favorited
      ? articles[index].favoritesCount + 1
      : articles[index].favoritesCount - 1
  }
}
</script>

<template>
  <div v-if="profileResult?.data" class="profile-page">
    <UserInfo
      :user="profileResult.data.profile"
      @followed-author="onAuthorFollowed"
    />
    <div class="container">
      <div class="row">
        <div class="col-xs-12 col-md-10 offset-md-1">
          <ProfileTabs @tab-changed="onTabChanged" />
          <ArticlePreview
            v-for="article in articlesResult?.data.articles"
            :key="article.slug"
            :article="article"
            @favorited="onFavorited"
          />
          <Pagination
            :pages-amount="articlesResult?.data.articlesCount"
            page-name="profile"
          />
        </div>
      </div>
    </div>
  </div>
</template>
