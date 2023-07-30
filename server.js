import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 6002;
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

var todolist = []

app.get("/", (req,res) => {
    res.render("home.ejs", { todos: todolist });
});

app.post("/add", (req,res) => {
    console.log("post recieved", req.body.newTodo);
    todolist.push(req.body.newTodo);
    res.redirect("/");
});

app.listen(port, () => {
    console.log(`Server is successfully running on port ${port}`);
});