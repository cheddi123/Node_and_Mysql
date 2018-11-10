
require("dotenv").config();
var mysql = require("mysql");
var inquirer = require("inquirer")

var keys = require("./keys.js")

var passWORD = keys.pass;
console.log(passWORD)
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "bamazon"
});
//start the app
connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  newTransaction();

});


// function which prompts the user for what action they should take
function start() {
  inquirer
    .prompt({
      name: "lookup",
      type: "list",
      message: "Would you like to do?",
      choices: ["view products", "view low inventory", "add to inventory", "add new product"]
    })
    .then(function (answer) {
      // based on their answer, either call the bid or the post functions
      switch (answer.lookup) {
        case "view products":
          viewProducts();
          break;

        case "view low inventory":
          lowInventory();
          break;

        case "add to inventory":
          addToInventory();
          break;

        case "add new product":
          console.log(" I am running out of products");
          newProduct();
          break;
      }

    });
}

//function to show all the items in the inventory
function viewProducts() {
  connection.query("SELECT * FROM bamazon.houseproducts", function (err, results) {
    for (var i = 0; i < results.length; i++) {
      console.log(results[i].item_id + " | " + " 'productName': " + results[i].product_name +
        " | " + " 'Price' $" + results[i].price + " |" + "Quantity: " + results[i].stock_quantity)
    }; 
    console.log("-----------------------------------");
    if (err) throw err;
    console.log("view all the products"),
    newTransaction()
  }
    
  );
  
};

// function to show which items have a quantity of below 5
function lowInventory() {
  connection.query("SELECT * FROM bamazon.houseproducts WHERE stock_quantity<5", function (err, results) {
    for (var i = 0; i < results.length; i++) {
      console.log(results[i].item_id + " | " + " 'productName': " + results[i].product_name +
        " | " + " 'Price'  $" + results[i].price + " |" + " Quantity: " + results[i].stock_quantity)
    };
    console.log("-----------------------------------");
    if (err) throw err;
    newTransaction();
  },
  );
  
}

// function to increase the quantity of an item
function addToInventory() {
  inquirer
    .prompt([
      {
        name: "id",
        type: "input",
        message: "Which item id you want to add more to your inventory?",
        validate: function(value){
					var valid = value.match(/^[0-9]+$/)
					if(valid){
						return true
					}
						return 'Please enter a numerical value'
					}
      },
      {
        name: "quantity",
        type: "input",
        message: "How many you want to add to this item inventory?",
        validate: function(value){
					var valid = value.match(/^[0-9]+$/)
					if(valid){
						return true
					}
						return 'Please enter a numerical value'
					}
      },
    ])
    .then(function (answer) {

      connection.query("SELECT * FROM houseproducts WHERE item_id =?", [answer.id], function (err, results) {

        connection.query(
          "UPDATE houseproducts SET ? WHERE ?",
          [
            {
              stock_quantity: parseInt(answer.quantity) + results[0].stock_quantity
            },
            {
              item_id: answer.id
            }
          ],
          function (err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " product updated!\n");
            newTransaction();
          })

      })

    })
}

//function to add a NEW  item to the inventory
function newProduct() {
  inquirer
    .prompt([
      {
        name: "itemName",
        type: "input",
        message: "Add the item?"
      },
      {
        name: "price",
        type: "input",
        message: "Add the unit price?"
      },
      {
        name: "quantity",
        type: "input",
        message: "Add the quantity of this unit",
        validate: function(value){
					var valid = value.match(/^[0-9]+$/)
					if(valid){
						return true
					}
						return 'Please enter a numerical value'
					}
      },
    ])
    .then(function (answer) {
      var query = "INSERT INTO  houseProducts SET ?"
      connection.query(
        query,
        {
          product_name: answer.itemName,
          price: answer.price,
          stock_quantity: answer.quantity
        },
        function (err, res) {
          console.log(res.affectedRows + " product inserted!\n");
          // Call updateProduct AFTER the INSERT completes
          newTransaction();
        }

      )

    })
}

function newTransaction(){
  inquirer.prompt([
    {
      name:"choosen",
      type: "confirm",
      message:"Do you want to do a transaction?"
    }
  ])
  .then(function(response){
    if(response.choosen){
      start()
    }
    else{
      console.log("Have a blessed day. Its nice doing business with me");
      connection.end();
    }
  })
}