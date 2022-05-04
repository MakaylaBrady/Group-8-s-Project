const Pool = require("pg").Pool;

const pool = new Pool({
    user: "postgres",       // Update the user to match the local postgres
    password: "",       // Update the password to match the local postgres
    host: "localhost",
    port: 5432,             // Update the port to match the local postgres
    database: "fuelapp"
});

module.exports = pool;