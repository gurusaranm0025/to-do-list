import express from "express";
import bodyParser from "body-parser";

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