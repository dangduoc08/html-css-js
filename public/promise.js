/* eslint-disable */
const fs = require('fs')
const axios = require('axios')

// Callback
fs.readFile('./assets/db.txt', (err, dataBuf) => {
  if (err) {
    return console.log(err)
  }

  return fs.readFile(dataBuf.toString(), (err, dataBuf) => {
    if (err) {
      return console.log(err)
    }

    return console.log(dataBuf.toString())
  })
})

// 3 state of promise:
// pending
// fulfilled 
// rejected

// Convert normal function to promise function
const fsPromise = path =>
  new Promise((resolve, reject) => {
    fs.readFile(path, (err, dataBuf) => {
      if (err) {
        return reject(err)
      }
      return resolve(dataBuf)
    })
  })

fsPromise('./assets/db.txt')
  .then(data => console.log('data', data.toString()))
  .catch(err => console.log('err', err))


class MyPromise {
  // enum PromiseState  {
  //   pending
  //   fulfilled
  //   rejected
  // }

  constructor(handler) {
    this.state = 'pending'
    this.value = undefined
    this.error = undefined
    this.firstHandler = true
    this.callbackHandlers = []
    handler(MyPromise.resolve.bind(this), MyPromise.reject.bind(this))
  }

  static resolve(responseValue) {
    this.state = 'fulfilled'
    this.value = responseValue
  }

  static reject(responseError) {
    this.state = 'rejected'
    this.error = responseError
  }

  then(callbackValue) {
    if (!this.firstHandler) {
      this.callbackHandlers.push(callbackValue)
    } else {
      const intervalHandler = setInterval(() => {
        if (this.state === 'fulfilled') {
          this.value = callbackValue(this.value)
          if (this.callbackHandlers.length > 0) {
            if (this.value instanceof MyPromise) {
              this.value.callbackHandlers = this.callbackHandlers
              this.then.call(this.value, this.callbackHandlers[0])
            } else {
              this.firstHandler = true
              this.then.call(this, this.callbackHandlers[0])
            }
            this.callbackHandlers.shift()
          }
          clearInterval(intervalHandler)
        }
      }, 0)
    }
    this.firstHandler = false
    return this
  }

  catch(callbackError) {
    const intervalHandler = setInterval(() => {
      if (this.state === 'rejected') {
        this.error = callbackError(this.error)
        clearInterval(intervalHandler)
      }
    }, 0)
    clearInterval(intervalHandler)
    return this
  }
}

function add(a, b) {
  if (a < 0 || b < 0) {
    return Error('a or b must be unsigned integer')
  }
  return a + b
}

const myAxiosPromise = url =>
  new MyPromise((resolve, reject) => {
    axios.get(url)
      .then(response => resolve(response.data))
      .catch(error => reject(error))
  })

const myFsPromise = path =>
  new MyPromise((resolve, reject) => {
    fs.readFile(path, (err, dataBuf) => {
      if (err) {
        return reject(err)
      }
      return resolve(dataBuf.toString())
    })
  })

myAxiosPromise('http://localhost:3000/get_links')
  .then(dataFromServer => {
    console.log('dataFromServer', dataFromServer)
    return myFsPromise(dataFromServer)
  })
  .then(dataFromDB => {
    console.log('dataFromDB', dataFromDB)
    return myFsPromise(dataFromDB)
  })
  .then(dataFromNumber => {
    console.log('dataFromNumber', dataFromNumber)
    return add(...dataFromNumber.split(',').map(number => +number))
  })
  .then(addResult => {
    console.log('addResult', addResult)
    return myAxiosPromise('http://localhost:3000/get_links')
  })
  .then(addResult2 => {
    console.log('addResult2', addResult2)
  })
  .catch(err => {
    console.log('error ne', err)
  })

console.log('End main')
