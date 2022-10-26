const inputColor = document.querySelector('input[data-color]')
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

function changeColor(arrayRGB, por100) {
    const porcentagem = (num, porcentagem) => num + (num * porcentagem)

    for (let i = 0; i < arrayRGB.length; i++) {
        let result = Math.floor(porcentagem(arrayRGB[i], por100))
        arrayRGB[i] = result > 255 ? result = 255 : result
    }

    return [arrayRGB[0], arrayRGB[1], arrayRGB[2]]
}

function showColors({ arrReduceValue, regra, por100Value, messageText }) {
    ulToShow.innerHTML = ''

    let rgb = hexToRgb(inputColor.value)
    rgb.reduce((prev, curr) => prev + curr, 0) === 0 ? rgb = [2, 2, 2] : ''
    let arrRgbReduce = arrReduceValue

    for (let i = 0; eval(regra); i++) {
        const por100 = eval(por100Value)
        const li = document.createElement('li')
        let arrRGB = changeColor(rgb, por100)

        arrRgbReduce = arrRGB.reduce((prev, curr) => prev + curr, 0)
        stringRGB = `rgb(${arrRGB[0]}, ${arrRGB[1]}, ${arrRGB[2]})`

        message.textContent = messageText

        li.style.background = stringRGB
        li.innerHTML = `<span data-copyRGB>${stringRGB}</span>`
        ulToShow.appendChild(li)

        i += 9
    }
}

buttonLighten.onclick = () => {
    showColors({
        arrReduceValue: 0,
        regra: `arrRgbReduce < 765`,
        por100Value: `i === 100 ? 1.0 : (i / 100)`,
        messageText: 'Sua cor foi clareada'
    })
}

buttonDarken.onclick = () => {
    showColors({
        arrReduceValue: 765,
        regra: `arrRgbReduce > 0`,
        por100Value: `i === 100 ? -1.0 : (i / 100) - ((i / 100) * 2)`,
        messageText: 'Sua cor foi escurecida'
    })
}