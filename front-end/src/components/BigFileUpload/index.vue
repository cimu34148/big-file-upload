<script lang="ts" setup>
  import { ref } from 'vue'
  import { createChunks, createWorker, Chunks, postChunks, validate } from './util'
  import axios from '@/utils/http'


  const percentage = ref(0)
  const upload = async (e: any) => {
    try {
      const file = e.target?.files?.[0]
      if(!file) return;

      const chunks = createChunks(file) as Chunks
      const hash = await createWorker(chunks, percentage) as string
      const { data = {} } = await validate(hash, chunks.length, file.name)
      const { status, files = [] } = data

      if(status === '0') {
        postChunks(chunks, hash, file)
      } else if(status === '1') {
        console.log('已存在同内容文件')
      } else if(status === '2') {
        if(files.length === chunks.length) {
          axios.post('/chunks/merge', { hash, fileName: file?.name })
        } else {
          const noExistChunks = chunks.filter((chunk: any) => files.indexOf(chunk.id) > -1)
          postChunks(noExistChunks, hash, file)
        }
      }

    } catch (error) {
      console.log(error)
    }

  }
</script>

<template>
  <input type="file" id="" @change="upload">
  <el-progress :text-inside="true" :percentage="percentage" :stroke-width="26"/>
</template>
