<script lang="ts" setup>
  import { ref } from 'vue'
  import { createChunks, createWorker, Chunks } from './util'

  const percentage = ref(0)
  const upload = (e: any) => {
    const file = e.target?.files?.[0]
    if(!file) return;

    const chunks = createChunks(file) as Chunks
    createWorker(chunks, percentage)

  }
</script>

<template>
  <input type="file" id="" @change="upload">
  <el-progress :text-inside="true" :percentage="percentage" :stroke-width="26"/>
</template>
