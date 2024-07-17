<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { articleReadService } from '@/shared/api'
import { useFetch, useUserSession } from '@/shared/hooks'

const commentText = ref('')

const { currentUser, route } = useUserSession()
const { result: commentsResult, fetchData } = useFetch(articleReadService.getArticleComments, true)

onMounted(() => {
  fetchData(String(route.params.slug))
})

async function deleteComment(id: number) {
  try {
    const { status } = await articleReadService.deleteArticleComments(String(route.params.slug), id)

    if (status === 200) {
      fetchData(String(route.params.slug))
    }
  }
  catch (error) {
    console.error(error)
  }
}

async function postComment() {
  try {
    const { status } = await articleReadService.createArticleComments(String(route.params.slug), commentText.value)

    if (status === 200) {
      fetchData(String(route.params.slug))
    }
  }
  catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <div class="col-xs-12 col-md-8 offset-md-2">
    <div v-if="currentUser !== null">
      <form data-test="post-comment-form" class="card comment-form" @submit.prevent="postComment">
        <div class="card-block">
          <textarea
            v-model="commentText"
            required
            class="form-control"
            name="comment"
            placeholder="Write a comment..."
            data-test="comment-textarea"
            rows="3"
          />
        </div>
        <div class="card-footer">
          <img
            :src="currentUser.image"
            class="comment-author-img"
            alt=""
            data-test="current-user-image"
          >
          <button
            class="btn btn-sm btn-primary"
            type="submit"
          >
            Post Comment
          </button>
        </div>
      </form>
    </div>
    <div v-else data-test="empty-current-user-row" class="row">
      <div class="col-xs-12 col-md-8 offset-md-2">
        <p>
          <router-link :to="{ name: 'login' }">
            Sign in
          </router-link>
          &nbsp; or &nbsp;
          <router-link :to="{ name: 'register' }">
            Sign up
          </router-link>
          &nbsp; to add comments on this article.
        </p>
      </div>
    </div>

    <div v-for="comment in commentsResult?.data.comments" :key="comment.id" data-test="comment" class="card">
      <div class="card-block">
        <p data-test="comment-body" class="card-text">
          {{ comment.body }}
        </p>
      </div>

      <div class="card-footer">
        <router-link
          :to="{ name: 'profile', params: { username: comment.author.username } }"
          class="comment-author"
          data-test="comment-author-image-link"
        >
          <img
            :src="comment.author.image"
            class="comment-author-img"
            alt=""
            data-test="comment-author-image"
          >
        </router-link>
        &nbsp;
        <router-link
          :to="{ name: 'profile', params: { username: comment.author.username } }"
          class="comment-author"
          data-test="comment-author-username-link"
        >
          {{ comment.author.username }}
        </router-link>
        <span class="date-posted" data-test="comment-created-date">{{ comment.createdAt }}</span>
        <span v-if="comment.author.username === currentUser?.username" data-test="delete-comment" class="mod-options">
          <form data-test="delete-comment-form" @submit.prevent="deleteComment(comment.id)">
            <button
              type="submit"
              style="border: none; outline: none; background-color: transparent;"
            >
              <i class="ion-trash-a" />
            </button>
          </form>
        </span>
      </div>
    </div>
  </div>
</template>
