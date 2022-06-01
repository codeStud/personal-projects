const express = require("express");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const app = express();

// app.get("/", (req, res) => {
//   res.send("Hello World");
// });

// grab the URL and replace <password> from MongoDB Atlas
const connectionString =
  "mongodb+srv://starwars-quotes-app:starwars-quotes-app@cluster0.6sntn.mongodb.net/?retryWrites=true&w=majority";

// MongoClient.connect(connectionString, (err, client) => {
//   if (err) console.log(err);
//   console.log("Connected to Database");
//   // set the database name
//   const db = client.db("starwars-quotes-app");
//   // app.use(/* ... */);
//   // app.get(/* ... */);
//   // app.post(/* ... */);
//   // app.listen(/* ... */);
// });

// MongoClient.connect also returns a Promise. So, we can write like-
MongoClient.connect(connectionString)
  .then((client) => {
    console.log("Connected to Database....");
    // getting the db object to work with the database
    const db = client.db("starwars-quotes-app");
    // defining the collection/table name = 'quotes'
    const quotesCollection = db.collection("quotes");
    // console.log(db);
    // We need the db variable from the connection to to access MongoDB.
    // This means we need to put our express request handlers into the MongoClient’s then call.
    // to parse the HTML form data
    app.use(bodyParser.urlencoded({ extended: true }));

    app.get("/", (req, res) => {
      res.sendFile(__dirname + "/index.html");
    });

    app.post("/quotes", (req, res) => {
      // console.log(req.body);
      quotesCollection
        .insertOne(req.body)
        .then((result) => {
          console.log(result);
          res.redirect("/");
        })
        .catch((error) => console.log(error));
    });

    app.listen(3000, function () {
      console.log("Listening on port 3000");
    });
  })
  .catch((err) => console.log(err));
