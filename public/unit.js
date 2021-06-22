/* eslint-disable*/

// initial state :root
let root = document.querySelector(':root')
let rootStyle = getComputedStyle(root)
let rootFSValue = +rootStyle.fontSize.replace('px', '')
let rootFS = document.getElementById('root-fs')
rootFS.value = `  
    :root {
      font-size: ${rootStyle.fontSize};
    }`

const rootFSIncr = document.getElementById('root-fs-incr')
rootFSIncr.onclick = () => {
  root = document.querySelector(':root')
  rootStyle = getComputedStyle(root)
  rootFSValue = +rootStyle.fontSize.replace('px', '')
  ++rootFSValue
  rootFS.value = `  
    :root {
      font-size: ${rootFSValue}px;
    }`
  root.style.fontSize = rootFSValue + 'px'
}

const rootFSDecr = document.getElementById('root-fs-decr')
rootFSDecr.onclick = () => {
  root = document.querySelector(':root')
  rootStyle = getComputedStyle(root)
  rootFSValue = +rootStyle.fontSize.replace('px', '')
  --rootFSValue
  rootFS.value = `  
    :root {
      font-size: ${rootFSValue}px;
    }`
  root.style.fontSize = rootFSValue + 'px'
}

// initial state .unit
let unit = document.querySelector('.unit')
let unitStyle = getComputedStyle(unit)
let unitFSValue = +unitStyle.fontSize.replace('px', '')
let unitFS = document.getElementById('unit-fs')
unitFS.value = `  
    .unit {
      font-size: ${unitStyle.fontSize};
    }`

const unitFSIncr = document.getElementById('unit-fs-incr')
unitFSIncr.onclick = () => {
  unit = document.querySelector('.unit')
  unitStyle = getComputedStyle(unit)
  unitFSValue = +unitStyle.fontSize.replace('px', '')
  ++unitFSValue
  unitFS.value = `
    .unit {
      font-size: ${unitFSValue}px;
    }`
  unit.style.fontSize = unitFSValue + 'px'
}

const unitFSDecr = document.getElementById('unit-fs-decr')
unitFSDecr.onclick = () => {
  unit = document.querySelector('.unit')
  unitStyle = getComputedStyle(unit)
  unitFSValue = +unitStyle.fontSize.replace('px', '')
  --unitFSValue
  unitFS.value = `
    .unit {
      font-size: ${unitFSValue}px;
    }`
  unit.style.fontSize = unitFSValue + 'px'
}

setInterval(() => {
  const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
  const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)

  const view = document.getElementById('viewport-fs')
  view.value = `
    width: ${vw}px
    height: ${vh}px
    `
}, 100)

