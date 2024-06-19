<script setup lang="ts">
  import { computed } from 'vue';
  import { Article } from '../models';
  import { feedApiService } from '..';

  interface ArticlePreviewProps {
    article: Article;
  }
  const props = defineProps<ArticlePreviewProps>();
  const emits = defineEmits<{
    (e: 'favourited', payload: { slug: string; favorited: boolean }): void;
  }>();


  const formattedDate = computed(() => {
    return new Date(props.article.createdAt).toLocaleDateString(undefined, {
        dateStyle: "long",
      });
  })

  const emitFavourited = (favorited: boolean) => {
    emits('favourited', { slug: props.article.slug, favorited})
  }

  const onFavourite = async () => {
    try {
      const favorited = props.article.favorited

      const method = favorited
        ? feedApiService.unfavouriteArticle
        : feedApiService.favouriteArticle

      emitFavourited(!favorited);
      const { status } = await method(props.article.slug)

      if (status !== 200) {
        emitFavourited(favorited);
      }
    } catch (error) {
      console.error(error)
    }
  }
</script>

<template>
  <div class="article-preview">
    <div class="article-meta">
      <router-link :to="`/profile/${props.article.author.username}`">
        <img :src="props.article.author.image" alt="" />
      </router-link>
      <div class="info">
        <router-link
          :to="`/profile/${props.article.author.username}`"
          class="author"
        >
          {{ props.article.author.username }}
        </router-link>
        <span class="date">
          {{ formattedDate }}
        </span>
      </div>
      <form @submit.prevent='onFavourite'>
        <button
          class='btn btn-sm pull-xs-right'
          :class="[ props.article.favorited ? 'btn-primary' : 'btn-outline-primary']"
        >
          <i class="ion-heart"></i> {{ props.article.favoritesCount }}
        </button>
      </form>
    </div>
    <router-link
      :to="{ name: 'article', params: { slug: props.article.slug }}"
      class="preview-link"
    >
      <h1>{{ props.article.title }}</h1>
      <p>{{ props.article.description }}</p>
      <span>Read more...</span>
      <ul class="tag-list">
        <li v-for="tag in article.tagList" :key="tag" class="tag-default tag-pill tag-outline">
          {{ tag }}
        </li>
      </ul>
    </router-link>
  </div>
</template>