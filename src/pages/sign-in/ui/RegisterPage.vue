<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { signInService } from '../api'
import AuthForm from './AuthForm.vue'
import { useFetch, useUserSession } from '@/shared/hooks'
import { RouteNames } from '@/app/routes'

const formFields = [
  { name: 'username', placeholder: 'Username', type: 'text' },
  { name: 'email', placeholder: 'Email', type: 'email' },
  { name: 'password', placeholder: 'Password', type: 'password' },
]

const router = useRouter()
const { setUser } = useUserSession()

const formValues = reactive({
  username: '',
  password: '',
  email: '',
})

const { result: registerResult, fetchData, error, isError } = useFetch(signInService.register, true)

async function onSubmit(_e: Event) {
  await fetchData(formValues.username, formValues.password, formValues.email)
  const user = registerResult.value?.data?.user

  if (!isError.value && user) {
    setUser(user)
    router.push({ name: RouteNames.FEED })
  }
}

function onFormValueChange(name: keyof typeof formValues, value: string) {
  formValues[name] = value
}
</script>

<template>
  <AuthForm
    :form-fields="formFields"
    :form-values="formValues"
    :is-error="isError"
    :error="error"
    @submit="onSubmit"
    @form-value-change="onFormValueChange"
  />
</template>
