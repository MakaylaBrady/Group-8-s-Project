//////////////////////////////////////////  Importing Everything  //////////////////////////////////////////////


// import express lib and initialise it to app var
const express = require("express");
const app = express();
// import bcrypyt hashing library (encryption)
const bcrypt = require("bcrypt");
// import dbConfig
const pool = require("./dbConfig.js");


////////////////////////////////////////////   Configuration   /////////////////////////////////////////////////


// server port (creates 4000 during dev otherwise grabs the port from env)
const PORT = 4000;

// allows to read static files e.g. css, imgs...
app.use(express.static('public'));

// allows us to access data entered into form, inside our request vars
app.use(express.urlencoded({
    extended: false
}));

// allows us to accept json data
app.use(express.json());

// sets the view engine to ejs template engine
app.set("view engine", "ejs");


///////////////////////////////////////////////////   Local Storage  //////////////////////////////////////////


// variable to check login session
let currentUser = "";

const states = {
    'AL': 'Alabama',
    'AK': 'Alaska',
    'AZ': 'Arizona',
    "AR": 'Arkansas',
    "CA": 'California',
    "CO": 'Colorado',
    "CT": 'Connecticut',
    "DE": 'Delaware',
    "DC": 'District Of Columbia',
    "FL": 'Florida',
    "GA": 'Georgia',
    "HI": 'Hawaii',
    "ID": 'Idaho',
    "IL": 'Illinois',
    "IN": 'Indiana',
    "IA": 'Iowa',
    "KS": 'Kansas',
    "KY": 'Kentucky',
    "LA": 'Louisiana',
    "ME": 'Maine',
    "MD": 'Maryland',
    "MA": 'Massachusetts',
    "MI": 'Michigan',
    "MN": 'Minnesota',
    "MS": 'Mississippi',
    "MO": 'Missouri',
    "MT": 'Montana',
    "NE": 'Nebraska',
    "NV": 'Nevada',
    "NH": 'New Hampshire',
    "NJ": 'New Jersey',
    "NM": 'New Mexico',
    "NY": 'New York',
    "NC": 'North Carolina',
    "ND": 'North Dakota',
    "OH": 'Ohio',
    "OK": 'Oklahoma',
    "OR": 'Oregon',
    "PA": 'Pennsylvania',
    "RI": 'Rhode Island',
    "SC": 'South Carolina',
    "SD": 'South Dakota',
    "TN": 'Tennessee',
    "TX": 'Texas',
    "UT": 'Utah',
    "VT": 'Vermont',
    "VA": 'Virginia',
    "WA": 'Washington',
    "WV": 'West Virginia',
    "WI": 'Wisconsin',
    "WY": 'Wyoming',
};


/////////////////////////////////////   Custom Functions   ////////////////////////////


const isUsernameTaken = async (username) => {
    return Boolean((await pool.query("SELECT * FROM usercredentials WHERE username = $1", [username])).rows.length);
};

// returns the specified user's profile
const getUserProfile = async (username) => {
    return (await pool.query("SELECT * FROM clientinformation WHERE username = $1", [username])).rows[0];
};

const containsSpace = (username) => {
    return username.includes(" ");
};

const exceedsCharacters = (string, length) => {
    return string.length > length;
};

// returns the specified user's quote history
const getUserQuotes = async (username) => {
    return (await pool.query("SELECT * FROM fuelquote WHERE username = $1", [username])).rows;
};

// returns whether profile exists or not
const initialProfileExists = async (username) => {
    return Boolean((await pool.query("SELECT * FROM clientinformation WHERE username = $1", [username])).rows.length);
};


//////////////////////////////////////   Routing (manipulating and displaying pages)   /////////////////////////


// homepage route
app.get("/", async (req, res) => {
    if (!currentUser && !req.body.username) {
        return res.redirect('/login');
    }

    if (!(await initialProfileExists(currentUser))) {
        return res.redirect('/client-profile-management');
    }

    res.render("home.ejs");
});


// login route
app.get("/login", (req, res) => {
    if (currentUser) {
        return res.redirect('/');
    }
    res.status(200).render("login.ejs");
});


