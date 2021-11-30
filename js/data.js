'use strict';

let arrProducts = []
let arrCars = []
let arrUsers = []

pushElement(arrProducts, new Product('колесо', 4, 1000, 'круглое'))
pushElement(arrProducts, new Product('руль', 1, 500,))

pushElement(arrCars, new Auto('mustang', 4, 30000, 'auto', 'Цвет: черный, Салон: белый' ))
pushElement(arrCars, new Auto('lada granta', 10, 6000, 'manual', 'Цвет: синий, Салон: коричневый'))

pushElement(arrUsers, new User('Антон', 30, 'anton@mail.ru', '+380669823453'))
pushElement(arrUsers, new User('Алина', 20, 'alina@mail.ru', '+380662352433'))