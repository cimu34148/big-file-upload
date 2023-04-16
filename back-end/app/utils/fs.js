const fsSync = require('fs/promises')
const fs = require('fs')
const path = require('path')

// 获取hash路径
const publicBasePath = '/public/'
const getHashPath = hash => path.resolve(__dirname, `${publicBasePath}${hash}`)
const getChunksPath = hash => path.resolve(__dirname, `${publicBasePath}${hash}/chunks`)
const getChunkPath = (hash, chunkId) => path.resolve(__dirname, `${publicBasePath}${hash}/chunks/${chunkId}`)

// 查询目录下的所有文件（不包括目录）
async function isExistMergeFile(path) {
  try {
    const files = fs.readdirSync(path)
    for (const file of files) {
      const filePath = fs.statSync(`${path}/${file}`)
      if(!filePath.isDirectory() && filePath.size) {
        return true
      }
    }
  
    return false
  } catch (error) {
    console.log(error)
    return false
  }
}

// 判断目录/文件是否存在
async function isExist(path) {
  try {
    await fsSync.access(path, fsSync.constants.F_OK | fsSync.constants.R_OK)
    return true
  } catch (error) {
    return false
  }
}

// 创建目录
async function createDirectory(path) {
  try {
    await fsSync.mkdir(path, { recursive: true })
  } catch (error) {
    console.error(`Failed to create directory ${path}: ${error}`)
  }
}

// 创建文件
async function createFile(path, content) {
  try {
    await fsSync.writeFile(path, content)
  } catch (error) {
    console.error(`Failed to create file ${path}: ${error}`)
  }
}

// 获取chunks
async function getFiles(hash) {
  try {
    const files = await fsSync.readdir(getChunksPath(hash))
    const result = []
  
    for (const file of files) {
      const chunkPath = getChunkPath(hash, file)
      const stats = await fsSync.stat(chunkPath)
      if (stats.isFile()) {
        const { name, ext } = path.parse(file)
        result.push({
          name: `${name}${ext}`,
          url: chunkPath
        })
      }
    }
    return result
  } catch (error) {
    console.error(error)
    return []
  }
}

// 合并chunks
async function merge(files, hash, fileName) {
  try {
    const sortFiles = files.sort((fileA, fileB) => {
      const nameA = fileA.name.split('-')[1]
      const nameB = fileB.name.split('-')[1]
      return nameA - nameB
    })

    let writeStream = fs.createWriteStream(path.resolve(__dirname, `${publicBasePath}${hash}/${fileName}`))
    sortFiles.map(async item => {
      const filePath = getChunkPath(hash, item.name)
      const readFile = fs.readFileSync(filePath)
      writeStream.write(readFile)
      fs.unlink(filePath, () => {})
    })
    // fs.rmdir(getChunksPath(hash), () => {})
    writeStream.end()
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  publicBasePath,
  isExist,
  createDirectory,
  createFile,
  getFiles,
  merge,
  getHashPath,
  getChunksPath,
  getChunkPath,
  isExistMergeFile
}
