<script setup lang="ts">
  import { IUserState } from '@/app/store';
  import { inject } from 'vue';
import { useRoute } from 'vue-router';

  const currentUser = inject<IUserState>('userState');
  const route = useRoute();
  console.log(currentUser?.user)
</script>

<template>
  <nav class="navbar navbar-light">
    <div class="container">
      <router-link class="navbar-brand" to="/" prefetch="intent">
        conduit
      </router-link>
      <ul class="nav navbar-nav pull-xs-right">
        <li class="nav-item">
          <router-link
            prefetch="intent"
            class="nav-link"
            :class="{ active: route.name == 'feed' }"
            :to="{ name: 'feed'}"
          >
            Home
          </router-link>
        </li>
        <template v-if="!currentUser">
          <li class="nav-item">
            <router-link
              prefetch="intent"
              class="nav-link"
              :class="{ active: pathname == '/login' }"
              to="/login"
            >
              Sign in
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              prefetch="intent"
              class="nav-link"
              :class="{ active: pathname == '/register' }"
              to="/register"
            >
              Sign up
            </router-link>
          </li>
        </template>
        <template v-else>
          <li class="nav-item">
            <router-link
              prefetch="intent"
              class="nav-link"
              :class="{ active: pathname == '/editor' }"
              to="/editor"
            >
              <i class="ion-compose"></i>&nbsp;New Article
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              prefetch="intent"
              class="nav-link"
              :class="{ active: pathname == '/settings' }"
              to="/settings"
            >
              <i class="ion-gear-a"></i>&nbsp;Settings
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              prefetch="intent"
              class="nav-link"
              :class="{ active: false }"
              :to="`/profile/${currentUser.username}`"
            >
              <template v-if="currentUser.image">
                <img
                  width="25"
                  height="25"
                  :src="currentUser.image"
                  class="user-pic"
                  alt=""
                />
              </template>
              {{ currentUser.username }}
            </router-link>
          </li>
        </template>
      </ul>
    </div>
  </nav>
</template>