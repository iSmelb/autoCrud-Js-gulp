'use strict';

function pushElement(arrForPush, obj) {                  // функция для пуша в выбранный массив
    arrForPush.push(obj)
}

function createMenu() {                                  // функция которая создаёт меню Авто. Юзеры Продукты и вешает на каждый обработчик на создание списка
    const productTitle = createDomElement('div', { class: 'Product_Title' })
    productTitle.innerText = 'Products'
    productTitle.addEventListener('click', () => createListElements(arrProducts))

    const carsTitle = createDomElement('div', { class: 'Cars_Title' })
    carsTitle.innerText = 'Cars'
    carsTitle.addEventListener('click', () => createListElements(arrCars))

    const userTitle = createDomElement('div', { class: 'User_Title' })
    userTitle.innerText = 'Users'
    userTitle.addEventListener('click', () => createListElements(arrUsers))

    document.querySelector('.btn-wrapper').append(productTitle, carsTitle, userTitle)
}

function createDivElement(arrElement, arrElements) {            // функция которая создаёт отдельный контейнер для каждого еллемента списка. В ней есть пока титул и список характеристик, позже будут кнопки
    const div = createDomElement('div', { class: 'List_element', data_id: arrElement.id })
    const title = createDomElement('h4', {}, (arrElements.indexOf(arrElement) + 1) + '.' + arrElement.name)
    const ul = createDomElement('ul', { class: 'information' })

    for (let key in arrElement) {
        if (key === 'id') {
            continue;
        }
        const li = document.createElement('li')
        li.innerText = key + ': ' + arrElement[key]
        ul.appendChild(li)
    }

    const buttonViev = createDomElement('button', {}, 'Viev')
    buttonViev.addEventListener('click', event => showUl(event))

    const buttonEdit = createDomElement('button', {}, 'Edit')
    buttonEdit.addEventListener('click', () => editInfo(div, arrElements))

    const buttonDelet = createDomElement('button', {}, 'Delet')
    buttonDelet.addEventListener('click', event => deletElement(event, div, arrElements))

    div.append(title, buttonViev, buttonEdit, buttonDelet, ul)
    document.querySelector('main').appendChild(div)
}

function deletElement(event, divWithId, arrElements) {                        //удаление из списка: пользователя, товара или машины, я думаю эту функцию можно лучше сделать, но это лучше вдвоём посмотреть и решить 
    const deletElement = divWithId.getAttribute('data_id')
    const div = createDomElement('div', { class: 'confirmDelet' })
    div.classList.toggle('show')
    const divYesNo = createDomElement('div', { class: 'yes_or_no' })
    const span = createDomElement('span', {}, 'Are you sure you want to delete it?')
    const buttonYes = createDomElement('button', {}, 'Yes')
    let arrJSONFormat
    buttonYes.addEventListener('click', () => {

        for (let i = 0; i < arrElements.length; i++) {
            if (deletElement == arrElements[i].id) {
                arrElements.splice(arrElements.indexOf(arrElements[i]), 1)
                break
            }
        }

        if (arrElements === arrProducts) {
            arrJSONFormat = JSON.stringify(arrElements)
            localStorage.setItem('arrProducts', arrJSONFormat)
        } else if (arrElements === arrCars) {
            arrJSONFormat = JSON.stringify(arrElements)
            localStorage.setItem('arrCars', arrJSONFormat)
        } else if (arrElements === arrUsers) {
            arrJSONFormat = JSON.stringify(arrElements)
            localStorage.setItem('arrUsers', arrJSONFormat)
        }
        document.querySelector('main').removeChild(event.target.parentNode)
        document.body.removeChild(document.querySelector('.confirmDelet'))
    })

    const buttonNo = createDomElement('button', {}, 'No')
    buttonNo.addEventListener('click', () => document.body.removeChild(document.querySelector('.confirmDelet')))


    divYesNo.append(span, buttonYes, buttonNo)
    div.append(divYesNo)
    document.body.appendChild(div)
}

