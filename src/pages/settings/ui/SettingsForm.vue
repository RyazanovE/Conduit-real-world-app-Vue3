<script setup lang='ts'>
import { onMounted, reactive } from 'vue'
import { useUserSession } from '@/shared/hooks'
import type { UpdateUser } from '@/shared/models'

const emits = defineEmits(['submit'])

const { currentUser } = useUserSession()

const formValues = reactive<UpdateUser>({
  username: '',
  email: '',
  bio: '',
  image: '',
  password: '',
})

onMounted(() => {
  if (currentUser.value) {
    Object.assign(formValues, currentUser.value)
  }
})
</script>

<template>
  <form @submit.prevent="emits('submit', formValues)">
    <fieldset>
      <fieldset class="form-group">
        <input
          v-model="formValues.image"
          data-test="image-url-input"
          class="form-control"
          type="text"
          placeholder="URL of profile picture"
        >
      </fieldset>
      <fieldset class="form-group">
        <input
          v-model="formValues.username"
          data-test="username-input"
          class="form-control form-control-lg"
          type="text"
          placeholder="Your Name"
        >
      </fieldset>
      <fieldset class="form-group">
        <textarea
          v-model="formValues.bio"
          data-test="bio-input"
          class="form-control form-control-lg"
          rows="8"
          placeholder="Short bio about you"
        />
      </fieldset>
      <fieldset class="form-group">
        <input
          v-model="formValues.email"
          data-test="email-input"
          class="form-control form-control-lg"
          type="text"
          placeholder="Email"
        >
      </fieldset>
      <fieldset class="form-group">
        <input
          v-model="formValues.password"
          data-test="password-input"
          class="form-control form-control-lg"
          type="password"
          placeholder="New Password"
        >
      </fieldset>
      <button
        data-test="submit-button"
        type="submit"
        class="btn btn-lg btn-primary pull-xs-right"
      >
        Update Settings
      </button>
    </fieldset>
  </form>
</template>
