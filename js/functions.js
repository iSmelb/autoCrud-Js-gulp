"use strict";

function pushElement(arrForPush, obj) {
  // функция для пуша в выбранный массив
  arrForPush.push(obj);
}

function checkLocal() {
  // проверка локал стор
  let getProductsFromLocal = localStorage.getItem("arrProducts");
  if (getProductsFromLocal) {
    arrProducts = JSON.parse(getProductsFromLocal);
  }

  let getCarsFromLocal = localStorage.getItem("arrCars");
  if (getCarsFromLocal) {
    arrCars = JSON.parse(getCarsFromLocal);
  }

  let getUsersFromLocal = localStorage.getItem("arrUsers");
  if (getUsersFromLocal) {
    arrUsers = JSON.parse(getUsersFromLocal);
  }
}

function setLocal(arrForset) {
  let arrJSONFormat;

  if (arrForset === arrProducts) {
    arrJSONFormat = JSON.stringify(arrForset);
    localStorage.setItem("arrProducts", arrJSONFormat);
  } else if (arrForset === arrCars) {
    arrJSONFormat = JSON.stringify(arrForset);
    localStorage.setItem("arrCars", arrJSONFormat);
  } else if (arrForset === arrUsers) {
    arrJSONFormat = JSON.stringify(arrForset);
    localStorage.setItem("arrUsers", arrJSONFormat);
  }
}

function createMenu() {
  // функция которая создаёт меню Авто. Юзеры Продукты и вешает на каждый обработчик на создание списка
  const productTitle = createDomElement("div", { class: "Product_Title" });
  productTitle.innerText = "Products";
  productTitle.addEventListener("click", () => createListElements(arrProducts));

  const carsTitle = createDomElement("div", { class: "Cars_Title" });
  carsTitle.innerText = "Cars";
  carsTitle.addEventListener("click", () => createListElements(arrCars));

  const userTitle = createDomElement("div", { class: "User_Title" });
  userTitle.innerText = "Users";
  userTitle.addEventListener("click", () => createListElements(arrUsers));

  document
    .querySelector(".btn-wrapper")
    .append(productTitle, carsTitle, userTitle);
}

function createUlinfo(ulForAdd, elementForSearch) {
  for (let key in elementForSearch) {
    const li = document.createElement("li");
    li.innerText = key + ": " + elementForSearch[key];

    if (key === "id") {
      continue;
    }

    if (key === "boughtItem" && elementForSearch[key].length !== 0) {
      let textForLi = `${elementForSearch[key][0].name}(${elementForSearch[key][0].count}); `;
      for (let i = 1; i < elementForSearch[key].length; i++) {
        textForLi += `${elementForSearch[key][i].name}(${elementForSearch[key][i].count}); `;
      }
      li.innerText = key + ": " + textForLi;
    }
    ulForAdd.appendChild(li);
  }
}

function createDivElement(arrElement, arrElements) {
  // функция которая создаёт отдельный контейнер для каждого еллемента списка. В ней есть пока титул и список характеристик, позже будут кнопки
  const div = createDomElement("div", {
    class: "List_element",
    data_id: arrElement.id,
  });
  const divForInfo = createDomElement("div", { class: "div_for_info" });
  const divForButton = createDomElement("div", { class: "div_for_button" });
  const title = createDomElement(
    "h4",
    {},
    arrElements.indexOf(arrElement) + 1 + "." + arrElement.name
  );
  const ul = createDomElement("ul", { class: "information" });

  createUlinfo(ul, arrElement);
  divForInfo.append(title, ul);

  const buttonViev = createDomElement("button", {
    class: "viev",
    title: "Viev",
  });
  buttonViev.addEventListener("click", (event) => showUl(event));

  const buttonEdit = createDomElement("button", {
    class: "edit",
    title: "Edit",
  });
  buttonEdit.addEventListener("click", () => editInfo(div, arrElements));

  const buttonDelet = createDomElement("button", {
    class: "delet",
    title: "Delet",
  });
  buttonDelet.addEventListener("click", (event) =>
    deletElement(event, div, arrElements)
  );

  divForButton.append(buttonViev, buttonEdit, buttonDelet);

  if (arrElements !== arrUsers) {
    const buttonSell = createDomElement("button", {
      class: "sale",
      title: "Sell",
    });
    if (Number(arrElement.count === 0)) {
      buttonSell.setAttribute("disabled", "disabled");
    }
    buttonSell.addEventListener("click", () =>
      createCustomerList(div, arrElements)
    );
    divForButton.append(buttonSell);
  }

  div.append(divForInfo, divForButton);
  document.querySelector("main").appendChild(div);
}

