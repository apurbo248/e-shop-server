require("dotenv").config();
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
var cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");


app.use(cors());

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



app.get("/", (req, res) => {
  res.send("Wellcome to eshop server");
});

app.use("/v1", require("./router/User"));
app.use("/v1", require("./router/Products"));
app.use("/v1", require("./router/Order"));
app.use("/v1", require("./router/Payment"));

const DB = process.env.DB;
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database connected"))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 1234;

app.listen(PORT, () => {
  console.log(`Server is running at port on ${PORT}`);
});
