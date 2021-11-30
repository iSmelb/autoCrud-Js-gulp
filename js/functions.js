'use strict';

function pushElement(arrForPush, obj) {                  // функция для пуша в выбранный массив
    arrForPush.push(obj)
}

function createMenu() {                                  // функция которая создаёт меню Авто. Юзеры Продукты и вешает на каждый обработчик на создание списка
    const productTitle = createDiv('Product_Title')
    productTitle.addEventListener('click', () => createListElements(arrProducts))

    const carsTitle = createDiv('Cars_Title')
    carsTitle.addEventListener('click', () => createListElements(arrCars))

    const userTitle = createDiv('User_Title')
    userTitle.addEventListener('click', () => createListElements(arrUsers))

    productTitle.innerText = 'Products'
    carsTitle.innerText = 'Cars'
    userTitle.innerText = 'Users'

    document.querySelector('.btn-wrapper').append(productTitle, carsTitle, userTitle)
}

function createDivElement(arrElement, arr) {            // функция которая создаёт отдельный контейнер для каждого еллемента списка. В ней есть пока титул и список характеристик, позже будут кнопки
    const div = createDiv('List_element')
    div.setAttribute('data-id', arrElement.id)
    const title = creatreTitleH(4, (arr.indexOf(arrElement) + 1) + '.' + arrElement.name)
    const ul = createUl('information')

    for (let key in arrElement) {
        if(key === 'id') {
            continue;
        }
        const li = document.createElement('li')
        li.innerText = key + ': ' + arrElement[key]
        ul.appendChild(li)
    }

    div.append(title, ul)
    document.querySelector('main').appendChild(div)
}

function createListElements(arr) {                   // функция которая затирает старый список и создаёт новый 
    document.querySelector('main').innerHTML =''

    for(let i = 0; i<arr.length; i++) {
        createDivElement(arr[i], arr)
    }
}