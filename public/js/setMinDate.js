const dateElement = document.querySelector('#deliveryDate');

let currentDate = new Date();

const year = currentDate.getFullYear().toString().padStart(2, '0');
const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
const day = (currentDate.getDate() + 1).toString().padStart(2, '0');

currentDate = year + '-' + month + '-' + day;

console.log(currentDate);
dateElement.setAttribute('min', currentDate);