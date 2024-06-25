<script setup lang="ts">
import { computed } from 'vue'
import type { Article } from '@/shared/models'
import { feedApiService } from '@/shared/api'

interface ArticlePreviewProps {
  article: Article
}
const props = defineProps<ArticlePreviewProps>()
const emits = defineEmits<{
  (e: 'favorited', payload: { slug: string, favorited: boolean }): void
}>()

const formattedDate = computed(() => {
  return new Date(props.article.createdAt).toLocaleDateString(undefined, {
    dateStyle: 'long',
  })
})

function emitFavourited(favorited: boolean) {
  emits('favorited', { slug: props.article.slug, favorited })
}

async function onFavourite() {
  try {
    const favorited = props.article.favorited

    const method = favorited
      ? feedApiService.unfavouriteArticle
      : feedApiService.favouriteArticle

    emitFavourited(!favorited)
    const { status } = await method(props.article.slug)

    if (status !== 200) {
      emitFavourited(favorited)
    }
  }
  catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <div class="article-preview">
    <div class="article-meta">
      <router-link data-test="img-profile-link" :to="{ name: 'profile', params: { username: props.article.author.username } }">
        <img data-test="author-image" :src="props.article.author.image" alt="">
      </router-link>
      <div class="info">
        <router-link
          :to="{ name: 'profile', params: { username: props.article.author.username } }"
          data-test="author-username-link"
          class="author"
        >
          {{ props.article.author.username }}
        </router-link>
        <span data-test="article-date" class="date">
          {{ formattedDate }}
        </span>
      </div>
      <form @submit.prevent="onFavourite">
        <button
          data-test="button-favorite"
          class="btn btn-sm pull-xs-right"
          :class="[props.article.favorited ? 'btn-primary' : 'btn-outline-primary']"
        >
          <i class="ion-heart" /> {{ props.article.favoritesCount }}
        </button>
      </form>
    </div>
    <router-link
      :to="{ name: 'article', params: { slug: props.article.slug } }"
      class="preview-link"
      data-test="article-profile-link"
    >
      <h1 data-test="article-title">
        {{ props.article.title }}
      </h1>
      <p data-test="article-description">
        {{ props.article.description }}
      </p>
      <span>Read more...</span>
      <ul data-test="tag-list" class="tag-list">
        <li v-for="tag in article.tagList" :key="tag" class="tag-default tag-pill tag-outline">
          {{ tag }}
        </li>
      </ul>
    </router-link>
  </div>
</template>
