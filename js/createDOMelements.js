'use strict';

function createDomElement(tagName, attObj) {                       //Создаём любой дом элемент, через объект добавляем атрибуты 
    const domElement = document.createElement(tagName)
    if(attObj) {
        for(let key in attObj) {
            domElement.setAttribute(key, attObj[key])
        }
    }
    return domElement
}