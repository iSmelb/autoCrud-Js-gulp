'use strict';

function pushElement(arrForPush, obj) {                  // функция для пуша в выбранный массив
    arrForPush.push(obj)
}

function createMenu() {                                  // функция которая создаёт меню Авто. Юзеры Продукты и вешает на каждый обработчик на создание списка
    const productTitle = createDomElement('div', {class: 'Product_Title'})
    productTitle.innerText = 'Products'
    productTitle.addEventListener('click', () => createListElements(arrProducts))

    const carsTitle = createDomElement('div', {class: 'Cars_Title'})
    carsTitle.innerText = 'Cars'
    carsTitle.addEventListener('click', () => createListElements(arrCars))

    const userTitle = createDomElement('div', {class: 'User_Title'})
    userTitle.innerText = 'Users'
    userTitle.addEventListener('click', () => createListElements(arrUsers))

    document.querySelector('.btn-wrapper').append(productTitle, carsTitle, userTitle)
}

function createDivElement(arrElement, arr) {            // функция которая создаёт отдельный контейнер для каждого еллемента списка. В ней есть пока титул и список характеристик, позже будут кнопки
    const div = createDomElement('div', {class: 'List_element', data_id: arrElement.id})
    const title = createDomElement('h4', {}, (arr.indexOf(arrElement) + 1) + '.' + arrElement.name)
    const ul = createDomElement('ul', {class:'information'})

    for (let key in arrElement) {
        if(key === 'id') {
            continue;
        }
        const li = document.createElement('li')
        li.innerText = key + ': ' + arrElement[key]
        ul.appendChild(li)
    }

    const buttonViev = createDomElement('button', {}, 'Viev')
    buttonViev.addEventListener('click', event => showUl(event))

    const buttonEdit = createDomElement('button', {}, 'Edit')
    const buttonDelet = createDomElement('button', {}, 'Delet')

    div.append(title,buttonViev, buttonEdit, buttonDelet, ul)
    document.querySelector('main').appendChild(div)
}

function showUl(event) {                              // показывает и скрывает сисок характеристик при клике
    const ul = event.target.parentNode.querySelector('ul')
    ul.classList.toggle('show')
}

function createListElements(arr) {                   // функция которая затирает старый список и создаёт новый 
    document.querySelector('main').innerHTML =''

    for(let i = 0; i<arr.length; i++) {
        createDivElement(arr[i], arr)
    }
}