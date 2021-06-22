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
      const matchedScripts = htmlPage.match(/\<script(.*?)<\/script>/gi)

      if (matchedScripts) {
        matchedScripts.forEach(matchedScript => {
          const matchedSrc = matchedScript.match(/src=(.*?).js/gi)
          if (matchedSrc) {
            matchedSrc.forEach(src => {
              fetch(src.replace(/(src='.\/|src=".\/)/gi, ''))
                .then(response => response.text())
                .then(jsCode => {
                  const scriptNode = document.createElement('script')
                  scriptNode.innerHTML = jsCode
                  htmlPage.replace(matchedScript, '')
                  container.appendChild(scriptNode)
                })
            })
          }
        })
      }

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