function deletElement(event, divWithId, arrElements) {
  //удаление из списка: пользователя, товара или машины, я думаю эту функцию можно лучше сделать, но это лучше вдвоём посмотреть и решить
  document.body.classList.add("stop-scrolling");
  const deletElement = Number(divWithId.getAttribute("data_id"));
  const div = createDomElement("div", { class: "confirmDelet" });
  div.classList.toggle("show");
  const divYesNo = createDomElement("div", { class: "yes_or_no" });
  const span = createDomElement(
    "span",
    {},
    `Are u sure u want delet ${divWithId.querySelector("h4").innerText}?`
  );
  const buttonYes = createDomElement("button", {}, "Yes");
  buttonYes.addEventListener("click", () => {
    for (let i = 0; i < arrElements.length; i++) {
      if (deletElement === arrElements[i].id) {
        arrElements.splice(arrElements.indexOf(arrElements[i]), 1);
        break;
      }
    }
    setLocal(arrElements);
    if(arrElements.length === 0) {
      const listEmpty = createDomElement('strong', { class: 'listEmpty'}, 'The list is empty')
      document.querySelector("main").appendChild(listEmpty)
    }

    document.querySelector("main").removeChild(event.target.parentNode.parentNode);
    document.body.removeChild(document.querySelector(".confirmDelet"));
    document.body.classList.remove("stop-scrolling");
  });

  const buttonNo = createDomElement("button", {}, "No");
  buttonNo.addEventListener("click", () => {
    document.body.removeChild(document.querySelector(".confirmDelet"));
    document.body.classList.remove("stop-scrolling");
  });

  divYesNo.append(span, buttonYes, buttonNo);
  div.append(divYesNo);
  document.body.appendChild(div);
}

function showUl(event) {
  // показывает и скрывает список характеристик при клике
  const ul = event.target.parentNode.parentNode.querySelector("ul");
  ul.classList.toggle("show");
}

function createListElements(arrElements) {
  // функция которая затирает старый список и создаёт новый
  document.querySelector("main").innerHTML = "";
  const buttonAdd = createDomElement(
    "button",
    { class: "button_for_add" },
    "Add new"
  );
  buttonAdd.addEventListener("click", () => createFormForAdd(arrElements));
  document.querySelector("main").appendChild(buttonAdd);

  for (let element of arrElements) {
    createDivElement(element, arrElements);
  }

  if(arrElements.length === 0) {
    const listEmpty = createDomElement('strong', { class: 'listEmpty'}, 'The list is empty')
    document.querySelector("main").appendChild(listEmpty)
  }
}

function createFormForAdd(arrElements) {
  // создание формы для добавления
  let nameForm = ["#product-template", "#auto-template", "#user-template"];
  let nameTamplate;

  if (arrElements === arrProducts) {
    nameTamplate = nameForm[0];
  } else if (arrElements === arrCars) {
    nameTamplate = nameForm[1];
  } else if (arrElements === arrUsers) {
    nameTamplate = nameForm[2];
  }

  const getForm = document.querySelector(nameTamplate);
  const cloneForm = getForm.content.cloneNode(true);
  const divForForm = createDomElement("div", { class: "conteiner_for_form" });
  document.body.classList.toggle("stop-scrolling");
  divForForm.append(cloneForm);
  document.body.appendChild(divForForm);

  const buttonSave = document.querySelector(".save_info_button");
  buttonSave.addEventListener("click", () =>
    errorOrConfirm(addNewElemet, arrElements)
  );
  const buttonBack = document.querySelector(".back_to_list_button");
  buttonBack.addEventListener("click", deletForm);
}