function showUl(event) {                              // показывает и скрывает сисок характеристик при клике
    const ul = event.target.parentNode.querySelector('ul')
    ul.classList.toggle('show')
}

function createListElements(arrElements) {                   // функция которая затирает старый список и создаёт новый 
    document.querySelector('main').innerHTML = ''

    for (let i = 0; i < arrElements.length; i++) {
        createDivElement(arrElements[i], arrElements)
    }
}

function checkLocal() {                                      // проверка локал стор
    let getProductsFromLocal = localStorage.getItem('arrProducts')
    if (getProductsFromLocal) {
        arrProducts = JSON.parse(getProductsFromLocal)
    }

    let getCarsFromLocal = localStorage.getItem('arrCars')
    if (getCarsFromLocal) {
        arrCars = JSON.parse(getCarsFromLocal)
    }

    let getUsersFromLocal = localStorage.getItem('arrUsers')
    if (getUsersFromLocal) {
        arrUsers = JSON.parse(getUsersFromLocal)
    }
}

let numberElement
let elementForEdit

function editInfo(divWithId, arrElements) {
    if (arrElements === arrProducts) {
        const getForm = document.querySelector('#product-template')
        const cloneForm = getForm.content.cloneNode(true);
        document.body.appendChild(cloneForm)
        const pathToFormProduct = document.forms[0].elements
        numberElement = divWithId.getAttribute('data_id')

        for (let i = 0; i < arrElements.length; i++) {
            if (numberElement == arrElements[i].id) {
                elementForEdit = arrElements.indexOf(arrElements[i])
                pathToFormProduct.title.value = arrElements[i].name
                pathToFormProduct.count.value = arrElements[i].count
                pathToFormProduct.price.value = arrElements[i].price
                if(arrElements[i].characteristics) {
                    pathToFormProduct.description.value = arrElements[i].characteristics
                }
            }
        }

        const buttonSave = document.querySelector('.save_info_button')
        buttonSave.addEventListener('click', () => editElementProduct(arrElements, pathToFormProduct))
        const buttonBack = document.querySelector('.back_to_list_button')
        buttonBack.addEventListener('click', deletForm)
    }
}

function deletForm() {
    document.body.removeChild(document.forms[0])
}

function editElementProduct(arrElements, pathToFormProduct) {
    arrElements[elementForEdit].name = pathToFormProduct.title.value
    arrElements[elementForEdit].count = pathToFormProduct.count.value
    arrElements[elementForEdit].price = pathToFormProduct.price.value
    arrElements[elementForEdit].characteristics = pathToFormProduct.description.value

    errorOrConfirm(saveAndEdit, arrElements)
}

function errorOrConfirm(funcAfterValid, arrElements) {
    if(numberElement === -2) {
        console.log('hi')             // здесь должна быть валидация
    } else {
        funcAfterValid(arrElements)
    }
}

function saveAndEdit(arrElements) {  // редактирование выбранного елемента
    const title = document.querySelector('.List_element[data_id="' + numberElement + '"]').querySelector('h4')
    title.innerText = (arrElements.indexOf(arrElements[elementForEdit]) + 1) + '.' + arrElements[elementForEdit].name

    const ul = document.querySelector('.List_element[data_id="' + numberElement + '"]').querySelector('.information')
    ul.innerHTML = ''

    for (let key in arrElements[elementForEdit]) {
        if (key === 'id') {
            continue;
        }
        const li = document.createElement('li')
        li.innerText = key + ': ' + arrElements[elementForEdit][key]
        ul.appendChild(li)
    }

    let arrJSONFormat
    if (arrElements === arrProducts) {
        arrJSONFormat = JSON.stringify(arrElements)
        localStorage.setItem('arrProducts', arrJSONFormat)
    } else if (arrElements === arrCars) {
        arrJSONFormat = JSON.stringify(arrElements)
        localStorage.setItem('arrCars', arrJSONFormat)
    } else if (arrElements === arrUsers) {
        arrJSONFormat = JSON.stringify(arrElements)
        localStorage.setItem('arrUsers', arrJSONFormat)
    }
    deletForm()
}