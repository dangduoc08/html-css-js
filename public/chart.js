/* eslint-disable */

(function () {
  const pivot = 50000
  const animationDuration = pivot / 10000
  const races = [
    {
      company: 'google',
      value: 167713,
      bg: '#95afca'
    },
    {
      company: 'samsung',
      value: 61098,
      bg: '#ed9a9b'
    },
    {
      company: 'amazon',
      value: 125263,
      bg: '#add4d1'
    },
    {
      company: 'apple',
      value: 234241,
      bg: '#d6d0cd'
    },
    {
      company: 'microsoft',
      value: 108847,
      bg: '#9bc795'
    }
  ]

  function addIncreaseFrame(name, width) {
    const style = document.createElement('style')
    style.innerHTML = `
      @keyframes increase_frame_${name} {
        from {
          width: 0%;
        }
        to {
          width: ${width};
        }
      }
    `
    document.getElementsByTagName('head')[0].appendChild(style)

    return `increase_frame_${name}`
  }

  const techCompanyAxis = document.getElementById('tech-company-axis')
  let chartCompanyHTML = ''
  let chartPivotHTML = ''
  races.sort((a, b) => b.value - a.value)
  let totalColumns = Math.ceil(races[0].value / pivot)

  races.forEach((race, index) => {
    const value = race.value
    const totalChartVal = Math.ceil(value / pivot)

    let chartValues = ``
    for (let i = 1; i <= totalChartVal; i++) {
      const isLast = i === totalChartVal
      const animationDelay = (i - 1) * animationDuration

      if (index === 0 && !isLast) {
        chartPivotHTML += `<div>${i * pivot}</div>`
      }

      let width = '100%'
      const remain = value - (pivot * i)
      if (remain < 0) {
        width = (value - ((i - 1) * pivot)) * 100 / pivot + '%'
      }

      let animationName = 'increase_frame'
      if (isLast) {
        animationName = addIncreaseFrame(race.company, width)
      }



      chartValues += `<div class='chart__value' style='background-color: ${race.bg}; animation-name: ${animationName}; animation-duration: ${animationDuration}s; animation-delay: ${animationDelay}s'>
          ${isLast ?
          `<div>${race.company[0].toUpperCase() + race.company.slice(1)}</div><div>${value}</div>` :
          ''}
        </div>`
    }

    chartCompanyHTML += `<div class='chart__company' id=${race.company} style='grid-template-columns: repeat(${totalColumns}, 1fr);'>${chartValues}</div>`
  })

  techCompanyAxis.innerHTML = `<div class='chart__pivot' style='grid-template-columns: repeat(${totalColumns}, 1fr);'>` + chartPivotHTML + '</div>' + chartCompanyHTML
})()