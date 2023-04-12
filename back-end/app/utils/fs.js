const fs = require('fs/promises')
const { streamToBuffer } = require('promisify-stream');
const { BlobServiceClient } = require('@azure/storage-blob');

// 判断目录/文件是否存在
async function isExist(path) {
  try {
    await fs.access(path, fs.constants.F_OK | fs.constants.R_OK)
    return true
  } catch (error) {
    return false
  }
}

// 创建目录
async function createDirectory(path) {
  try {
    await fs.mkdir(path, { recursive: true })
  } catch (error) {
    console.error(`Failed to create directory ${path}: ${error}`)
  }
}

// 创建文件
async function createFile(path, content) {
  try {
    await fs.writeFile(path, content)
  } catch (error) {
    console.error(`Failed to create file ${path}: ${error}`)
  }
}

const { streamToBuffer } = require('promisify-stream');

async function fileToBuffer(filePath) {
  const readStream = fs.createReadStream(filePath);
  return await streamToBuffer(readStream);
}

module.exports = {
  isExist,
  createDirectory,
  createFile,
  fileToBuffer
}