app.post("/login", async (req, res) => {
    if (containsSpace(req.body.username)) {
        return res.render('login.ejs', { showSpaceError: true });
    }

    let user = (await pool.query("SELECT * FROM usercredentials WHERE username = $1", [req.body.username])).rows;

    // checks if user does not exists
    if (user.length == 0) {
        return res.render("login.ejs", { showError: true });
    }

    user = user[0];

    try {
        // checks if password matches
        if (await bcrypt.compare(req.body.password, user.password)) {
            // sets the current user to logged in one so it remembers even if the page refreshes
            currentUser = req.body.username;
            // redirected to client profile management if first time logging in
            if (!(await initialProfileExists(currentUser))) {
                return (res.redirect('/client-profile-management'));
            }
            // redirect to home since logged in successfully
            res.redirect('/');
        } else {
            // password didn't match
            return res.render("login.ejs", {
                // sets the error flash to show
                showError: true
            });
        }
    } catch {
        // unknown error occured
        // res.status(500).send('Internal server error');
    }


});


// sign-up route
app.get("/sign-up", (req, res) => {
    // if logged in only then allow access to page
    if (currentUser) {
        res.redirect('/');
    }

    res.render("sign-up.ejs");
});

app.post("/sign-up", async (req, res) => {
    if (containsSpace(req.body.username)) {
        return res.render('sign-up.ejs', { showSpaceError: true });
    }

    if (await isUsernameTaken(req.body.username)) {
        return res.render('sign-up.ejs', { showError: true });
    }

    try {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        await pool.query("INSERT INTO usercredentials (username, password) VALUES($1, $2)", [req.body.username, hashedPassword]);

        res.redirect("/login");
    } catch {
        res.status(500).status('Error!');
    }
});

// sends the current user's state
app.get("/get-state", async (req, res) => {
    try {
        let state = await pool.query("SELECT state FROM clientinformation WHERE username = $1", [currentUser]);
        state = state.rows[0].state;
        res.status(200).send(state);
    } catch (err) {
        console.log(err);
    }

});

// sends the current user's state
app.get("/get-history", async (req, res) => {
    const rateHistory = await pool.query("SELECT * FROM fuelquote WHERE username = $1", [currentUser]);

    if (rateHistory.rowCount == 0) {
        res.send({ exists: false });
    } else {
        res.send({ exists: true });
    }
});


// logout route
app.post("/logout", (req, res) => {
    currentUser = "";
    res.redirect('/login');
});


// profile firstime management route
app.get("/client-profile-management", async (req, res) => {
    // if logged in only then allow access to page
    if (!currentUser) {
        return res.redirect('/login');
    }

    // if profile already exists redirect to home
    if (await initialProfileExists(currentUser)) {
        return res.redirect('/');
    }

    return res.render("client-profile-management.ejs");
});


app.post("/client-profile-management", async (req, res) => {
    const fullName = req.body.fullName;
    const address1 = req.body.address1;
    const address2 = req.body.address2;
    const city = req.body.city;
    const state = req.body.state;
    const zipCode = req.body.zipCode;


    if (exceedsCharacters(fullName, 50)) {
        return res.render("client-profile-management.ejs", { showFieldError: true, length: 50, field: fullName, fieldName: "Full name" });
    }

    if (!exceedsCharacters(fullName, 0)) {
        return res.render("client-profile-management.ejs", { showZeroError: true, field: fullName, fieldName: "Full name" });
    }

    if (exceedsCharacters(address1, 100)) {
        return res.render("client-profile-management.ejs", { showFieldError: true, length: 100, field: address1, fieldName: "Address 1" });
    }

    if (!exceedsCharacters(address1, 0)) {
        return res.render("client-profile-management.ejs", { showZeroError: true, field: address1, fieldName: "Address 1" });
    }
    if (exceedsCharacters(address2, 100)) {
        return res.render("client-profile-management.ejs", { showFieldError: true, length: 100, field: address2, fieldName: "Address 2" });
    }

    if (exceedsCharacters(zipCode, 9)) {
        return res.render("client-profile-management.ejs", { showFieldError: true, length: 9, field: zipCode, fieldName: "Zipcode" });
    }

    if (!exceedsCharacters(zipCode, 4)) {
        return res.render("client-profile-management.ejs", { showZipCodeError: true, length: 5, field: zipCode, fieldName: "Zipcode" });
    }

    if (exceedsCharacters(city, 100)) {
        return res.render("client-profile-management.ejs", { showFieldError: true, length: 100, field: city, fieldName: "City" });
    }

    if (!exceedsCharacters(city, 0)) {
        return res.render("client-profile-management.ejs", { showZeroError: true, field: city, fieldName: "City" });
    }

    await pool.query("INSERT INTO clientinformation (username, full_name, address_1, address_2, city, state, zip_code) VALUES($1, $2, $3, $4, $5, $6, $7)", [currentUser, fullName, address1, address2, city, state, zipCode]);

    res.redirect('/');
});


