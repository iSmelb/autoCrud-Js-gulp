"use strict";
checkLocal();
createMenu();
mainPage()
console.log(arrUsers);
console.log(arrCars);
console.log(arrProducts);
const namePattern = /[A-Za-zА-Яа-я]+/;
const agePattern = /^\d\d$/;
const emailPattern = /^[a-zA-Z0-9].+@[a-z]{3,}.[a-z]{2,}$/;
const phoneNumberPattern = /(^(\+)([0-9]{4,15})$)/;
const balancePricePattern = /^([1-9]{1})$|(^[1-9]{1}\d{1,5}$)/;
const countItemForSell = /^([1-9]{1})$|(^[1-9]{1}\d{1}$)/
