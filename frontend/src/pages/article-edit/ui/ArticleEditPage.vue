<script setup lang="ts">
  import { onMounted, reactive, ref, watch } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import FormErrors from './FormErrors.vue';
  import TagsInput from './TagsInput.vue';
  import { Article } from '@/shared/models';
  import { useFetch } from '@/shared/hooks';
  import { articleReadService } from '@/pages/article-read';

  const router = useRouter();
  const route = useRoute()

  const { fetchData, result: articleResult } = useFetch(articleReadService.getArticle, true)

  const formErrors = ref<string[]>([]);

  const form = reactive<Partial<Article>>({
    title: articleResult.value?.data.article.title || '',
    description: articleResult.value?.data.article.description || '',
    body: articleResult.value?.data.article.body || '',
    tagList: articleResult.value?.data.article.tagList || []
  });

  onMounted(async () => {
    if (route.params.slug) {
      fetchData(String(route.params.slug))
    }
  })

  watch(() => articleResult.value?.data.article, (newValue) => {
    if (newValue) {
      const { title, description, body, tagList } = newValue;
      form.tagList = tagList;
      form.description = description;
      form.body = body;
      form.title = title;
    }
  }, { deep: true })

  const submitForm = async () => {
    try {
      formErrors.value = [];

      const { title, description, body } = form;

      if (typeof title !== "string" || title === "") {
        formErrors.value.push("Give this article a title");
        throw new Error("Give this article a title")
      }

      if (typeof description !== "string" || description === "") {
        formErrors.value.push("Describe what this article is about");
        throw new Error("Describe what this article is about")
      }

      if (typeof body !== "string" || body === "") {
        formErrors.value.push("Write the article itself");
        throw new Error("Write the article itself")
      }

      const promise = route.params.slug 
        ? articleReadService.editArticle(String(route.params.slug), form) 
        : articleReadService.createArticle(form)
      const { status, data } = await promise;
      
      if ([200, 201].includes(status)) {
        router.push({name: 'article', params: { slug: data.article.slug }})
      }
    } catch (error) {
      console.error('Error submitting form', error);
    }
  };
</script>

<template>
  <div class="editor-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-10 offset-md-1 col-xs-12">
          <FormErrors :errors='formErrors'/>

          <form @submit.prevent="submitForm">
            <fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control form-control-lg"
                  v-model="form.title"
                  placeholder="Article Title"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control"
                  v-model="form.description"
                  placeholder="What's this article about?"
                />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  class="form-control"
                  v-model="form.body"
                  rows="8"
                  placeholder="Write your article (in markdown)"
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <TagsInput
                  v-model:tags="form.tagList"
                />
              </fieldset>

              <button class="btn btn-lg pull-xs-right btn-primary">
                Publish Article
              </button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
