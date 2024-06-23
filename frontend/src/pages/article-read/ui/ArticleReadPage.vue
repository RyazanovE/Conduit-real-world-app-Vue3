<script setup lang="ts">
  import { useFetch } from '@/shared/hooks';
  import Comments from './Comments.vue'
  import ArticleMeta from './ArticleMeta.vue'
  import { onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import { articleReadService } from '@/shared/api';

  const route = useRoute();

  const { result: articleResult, fetchData: fetchArticle } = useFetch(articleReadService.getArticle, true);

  onMounted(() => {
    fetchArticle(String(route.params.slug))
  })

  const onFollowedAuthor = (following: boolean) => {
    if (articleResult.value) {
      articleResult.value.data.article.author.following = following;
    }
  }
  
  const onFavoritedArticle = (favorited: boolean) => {
    if (articleResult.value) {
      articleResult.value.data.article.favorited = favorited;
    }
  }

</script>

<template>
  <div class="article-page">
      <div class="banner">
        <div class="container">
          <h1>{{articleResult?.data.article.title}}</h1>

          <ArticleMeta 
            v-if='articleResult?.data.article' 
            :article='articleResult.data.article'
            @followedAuthor='onFollowedAuthor'
            @favoritedArticle='onFavoritedArticle'
            />
        </div>
      </div>

      <div class="container page">
        <div class="row article-content">
          <div class="col-md-12">
            <ul class="tag-list">
              <p>{{articleResult?.data.article.body}}</p>
              <li
                v-for='tag in articleResult?.data.article.tagList'
                :key="tag"
                class="tag-default tag-pill tag-outline" 
              >
                {{tag}}
              </li>
            </ul>
          </div>
        </div>

        <hr />

        <div class="row">
          <Comments 
            v-if='articleResult?.data.article'
          />
        </div>
      </div>
    </div>
</template>