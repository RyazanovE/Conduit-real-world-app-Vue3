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
      { name: 'username', placeholder: 'Username', type: 'text' },
      { name: 'email', placeholder: 'Email', type: 'email' },
      { name: 'password', placeholder: 'Password', type: 'password' },
    ];

  const formValues = reactive({
    username: '',
    password: '',
    email: ''
  })

  const { result: registerResult, fetchData, error } = useFetch((...args) => signInService.register(...args), true)

  const onSubmit = async (_e: Event) => {
    await fetchData(formValues.username, formValues.password, formValues.email);
    setUser(registerResult.value?.data.user ?? null)
    const errors = registerResult?.value?.error?.errors;
    const token = registerResult.value?.data?.user.token

    
    if (!Object.values(errors ?? {}).length && !error.value) {
      cookies.set('token', token)
      router.push({ name: 'feed' })
    }
  }
</script>

<template>
  <div className="auth-page">
    <div className="container page">
      <div className="row">
        <div className="col-md-6 offset-md-3 col-xs-12">
          <h1 className="text-xs-center">Sign up</h1>
          <p className="text-xs-center">
            <router-link :to="{name: 'login'}">Have an account?</router-link>
          </p>
          
            <ul 
              v-if='registerResult?.error' 
              className="error-messages"
            >
              <li 
                v-for="(key, value) of registerResult.error.errors as never as Record<string, string>" 
                :key="value"
              >
                {{ value }}: {{ key }}
              </li>
            </ul>
          <form @submit.prevent='onSubmit'>
            <fieldset
              v-for="{name, placeholder, type} of formFields"
              className="form-group"
            >
              <input
                v-model='formValues[name as keyof typeof formValues]'
                className="form-control form-control-lg"
                :type
                :name
                :placeholder
              />
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
