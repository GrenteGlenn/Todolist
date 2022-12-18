CREATE TABLE users
(
    UserID INT AUTO_INCREMENT,
    username VARCHAR(100) unique,
    password VARCHAR(255),
    PRIMARY KEY (UserID)
);
CREATE TABLE task
(
    id INT AUTO_INCREMENT,
    name VARCHAR(100),
    UserID INT,
    PRIMARY KEY (id),
    FOREIGN KEY (UserID) REFERENCES users(UserID)
);
