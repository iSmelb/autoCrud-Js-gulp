'use strict';

class Auto {
    constructor(name, count, price, transmission, characteristics) {
        this.name = name
        this.count = count
        this.price = price
        this.transmission = transmission
        this.characteristics = characteristics

        if(arrCars.length === 0) {  
            this.id = 1
        } else {
            this.id = arrCars[arrCars.length - 1].id + 1
        }
    }
}