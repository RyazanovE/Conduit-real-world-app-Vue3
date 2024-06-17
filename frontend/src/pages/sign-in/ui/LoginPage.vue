<script setup lang="ts">
  import { useFetch } from '@/shared/hooks';
  import { signInService } from '../api';
  import { reactive } from 'vue';
  import { useRouter } from 'vue-router';
  import { useCookies } from "vue3-cookies";

  const formFields = [
    { name: 'email', placeholder: 'Email', type: 'email' },
    { name: 'password', placeholder: 'Password', type: 'password' },
  ];

  const router = useRouter();
  const { cookies } = useCookies();

  const formValues = reactive({
    password: '',
    email: ''
  })

  const { result: loginResult, fetchData, error, isError } = useFetch(signInService.login, true)

  const onSubmit = async (_e: Event) => {
    await fetchData(formValues.password, formValues.email);
    const user = loginResult.value?.data?.user
    const token = user?.token

    if (!isError.value && token) {
      cookies.set('token', token)
      sessionStorage.setItem("user", JSON.stringify(user));
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

          <template v-if='isError' >
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
                className="error-messages"
                v-else
              >
                {{ error?.response?.data }}
              </p>
          </template>

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