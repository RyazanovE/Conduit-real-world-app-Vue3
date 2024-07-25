<script setup lang="ts">
import { useUserSession } from '../hooks'
import { RouteNames } from '@/app/routes'

const { currentUser, route } = useUserSession()
</script>

<template>
  <nav class="navbar navbar-light">
    <div class="container">
      <router-link
        class="navbar-brand"
        prefetch="intent"
        :to="{ name: RouteNames.FEED }"
      >
        conduit
      </router-link>
      <ul class="nav navbar-nav pull-xs-right">
        <li class="nav-item">
          <router-link
            prefetch="intent"
            class="nav-link"
            :class="{ active: route.name === RouteNames.FEED }"
            :to="{ name: RouteNames.FEED }"
          >
            Home
          </router-link>
        </li>
        <template v-if="!currentUser">
          <li class="nav-item">
            <router-link
              prefetch="intent"
              class="nav-link"
              :class="{ active: route.name === RouteNames.LOGIN }"
              :to="{ name: RouteNames.LOGIN }"
            >
              Sign in
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              prefetch="intent"
              class="nav-link"
              :class="{ active: route.name === RouteNames.REGISTER }"
              :to="{ name: RouteNames.REGISTER }"
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
              :class="{ active: route.name === RouteNames.EDITOR && !route.params.slug }"
              :to="{ name: RouteNames.EDITOR }"
            >
              <i class="ion-compose" />&nbsp;New Article
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              prefetch="intent"
              class="nav-link"
              :class="{ active: route.name === RouteNames.SETTINGS }"
              :to="{ name: RouteNames.SETTINGS }"
            >
              <i class="ion-gear-a" />&nbsp;Settings
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              prefetch="intent"
              class="nav-link"
              :class="{ active: false }"
              :to="{ name: RouteNames.PROFILE, params: { username: currentUser?.username } }"
            >
              <template v-if="currentUser?.image">
                <img
                  width="25"
                  height="25"
                  :src="currentUser?.image"
                  class="user-pic"
                  alt=""
                >
              </template>
              {{ currentUser?.username }}
            </router-link>
          </li>
        </template>
      </ul>
    </div>
  </nav>
</template>