// quote history route
app.get("/fuel-quote-history", async (req, res) => {
    // if not logged in
    if (!currentUser && !req.body.username) {
        return res.redirect('/login');
    }

    // if initial profile doesn't exist
    if (!(await initialProfileExists(currentUser))) {
        return res.redirect('/client-profile-management');
    }

    res.render("fuel-quote-history.ejs", { quotes: Array.from(await getUserQuotes(currentUser)) });
});


// new fuel quote route
app.get("/new-fuel-quote", async (req, res) => {
    // if not logged in
    if (!currentUser && !req.body.username) {
        return res.redirect('/login');
    }

    // if initial profile doesn't exist
    if (!(await initialProfileExists(currentUser))) {
        return res.redirect('/client-profile-management');
    }

    // gets user's profile from local storage
    const userProfile = await getUserProfile(currentUser);

    // prepares address to be displayed
    const userAddress = userProfile.address_1 + " " + userProfile.address_2 + " " + userProfile.city + ', ' + userProfile.state + ', ' + userProfile.zip_code;

    res.render("new-fuel-quote.ejs", { address: userAddress });
});


app.post("/new-fuel-quote", async (req, res) => {
    const userProfile = await getUserProfile((currentUser) ? currentUser : req.body.username);

    // prepare user address
    const userAddress = userProfile.address_1 + " " + userProfile.address_2 + " " + userProfile.city + ', ' + userProfile.state + ', ' + userProfile.zip_code;

    await pool.query("INSERT INTO fuelquote (username, gallons_requested, delivery_address, delivery_date, suggested_price, total_amount) VALUES($1, $2, $3, $4, $5, $6)", [currentUser, req.body.gallonsRequested, userAddress, req.body.deliveryDate, req.body.suggestedPrice, req.body.totalAmount]);

    res.redirect('/');
});


// client settings routes
app.get("/client-profile-settings", async (req, res) => {
    // if not logged in
    if (!currentUser) {
        return res.redirect('/login');
    }

    // if initial profile doesn't exist
    if (!(await initialProfileExists(currentUser))) {
        return res.redirect('/client-profile-management');
    }

    const userProfile = await getUserProfile(currentUser);
    const stateCode = userProfile.state;
    const placeholderData = {
        fullName: userProfile.full_name,
        stateCode: stateCode,
        stateFull: stateCode + ' - ' + states[stateCode],
        zipCode: userProfile.zip_code,
        address1: userProfile.address_1,
        address2: userProfile.address_2,
        city: userProfile.city
    };

    res.render("client-profile-settings.ejs", placeholderData);
});


app.post("/client-profile-settings", async (req, res) => {
    // grabs new settings from all the fields
    full_name = req.body.fullName;
    address_1 = req.body.address1;
    address_2 = req.body.address2;
    state = req.body.state;
    city = req.body.city;
    zip_code = req.body.zipCode;

    await pool.query('UPDATE clientinformation SET full_name = $2, address_1 = $3, address_2 = $4, state = $5, city = $6, zip_code = $7 WHERE username = $1', [currentUser, full_name, address_1, address_2, state, city, zip_code]);

    res.redirect('/');
});


// launches server and listens on PORT var
app.listen(PORT);

module.exports = { containsSpace, exceedsCharacters, getUserQuotes, initialProfileExists, isUsernameTaken, app };