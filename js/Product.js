'use strict';

class Product {
    constructor(name, count ,price, characteristics = '') {
        if(arrProducts.length === 0) {  
            this.id = 1
        } else {
            this.id = arrProducts[arrProducts.length - 1].id + 1
        }

        this.name = name
        this.count = count
        this.price = price
        this.characteristics = characteristics
    }
}