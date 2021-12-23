'use strict';

function pushElement(arrForPush, obj) {                  // функция для пуша в выбранный массив
    arrForPush.push(obj)
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
    const divForInfo = createDomElement('div', {class: 'div_for_info'})
    const divForButton = createDomElement('div', {class: 'div_for_button'})
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
    divForInfo.append(title , ul)

    const buttonViev = createDomElement('button', {class: 'viev', title: 'Viev'})
    buttonViev.addEventListener('click', event => showUl(event))

    const buttonEdit = createDomElement('button', {class: 'edit', title: 'Edit'})
    buttonEdit.addEventListener('click', () => editInfo(div, arrElements))

    const buttonDelet = createDomElement('button', { class: 'delet', title: 'Delet'}, )
    buttonDelet.addEventListener('click', event => deletElement(event, div, arrElements))

    divForButton.append(buttonViev, buttonEdit, buttonDelet)

    if(arrElements !== arrUsers) {
        const buttonSell = createDomElement('button', {class: 'sale', title: 'Sell'},)
        buttonSell.addEventListener('click', ()=> createCustomerList(div, arrElements))
        divForButton.append(buttonSell)
    }

    div.append(divForInfo, divForButton)
    document.querySelector('main').appendChild(div)
}

function deletElement(event, divWithId, arrElements) {                        //удаление из списка: пользователя, товара или машины, я думаю эту функцию можно лучше сделать, но это лучше вдвоём посмотреть и решить 
    const deletElement = Number(divWithId.getAttribute('data_id'))
    const div = createDomElement('div', { class: 'confirmDelet' })
    div.classList.toggle('show')
    const divYesNo = createDomElement('div', { class: 'yes_or_no' })
    const span = createDomElement('span', {}, 'Are you sure you want to delete it?')
    const buttonYes = createDomElement('button', {}, 'Yes')
    let arrJSONFormat
    buttonYes.addEventListener('click', () => {

        for (let i = 0; i < arrElements.length; i++) {
            if (deletElement === arrElements[i].id) {
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

function showUl(event) {                              // показывает и скрывает список характеристик при клике
    const ul = event.target.parentNode.parentNode.querySelector('ul')
    ul.classList.toggle('show')
}

function createListElements(arrElements) {                   // функция которая затирает старый список и создаёт новый 
    document.querySelector('main').innerHTML = ''
    const buttonAdd = createDomElement('button', {class: 'button_for_add'}, 'Add new')
    buttonAdd.addEventListener('click', ()=> createFormForAdd(arrElements))
    document.querySelector('main').appendChild(buttonAdd)

    for(let element of arrElements) {
        createDivElement(element, arrElements)
    }
}

function createFormForAdd(arrElements) {                    // создание формы для добавления
    let nameForm = ['#product-template', "#auto-template", "#user-template"]
    let nameTamplate

    if (arrElements === arrProducts) {
        nameTamplate = nameForm[0]
    } else if (arrElements === arrCars) {
        nameTamplate = nameForm[1]
    } else if (arrElements === arrUsers) {
        nameTamplate = nameForm[2]
    }

    const getForm = document.querySelector(nameTamplate)
    const cloneForm = getForm.content.cloneNode(true);
    const divForForm = createDomElement('div', {class: 'conteiner_for_form'})
    divForForm.append(cloneForm)
    document.body.appendChild(divForForm)
    const pathToForm = document.forms[0].elements

    const buttonSave = document.querySelector('.save_info_button')
    buttonSave.addEventListener('click', () => errorOrConfirm(addNewElemet, arrElements))
    const buttonBack = document.querySelector('.back_to_list_button')
    buttonBack.addEventListener('click', deletForm)
}

function addNewElemet(arrElements) {                         // добавление нового елемента     
    const pathToForm = document.forms[0].elements
    let elementToAdd
    let arrJSONFormat
    if (arrElements === arrProducts) {
        elementToAdd = new Product(pathToForm.name.value, pathToForm.count.value ,pathToForm.price.value, pathToForm.characteristics.value)
        arrElements.push(elementToAdd)
        arrJSONFormat = JSON.stringify(arrElements)
        localStorage.setItem('arrProducts', arrJSONFormat)
    } else if (arrElements === arrCars) {
        elementToAdd = new Auto(pathToForm.name.value, pathToForm.count.value ,pathToForm.price.value, pathToForm.transmission.value, pathToForm.characteristics.value)
        arrElements.push(elementToAdd)
        arrJSONFormat = JSON.stringify(arrElements)
        localStorage.setItem('arrCars', arrJSONFormat)
    } else if (arrElements === arrUsers) {
        elementToAdd = new User(pathToForm.firstname.value, pathToForm.age.value, pathToForm.email.value, pathToForm.phonenumber.value, pathToForm.balance.value)
        arrElements.push(elementToAdd)
        arrJSONFormat = JSON.stringify(arrElements)
        localStorage.setItem('arrUsers', arrJSONFormat)
    }
    
    createDivElement(elementToAdd, arrElements)
    deletForm()
}

let dataIdElement
let elementForEditOnArr

function editInfo(divWithId, arrElements) {
    if (arrElements === arrProducts) {
        editProduct(divWithId, arrElements)
    } else if (arrElements === arrCars) {
        editCar(divWithId, arrElements)
    } else if (arrElements === arrUsers) {
        editUser(divWithId, arrElements)
    }
}

function editProduct(divWithId, arrElements) {                 // заполнение формы для редактирования продукта
    const getForm = document.querySelector('#product-template')
    const cloneForm = getForm.content.cloneNode(true);
    const divForForm = createDomElement('div', {class: 'conteiner_for_form'})
    divForForm.append(cloneForm)
    document.body.appendChild(divForForm)
    const pathToFormProduct = document.forms[0].elements
    dataIdElement = Number(divWithId.getAttribute('data_id'))

    for (let i = 0; i < arrElements.length; i++) {
        if (dataIdElement === arrElements[i].id) {
            elementForEditOnArr = arrElements.indexOf(arrElements[i])
            pathToFormProduct.name.value = arrElements[i].name
            pathToFormProduct.count.value = arrElements[i].count
            pathToFormProduct.price.value = arrElements[i].price
            if (arrElements[i].characteristics) {
                pathToFormProduct.characteristics.value = arrElements[i].characteristics
            }
            break
        }
    }

    const buttonSave = document.querySelector('.save_info_button')
    buttonSave.addEventListener('click', () => editElementProductOrCar(arrElements, pathToFormProduct))
    const buttonBack = document.querySelector('.back_to_list_button')
    buttonBack.addEventListener('click', deletForm)
}

function editCar(divWithId, arrElements) {                      // заполнение формы для редактирования машины
    const getForm = document.querySelector('#auto-template')
    const cloneForm = getForm.content.cloneNode(true);
    const divForForm = createDomElement('div', {class: 'conteiner_for_form'})
    divForForm.append(cloneForm)
    document.body.appendChild(divForForm)
    const pathToFormCar = document.forms[0].elements
    dataIdElement = Number(divWithId.getAttribute('data_id'))

    for (let i = 0; i < arrElements.length; i++) {
        if (dataIdElement === arrElements[i].id) {
            elementForEditOnArr = arrElements.indexOf(arrElements[i])
            pathToFormCar.name.value = arrElements[i].name
            pathToFormCar.count.value = arrElements[i].count
            pathToFormCar.price.value = arrElements[i].price
            pathToFormCar.transmission.value = arrElements[i].transmission
            if (arrElements[i].characteristics) {
                pathToFormCar.characteristics.value = arrElements[i].characteristics
            }
            break
        }
    }

    const buttonSave = document.querySelector('.save_info_button')
    buttonSave.addEventListener('click', () => editElementProductOrCar(arrElements, pathToFormCar))
    const buttonBack = document.querySelector('.back_to_list_button')
    buttonBack.addEventListener('click', deletForm)
}

function editUser(divWithId, arrElements) {                     // заполнение формы для редактирования пользователя
    const getForm = document.querySelector('#user-template')
    const cloneForm = getForm.content.cloneNode(true);
    const divForForm = createDomElement('div', {class: 'conteiner_for_form'})
    divForForm.append(cloneForm)
    document.body.appendChild(divForForm)
    const pathToFormUser = document.forms[0].elements
    dataIdElement = Number(divWithId.getAttribute('data_id'))

    for (let i = 0; i < arrElements.length; i++) {
        if (dataIdElement === arrElements[i].id) {
            elementForEditOnArr = arrElements.indexOf(arrElements[i])
            pathToFormUser.firstname.value = arrElements[i].name
            pathToFormUser.age.value = arrElements[i].age
            pathToFormUser.email.value = arrElements[i].email
            pathToFormUser.phonenumber.value = arrElements[i].tel
            pathToFormUser.balance.value = arrElements[i].balance
            break
        }
    }

    const buttonSave = document.querySelector('.save_info_button')
    buttonSave.addEventListener('click', () => editElementUser(arrElements, pathToFormUser))
    const buttonBack = document.querySelector('.back_to_list_button')
    buttonBack.addEventListener('click', deletForm)
}

function deletForm() {
    document.querySelector('.conteiner_for_form').remove()
}

function editElementProductOrCar(arrElements, pathToForm) {     // редактирование елмента в массиве
    arrElements[elementForEditOnArr].name = pathToForm.name.value
    arrElements[elementForEditOnArr].count = pathToForm.count.value
    arrElements[elementForEditOnArr].price = pathToForm.price.value
    arrElements[elementForEditOnArr].characteristics = pathToForm.characteristics.value
    if(arrElements[elementForEditOnArr].transmission) {
        arrElements[elementForEditOnArr].transmission = pathToForm.transmission.value
    }

    errorOrConfirm(saveAndEdit, arrElements)
}

function editElementUser(arrElements, pathToForm) {
    arrElements[elementForEditOnArr].name = pathToForm.firstname.value
    arrElements[elementForEditOnArr].age = pathToForm.age.value
    arrElements[elementForEditOnArr].email = pathToForm.email.value
    arrElements[elementForEditOnArr].tel = pathToForm.phonenumber.value
    arrElements[elementForEditOnArr].balance = pathToForm.balance.value

    errorOrConfirm(saveAndEdit, arrElements)
}

function errorOrConfirm(funcAfterValid, arrElements) {
    if (dataIdElement === -2) {         // здесь должна быть валидация
        console.log('error')               
    } else {
        funcAfterValid(arrElements)
    }
}

function saveAndEdit(arrElements) {  // перерендер выбранного елемента
    const title = document.querySelector('.List_element[data_id="' + dataIdElement + '"]').querySelector('h4')
    title.innerText = (arrElements.indexOf(arrElements[elementForEditOnArr]) + 1) + '.' + arrElements[elementForEditOnArr].name

    const ul = document.querySelector('.List_element[data_id="' + dataIdElement + '"]').querySelector('.information')
    ul.innerHTML = ''

    for (let key in arrElements[elementForEditOnArr]) {
        if (key === 'id') {
            continue;
        }
        const li = document.createElement('li')
        li.innerText = key + ': ' + arrElements[elementForEditOnArr][key]
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

    if(document.forms[0]){
        deletForm()
    }
}

function createCustomerList(divWithId, arrElements) {
    const customerList = createDomElement('div', {class: 'customer_list'})

    for(let i = 0; i < arrUsers.length; i++) {
        const userDiv = createDomElement('div', {class: 'customer_list_user', data_user_id: arrUsers[i].id})
        const nameUser = createDomElement('h4', {}, `${arrUsers.indexOf(arrUsers[i]) + 1}. ${arrUsers[i].name} ($${arrUsers[i].balance})`)
        const inputForCount = createDomElement('input', {type: 'number', placeholder: 'Enter a count product'})
        const buttonSell = createDomElement('button', {}, 'sell')
        buttonSell.addEventListener('click', ()=> sellItem(divWithId, arrElements, userDiv))

        userDiv.append(nameUser, inputForCount, buttonSell)
        customerList.append(userDiv)
    }

    document.body.append(customerList)
}

function sellItem(divWithId, arrElements, userDivId) {
    let itemId = Number(divWithId.getAttribute('data_id'))
    let userId = Number(userDivId.getAttribute('data_user_id'))
    let countForBuy = Number(document.querySelector('.customer_list_user[data_user_id="' + userId + '"]').querySelector('input').value)
    let itemForSell
    let userWhoBuy

    for(let item of arrElements) {
        if(item.id === itemId) {
            itemForSell = item
            elementForEditOnArr = arrElements.indexOf(item)
            break
        }
    }

    for(let user of arrUsers) {
        if(user.id === userId) {
            userWhoBuy = user
            break
        }
    }
    
    if(countForBuy <= Number(itemForSell.count)) {
        let totalPrice = countForBuy * itemForSell.price
        
        if(totalPrice <= userWhoBuy.balance) {
            userWhoBuy.balance -= totalPrice
            itemForSell.count -= countForBuy

            let sellingItem = `${itemForSell.name}(${countForBuy})`
            userWhoBuy.boughtItem.push(sellingItem)

            dataIdElement = itemId
            saveAndEdit(arrElements)
            let arrJSONFormat = JSON.stringify(arrUsers)
            localStorage.setItem('arrUsers', arrJSONFormat)

            document.body.removeChild(document.querySelector('.customer_list'))
        } else{
            alert('error')
        }
    } else {
        alert('error')
    }
}