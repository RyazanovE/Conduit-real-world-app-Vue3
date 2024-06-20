<script setup lang="ts">
  import { useUserSession } from '@/shared/hooks';
  import { User } from '@/shared/models';
  import { computed } from 'vue';
  import { useRouter } from 'vue-router';

  const router = useRouter();
  const props = defineProps<{ user: Partial<User> }>();  
  
  const { currentUser, route } = useUserSession();

  const isMyProfile = computed(() => route.params.username === currentUser.value?.username)

  
</script>

<template>
  <div class="user-info">
    <div class="container">
      <div class="row">
        <div class="col-xs-12 col-md-10 offset-md-1">
          <img :src="props.user.image" class="user-img" />
          <h4>{{ props.user.username }}</h4>
          <p>
            {{ props.user.bio }}
          </p>
          <button 
            v-if='isMyProfile' 
            class="btn btn-sm btn-outline-secondary action-btn"
            @click="router.push({name: 'settings'})"
            >
            <i class="ion-gear-a"></i>
            &nbsp; Edit Profile Settings
          </button>
          <button
            v-else 
            class="btn btn-sm btn-outline-secondary action-btn"
          >
            <i class="ion-plus-round"></i>
            &nbsp; Follow {{ props.user.username }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
