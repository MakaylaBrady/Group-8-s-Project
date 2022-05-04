const serverModules = require("./server.js");
const request = require('supertest');

function randomString(length) {
    return Math.random().toString(36).slice(2);
}

test('Contains Space', () => {
    const testSpace = 'Gigi Gigi';

    expect(serverModules.containsSpace(testSpace)).toBe(true);
    expect(serverModules.containsSpace("asdas")).toBe(false);
});

test('Exceeds Characters', () => {
    const testCharacters = 'Gigi Gigi';

    expect(serverModules.exceedsCharacters(testCharacters, 1000)).toBe(false);
    expect(serverModules.exceedsCharacters("21", 1)).toBe(true);
});

test('Get User Profile', () => {
    const username = '1234';

    expect(serverModules.containsSpace(username)).toBe(false);
    expect(serverModules.containsSpace("asddsdas")).toBe(false);
});

test('Get User Quotes', async () => {
    const response = await serverModules.getUserQuotes("1");
    expect(Boolean(response)).toBe(true);
});

describe("/ home route", () => {
    test("get request", async () => {
        const response = await request(serverModules.app).get('/').send({
            username: "1"
        });
        expect(response.statusCode).toBe(302);
    });

});

describe("/login route", () => {

    test("get request", async () => {
        const response = await request(serverModules.app).get('/login');
        expect(response.statusCode).toBe(200);

    });

    test("post request", async () => {
        const response = await request(serverModules.app).post('/login').send({
            username: "1",
            password: "1"
        });
        expect(response.statusCode).toBe(302);
    });
});

describe("/sign-up route", () => {

    test("get request", async () => {
        const response = await request(serverModules.app).get('/sign-up');
        expect(response.statusCode).toBe(302);

    });

    test("post request", async () => {
        const randomUser = randomString();
        const response = await request(serverModules.app).post('/sign-up').send({
            username: randomUser,
            password: "2312312"
        });
        expect(response.statusCode).toBe(302);
    });
});

describe("/get-state route", () => {

    test("get request", async () => {
        const response = await request(serverModules.app).get('/get-state');
        expect(response.statusCode).toBe(200);
    });
});

describe("/get-history route", () => {
    test("get request", async () => {
        const response = await request(serverModules.app).get('/get-history');
        expect(response.statusCode).toBe(200);
    });
});

describe("/logout route", () => {

    test("post request", async () => {
        const response = await request(serverModules.app).post('/logout').send({
            username: "1",
            password: "1"
        });
        expect(response.statusCode).toBe(302);
    });
});

describe("/client-profile-management", () => {

    test("get request", async () => {
        const response = await request(serverModules.app).get('/client-profile-management');
        expect(response.statusCode).toBe(302);

    });

    test("post request", async () => {
        const test = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to";
        const response = await request(serverModules.app).post('/client-profile-management').send({
            fullName: test,
            address1: test,
            address2: test,
            city: test,
            state: test,
            zipCode: "12312312312321312312"
        });
        expect(response.statusCode).toBe(200);
    });
});

describe("/fuel-quote-history", () => {

    test("get request", async () => {
        const response = await request(serverModules.app).get('/fuel-quote-history').send({
            username: "1"
        });
        expect(response.statusCode).toBe(302);

    });
});

describe("/new-fuel-quote", () => {
    test("get request", async () => {
        const response = await request(serverModules.app).get('/new-fuel-quote').send({
            username: "1"
        });
        expect(response.statusCode).toBe(302);

    });

    test("post request", async () => {
        const response = await request(serverModules.app).post('/new-fuel-quote').send({
            username: "1"
        });
        expect(response.statusCode).toBe(302);

    });
});

describe("/client-profile-settings", () => {
    test("get request", async () => {
        const response = await request(serverModules.app).get('/client-profile-settings');
        expect(response.statusCode).toBe(302);
    });

    test("post request", async () => {
        const response = await request(serverModules.app).post('/client-profile-settings').send({
            fullName: "test",
            address1: "1321",
            address2: "test",
            city: "Houston",
            state: "TX",
            zipCode: "1321"
        });
        expect(response.statusCode).toBe(302);
    });
});

