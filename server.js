import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 6002;
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req,res) => {
    res.render("home.ejs");
});

app.listen(port, () => {
    console.log(`Server is successfully running on port ${port}`);
});