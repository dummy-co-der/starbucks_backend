const express = require("express");
const app = express();
const cors = require("cors");
const authentication = require("./reg");
const dotenv = require("dotenv");

dotenv.config();
app.use(cors());
app.use(express.json());
const port = process.env.PORT;
app.use("/", authentication);
app.listen(port, console.log(`server started on port ${port}.`));