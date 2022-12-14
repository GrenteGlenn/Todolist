CREATE TABLE users
(
    UserID INT AUTO_INCREMENT,
    username VARCHAR(100) unique,
    password VARCHAR(255),
    role VARCHAR(100),
    email VARCHAR(255),
    Adresse TEXT(255),
    PRIMARY KEY (UserID)
);
CREATE TABLE products
(
    id INT AUTO_INCREMENT,
    name VARCHAR(100),
    price FLOAT,
    description VARCHAR(255),
    currency VARCHAR(10),
    link VARCHAR(255),
    UserID INT,
    PRIMARY KEY (id),
    FOREIGN KEY (UserID) REFERENCES users(UserID)

);