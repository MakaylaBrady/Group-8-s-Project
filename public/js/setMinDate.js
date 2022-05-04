const dateElement = document.querySelector('#deliveryDate');

let currentDate = new Date();

currentDate.setDate(currentDate.getDate() + 1);
dateElement.setAttribute('min', currentDate.toISOString().split('T')[0]);