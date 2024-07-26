<script setup lang="ts">
import type { AxiosError } from 'axios'
import { RouteNames } from '@/app/routes'

interface AuthFormProps {
  formFields: {
    name: string
    placeholder: string
    type: string
  }[]
  formValues: {
    password: string
    email: string
  }
  isError: boolean
  error: AxiosError<unknown, any> | null
}

const props = defineProps<AuthFormProps>()
defineEmits(['sumbit', 'formValueChange'])
</script>

<template>
  <div class="auth-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">
            Sign in
          </h1>
          <p class="text-xs-center">
            <router-link :to="{ name: RouteNames.REGISTER }">
              Need an account?
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

          <form @submit.prevent="$emit('sumbit')">
            <fieldset
              v-for="({ name, placeholder, type }, i) in props.formFields"
              :key="i"
              class="form-group"
            >
              <input
                class="form-control form-control-lg"
                :value="props.formValues[name as keyof AuthFormProps['formValues']]"
                :type="type"
                :name="name"
                :placeholder="placeholder"
                @input="$emit('formValueChange', name, ($event.target as HTMLInputElement).value)"
              >
            </fieldset>
            <button class="btn btn-lg btn-primary pull-xs-right">
              Sign in
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
