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

buttonLighten.onclick = () => {
    inputColor.value == '#ffffff' ?
        alertCustom({
            title: 'The color is already too light',
            messageHTML: 'It is not possible to lighten the color you chose because it is already too light, to generate a palette choose another color or lighten it instead of darkening it.',
            type: 'warn',
            timeToHide: 8000
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
            timeToHide: 8000
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