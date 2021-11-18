const express = require("express");
const path = require("path");
const cors = require("cors");
// include and initialize the rollbar library with your access token
var Rollbar = require('rollbar')
var rollbar = new Rollbar({
  accessToken: '60ba18c358334e17a9682e5e0b63c8e1',
  captureUncaught: true,
  captureUnhandledRejections: true,
})

// record a generic message and send it to Rollbar
rollbar.log('Hello world!')

const app = express();
app.use(express.json());
app.use(cors());

const students = ["Tommy"];

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"));
    rollbar.info("HTML file served successfully");
});

app.get("/api/students", (req, res) => {
    rollbar.info("Someone got the list of students on page load");
    res.status(200).send(students);
});

app.post("/api/students", (req, res) => {
    let {name} = req.body;
    name = name.trim();

    const index = students.findIndex((studentName) => studentName === name);

    if(index === -1 && name !== "") {
        students.push(name);
        rollbar.log("Student added successfully", {author: "Tomas", type: "manual entry"});
        res.status(200).send(students);
    } else if(name === "") {
        rollbar.error("no name given");
        res.status(400).send("must provide a name");
    } else {
        rollbar.error("student already exists");
        res.status(400).send("student already exists");
    };
})

app.use(rollbar.errorHandler())

const port = process.env.port || 4545;

app.listen(port, () => {
    console.log(`Jammin on ${port}`);
});

