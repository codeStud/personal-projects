const express = require("express");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const app = express();

// app.get("/", (req, res) => {
//   res.send("Hello World");
// });

// setting EJS as the templating engine to generate dynamic HTML to serve to client
app.set("view engine", "ejs");
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

    // telling our server to accept the JSON data using bodyParser middleware
    app.use(bodyParser.json());

    app.use(express.static("public"));

    app.get("/", (req, res) => {
      quotesCollection
        .find()
        .toArray()
        .then((results) => res.render("index.ejs", { quotes: results }))
        .catch((error) => console.log(error));
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

    app.put("/quotes", (req, res) => {
      // console.log(req.body);
      quotesCollection
        .findOneAndUpdate(
          { name: "Pratik Raj" },
          {
            $set: {
              name: req.body.name,
              quote: req.body.quote,
            },
          },
          {
            upsert: true,
          }
        )
        .then((result) => {
          console.log(result);
          res.json("Success");
        })
        .catch((error) => console.log(error));
    });

    app.delete("/quotes", (req, res) => {
      quotesCollection
        .deleteOne(
          { name: req.body.name } // 'Coming from fetch in main.js'
          // Also, no need of options in this case
        )
        .then((result) => {
          // If there are no more Darth Vadar quotes, result.deletedCount will be 0
          if (result.deletedCount === 0) {
            return res.json("No quote to delete");
          }
          res.json(`Deleted Darth Vadar's quote`);
        })
        .catch((error) => console.log(error));
    });

    app.listen(3000, function () {
      console.log("Listening on port 3000");
    });
  })
  .catch((err) => console.log(err));