function addNewElemet(arrElements) {
  // добавление нового елемента
  const pathToForm = document.forms[0].elements;
  let elementToAdd;
  if (arrElements === arrProducts) {
    elementToAdd = new Product(
      pathToForm.name.value,
      pathToForm.count.value,
      pathToForm.price.value,
      pathToForm.characteristics.value
    );
    arrElements.push(elementToAdd);
  } else if (arrElements === arrCars) {
    elementToAdd = new Auto(
      pathToForm.name.value,
      pathToForm.count.value,
      pathToForm.price.value,
      pathToForm.transmission.value,
      pathToForm.characteristics.value
    );
    arrElements.push(elementToAdd);
  } else if (arrElements === arrUsers) {
    elementToAdd = new User(
      pathToForm.firstname.value,
      pathToForm.age.value,
      pathToForm.email.value,
      pathToForm.phonenumber.value,
      pathToForm.balance.value
    );
    arrElements.push(elementToAdd);
  }
  setLocal(arrElements);
  
  if(arrElements.length === 1) {
    document.querySelector(".listEmpty").remove()
  }

  createDivElement(elementToAdd, arrElements);
  deletForm();
}

let dataIdElement;
let elementForEditOnArr;

function editInfo(divWithId, arrElements) {                //создание формы для редактирования
  document.body.classList.toggle("stop-scrolling");
  let nameForm = ["#product-template", "#auto-template", "#user-template"];
  let nameTamplate;

  if (arrElements === arrProducts) {
    nameTamplate = nameForm[0];
  } else if (arrElements === arrCars) {
    nameTamplate = nameForm[1];
  } else if (arrElements === arrUsers) {
    nameTamplate = nameForm[2];
  }

  const getForm = document.querySelector(nameTamplate);
  const cloneForm = getForm.content.cloneNode(true);
  const divForForm = createDomElement("div", { class: "conteiner_for_form" });
  divForForm.append(cloneForm);
  document.body.appendChild(divForForm);
  const pathToForm = document.forms[0].elements;
  dataIdElement = Number(divWithId.getAttribute("data_id"));

  setInputOnForm(dataIdElement, arrElements, pathToForm)

  const buttonSave = document.querySelector(".save_info_button");
  if (arrElements === arrProducts || arrElements === arrCars) {
    buttonSave.addEventListener("click", () =>
      editElementProductOrCar(arrElements, pathToForm)
    );
  } else {
    buttonSave.addEventListener("click", () =>
      editElementUser(arrElements, pathToForm)
    );
  }
  const buttonBack = document.querySelector(".back_to_list_button");
  buttonBack.addEventListener("click", deletForm);
}

function setInputOnForm(idElement, arrElements, pathToForm) {           //заполнение формы для редактирования
  if (arrElements === arrProducts) {
    for (let i = 0; i < arrElements.length; i++) {
      if (idElement === arrElements[i].id) {
        elementForEditOnArr = arrElements.indexOf(arrElements[i]);
        pathToForm.name.value = arrElements[i].name;
        pathToForm.count.value = arrElements[i].count;
        pathToForm.price.value = arrElements[i].price;
        if (arrElements[i].characteristics) {
          pathToForm.characteristics.value =
            arrElements[i].characteristics;
        }
        break;
      }
    }
  } else if (arrElements === arrCars) {
    for (let i = 0; i < arrElements.length; i++) {
      if (idElement === arrElements[i].id) {
        elementForEditOnArr = arrElements.indexOf(arrElements[i]);
        pathToForm.name.value = arrElements[i].name;
        pathToForm.count.value = arrElements[i].count;
        pathToForm.price.value = arrElements[i].price;
        pathToForm.transmission.value = arrElements[i].transmission;
        if (arrElements[i].characteristics) {
          pathToForm.characteristics.value = arrElements[i].characteristics;
        }
        break;
      }
    }
  } else if (arrElements === arrUsers) {
    for (let i = 0; i < arrElements.length; i++) {
      if (idElement === arrElements[i].id) {
        elementForEditOnArr = arrElements.indexOf(arrElements[i]);
        pathToForm.firstname.value = arrElements[i].name;
        pathToForm.age.value = arrElements[i].age;
        pathToForm.email.value = arrElements[i].email;
        pathToForm.phonenumber.value = arrElements[i].tel;
        pathToForm.balance.value = arrElements[i].balance;
        break;
      }
    }
  }
}

