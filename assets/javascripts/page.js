/* eslint-disable*/
const key = 'href';
(function () {
  let href = localStorage.getItem(key)
  if (!href || href === undefined || href === null || href === '') {
    href = '/html_elements.html'
  }

  navigate({ dataset: { href } })
})()

function navigate(self) {
  const { href } = self.dataset
  fetch(href)
    .then(response => response.text())
    .then(htmlPage => {
      const container = document.getElementById('container')
      container.innerHTML = htmlPage
      localStorage.setItem(key, href)

      const navs = document.getElementsByClassName('menu__item')
      for (let i = 0; i < navs.length; i++) {
        const nav = navs.item(i)
        const ahref = nav.lastElementChild
        if (ahref.dataset.href === href) {
          nav.classList.add('menu_active')
        } else {
          nav.classList.remove('menu_active')
        }
      }
    })
}