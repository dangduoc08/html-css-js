function add(a, minus) {
  return a + minus(a)
}
function minus(number) {
  return number - 1
}

const arr = [5, 4, 3, 2, 1]
const s_arr = ['a', 'b', 'c', 'd', 'e']
const sum = 0

/////FOREACH
Array.prototype.myforEach = function (cb) {
  for (let i = 0; i < this.length; i++)
    cb(this[i])
}

////FILTER
function filterNum(val) {
  if (val % 2 === 0)
    return true

  return false
}

Array.prototype.myFilter = function (cb) {
  const arrtmp = []
  for (let i = 0; i < this.length; i++) {
    if (cb(this[i]) === true)
      arrtmp.push(this[i])
  }

  return arrtmp
}


//MAP
function mapCondition(val) {
  if (val % 2 === 0)
    val = val * 2

  return val
}
Array.prototype.myMap = function (cb) {
  const arrtmp = []
  for (let i = 0; i < this.length; i++) {
    arrtmp[i] = cb(this[i])
  }

  return arrtmp
}
const arr3 = arr.myMap(mapCondition)


//SORT
Array.prototype.sort2 = function (cb) {
  for (let i = 0; i < this.length - 1; i++) {
    for (let j = i + 1; j < this.length; j++) {
      if (cb(this[i], this[j])) {
        const vartmp = this[i]
        this[i] = this[j]
        this[j] = vartmp
      }

    }
  }
  return this
}


const options = { A: [], B: [], C: [], D: [], E: [], V: [] }
function getFirstElement(val) {
  if (typeof (val) === 'string' && val !== ' ') {
    return val[0]
  }

  return ''
}

Array.prototype.sortArrstring = function (cb) {
  const arrAfterSort = []
  for (let i = 0; i < this.length; i++) {
    const key = (cb(this[i]))
    options[key].push(this[i])

  }

  for (const [key, value] of Object.entries(options)) {
    value.forEach(item => arrAfterSort.push(item))
  }

  return arrAfterSort
}
const arr7 = ['Doc', 'Viet', 'An', 'Choi', 'Dung', 'Chay']


