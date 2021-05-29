const input = document.getElementById('input')
const btn = document.getElementById('btn')
const results = document.getElementById('results')

input.addEventListener('input', () => {
  getDebouncedData()
})

async function getDoctorData(searchText) {
  console.log(searchText)
  const res = await fetch('https://still-taiga-90718.herokuapp.com/api/doctors')
  const data = await res.json()
  let matches = data.filter((d) => {
    const regex = new RegExp(`^${searchText.toString()}`, 'gi')
    return d.name.match(regex)
  })
  console.log(matches)
  // Results.classList.add('displayNone');
  if (searchText.length == 0) {
    matches = []
  }
  outputHtmlProject(matches)
}

const applyDebounce = function (fn, d) {
  let timer
  return function () {
    clearInterval(timer)
    timer = setTimeout(() => {
      getDoctorData(input.value)
    }, d)
  }
}

const getDebouncedData = applyDebounce(getDoctorData, 300)

function outputHtmlProject(matches) {
  if (matches.length > 0) {
    const html = matches
      .map(
        (match) =>
          `<div class="projectCard">
                <div class="projectDetails">
                    <p><b>${match.name}</b></p>
                    <p><b>${match.degree}</b></p>
                </div>
                <div class="projectStartDate">
                    <p>${match.address}</p>
                </div>
                <div class="button">
                    <a href="/users/doctors/${match._id}">Book</a>
                </div>
            </div>`,
      )
      .join('')
    results.innerHTML = html
  } else {
    const html = ''
    results.innerHTML = html
  }
}
