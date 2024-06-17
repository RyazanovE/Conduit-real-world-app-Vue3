<script setup lang="ts">
import { Article } from '@/pages/sign-in/models';
import { computed } from 'vue';

  interface ArticlePreviewProps {
    article: Article;
  }
  const props = defineProps<ArticlePreviewProps>();

  const formattedDate = computed(() => {
    return new Date(props.article.createdAt).toLocaleDateString(undefined, {
        dateStyle: "long",
      });
  })
</script>

<template>
  <div class="article-preview">
    <div class="article-meta">
      <router-link :to="`/profile/${props.article.author.username}`" prefetch="intent">
        <img :src="props.article.author.image" alt="" />
      </router-link>
      <div class="info">
        <router-link
          :to="`/profile/${props.article.author.username}`"
          class="author"
          prefetch="intent"
        >
          {{ props.article.author.username }}
        </router-link>
        <span class="date">
          {{ formattedDate }}
        </span>
      </div>
      <button class="btn btn-outline-primary btn-sm pull-xs-right">
        <i class="ion-heart"></i> {{ props.article.favoritesCount }}
      </button>
    </div>
    <router-link
      :to="`/article/${article.slug}`"
      class="preview-link"
      prefetch="intent"
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