<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import FormErrors from './FormErrors.vue'
import TagsInput from './TagsInput.vue'
import type { Article } from '@/shared/models'
import { useFetch } from '@/shared/hooks'
import { articleReadService } from '@/shared/api'
import { RouteNames } from '@/app/routes'

const router = useRouter()
const route = useRoute()

const { fetchData, result: articleResult } = useFetch(articleReadService.getArticle, true)

const formErrors = ref<string[]>([])

const form = reactive<Partial<Article>>({
  title: '',
  description: '',
  body: '',
  tagList: [],
})

onMounted(() => {
  fetchData(String(route.params.slug))
})

watch(() => articleResult.value?.data?.article, (newValue) => {
  if (newValue) {
    const { title, description, body, tagList } = newValue
    form.tagList = tagList
    form.description = description
    form.body = body
    form.title = title
  }
}, { deep: true })

async function submitForm() {
  try {
    validateForm()

    const promise = route.params.slug
      ? articleReadService.editArticle(String(route.params.slug), form)
      : articleReadService.createArticle(form)
    const { data } = await promise

    router.push({ name: RouteNames.ARTICLE, params: { slug: data.article.slug } })
  }
  catch (error) {
    console.error('Error submitting form', error)
  }
}

function validateForm() {
  formErrors.value = []

  const { title, description, body } = form

  if (typeof title !== 'string' || title === '') {
    formErrors.value.push('Give this article a title')
  }

  if (typeof description !== 'string' || description === '') {
    formErrors.value.push('Describe what this article is about')
  }

  if (typeof body !== 'string' || body === '') {
    formErrors.value.push('Write the article itself')
  }

  if (formErrors.value.length > 0) {
    throw new Error(formErrors.value.join(', '))
  }
}
</script>

<template>
  <div class="editor-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-10 offset-md-1 col-xs-12">
          <FormErrors :errors="formErrors" />

          <form @submit.prevent="submitForm">
            <fieldset>
              <fieldset class="form-group">
                <input
                  v-model="form.title"
                  data-test="article-title-input"
                  type="text"
                  class="form-control form-control-lg"
                  placeholder="Article Title"
                >
              </fieldset>
              <fieldset class="form-group">
                <input
                  v-model="form.description"
                  data-test="article-description-input"
                  type="text"
                  class="form-control"
                  placeholder="What's this article about?"
                >
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  v-model="form.body"
                  data-test="article-body-textarea"
                  class="form-control"
                  rows="8"
                  placeholder="Write your article (in markdown)"
                />
              </fieldset>
              <fieldset class="form-group">
                <TagsInput
                  v-model:tags="form.tagList"
                />
              </fieldset>

              <button type="submit" data-test="publish-button" class="btn btn-lg pull-xs-right btn-primary">
                Publish Article
              </button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
