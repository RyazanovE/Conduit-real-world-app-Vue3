<script setup lang='ts'>
  import UserInfo  from './UserInfo.vue';
  import ProfileTabs from './ProfileTabs.vue';
  import { useFetch } from '@/shared/hooks';
  import { onMounted, watch } from 'vue';
  import { ArticlePreview } from '@/features/article-preview';
  import { Pagination } from '@/shared/ui';
  import { Article } from '@/shared/models';
  import { useRoute } from 'vue-router';
  import { profileApiService } from '../api';
  import { feedApiService } from '@/shared/api';

  type tabNames = 'profile' | 'profile-favorites';

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

  const updatePage = async () => {
    profileResult.value = null;
    articlesResult.value = null;

    await fetchProfile(String(route.params.username))
    updateArticles();
  }

  const onTabChanged = (tabName: tabNames) => {
    updateArticles(tabName)
  }

  const onAuthorFollowed = (following: boolean) => {
    if (profileResult.value) {
      profileResult.value.data.profile.following = following;
    }
  }

  const updateArticles = (tabName: tabNames = 'profile') => {
    articlesResult.value = null;

    const page = Number(route.query.page ?? 1);
    const author = tabName === 'profile' ? profileResult.value?.data.profile.username : undefined;
    const favorited = tabName === 'profile-favorites' ? profileResult.value?.data.profile.username : undefined

    fetchArticles({ page, author, favorited})
  }

  const toggleFavorite = ({ slug, favorited }: Partial<Article>) => {
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
    <UserInfo 
      :user='profileResult.data.profile'
      @followedAuthor='onAuthorFollowed'
      />
    <div class="container">
      <div class="row">
        <div class="col-xs-12 col-md-10 offset-md-1">
          <ProfileTabs @tabChanged='onTabChanged'/>
          <ArticlePreview 
            v-for="article in articlesResult?.data.articles" 
            :key="article.slug" 
            :article="article" 
            @favorited='toggleFavorite'
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