// function editProduct(divWithId, arrElements) {
//   // заполнение формы для редактирования продукта
//   const getForm = document.querySelector("#product-template");
//   const cloneForm = getForm.content.cloneNode(true);
//   const divForForm = createDomElement("div", { class: "conteiner_for_form" });
//   divForForm.append(cloneForm);
//   document.body.appendChild(divForForm);
//   const pathToFormProduct = document.forms[0].elements;
//   dataIdElement = Number(divWithId.getAttribute("data_id"));

//   for (let i = 0; i < arrElements.length; i++) {
//     if (dataIdElement === arrElements[i].id) {
//       elementForEditOnArr = arrElements.indexOf(arrElements[i]);
//       pathToFormProduct.name.value = arrElements[i].name;
//       pathToFormProduct.count.value = arrElements[i].count;
//       pathToFormProduct.price.value = arrElements[i].price;
//       if (arrElements[i].characteristics) {
//         pathToFormProduct.characteristics.value =
//           arrElements[i].characteristics;
//       }
//       break;
//     }
//   }

//   const buttonSave = document.querySelector(".save_info_button");
//   buttonSave.addEventListener("click", () =>
//     editElementProductOrCar(arrElements, pathToFormProduct)
//   );
//   const buttonBack = document.querySelector(".back_to_list_button");
//   buttonBack.addEventListener("click", deletForm);
// }

// function editCar(divWithId, arrElements) {
//   // заполнение формы для редактирования машины
//   const getForm = document.querySelector("#auto-template");
//   const cloneForm = getForm.content.cloneNode(true);
//   const divForForm = createDomElement("div", { class: "conteiner_for_form" });
//   divForForm.append(cloneForm);
//   document.body.appendChild(divForForm);
//   const pathToFormCar = document.forms[0].elements;
//   dataIdElement = Number(divWithId.getAttribute("data_id"));

//   for (let i = 0; i < arrElements.length; i++) {
//     if (dataIdElement === arrElements[i].id) {
//       elementForEditOnArr = arrElements.indexOf(arrElements[i]);
//       pathToFormCar.name.value = arrElements[i].name;
//       pathToFormCar.count.value = arrElements[i].count;
//       pathToFormCar.price.value = arrElements[i].price;
//       pathToFormCar.transmission.value = arrElements[i].transmission;
//       if (arrElements[i].characteristics) {
//         pathToFormCar.characteristics.value = arrElements[i].characteristics;
//       }
//       break;
//     }
//   }

//   const buttonSave = document.querySelector(".save_info_button");
//   buttonSave.addEventListener("click", () =>
//     editElementProductOrCar(arrElements, pathToFormCar)
//   );
//   const buttonBack = document.querySelector(".back_to_list_button");
//   buttonBack.addEventListener("click", deletForm);
// }

// function editUser(divWithId, arrElements) {
//   // заполнение формы для редактирования пользователя
//   const getForm = document.querySelector("#user-template");
//   const cloneForm = getForm.content.cloneNode(true);
//   const divForForm = createDomElement("div", { class: "conteiner_for_form" });
//   divForForm.append(cloneForm);
//   document.body.appendChild(divForForm);
//   const pathToFormUser = document.forms[0].elements;
//   dataIdElement = Number(divWithId.getAttribute("data_id"));

