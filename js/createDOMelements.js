'use strict';

function createDiv(className) {
    let div = document.createElement('div')
    div.setAttribute('class', className)
    return div
}

function creatreTitleH(number, title) {
    let h = document.createElement('h' + number)
    h.innerText = title
    return h
}

function createUl(className) {
    let ul = document.createElement('ul')
    ul.setAttribute('class', className)
    return ul
}

function createButton(textButton, functionHandler) {
    let buttom = document.createElement('button')
    buttom.innerText = textButton
    buttom.addEventListener('click', functionHandler)
    return buttom
}