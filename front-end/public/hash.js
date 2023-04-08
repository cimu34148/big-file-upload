// 导入脚本
self.importScripts("/spark-md5.min.js")

self.onmessage = e => {
  const { chunks = [] } = e.data
  const spark = new self.SparkMD5.ArrayBuffer()
  let percentage = 0
  let count = 0

  const load = index => {
    const reader = new FileReader()
    const file = chunks[index]
    reader.readAsArrayBuffer(file)
    reader.onload = (readerEvent) => {
      count++
      spark.append(readerEvent.target.result)
      if(count === chunks.length) {
        self.postMessage({
          percentage: 100,
          hash: spark.end()
        })
        self.close()
      } else {
        percentage += (100 / chunks.length)
        self.postMessage({ percentage })

        load(count)
      }
    }
  }

  load(count)
}