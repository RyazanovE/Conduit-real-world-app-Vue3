<script setup lang="ts">
  import { useFetch } from '@/shared/hooks';
  import { signInService } from '../api';
  import { reactive } from 'vue';
  import { useRouter } from 'vue-router';
  import { useCookies } from "vue3-cookies";
import { setUser } from '@/app/store';

  const router = useRouter();
  const { cookies } = useCookies();

  const formFields = [
      { name: 'email', placeholder: 'Email', type: 'email' },
      { name: 'password', placeholder: 'Password', type: 'password' },
    ];

  const formValues = reactive({
    password: '',
    email: ''
  })

  const { result: loginResult, fetchData, error } = useFetch((...args) => signInService.login(...args), true)

  const onSubmit = async (_e: Event) => {
    await fetchData(formValues.password, formValues.email);
    setUser(loginResult.value?.data.user ?? null)
    const errors = loginResult?.value?.error?.errors;
    const token = loginResult.value?.data?.user.token

    
    if (!Object.values(errors ?? {}).length && !error.value) {
      cookies.set('token', token)
      router.push({ name: 'feed' })
    }
  }
</script>

<template>
  <div class="auth-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Sign in</h1>
          <p class="text-xs-center">
            <router-link :to="{ name: 'register' }">Need an account?</router-link>
          </p>
          <ul v-if="loginResult?.error" class="error-messages">
            <li 
              v-for="(value, key) in loginResult.error.errors" 
              :key="key"
            >
              {{ key }}: {{ value }}
            </li>
          </ul>
          <form @submit.prevent="onSubmit">
            <fieldset 
              v-for="{ name, placeholder, type } in formFields" 
              class="form-group"
            >
              <input
                v-model="formValues[name as keyof typeof formValues]"
                class="form-control form-control-lg"
                :type="type"
                :name="name"
                :placeholder="placeholder"
              />
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