//   for (let i = 0; i < arrElements.length; i++) {
//     if (dataIdElement === arrElements[i].id) {
//       elementForEditOnArr = arrElements.indexOf(arrElements[i]);
//       pathToFormUser.firstname.value = arrElements[i].name;
//       pathToFormUser.age.value = arrElements[i].age;
//       pathToFormUser.email.value = arrElements[i].email;
//       pathToFormUser.phonenumber.value = arrElements[i].tel;
//       pathToFormUser.balance.value = arrElements[i].balance;
//       pathToFormUser.bought_item.value = arrElements[i].boughtItem;
//       break;
//     }
//   }

//   const buttonSave = document.querySelector(".save_info_button");
//   buttonSave.addEventListener("click", () =>
//     editElementUser(arrElements, pathToFormUser)
//   );
//   const buttonBack = document.querySelector(".back_to_list_button");
//   buttonBack.addEventListener("click", deletForm);
// }

function deletForm() {
  // удаляет форму
  document.querySelector(".conteiner_for_form").remove();
  document.body.classList.toggle("stop-scrolling");
}

function editElementProductOrCar(arrElements, pathToForm) {
  // редактирование елмента в массиве
  arrElements[elementForEditOnArr].name = pathToForm.name.value;
  arrElements[elementForEditOnArr].count = pathToForm.count.value;
  arrElements[elementForEditOnArr].price = pathToForm.price.value;
  arrElements[elementForEditOnArr].characteristics =
    pathToForm.characteristics.value;
  if (arrElements[elementForEditOnArr].transmission) {
    arrElements[elementForEditOnArr].transmission =
      pathToForm.transmission.value;
  }

  const buttonForUnDisabled = document.querySelector('.List_element[data_id="' + dataIdElement + '"]').querySelector(".sale");
  if (arrElements[elementForEditOnArr].count > 0) {
    buttonForUnDisabled.removeAttribute("disabled");
  }

  errorOrConfirm(saveAndEdit, arrElements);
}

function editElementUser(arrElements, pathToForm) {
  arrElements[elementForEditOnArr].name = pathToForm.firstname.value;
  arrElements[elementForEditOnArr].age = pathToForm.age.value;
  arrElements[elementForEditOnArr].email = pathToForm.email.value;
  arrElements[elementForEditOnArr].tel = pathToForm.phonenumber.value;
  arrElements[elementForEditOnArr].balance = pathToForm.balance.value;

  errorOrConfirm(saveAndEdit, arrElements);
}

function errorOrConfirm(funcAfterValid, arrElements) {
  if (arrElements === arrUsers) {
    const pathToForm = document.forms[0];
    let formData = new FormData(pathToForm);
    let formDataObj = Object.fromEntries(formData);
    if (!namePattern.test(formDataObj.firstname)) {
      //   formDataObj.firstname.trim()
      console.log("error");
    } else if (!agePattern.test(formDataObj.age)) {
      console.log("error");
    } else if (!emailPattern.test(formDataObj.email)) {
      console.log("error");
    } else if (!phoneNumberPattern.test(formDataObj.phonenumber)) {
      console.log("error");
    } else if (!balancePattern.test(formDataObj.balance)) {
      console.log("error");
    } else {
      funcAfterValid(arrElements);
    }
  } else if (arrElements === arrCars) {
    const pathToForm = document.forms[0];
    let formData = new FormData(pathToForm);
    let formDataObj = Object.fromEntries(formData);

    funcAfterValid(arrElements)
  } else if (arrElements === arrProducts) {
    const pathToForm = document.forms[0];
    let formData = new FormData(pathToForm);
    let formDataObj = Object.fromEntries(formData);

    funcAfterValid(arrElements)
  }

}

function saveAndEdit(arrElements) {
  // перерендер выбранного елемента
  const title = document
    .querySelector('.List_element[data_id="' + dataIdElement + '"]')
    .querySelector("h4");
  title.innerText =
    arrElements.indexOf(arrElements[elementForEditOnArr]) +
    1 +
    "." +
    arrElements[elementForEditOnArr].name;

  const ul = document
    .querySelector('.List_element[data_id="' + dataIdElement + '"]')
    .querySelector(".information");
  ul.innerHTML = "";
  createUlinfo(ul, arrElements[elementForEditOnArr]);

  setLocal(arrElements);

  if (document.forms[0]) {
    deletForm();
  }
}

