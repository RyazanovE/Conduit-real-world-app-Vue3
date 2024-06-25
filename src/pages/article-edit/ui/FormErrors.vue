<script setup lang="ts">
const props = defineProps<{ errors: string[] }>()
</script>

<template>
  <ul v-if="props.errors.length" class="error-messages">
    <li v-for="(error, index) in errors" :key="index">
      {{ error }}
    </li>
  </ul>
</template>
