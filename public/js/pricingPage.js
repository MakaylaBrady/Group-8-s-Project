const suggestedPriceElement = document.querySelector('.suggested-price');
const totalAmountElement = document.querySelector('.total-amount');
const getQuoteButton = document.querySelector('#get-quote');
const submitButton = document.querySelector('#submit-button');
const gallonsRequested = document.querySelector('#gallons-requested');
const deliveryDate = document.querySelector('#deliveryDate');

let enableQuoteButton = false;
let gallonsAvailable = false;
let dateAvailable = false;

gallonsRequested.addEventListener('input', (e) => {
    if ((e.target.value == "")) {
        gallonsAvailable = false;
    } else {
        gallonsAvailable = true;
    }

    if ((gallonsAvailable && dateAvailable)) {
        // enabled
        getQuoteButton.classList.remove('disabled');
        getQuoteButton.removeAttribute('disabled');

    } else {
        // disabled
        getQuoteButton.classList.add('disabled');
        getQuoteButton.setAttribute('disabled', 'disabled');
    }
});

deliveryDate.addEventListener('input', () => {
    dateAvailable = true;

    if ((gallonsAvailable && dateAvailable)) {
        // enabled
        getQuoteButton.classList.remove('disabled');
        getQuoteButton.removeAttribute('disabled');

    } else {
        // disabled
        getQuoteButton.classList.add('disabled');
        getQuoteButton.setAttribute('disabled', 'disabled');
    }
});

getQuoteButton.addEventListener('click', async (e) => {
    const gallonsRequested = document.querySelector('#gallons-requested').value;
    const state = await getState();
    const rateHistory = await getRateHistory();
    const price = new Pricing(state, rateHistory.exists, gallonsRequested);
    const suggestedPrice = price.getSuggestedPrice();
    const totalAmount = roundToTwo(price.getTotalAmount());

    suggestedPriceElement.value = suggestedPrice;
    totalAmountElement.value = totalAmount;

    submitButton.removeAttribute("disabled");
    submitButton.setAttribute("title", "Click here to Submit a New Fuel Quote");
    submitButton.classList.remove("disabled");
});

submitButton.addEventListener('click', async (e) => {
    const gallonsRequested = document.querySelector('#gallons-requested').value;
    const deliveryDate = document.querySelector('#deliveryDate').value;

    const data = {
        'gallonsRequested': gallonsRequested,
        'deliveryDate': deliveryDate,
        'suggestedPrice': suggestedPriceElement.value,
        'totalAmount': totalAmountElement.value
    };

    try {
        const options = {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        };
        await fetch('/new-fuel-quote', options);
    } catch (err) {
        console.log(err);
    }


    window.location.replace("/fuel-quote-history");
    e.preventDefault();
});