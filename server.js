import express from "express";
import bodyParser from "body-parser";
import _ from "lodash";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://gurusaranm0025:prasad0027@cluster0.afdwdgy.mongodb.net/todolistDB",
  {
    useNewUrlParser: true,
  }
);

const itemsSchema = new mongoose.Schema({
  name: String,
});

const Item = new mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Welcome to the todolist!",
});

const item2 = new Item({
  name: "Hit the + buton add a to-do to the list",
});

const item3 = new Item({
  name: "<---Hit this to delete the item.",
});

const defaultItems = [item1, item2, item3];

const listSchema = new mongoose.Schema({
  name: String,
  items: [itemsSchema],
});

const List = new mongoose.model("List", listSchema);

// Code to add deafult items to mongoDB

const app = express();
const port = 6002;
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// var todolist = [];
// var workTodoList = [];

app.get("/", (req, res) => {
  Item.find({})
    .then(function (items) {
      if (items.length === 0) {
        Item.insertMany(defaultItems)
          .then(function () {
            console.log("Default data is successfully inserted.");
            res.redirect("/");
          })
          .catch(function (err) {
            console.log(err);
          });
      } else {
        res.render("home.ejs", {
          todos: items,
          list: "root",
        });
      }
    })
    .catch(function (error) {
      console.log(error);
    });
});

app.get("/:customListName", (req, res) => {
  const custListName = _.capitalize(req.params.customListName);

  const list = new List({
    name: custListName,
    items: defaultItems,
  });

  List.findOne({ name: custListName }).then(function (foundList) {
    if (!foundList) {
      list.save();
      res.redirect(`/${custListName}`);
    } else {
      res.render("home.ejs", { todos: foundList.items, list: custListName });
    }
  });

  // list.save();
});

// app.get("/work", (req, res) => {
//   res.render("home.ejs", { todos: workTodoList, toPersonal: false });
// });

app.post("/add", (req, res) => {
  const itemName = req.body.newTodo;
  const listName = req.body.list;
  // console.log(listName);
  const item = new Item({
    name: itemName,
  });

  if (listName === "root") {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({ name: listName })
      .then(function (foundList) {
        foundList.items.push(item);
        foundList.save();
        res.redirect("/" + listName);
      })
      .catch(function (error) {
        console.log(error);
      });
  }
});

app.post("/delete", (req, res) => {
  const checkedItemID = req.body.cb;
  const listName = req.body.list;

  if (listName === "root") {
    Item.deleteOne({ _id: checkedItemID })
      .then(function () {
        res.redirect("/");
      })
      .catch(function (error) {
        console.log(error);
      });
  } else {
    List.findOneAndUpdate(
      { name: listName },
      { $pull: { items: { _id: checkedItemID } } }
    )
      .then(function (foundList) {
        res.redirect("/" + listName);
      })
      .catch(function (error) {
        console.log(error);
      });
  }
});

// app.post("/work", (req, res) => {
//   console.log("post recieved to work list", req.body.newTodo);
//   workTodoList.push(req.body.newTodo);
//   res.redirect("/work");
// });

app.listen(port, () => {
  console.log(`Server is successfully running on port ${port}`);
});
