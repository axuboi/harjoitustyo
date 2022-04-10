// 1. npm init
// 2. npm install express
// 3. npm install mongoose

const express = require("express"); // Add express library.
const mongoose = require("mongoose"); // Add mongoose library.
const body_parser = require("body-parser"); // Add body parser to use.
const { waitForDebugger } = require("inspector");

const PORT = process.env.PORT | 8081; // Define port.

const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server); // Remember to npm install socket.io
app.use(body_parser.json()); // App shall use body-parser's JSON format.

let connections = [];
let number_of_connections = 0;

const broadcast_order_data = (data) => {
    for(let id in connections){
        const connection = connections[id];
        connection.emit("order_updated", data);
        console.log("broadcast_order_data() for connection {" + id + "}.");
    }
};

// Handle the web socket.
io.on("connection", (socket) => {
    connections[socket.id] = socket;
    number_of_connections++;
    console.log("Client connected.");
    socket.on("disconnect", (socket) => {
        delete connections[socket.id];
        console.log("Client disconnected.");
        number_of_connections--;
    });
});
app.use(express.static("public"));

const db_uri = "mongodb+srv://db_user_01:CKa6e2mo6Kxsm99x@cluster0.znacf.mongodb.net/machining_order_database?retryWrites=true&w=majority";
mongoose.connect(db_uri, {})
.then(() => { // Create a connection to given MongoDB database.
    console.log("Connected to machining_order_database");
    console.log("Listening to port: " + PORT);
    server.listen(PORT);  // App may receive requests only after connection creation.
});

const order_model = require("./order_model"); // Add order_model from order_model.js.

// CREATE
const api_post_order = (req, res) => {
    let order = order_model(req.body);
    order
        .save()
        .then((order) => {
            console.log("Order created succesfully.");
            res.send(order);
            broadcast_order_data(); // Orders changed.
        })
        .catch((err) => { // Catch any errors.
            console.log("500: Could not create order " + id + ". " + err.message);
            res.status(500); // Give internal error.
            res.send(err.message);
        });
};

// READ (all orders)
const api_get_orders = (req, res) => {
    order_model
    .find({}) // Empty object as a filter will return all orders.
    .then((orders) => {
        console.log("Orders listed succesfully.");
        res.send(orders);
    }).catch((err) => {
        console.log("500: Could not find orders. " + err.message);
        res.status(500); // Give internal error.
        res.send(err.message);
    });
};

// READ (one order)
const api_get_order = (req, res) => {
    const id = req.params.id;
    order_model
    .findById(id)
    .then((order) => {
        console.log("Order {" + id + "} listed succesfully.");
        res.send(order);
    }).catch((err) => {
        console.log("500: Could not find order " + id + ". " + err.message);
        res.status(500); // Give internal error.
        res.send(err.message);
    });
};

// UPDATE
const api_put_order = (req, res) => {
    const id = req.params.id;
    order_model
    .findByIdAndUpdate(id, req.body)
    .then((order) => {
        console.log("Order {" + id + "} updated succesfully.");
        res.send(order);
        broadcast_order_data(); // Orders changed.
    }).catch((err) => {
        console.log("500: Could not update order " + id + ". " + err.message);
        res.status(500); // Give internal error.
        res.send(err.message);
    });
};

// DELETE
const api_delete_order = (req, res) => {
    const id = req.params.id;
    order_model
    .findByIdAndDelete(id)
    .then((order) => {
        console.log("Order {" + id + "} deleted succesfully.");
        res.send(order);
        broadcast_order_data(); // Orders changed.
    }).catch((err) => {
        console.log("500: Could not delete order " + id + ". " + err.message);
        res.status(500); // Give internal error.
        res.send(err.message);
    });
};

// CRUD commands defined in order_controller.js.
// These can be used via POSTMAN.
app.post("/api/order", api_post_order); // Create a order with machining parameters.
app.get("/api/orders", api_get_orders); // Get all orders.
app.get("/api/order/:id", api_get_order); // Get one order by id.
app.put("/api/order/:id", api_put_order); // Update a order.
app.delete("/api/order/:id", api_delete_order); // Delete a order.