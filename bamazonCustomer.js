var mysql = require("mysql");
var inquirer = require("inquirer")

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


connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
 newTransaction();
 
});

// function to display table information
function showTable() {
  connection.query("SELECT * FROM products", function (err, results) {
    for (var i = 0; i < results.length; i++) {
      console.log(results[i].item_id + " | " + " 'productName': " + results[i].product_name + " | " + " 'Department': " + results[i].department_name + " | " + " 'Price': $" + results[i].price + " |" + "Quantity: " + results[i].stock_quantity +"\n" );
    }
    console.log("-----------------------------------");

  }

  );
}

// function which prompts the user for what action they should take
function start() {
  showTable();
  inquirer
    .prompt([
      {
        name: "Id",
        type: "input",
        message: "What is the ID of the product you want to buy?"
      },
      {
        name: "quantity",
        type: "input",
        message: "How many units of this product you want to buy?"
      }
    ])
    .then(function (answer) {
      console.log("\n"+"I wish to buy " + answer.quantity)

      connection.query("SELECT * FROM bamazon.products", function (err, results) {
        var item_number = parseInt(answer.Id) - 1;
        var amount = parseInt(answer.quantity);
        var stockQuantity = results[item_number].stock_quantity;
        if (err) throw err;
        if (stockQuantity >= amount) {
          var newQuantity = stockQuantity - amount;
          var numberId = item_number;
          update(numberId, newQuantity);
          totalCost(numberId, amount);
          console.log("We have your order")
        

        } else {
          console.log("Insufficient quantity");
          
        }
        newTransaction();

      })

    })
 
};



function update(number, Quantity) {
  var x = parseInt(number) + 1

  // console.log("item number is "+ x + "\n" + "New quantity is : " + newQuantity)
  connection.query(
    "UPDATE  products SET ? WHERE ?",
    [
      { stock_quantity: Quantity },

      { item_id: x }

    ],


    function (err, result) {
      if (err) throw err;
      console.log(result.affectedRows + " record(s) updated");
        

    },

  )
  
}


function totalCost(x, y) {
  connection.query("SELECT * FROM products", function (err, result) {

    var total = result[x].price * y;
    console.log("the total cost is of the " + result[x].product_name + " is  $" + total.toFixed(2))
    // console.log("you bought :"+ result[x].price)

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
      start();
    }
    else{
      console.log("\n"+"Have a blessed day. Its nice doing business with me");
      connection.end();
    }
  })
}