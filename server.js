import express from "express";
import bodyParser from "body-parser";
const mongoose = require("mongoose");

mongoose.connection("mongodb://localhost:27017/todolistDB");

const itemsSchema = new mongoose.Schema({
    name: String
});

const Item = new mongoose.model("Item", itemsSchema);

const item1 = new Item ({
    name: "Welcome to the todolist!"
});

const item2 = new Item ({
    name:"Hit the + buton add a to-do to the list"
});

const item3 = new Item ({
    name: "<---Hit this to delete the item."
});

const defaultItems = [item1,item2,item3];

Item.insertMany(defaultItems).then(function() {
    console.log("Default data is successfully inserted.");
}).catch(function(err) {
    console.log(err);
});


const app = express();
const port = 6002;
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

var todolist = []
var workTodoList = []

app.get("/", (req,res) => {
    res.render("home.ejs", { todos: todolist, toPersonal: true });
});

app.get("/work", (req, res) => {
    res.render("home.ejs", {todos: workTodoList, toPersonal: false });
});

app.post("/add", (req,res) => {
    console.log("post recieved", req.body.newTodo);
    todolist.push(req.body.newTodo);
    res.redirect("/");
});

app.post("/work", (req, res) => {
    console.log("post recieved to work list", req.body.newTodo);
    workTodoList.push(req.body.newTodo);
    res.redirect("/work");
})

app.listen(port, () => {
    console.log(`Server is successfully running on port ${port}`);
});