function createCustomerList(divWithId, arrElements) {
  // создание списка пользователей для продажи товара
  document.body.classList.toggle("stop-scrolling");
  const customerListConteiner = createDomElement("div", {
    class: "customer_list_conteiner",
  });
  const customerList = createDomElement("div", { class: "customer_list" });
  const closeList = createDomElement(
    "div",
    { class: "close_customer_list" },
    "close"
  );
  closeList.addEventListener("click", () => {
    document.querySelector(".customer_list_conteiner").remove();
    document.body.classList.toggle("stop-scrolling");
  });
  customerList.append(closeList);

  for (let i = 0; i < arrUsers.length; i++) {
    const userDiv = createDomElement("div", {
      class: "customer_list_user",
      data_user_id: arrUsers[i].id,
    });
    const nameUser = createDomElement(
      "label",
      {},
      `${arrUsers.indexOf(arrUsers[i]) + 1}. ${arrUsers[i].name} ($${arrUsers[i].balance
      })`
    );
    const inputForCount = createDomElement("input", {
      type: "text",
      placeholder: "Enter a count product",
    });
    const buttonSell = createDomElement("button", {}, "sell");
    buttonSell.addEventListener("click", () =>
      sellItem(divWithId, arrElements, userDiv)
    );

    nameUser.append(inputForCount);
    userDiv.append(nameUser, buttonSell);
    customerList.append(userDiv);
  }

  customerListConteiner.append(customerList);
  document.body.append(customerListConteiner);
}

function sellItem(divWithId, arrElements, userDivId) {
  let itemId = Number(divWithId.getAttribute("data_id"));
  let userId = Number(userDivId.getAttribute("data_user_id"));
  let countForBuy = Number(
    document
      .querySelector('.customer_list_user[data_user_id="' + userId + '"]')
      .querySelector("input").value
  );
  const buttonForDisabled = document
    .querySelector('.List_element[data_id="' + itemId + '"]')
    .querySelector(".sale");
  let itemForSell;
  let userWhoBuy;

  for (let item of arrElements) {
    if (item.id === itemId) {
      itemForSell = item;
      elementForEditOnArr = arrElements.indexOf(item);
      break;
    }
  }
  for (let user of arrUsers) {
    if (user.id === userId) {
      userWhoBuy = user;
      break;
    }
  }

  if (countForBuy <= Number(itemForSell.count)) {
    let totalPrice = countForBuy * itemForSell.price;

    if (totalPrice <= userWhoBuy.balance) {
      userWhoBuy.balance -= totalPrice;
      itemForSell.count -= countForBuy;
      if (itemForSell.count === 0) {
        buttonForDisabled.setAttribute("disabled", "disabled");
      }

      const sellingItem = {
        name: itemForSell.name,
        count: countForBuy,
      };
      if (userWhoBuy.boughtItem.length === 0) {
        userWhoBuy.boughtItem.push(sellingItem);
      } else {
        for (let i = 0; i < userWhoBuy.boughtItem.length; i++) {
          if (userWhoBuy.boughtItem[i].name === sellingItem.name) {
            userWhoBuy.boughtItem[i].count += sellingItem.count;
            break;
          } else if (i === userWhoBuy.boughtItem.length - 1) {
            userWhoBuy.boughtItem.push(sellingItem);
            break;
          }
        }
      }

      dataIdElement = itemId;
      saveAndEdit(arrElements);
      let arrJSONFormat = JSON.stringify(arrUsers);
      localStorage.setItem("arrUsers", arrJSONFormat);

      document.body.removeChild(
        document.querySelector(".customer_list_conteiner")
      );
    } else {
      alert("error");
    }
  } else {
    alert("error");
  }

  document.body.classList.toggle("stop-scrolling");
}