<script setup lang='ts'>
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { settingsService } from '../api'
import SettingsForm from './SettingsForm.vue'
import { useUserSession } from '@/shared/hooks'
import type { UpdateUser } from '@/shared/models'

const router = useRouter()
const { deleteUser, setUser } = useUserSession()

const formErrors = ref<string[]>([])

async function onSubmit(formValues: UpdateUser) {
  try {
    validateForm(formValues)

    const { data } = await settingsService.updateUser(formValues)

    setUser(data.user)
    router.push({ name: 'profile', params: { username: data.user.username } })
  }
  catch (error) {
    console.error(error)
  }
}

function validateForm(formValues: UpdateUser) {
  formErrors.value = []

  const { email, username } = formValues

  if (typeof email !== 'string' || email === '') {
    formErrors.value.push('Email is required')
  }

  if (typeof username !== 'string' || username === '') {
    formErrors.value.push('Username is required')
  }

  if (formErrors.value.length > 0) {
    throw new Error(formErrors.value.join(', '))
  }
}

function logout() {
  deleteUser()
  router.push({ name: 'feed' })
}
</script>

<template>
  <div class="settings-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">
            Your Settings
          </h1>
          <ul class="error-messages">
            <li v-for="error in formErrors" :key="error" data-test="error-message">
              {{ error }}
            </li>
          </ul>
          <SettingsForm @submit="onSubmit" />
          <hr>
          <button
            data-test="logout-button"
            class="btn btn-outline-danger"
            @click="logout"
          >
            Or click here to logout.
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
