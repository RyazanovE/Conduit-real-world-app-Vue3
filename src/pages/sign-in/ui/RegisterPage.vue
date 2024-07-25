<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { signInService } from '../api'
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
</script>

<template>
  <div className="auth-page">
    <div className="container page">
      <div className="row">
        <div className="col-md-6 offset-md-3 col-xs-12">
          <h1 className="text-xs-center">
            Sign up
          </h1>
          <p className="text-xs-center">
            <router-link :to="{ name: RouteNames.LOGIN }">
              Have an account?
            </router-link>
          </p>

          <template v-if="isError">
            <ul
              v-if="typeof (error?.response?.data) === 'object'"
              className="error-messages"
            >
              <li
                v-for="(key, value) of (error.response?.data as Record<string, string>)?.errors"
                :key="value"
              >
                {{ value }}: {{ key }}
              </li>
            </ul>
            <p
              v-else
              className="error-messages"
            >
              {{ error?.response?.data }}
            </p>
          </template>

          <form @submit.prevent="onSubmit">
            <fieldset
              v-for="({ name, placeholder, type }, i) of formFields"
              :key="i"
              className="form-group"
            >
              <input
                v-model="formValues[name as keyof typeof formValues]"
                className="form-control form-control-lg"
                :type
                :name
                :placeholder
              >
            </fieldset>
            <button className="btn btn-lg btn-primary pull-xs-right">
              Sign up
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
