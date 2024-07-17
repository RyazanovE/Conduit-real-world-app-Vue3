<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useUserSession } from '@/shared/hooks'
import type { Article } from '@/shared/models'
import { articleReadService } from '@/shared/api'

const props = defineProps<{ article: Article }>()
const emits = defineEmits<{
  (e: 'followedAuthor', payload: boolean): void
  (e: 'favoritedArticle', payload: boolean): void
}>()

const { currentUser } = useUserSession()
const router = useRouter()

async function handleDelete() {
  try {
    const { status } = await articleReadService.deleteArticle(props.article.slug)

    if (status === 204) {
      router.push({ name: 'feed' })
    }
  }
  catch (error) {
    console.error(error)
  }
}

async function toggleFollow() {
  const following = props.article.author.following

  try {
    const method = following
      ? articleReadService.unfollowAuthor
      : articleReadService.followAuthor

    emits('followedAuthor', !following)
    await method(props.article.author.username)
  }
  catch (error) {
    console.error(error)
    emits('followedAuthor', following)
  }
}

async function toggleFavorite() {
  const favorited = props.article.favorited

  try {
    const method = favorited
      ? articleReadService.unfavoriteArticle
      : articleReadService.favoriteArticle

    emits('favoritedArticle', !favorited)
    await method(props.article.slug)
  }
  catch (error) {
    console.error(error)
    emits('favoritedArticle', favorited)
  }
}
</script>

<template>
  <form @submit.prevent>
    <div class="article-meta">
      <router-link data-test="image-profile-link" :to="{ name: 'profile', params: { username: props.article.author.username } }">
        <img :src="props.article.author.image" alt="">
      </router-link>

      <div class="info">
        <router-link data-test="username-profile-link" :to="{ name: 'profile', params: { username: props.article.author.username } }" class="author">
          {{ props.article.author.username }}
        </router-link>
        <span data-test="article-date" class="date">{{ props.article.createdAt }}</span>
      </div>

      <div v-if="props.article.author.username === currentUser?.username" data-test="edit-article-block" style="display: inline">
        <router-link data-test="edit-article-link" :to="{ name: 'editor', params: { slug: props.article.slug } }" class="btn btn-sm btn-outline-secondary">
          <i class="ion-edit" /> Edit Article
        </router-link>
        &nbsp;&nbsp;
        <button class="btn btn-sm btn-outline-danger" @click="handleDelete">
          <i class="ion-trash-a" /> Delete Article
        </button>
      </div>
      <div v-else data-test="follow-author-block" style="display: inline">
        <input data-test="hidden-username-input" type="hidden" name="username" :value="props.article.author.username">
        <button data-test="author-follow-button" class="btn btn-sm" :class="[props.article.author.following ? 'btn-secondary' : 'btn-outline-secondary']" @click="toggleFollow">
          <i class="ion-plus-round" />
          &nbsp; {{ props.article.author.following ? 'Unfollow' : 'Follow' }} {{ props.article.author.username }}
        </button>
        &nbsp;&nbsp;
        <button data-test="author-favorite-button" class="btn btn-sm" :class="[props.article.favorited ? 'btn-primary' : 'btn-outline-primary']" @click="toggleFavorite">
          <i class="ion-heart" />
          &nbsp; {{ props.article.favorited ? 'Unfavorite' : 'Favorite' }} Post
          <span data-test="article-favorites-count" class="counter">({{ props.article.favoritesCount }})</span>
        </button>
      </div>
    </div>
  </form>
</template>
