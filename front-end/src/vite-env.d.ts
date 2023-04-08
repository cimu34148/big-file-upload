/// <reference types="vite/client" />

declare module 'spark-md5' {
  const SparkMD5: any
  export = SparkMD5
}

declare module '*.vue' {
  export { ComponentOptions } from 'vue'
}