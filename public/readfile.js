/* eslint-disable */
const fs = require('fs')
const path = require('path')

function writeFile(pathfilname, data) {
  fs.writeFile(pathfilname, data, (err) => {
    if (err) throw err

    console.log('file create and save')

  })
}

function createDirectory(folderpath, data) {
  //check if folderpath contain file name
  const extend = path.extname(folderpath)
  let filename = 'text.txt' //default text.txt if filename is not given in folderpath

  const arrFolder = folderpath.split(path.sep)
  if (extend.length > 1) {
    filename = arrFolder[arrFolder.length - 1]
    arrFolder.pop()
  }

  let pathtmp = ''
  let bCheckfolderexist = true
  arrFolder.forEach(folder => {

    pathtmp += folder
    if (!bCheckfolderexist || !fs.existsSync(pathtmp)) {
      bCheckfolderexist = false
      fs.mkdirSync(pathtmp)
      console.log(`create folder: ${folder}`)
    }
    pathtmp += '/'
  })

  pathtmp += filename
  if (pathtmp.length == folderpath.length) {
    writeFile(pathtmp, data)
  }
}

function checkFileExistToCreate(FilePath, data = '', callback1, callback2) {
  if (!fs.existsSync(FilePath)) {
    console.log('path does not exist')
    callback1(FilePath, data)
  }
  else if (data.length > 0) //overwrite
  {
    console.log('path exists')
    callback2(FilePath, data)
  }
}

module.exports = { writeFile, createDirectory, checkFileExistToCreate }
