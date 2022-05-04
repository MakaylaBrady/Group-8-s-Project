const { roundToTwo, Pricing, getRateHistory, getState } = require("./pricing.js");


test('Round to two decimals', () => {
    expect(roundToTwo(25.55666)).toBe(25.56);
});

test('Pricing Class', () => {
    expect(roundToTwo(25.55666)).toBe(25.56);
});

test('Get Margin', () => {
    let pricing = new Pricing('TX', true, 21);
    expect(pricing.getMargin()).toBe(0.21000000000000002);
});

test('Get Margin', () => {
    let pricing = new Pricing('NY', false, 21);
    expect(pricing.getMargin()).toBe(0.255);
});

test('Get Margin', () => {
    let pricing = new Pricing('TX', true, 1001);
    expect(pricing.getMargin()).toBe(0.195);
});

test('Get Suggested Price', () => {
    let pricing = new Pricing('TX', true, 1001);
    expect(pricing.getSuggestedPrice()).toBe(1.695);
});

test('Get Total Amount', () => {
    let pricing = new Pricing('TX', true, 1001);
    expect(pricing.getTotalAmount()).toBe(1696.6950000000002);
});

test('Get Rate History', () => {
    return getRateHistory().then(data => {
        expect(Boolean(data)).toBe(false);
    });
});

test('Get State', () => {
    return getState().then(data => {
        expect(data).toBe(undefined);
    });
});
