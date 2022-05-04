CREATE DATABASE fuelapp;

CREATE TABLE usercredentials(
    username VARCHAR PRIMARY KEY,
    password VARCHAR NOT NULL
);

CREATE TABLE clientinformation(
    username VARCHAR PRIMARY KEY,
    full_name VARCHAR(50) NOT NULL,
    address_1 VARCHAR(100) NOT NULL,
    address_2 VARCHAR(100),
    city VARCHAR(100) NOT NULL,
    state CHAR(2) NOT NULL,
    zip_code VARCHAR(9) CHECK (length(zip_code) > 4) NOT NULL
);

CREATE TABLE fuelquote(
    quote_id SERIAL PRIMARY KEY,
    username VARCHAR,
    gallons_requested NUMERIC,
    delivery_address VARCHAR,
    delivery_date VARCHAR,
    suggested_price NUMERIC(15,3),
    total_amount NUMERIC(15,2)
);