class Pricing {
    constructor(state, rateHistory, gallonsRequested) {
        this.state = state;
        this.rateHistory = rateHistory;
        this.gallonsRequested = gallonsRequested;
        this.pricePerGallon = 1.50;
    }

    getMargin() {
        const inState = 0.02;
        const outOfState = 0.04;
        const profitFactor = 0.1;
        let locationFactor, historyFactor, gallonsRate;

        if (this.state == 'TX') {
            locationFactor = inState;
        }
        else {
            locationFactor = outOfState;
        }

        if (this.rateHistory == true) {
            historyFactor = 0.01;
        }
        else {
            historyFactor = 0;
        }

        if (this.gallonsRequested > 1000) {
            gallonsRate = 0.02;
        }
        else {
            gallonsRate = 0.03;
        }

        const margin = (locationFactor - historyFactor + gallonsRate + profitFactor) * this.pricePerGallon;

        return margin;
    }

    getSuggestedPrice() {
        return (this.pricePerGallon + this.getMargin());
    }

    getTotalAmount() {
        return (this.gallonsRequested * this.getSuggestedPrice());
    }

}

const roundToTwo = (num) => {
    return Math.round(num * 100) / 100;
};

const getRateHistory = async () => {
    try {
        const response = await fetch('/get-history');
        return response.json();
    } catch {
    }
};

const getState = async () => {
    try {
        const response = await fetch('/get-state');
        return response.text();
    } catch {
    }
};


module.exports = { roundToTwo, Pricing, getRateHistory, getState };
