<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { ProfileResponse } from '../models'
import { useUserSession } from '@/shared/hooks'
import { articleReadService } from '@/shared/api'

const props = defineProps<{ user: ProfileResponse['profile'] }>()

const emits = defineEmits<{
  (e: 'followedAuthor', payload: boolean): void
}>()

const router = useRouter()
const { currentUser, route } = useUserSession()

const isMyProfile = computed(() => {
  return route.params.username === currentUser.value?.username
})

const followButtonName = computed(() => {
  return (props.user.following ? 'Unfollow' : 'Follow').concat(' ', props.user.username)
})

async function toggleFollow() {
  const following = props.user.following

  try {
    const method = following
      ? articleReadService.unfollowAuthor
      : articleReadService.followAuthor

    emits('followedAuthor', !following)
    await method(props.user.username)
  }
  catch (error) {
    console.error(error)
    emits('followedAuthor', following)
  }
}
</script>

<template>
  <div class="user-info">
    <div class="container">
      <div class="row">
        <div class="col-xs-12 col-md-10 offset-md-1">
          <img data-test="user-image" :src="props.user.image" class="user-img">
          <h4 data-test="username-header">
            {{ props.user.username }}
          </h4>
          <p data-test="bio-paragraph">
            {{ props.user.bio }}
          </p>
          <button
            v-if="isMyProfile"
            data-test="edit-profile-button"
            class="btn btn-sm btn-outline-secondary action-btn"
            @click="router.push({ name: 'settings' })"
          >
            <i class="ion-gear-a" />
            &nbsp; Edit Profile Settings
          </button>
          <button
            v-else
            data-test="follow-button"
            class="btn btn-sm btn-outline-secondary action-btn"
            @click="toggleFollow"
          >
            <i class="ion-plus-round" />
            &nbsp; {{ followButtonName }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
