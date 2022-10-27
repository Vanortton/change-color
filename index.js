const inputColor = document.querySelector('input[data-color]')
const rangeInputs = document.querySelectorAll('input[type="range"]')
const numberInput = document.querySelector('input[type="number"]')
const buttonLighten = document.querySelector('button[data-lighten]')
const buttonDarken = document.querySelector('button[data-darken]')
const message = document.querySelector('.results h3')
const ulToShow = document.querySelector('.results ul')

const SVGs = {
    info: `<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 48 48" style=" fill:#000000;" width="30px"><path fill="#2196f3" d="M44,24c0,11.045-8.955,20-20,20S4,35.045,4,24S12.955,4,24,4S44,12.955,44,24z"></path><path fill="#fff" d="M22 22h4v11h-4V22zM26.5 16.5c0 1.379-1.121 2.5-2.5 2.5s-2.5-1.121-2.5-2.5S22.621 14 24 14 26.5 15.121 26.5 16.5z"></path></svg>`,
    warn: `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 171 171" width="30px"><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path d="M0,171.99219v-171.99219h171.99219v171.99219z" fill="none"></path><g><path d="M156.75,85.5c0,39.1875 -32.0625,71.25 -71.25,71.25c-39.1875,0 -71.25,-32.0625 -71.25,-71.25c0,-39.1875 32.0625,-71.25 71.25,-71.25c39.1875,0 71.25,32.0625 71.25,71.25z" fill="#ffca28"></path><path d="M93.3375,97.25625h-15.675v-55.21875h15.675zM77.6625,121.125c0,-4.275 3.5625,-7.8375 7.8375,-7.8375c4.275,0 7.8375,3.5625 7.8375,7.8375c0,4.275 -3.5625,7.8375 -7.8375,7.8375c-4.275,0 -7.8375,-3.5625 -7.8375,-7.8375z" fill="#37474f"></path></g></g></svg>`,
    danger: `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 172 172" width="30px"><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path d="M0,172v-172h172v172z" fill="none"></path><g><path d="M157.66667,86c0,39.41667 -32.25,71.66667 -71.66667,71.66667c-39.41667,0 -71.66667,-32.25 -71.66667,-71.66667c0,-39.41667 32.25,-71.66667 71.66667,-71.66667c39.41667,0 71.66667,32.25 71.66667,71.66667z" fill="#e74c3c"></path><path d="M93.88333,97.825h-15.76667v-55.54167h15.76667zM78.11667,121.83333c0,-4.3 3.58333,-7.88333 7.88333,-7.88333c4.3,0 7.88333,3.58333 7.88333,7.88333c0,4.3 -3.58333,7.88333 -7.88333,7.88333c-4.3,0 -7.88333,-3.58333 -7.88333,-7.88333z" fill="#ffffff"></path></g></g></svg>`
}

const background = {
    info: '#16546a',
    warn: '#aa860b',
    danger: '#700c1f'
}

function alertCustom({ title, messageHTML, type, timeToHide = 3000 }) {
    const divAllAlerts = document.querySelector('.alerts')

    const divAlert = document.createElement('div')
    divAlert.classList.add('alert')
    divAlert.style.background = background[`${type}`]

    const alertTitle = document.createElement('div')
    alertTitle.classList.add('alertTitle')

    const alertTitleH3 = document.createElement('h3')
    alertTitleH3.innerText = title

    const descriptionAlert = document.createElement('p')
    descriptionAlert.classList.add('description')
    descriptionAlert.innerHTML = messageHTML

    alertTitle.innerHTML = SVGs[`${type}`]
    alertTitle.appendChild(alertTitleH3)
    divAlert.appendChild(alertTitle)
    divAlert.appendChild(descriptionAlert)
    divAllAlerts.appendChild(divAlert)

    setTimeout(() => {
        divAlert.style.transform = 'translateX(0%)'
    }, 100)
    setTimeout(() => {
        divAlert.style.transform = 'translateX(110%)'
        setTimeout(() => {
            divAlert.parentNode.removeChild(divAlert)
        }, 500)
    }, timeToHide)
}

function hexToRgb(hex) {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
        return r + r + g + g + b + b
    })

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    const rgb = [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
    ]

    return result ? rgb : null
}

function changeColor(arrayRGB, per100) {
    const percentage = (num, percentage) => num + (num * percentage)

    for (let i = 0; i < arrayRGB.length; i++) {
        let result = Math.floor(percentage(arrayRGB[i], per100))
        arrayRGB[i] = result > 255 ? result = 255 :
            result < 0 ? result = 0 : result
    }

    return [arrayRGB[0], arrayRGB[1], arrayRGB[2]]
}

