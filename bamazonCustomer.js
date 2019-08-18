var mysql = require('mysql');
var inquirer = require('inquirer');


var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon_db",
})

connection.connect();
function start(){
let sql = `SELECT * FROM products`;
connection.query(sql, (err, res)=> {
    if (err) {
        throw err;
    } else {
        console.table(res)
    } 
    purchase(res);
}) 
};
start();
function purchase(response) {
    inquirer.prompt([
        {
            message: 'what item (by ID) would you like to buy ?',
            name: 'id',
            type: 'input'
        },
        {
            message: 'How many would you like to buy?',
            type: 'input',
            name: 'qty',
        },
    ]).then((res) => {
        let index = res.id;
        let itemID = parseInt(res.id) - 2;
        let total = response[itemID].Stock - res.qty;
        let cost = response[itemID].Price * res.qty;
        inventory(total, index, cost);
    });


    function inventory(stock,id, cost) {
        if(stock <=0){
            console.log('no stock');
        }else{
            connection.query(`UPDATE products SET Stock = ${stock} WHERE id = ${id}`, (err) =>{
                if (err) throw err;
            });
            console.log(`your total is $${cost}`);
        }
        setTimeout(start, 2000);
    }
}