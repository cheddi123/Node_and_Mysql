DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE products( 
item_id INT NOT NULL AUTO_INCREMENT ,
product_name VARCHAR(250),
department_name VARCHAR(250),
price DECIMAL(10,2),
stock_quantity INT,
PRIMARY KEY(item_id)
);

INSERT INTO products(product_name,department_name,price,stock_quantity)
VALUES  ("Mac Book Air","Electronics",1599.00,150),
        ("Vizio 60in Led TV","Electronics",680.00,450),
        ("Air JordanX","Shoes",150.99,800),
        ("Fire Stick","Electronics",39.99,1800),
        ("Rolex Watch","Jewellery",1050.00,3500),
        ("Better Homes Pot Set","HouseHold",89.95,2500),
        ("PS4","Electronics",450.00,5300),
        ("HP Laser Printer","Office",250.00,5000),
        ("Samsung Galaxy S X","Electronics",1200.00,10000),
        ("Eureka Vaccumm","HouseHold",130.95,1350);
         
DROP TABLE IF EXISTS houseproducts;

CREATE TABLE houseproducts(
 item_id INT NOT NULL AUTO_INCREMENT ,
product_name VARCHAR(250),
price DECIMAL(10,2),
stock_quantity INT,
PRIMARY KEY(item_id)
);

INSERT INTO houseproducts(product_name,price,stock_quantity)
VALUES ("Ajax", 3.50 ,20),
        ("colgate", 1.25 ,5),
        ("Axe Spray", 4.00 ,4),
        ("Carpet cleaner", 5.50 ,2),
        ("3lb sugar", 2.75 ,35),
        ("5 lb rice", 6.00 ,4),
        ("Tea Bags", 1.50 ,50),
        ("dozen jumbo eggs", 4.50 ,3),
        ("salt", 0.99 ,25);