function handleInputChange(e) {
    let target = e.target
    if (e.target.type !== 'range') {
        target = document.getElementById('range')
    }
    const min = target.min
    const max = target.max
    const val = target.value

    target.style.backgroundSize = (val - min) * 100 / (max - min) + '% 100%'
}

rangeInputs.forEach(input => {
    input.addEventListener('input', handleInputChange)
})

numberInput.addEventListener('input', handleInputChange)

function showColors({ arrReduceValue = 0, regra, per100Value, messageText }) {
    ulToShow.innerHTML = ''

    let rgb = hexToRgb(inputColor.value)
    let arrRgbReduce = arrReduceValue
    let numLis = 0

    for (let i = 0; eval(regra); i++) {
        const reduce0 = rgb.reduce((prev, curr) => prev + curr, 0) === 0
        const reduce1 = rgb.reduce((prev, curr) => prev + curr, 0) === 3
        const reduce2 = rgb.reduce((prev, curr) => prev + curr, 0) === 6
        for (let i = 0; i < rgb.length; i++) {
            rgb[i] === 0 ? rgb[i] = 1 : ''
            rgb[i] === 1 ? rgb[i] = 2 : ''
        }

        const per100 = eval(per100Value)
        const li = document.createElement('li')
        let arrRGB = changeColor(rgb, per100)

        arrRgbReduce = arrRGB.reduce((prev, curr) => prev + curr, 0)
        stringRGB = `rgb(${arrRGB[0]}, ${arrRGB[1]}, ${arrRGB[2]})`

        message.textContent = messageText

        li.style.background = stringRGB
        li.innerHTML = `<div data-rgb>${stringRGB}</div>`
        ulToShow.appendChild(li)

        if (reduce0) {
            rgb = [1, 1, 1]
        } else if (reduce1) {
            rgb = [2, 2, 2]
        } else if (reduce2) {
            rgb = [3, 3, 3]
        }

        i += (numberInput.value - 1)
        numLis++
        if (numLis > 50) {
            alertCustom({
                title: 'Danger when taking action',
                messageHTML: `To prevent your device from crashing or slowing down, script execution has been stopped.<br>
                Unable to create a palette with the color you chose. Try increasing the saute value.<br>
<br>
If you think something is wrong or that this is a mistake, please contact me:<br>
- Gmail: vanortton@gmail.com<br>
- Github repository (issues): <a href="https://github.com/Vanortton/change-color/issues">https://github.com/Vanortton/change-color/issues</a>`,
                type: 'warn',
                timeToHide: 15000
            })
            return
        }
    }
    const datas = document.querySelectorAll('ul li div')
    datas.forEach(data => data.style.maxWidth = `calc(97vw / ${datas.length})`)
}

buttonLighten.onclick = () => {
    inputColor.value == '#ffffff' ?
        alertCustom({
            title: 'The color is already too light',
            messageHTML: 'It is not possible to lighten the color you chose because it is already too light, to generate a palette choose another color or lighten it instead of darkening it.',
            type: 'warn',
            timeToHide: 10000
        }) :
    showColors({
        arrReduceValue: 0,
        regra: `arrRgbReduce < 765`,
        per100Value: `i === 100 ? 1.0 : (i / 100)`,
        messageText: 'Your light palette has been generated! Click in a color to copy.'
    })
    activeToCopy()
}

buttonDarken.onclick = () => {
    inputColor.value == '#000000' ? 
        alertCustom({
            title: 'The color is already too dark',
            messageHTML: 'It is not possible to darken the color you chose because it is already too dark, to generate a palette choose another color or lighten it instead of darkening it.',
            type: 'warn',
            timeToHide: 10000
    }) :
    showColors({
        arrReduceValue: 765,
        regra: `arrRgbReduce > 0`,
        per100Value: `i === 100 ? -1.0 : (i / 100) - ((i / 100) * 2)`,
        messageText: 'Your eyeshadow palette has been generated! Click in a color to copy.'
    })
    activeToCopy()
}

function activeToCopy() {
    const lis = document.querySelectorAll('li')
    lis.forEach(li => {
        li.onclick = () => {
            let content = li.firstChild.textContent
            navigator.clipboard.writeText(content)
                .then(() => {
                    alertCustom({
                        title: 'Color copied to clipboard...',
                        messageHTML: `Your color has been copied to your clipboard in RGB, now you can use it anywhere.`,
                        type: 'info'
                    })
                })
                .catch(err => {
                    alertCustom({
                        title: 'Something went wrong',
                        messageHTML: `${err}`,
                        type: 'danger'
                    })
                })
        }
    })
}