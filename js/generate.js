const inputColor = document.querySelector('input[data-color]')
const rangeInputs = document.querySelectorAll('input[type="range"]')
const numberInput = document.querySelector('input[type="number"]')
const buttonLighten = document.querySelector('button[data-lighten]')
const buttonDarken = document.querySelector('button[data-darken]')
const message = document.querySelector('.results p')
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
        li.classList.add('col')
        li.classList.add('d-flex')
        li.classList.add('align-items-center')
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
        if (numLis > 80) {
            alertCustom({
                title: 'Perigo enquanto ação era executada!',
                messageHTML: `Para evitar que seu dispositivo fique lento ou trave o script foi parado.<br>
                Por isso não foi possível criar uma paleta com as suas configurações. Tente aumentar o valor do salto ou escolha outra cor.<br>
                <br>
                Se o problema persistir, entre em contato comigo:<br>
                - Gmail: vanortton@gmail.com<br>
                - Github (issues): <a href="https://github.com/Vanortton/change-color/issues">https://github.com/Vanortton/change-color/issues</a>`,
                type: 'danger',
                timeToHide: 15000
            })
            return
        }
    }

    const allTexts = document.querySelectorAll('li div[data-rgb]')
    const arrayColors = []
    allTexts.forEach(div => {
        if (arrayColors.indexOf(div.textContent) !== -1) {
            div.parentNode.remove()
        } else {
            arrayColors.push(div.textContent)
        }
        let item = div.textContent.replace('rgb(', '')
        item = item.replace(')', '')
        item = item.split(', ')
        item = item.reduce((acc, val) => acc + parseInt(val), 0)
        if (item >= 412) {
            div.style.color = 'black'
        } else if (item < 412) {
            div.style.color = 'white'
        }
    })
}