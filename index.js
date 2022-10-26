const inputColor = document.querySelector('input[data-color]')
const rangeInputs = document.querySelectorAll('input[type="range"]')
const numberInput = document.querySelector('input[type="number"]')
const buttonLighten = document.querySelector('button[data-lighten]')
const buttonDarken = document.querySelector('button[data-darken]')
const message = document.querySelector('.results h3')
const ulToShow = document.querySelector('.results ul')

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

function showColors({ arrReduceValue, regra, per100Value, messageText }) {
    ulToShow.innerHTML = ''

    let rgb = hexToRgb(inputColor.value)
    let arrRgbReduce = arrReduceValue

    for (let i = 0; eval(regra); i++) {
        const reduce0 = rgb.reduce((prev, curr) => prev + curr, 0) === 0
        const reduce1 = rgb.reduce((prev, curr) => prev + curr, 0) === 3
        const reduce2 = rgb.reduce((prev, curr) => prev + curr, 0) === 6

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
    }
    const datas = document.querySelectorAll('ul li div')
    datas.forEach(data => data.style.maxWidth = `calc(97vw / ${datas.length})`)
}

buttonLighten.onclick = () => {
    showColors({
        arrReduceValue: 0,
        regra: `arrRgbReduce < 765`,
        per100Value: `i === 100 ? 1.0 : (i / 100)`,
        messageText: 'Your light palette has been generated!'
    })
    activeToCopy()
}

buttonDarken.onclick = () => {
    showColors({
        arrReduceValue: 765,
        regra: `arrRgbReduce > 0`,
        per100Value: `i === 100 ? -1.0 : (i / 100) - ((i / 100) * 2)`,
        messageText: 'Your eyeshadow palette has been generated!'
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
                    alert('Text copied to clipboard...')
                    console.log('Text copied to clipboard...')
                })
                .catch(err => {
                    console.log('Something went wrong', err);
                })
        }
    })
}