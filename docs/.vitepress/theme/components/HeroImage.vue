<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'

const { isDark } = useData()

const src = computed(() =>
  isDark.value ? '/images/logo_dark.png' : '/images/logo_light.png'
)
</script>

<template>
  <img class="image-src" :src="src" alt="AWMC Logo" />
</template>
