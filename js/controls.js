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

function veryLightOrDark(value) {
    let item = hexToRgb(value)
    item = item.reduce((acc, val) => acc + val, 0)
    if (item >= 620) {
        return 'no lighten'
    } else if (item < 90) {
        return 'no darken'
    }
}

buttonLighten.onclick = () => {
    veryLightOrDark(inputColor.value) === 'no lighten' ?
        alertCustom({
            title: 'A cor é muito clara!',
            messageHTML: 'Não é possível clarear essa cor pois ela já é muito clara, para gerar uma paleta de luz tente escolher uma cor mais escura ou gere uma paleta de sombras.',
            type: 'warn'
        }) :
        showColors({
            arrReduceValue: 0,
            regra: `arrRgbReduce < 765`,
            per100Value: `i === 100 ? 1.0 : (i / 100)`,
            messageText: 'Sua paleta de luz foi gerada! Click em uma cor para copiá-la.'
        })
    activeToCopy()
}

buttonDarken.onclick = () => {
    veryLightOrDark(inputColor.value) === 'no darken' ?
        alertCustom({
            title: 'A cor é muito escura!',
            messageHTML: 'Não é possível escurecer essa cor pois ela já é muito escura, para gerar uma paleta de sombras tente escolher uma cor mais clara ou gere uma paleta de luz.',
            type: 'warn',
        }) :
        showColors({
            arrReduceValue: 765,
            regra: `arrRgbReduce > 0`,
            per100Value: `i === 100 ? -1.0 : (i / 100) - ((i / 100) * 2)`,
            messageText: 'Sua paleta de sombras foi gerada! Click em uma cor para copiá-la.'
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
                        title: 'Cor copiada para a área de transferência..',
                        messageHTML: `Sua cor foi copiada para a área de transferência no formato RGB, agora você pode usá-la onde quiser.`,
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