/* eslint-disable */

(function () {
  const pivot = 50000
  const races = [
    {
      company: 'apple',
      value: 234241
    },
    {
      company: 'google',
      value: 167713
    },
    {
      company: 'samsung',
      value: 61098
    },
    {
      company: 'amazon',
      value: 125263
    },
    {
      company: 'microsoft',
      value: 108847
    }
  ]

  const techCompanyAxis = document.getElementById('tech-company-axis')
  let chartCompanyHTML = ''
  races.forEach((race, index) => {
    const value = race.value
    const totalChartVal = Math.round(value / pivot)
    let chartValues = ``
    for (let i = 1; i <= totalChartVal; i++) {
      const isLast = i === totalChartVal
      let width = '100%'
      if (value < pivot) {
        width = value * 100 / pivot + '%'
      } else if (isLast) {
        width = (value - (pivot * i)) / pivot + '%'
      }

      chartValues += `<div class='chart__value' style='width: ${width}'>
          <div>${!isLast ? '' : race.company[0].toUpperCase() + race.company.slice(1)}</div>
          <div>${!isLast ?
          index === 0 ?
            pivot * i :
            '' :
          value
        }</div>
        </div>`
    }

    chartCompanyHTML += `<div class='chart__company' id=${race.company}>${chartValues}</div>`
  })
  techCompanyAxis.innerHTML = chartCompanyHTML
})()