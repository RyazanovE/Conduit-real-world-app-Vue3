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
  try {
    const following = props.user.following

    const method = following
      ? articleReadService.unfollowAuthor
      : articleReadService.followAuthor

    emits('followedAuthor', !following)
    const { status } = await method(props.user.username)

    if (status !== 200) {
      emits('followedAuthor', following)
    }
  }
  catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <div class="user-info">
    <div class="container">
      <div class="row">
        <div class="col-xs-12 col-md-10 offset-md-1">
          <img :src="props.user.image" class="user-img">
          <h4>{{ props.user.username }}</h4>
          <p>
            {{ props.user.bio }}
          </p>
          <button
            v-if="isMyProfile"
            class="btn btn-sm btn-outline-secondary action-btn"
            @click="router.push({ name: 'settings' })"
          >
            <i class="ion-gear-a" />
            &nbsp; Edit Profile Settings
          </button>
          <button
            v-else
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
