
const SIZE = 10 * 1024 * 1024

export type Chunks = File[]

// 1024 * 1024 是1M
export function createChunks(file: File, size = SIZE) {
  if(!file || !(file instanceof File)) return;

  const chunks: Chunks = []

  for(let i = 0;i < file.size;i = i + size) {
    const chunk = file.slice(i, i + size) as File
    chunks.push(chunk)
  }

  return chunks
}

// 创建worker
export function createWorker(chunks: Chunks, percentage: any) {
  return new Promise((resolve) => {
    const worker = new Worker('../../../public/hash.js')
    worker.postMessage({ chunks })
    worker.onmessage = e => {
      const { percentage: progress, hash } = e.data
      percentage.value = Math.ceil(progress)
      
      if(hash) {
        resolve(hash)
      }
    }
  })
}