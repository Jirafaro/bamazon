var mysql = require('mysql');
var inquirer = require('inquirer');

// defines sql connection to bamazon_db
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon_db",
})
// connects to db and displays db table
connection.connect();
function start(){
let sql = `SELECT * FROM products`;
connection.query(sql, (err, res)=> {
    if (err) {
        throw err;
    } else {
        console.table(res)
    } 
    purchase(res); // runs purchase with response as argument
}) 
};
start();
function purchase(response) {
    inquirer.prompt([
        { //first user response
            message: 'what item (by ID) would you like to buy ?',
            name: 'id',
            type: 'input'
        },
        { // second user response
            message: 'How many would you like to buy?',
            type: 'input',
            name: 'qty',
        },
    ]).then((res) => {
        let index = res.id; // set index to id
        let itemID = parseInt(res.id) - 2; // sets appropriate index to id value
        let total = response[itemID].Stock - res.qty; // grabs integer of stock in current products table and subtracts the number of items selected in the response
        let cost = response[itemID].Price * res.qty; // multiplies the integer of price in the products table by the response quantity and displays so the user can see the total
        inventory(total, index, cost);
    });


    function inventory(stock,id, cost) {
        if(stock <=0){ // check if out of stock
            console.log('no stock'); 
        }else{ // if not out of stock update total stock 
            connection.query(`UPDATE products SET Stock = ${stock} WHERE id = ${id}`, (err) =>{
                if (err) throw err;
            });
            console.log(`your total is $${cost}`); //display cost to user 
        }
        setTimeout(start, 2000); // repeat application over again for more sales!
    }
}