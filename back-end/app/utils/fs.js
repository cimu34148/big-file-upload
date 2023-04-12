const fsSync = require('fs/promises')
const fs = require('fs')
const path = require('path')

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
  const files = await fsSync.readdir(path.join(__dirname, `../public/resume/${hash}`))
  const result = []

  for (const file of files) {
    const stats = await fsSync.stat(path.join(__dirname, `../public/resume/${hash}`, file))
    if (stats.isFile()) {
      const { name, ext } = path.parse(file)
      result.push({
        name: `${name}${ext}`,
        url: `/public/resume/${hash}/${file}`
      })
    }
  }
  return result
}

// 合并chunks
async function merge(files, hash, fileName) {
  try {
    const sortFiles = files.sort((fileA, fileB) => {
      const nameA = fileA.name.split('-')[1]
      const nameB = fileB.name.split('-')[1]
      return nameA - nameB
    })

    let writeStream = fs.createWriteStream(path.resolve(__dirname, `../public/resume/${hash}/${fileName}`))
    sortFiles.map(async item => {
      const filePath = path.resolve(__dirname, `../public/resume/${hash}/${item.name}`)
      const readFile = fs.readFileSync(filePath)
      writeStream.write(readFile)
      fs.unlink(filePath, () => {})
    })
    writeStream.end()
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  isExist,
  createDirectory,
  createFile,
  getFiles,
  merge
}
