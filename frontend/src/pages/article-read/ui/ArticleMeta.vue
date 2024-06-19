<script setup lang="ts">
  import { useUserSession } from '@/shared/hooks';
  import { articleReadService } from '..';
  import { useRouter } from 'vue-router';
import { Article } from '@/shared/models';

  const props = defineProps<{article: Article}>()
  const emits = defineEmits<{
    (e: 'followedAuthor', payload: boolean): void;
    (e: 'favoritedArticle', payload: boolean): void;
  }>();

  const { currentUser } = useUserSession();
  const router = useRouter();

  const handleDelete = async () => {
    try {
      const { status } = await articleReadService.deleteArticle(props.article.slug)

      if (status === 204) {
        router.push({ name: 'feed' })
      }
    } catch (error) {
      console.error(error)
    }

  }

  const toggleFollow = async () => {
    try {
      const following = props.article.author.following

      const method = following
        ? articleReadService.unfollowAuthor
        : articleReadService.followAuthor

      emits('followedAuthor', !following)
      const { status } = await method(props.article.author.username)

      if (status !== 200) {
        emits('followedAuthor', following)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const toggleFavorite = async () => {
    try {
      const favorited = props.article.favorited

      const method = favorited
        ? articleReadService.unfavoriteArticle
        : articleReadService.favoriteArticle

      emits('favoritedArticle', !favorited)
      const { status } = await method(props.article.slug)

      if (status !== 200) {
        emits('favoritedArticle', favorited)
      }
    } catch (error) {
      console.error(error)
    }
  } 
</script>

<template>
  <form @submit.prevent>
    <div class="article-meta">
      <router-link :to="`/profile/${props.article.author.username}`">
        <img :src="props.article.author.image" alt="" />
      </router-link>

      <div class="info">
        <router-link :to="`/profile/${props.article.author.username}`" class="author">
          {{ props.article.author.username }}
        </router-link>
        <span class="date">{{ props.article.createdAt }}</span>
      </div>

      <div v-if="props.article.author.username === currentUser?.username" style='display: inline'>
        <router-link :to="`/editor/${props.article.slug}`" class="btn btn-sm btn-outline-secondary">
          <i class="ion-edit"></i> Edit Article
        </router-link>
        &nbsp;&nbsp;
        <button @click="handleDelete" class="btn btn-sm btn-outline-danger">
          <i class="ion-trash-a"></i> Delete Article
        </button>
      </div>
      <div v-else style='display: inline'>
        <input type="hidden" name="username" :value="props.article.author.username" />
        <button @click="toggleFollow" :class="['btn btn-sm', props.article.author.following ? 'btn-secondary' : 'btn-outline-secondary']">
          <i class="ion-plus-round"></i>
          &nbsp; {{ props.article.author.following ? 'Unfollow' : 'Follow' }} {{ props.article.author.username }}
        </button>
        &nbsp;&nbsp;
        <button @click="toggleFavorite" :class="['btn btn-sm', props.article.favorited ? 'btn-primary' : 'btn-outline-primary']">
          <i class="ion-heart"></i>
          &nbsp; {{ props.article.favorited ? 'Unfavorite' : 'Favorite' }} Post
          <span class="counter">({{ props.article.favoritesCount }})</span>
        </button>
      </div>
    </div>
  </form>
</template>