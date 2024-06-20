<script setup lang='ts'>
  import { LIMIT, feedApiService } from '@/pages/feed';
  import { useFetch } from '@/shared/hooks';
  import { onMounted, watch } from 'vue';
  import { ArticlePreview } from '@/features/article-preview';
  import { Pagination } from '@/shared/ui';
  import { Article } from '@/shared/models';
  import { profileApiService } from '../api';
  import { ProfileTabs } from '..';
  import { useRoute } from 'vue-router';
  import { UserInfo } from '..';

  const route = useRoute();

  const { result: articlesResult, fetchData: fetchArticles } = useFetch(feedApiService.getArticles, true);
  const { result: profileResult, fetchData: fetchProfile } = useFetch(profileApiService.getProfile, true);

  onMounted(() => {
    updatePage()
  })

  watch(() => route.params.username, () => {
    updatePage()
  })

  watch(() => route.query.page, () => {
    updateArticles()
  });

  watch(() => route.name, () => {
    updateArticles()
  });

  const updatePage = async () => {
    profileResult.value = null;
    articlesResult.value = null;

    await fetchProfile(String(route.params.username))
    updateArticles();
  }

  const updateArticles = () => {
    articlesResult.value = null;

    const page = Number(route.query.page ?? 1);
    const tag = route.query.tag ? String(route.query.tag) : null;
    const limit = Number(route.query.limit ?? LIMIT);
    const author = route.name === 'profile' ? profileResult.value?.data.profile.username : undefined;
    const favorites = route.name === 'profile-favorites' ? profileResult.value?.data.profile.username : undefined

    fetchArticles(page, tag, limit, undefined, author, favorites)
  }

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
  <div v-if='profileResult?.data'  class="profile-page">
    <UserInfo :user='profileResult.data.profile'/>

    <div class="container">
      <div class="row">
        <div class="col-xs-12 col-md-10 offset-md-1">
          <ProfileTabs />
          <ArticlePreview 
            v-for="article in articlesResult?.data.articles" 
            :key="article.slug" 
            :article="article" 
            @favourited='toggleFavorite'
          />
          <Pagination 
            :pagesAmount='articlesResult?.data.articlesCount'
            pageName='profile'
          />
          </div>
        </div>
      </div>
    </div>
</template>