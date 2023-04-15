import axios from '@/utils/http'
import { AxiosRequestConfig, AxiosResponse } from 'axios'

// 超过10M传参失败
const SIZE = 3 * 1024 * 1024

export type Chunks = File[]

// 1024 * 1024 是1M
export function createChunks(file: File, size = SIZE) {
  if (!file || !(file instanceof File)) return

  const chunks: Chunks = []

  for (let i = 0; i < file.size; i = i + size) {
    const chunk = file.slice(i, i + size) as File
    chunks.push(chunk)
  }

  return chunks
}

// 创建worker
export function createWorker(chunks: Chunks, percentage: any) {
  return new Promise(resolve => {
    const worker = new Worker('../../../public/hash.js')
    worker.postMessage({ chunks })
    worker.onmessage = e => {
      const { percentage: progress, hash } = e.data
      percentage.value = Math.ceil(progress)

      if (hash) {
        resolve(hash)
      }
    }
  })
}

interface Request {
  config: AxiosRequestConfig
  resolve: (value?: AxiosResponse<any> | PromiseLike<AxiosResponse<any>>) => void
  reject: (reason?: any) => void
}

export class RequestQueue {
  private maxRequests: number
  private count: number
  private queue: Request[]

  constructor(maxRequests: number = 5) {
    this.maxRequests = maxRequests
    this.count = 0
    this.queue = []
  }

  add(config: AxiosRequestConfig): Promise<AxiosResponse<any>> {
    return new Promise((resolve, reject) => {
      const request = { config, resolve, reject } as Request
      if (this.count < this.maxRequests) {
        this.send(request)
      } else {
        this.queue.push(request)
      }
    })
  }

  private send(request: Request) {
    this.count++
    axios(request.config)
      .then(response => {
        request.resolve(response)
      })
      .catch(error => {
        request.reject(error)
      })
      .finally(() => {
        this.count--
        if (this.queue.length > 0) {
          this.send(this.queue.shift()!)
        }
      })
  }
}

// post切片
export function postChunks(chunks: Chunks, hash: string, file: File) {
  if (!Array.isArray(chunks)) return

  const queue = new RequestQueue()
  let count = 0

  chunks.map((chunk: Blob, index) => {
    const data = new FormData()

    data.append('chunk', chunk, file?.name)
    data.append('type', file?.type)
    data.append('index', String(index + 1))
    data.append('hash', hash)
    data.append('fileName', file?.name)
    data.append('id', `${hash}-${index + 1}`)
    data.append('chunkSize', String(chunks.length))

    queue
      .add({
        method: 'POST',
        url: '/chunks/upload',
        data,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then(res => {
        count++
      })
      .finally(() => {
        // 全部响应完成 发送合并文件请求
        if (count === chunks.length) {
          axios.post('/chunks/merge', { hash, fileName: file?.name })
        }
      })
  })
}

// 验证
export async function validate(hash: string, chunkSize: number, fileName: string) {
  return await axios.post('/chunks/validate', {
    hash,
    chunkSize,
    fileName
  })
}
