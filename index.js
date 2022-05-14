const { response } = require('express');
var express = require('express');
var app = express();

// Get port from environment and store in Express. 
var port = normalizePort(process.env.PORT || '3000');

app.set('port', port);
// Normalize a port into a number, string, or false. 

function normalizePort(val) {
    var port = parseInt(val, 10);
    if (isNaN(port)) {
        // named pipe
        return val;
    }
    if (port >= 0) {
        // port number 
        return port;
    } return false;
}

function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes * 60000);
}


// Tell our application to serve all the files under the `public_html` directory
app.use(express.static('public_html'))

//Here we are configuring express to use inbuilt body-parser as middle-ware.
app.use(express.urlencoded({ extended: false }));

const pizzaprices = {
    'Cheese Pizza': 12.55,
    'Veggie Pizza': 12.75,
    'Marinara Pizza': 15.55,
    'Super Supreme': 16.25,
    'Tropical Pizza': 11.75,
    'Veggie Supreme': 13.75,
}
const pizzaSizes = {
    'Medium': 1.50,
    'Large' : 2.00,
    'Extra-Large' : 3.50,
}

const pizzaExtraOptions = {
    'Extra Cheese': 0.50,
    'Roasted Garlic' : 1.00,
    'Thick Crust' : 1.50,
    'No Chilli' : 2.00,
    '' : 0.00,

}

const PromoCodes = {
    '7342418' : {name: 'Dinner-4-all', discount: 0.10},
    '8403979' : {name: 'Winter-Special', discount:0.25},
    '2504647' : {name: 'Midweek-Deal', discount: 0.50},
    '8406800' : {name: 'Special-Gift', discount: 0.75},
}

// REST endpoint for posting a new user
app.post('/order', function (req, res, next) {
    console.log(req.body);
    let firstname = req.body.firstname;
    let surname = req.body.surname;
    let address = req.body.address;
    let city = req.body.city;
    let state = req.body.state;
    let postcode = req.body.postcode;
    let email = req.body.email;
    let mobile = req.body.mobile;
    let pizzaNumber = req.body.numBoxes;
    let pizzatype = req.body.pizzaType;
    let pizzasize = req.body.pizzaSize;
    let pizzaoptions = req.body.pizzaOptions;
    let promocode = req.body.promocode;
    let delivery = 5.00;

    let d= new Date();
    deliveryTime = addMinutes(d, 45);
 
    const pizzatypeprice = pizzaprices[pizzatype];
    const size = pizzaSizes [pizzasize];
    let pizzaExtras = pizzaExtraOptions [pizzaoptions];
    if (!pizzaExtras)
    {
        pizzaExtras = 0.00;
    }

    let promoCodes= PromoCodes [promocode];
    if (!promoCodes){
        promoCodes = {name: 'None', discount:0.00}
    }
    let pizzaprice = (pizzatypeprice + size + pizzaExtras) * parseInt(pizzaNumber); 

    let html = ''
    html += '<h1>Order Confirmation</h1>';
    html += `<p>Thank you for your order recieved on <b>${d.toString()}</b>  `;
    html += '<h3>Pizza Details</h3>';
    html += `<li> Name: ${pizzaNumber} ${pizzasize} ${pizzatype} [${pizzaoptions}]</li> `;
    html += '<h3>Customer Details</h3>';
    html += `<li> Customer: ${firstname}, ${surname} </li> `;
    html += `<li> Address: ${address}, ${city}, ${state}, ${postcode}</li> `;
    html += `<li> Contact mobile: ${mobile} </li> `;
    html += `<li> Contact email: ${email} </li> `;
    html += '<h3> Pizza Cost</h3>';
    html += '<p> The total cost of your pizza is: ';
    html += `<table> <tbody> <tr> <td> pizza(s) ${pizzaNumber} x ${pizzatype} (${pizzasize} ${pizzaoptions})</td> 
    <td>  $ ${pizzaprice.toFixed(2)} </td> </tr> `
    html += `<tr> <td> Delivery </td> <td> $ ${delivery.toFixed(2)}</td> </tr>`
    html += `<tr> <td> Discount ${promoCodes.name} ${promoCodes.discount * 100}%</td> <td> $ ${(promoCodes.discount * pizzaprice).toFixed(2)} </td> </tr> `
    html += `<tr> <td> Total </td> <td> $ ${(pizzatypeprice + size + pizzaExtras - promoCodes.discount * pizzaprice + delivery).toFixed(2)}</td> </tr> </tbody></table> `;

    html += '<h3>Estimated Delivery Time</h3>';
    html += `Delivery expected by <b> ${deliveryTime.toString()}</b> -- or the pizza is free! `;
    html += `To return to the previous page to order another pizza, please click here:  <a href="/">Return</a> `;

    console.log("Just received POST data for users endpoint!");
    /*console.log(`Data includes: ${username}, ${password}, ${comment} and ${contact}`);*/

    res.send(html);
});


// Tell our application to listen to requests at port 3000 on the localhost
app.listen(port, function () {
    // When the application starts, print to the console that our app is
    // running at http://localhost:3000 (where the port number is 3000 by
    // default). Print another message indicating how to shut the server down.
    console.log(`Web server running at: http://localhost:${port}`);
    console.log("Type Ctrl+C to shut down the web server");
});
