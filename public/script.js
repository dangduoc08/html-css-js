/* eslint-disable */
const path = require('path')
const {
  writeFile,
  createDirectory,
  checkFileExistToCreate
} = require('./readfile.js')

const filepath = '../new_module/Input/Text.txt'

checkFileExistToCreate(path.resolve(filepath), 'Hello world', createDirectory, writeFile)