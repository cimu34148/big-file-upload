<script lang="ts" setup>
  import { ref } from 'vue'
  import { createChunks, createWorker, Chunks, postChunks } from './util'


  const percentage = ref(0)
  const upload = async (e: any) => {
    try {
      const file = e.target?.files?.[0]
      if(!file) return;

      const chunks = createChunks(file) as Chunks
      const hash = await createWorker(chunks, percentage) as string
      postChunks(chunks, hash, file)

    } catch (error) {
      console.log(error)
    }

  }
</script>

<template>
  <input type="file" id="" @change="upload">
  <el-progress :text-inside="true" :percentage="percentage" :stroke-width="26"/>
</template>
