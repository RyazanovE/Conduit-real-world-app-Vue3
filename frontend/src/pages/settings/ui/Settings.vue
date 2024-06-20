<script setup lang='ts'>
  import { useUserSession } from '@/shared/hooks';
  import { UpdateUser } from '@/shared/models/sign-in';
  import { reactive, ref, watch } from 'vue';
  import { settingsService } from '..';
  import { useRouter } from 'vue-router';

  const router = useRouter();
  const { currentUser, deleteUser, setUser } = useUserSession();

  const formValues = reactive<UpdateUser>({
    username: '',
    email:'',
    bio: '',
    image: '',
    password: '',
  })

  const formErrors = ref<string[]>([])

  watch(() => currentUser.value, (newValue) => {
    if (newValue) {
      const { bio, email, image, username } = newValue;
      formValues.bio = bio;
      formValues.email = email;
      formValues.image = image;
      formValues.username = username;
    }
  }, { deep: true })

  const onSubmit = async () => {
    try {
      validateForm()

      const { status, data } = await settingsService.updateUser(formValues);
      
      if (status === 200) {
        setUser(data.user)
        router.push({ name: 'feed' })
      }
    } catch (error) {
      console.error(error)
    }
  }

  const validateForm = () => {
    formErrors.value = [];

    const { email, username } = formValues;

    if (typeof email !== "string" || email === "") {
      formErrors.value.push("Email is required");
    }

    if (typeof username !== "string" || username === "") {
      formErrors.value.push("Username is required");
    }

    if (formErrors.value.length > 0) {
      throw new Error(formErrors.value.join(", "));
    }
  }

  const logout = () => {
    deleteUser();
    router.push({ name: 'feed' })
  }
</script>

<template>
  <div class="settings-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Your Settings</h1>

          <ul class="error-messages">
            <li v-for='error in formErrors' :key='error'>{{ error }}</li>
          </ul>

          <form @submit.prevent='onSubmit'>
            <fieldset>
              <fieldset class="form-group">
                <input 
                  v-model='formValues.image' 
                  class="form-control" 
                  type="text" 
                  placeholder="URL of profile picture" 
                />
              </fieldset>
              <fieldset class="form-group">
                <input 
                  v-model='formValues.username' 
                  class="form-control form-control-lg" 
                  type="text" 
                  placeholder="Your Name" 
                />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  v-model='formValues.bio' 
                  class="form-control form-control-lg"
                  rows="8"
                  placeholder="Short bio about you"
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input 
                  v-model='formValues.email' 
                  class="form-control form-control-lg" 
                  type="text" 
                  placeholder="Email" 
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  v-model='formValues.password' 
                  class="form-control form-control-lg"
                  type="password"
                  placeholder="New Password"
                />
              </fieldset>
              <button class="btn btn-lg btn-primary pull-xs-right">Update Settings</button>
            </fieldset>
          </form>
          <hr />
          <button 
            class="btn btn-outline-danger"
            @click='logout'
          >
            Or click here to logout.
          </button>
        </div>
      </div>
    </div>
  </div>
</template>