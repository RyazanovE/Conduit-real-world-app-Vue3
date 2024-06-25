<script setup lang='ts'>
import { reactive, watch } from 'vue'
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

watch(() => currentUser.value, (newValue) => {
  if (newValue) {
    const { bio, email, image, username } = newValue
    formValues.bio = bio
    formValues.email = email
    formValues.image = image
    formValues.username = username
  }
}, { deep: true })
</script>

<template>
  <form @submit.prevent="emits('submit', formValues)">
    <fieldset>
      <fieldset class="form-group">
        <input
          v-model="formValues.image"
          class="form-control"
          type="text"
          placeholder="URL of profile picture"
        >
      </fieldset>
      <fieldset class="form-group">
        <input
          v-model="formValues.username"
          class="form-control form-control-lg"
          type="text"
          placeholder="Your Name"
        >
      </fieldset>
      <fieldset class="form-group">
        <textarea
          v-model="formValues.bio"
          class="form-control form-control-lg"
          rows="8"
          placeholder="Short bio about you"
        />
      </fieldset>
      <fieldset class="form-group">
        <input
          v-model="formValues.email"
          class="form-control form-control-lg"
          type="text"
          placeholder="Email"
        >
      </fieldset>
      <fieldset class="form-group">
        <input
          v-model="formValues.password"
          class="form-control form-control-lg"
          type="password"
          placeholder="New Password"
        >
      </fieldset>
      <button class="btn btn-lg btn-primary pull-xs-right">
        Update Settings
      </button>
    </fieldset>
  </form>
</template>
