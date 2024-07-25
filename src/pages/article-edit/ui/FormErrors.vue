<script setup lang="ts">
interface FormErrorsProps {
  errors: string[]
}

const props = defineProps<FormErrorsProps>()
</script>

<template>
  <ul v-if="props.errors.length" class="error-messages">
    <li v-for="(error, index) in errors" :key="index" data-test="error-item">
      {{ error }}
    </li>
  </ul>
</template>
