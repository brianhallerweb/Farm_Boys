var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Users = require("./models/users");
var Ads = require("./models/ads");
mongoose.connect("mongodb://localhost/farm_boys");
var app = express();
app.use(express.static("public"));
app.use(bodyParser.json());
var morgan = require("morgan");

app.use(morgan("dev"));

// var apiRoutes = express.Router();
//
// apiRoutes.get("/users", function(req, res) {
//   User.find({}, function(err, users) {
//     res.json(users);
//   });
// });
//
// app.use("/api", apiRoutes);

/*app.get("/setup", function(req, res) {
  // create a sample user
  var nick = new UserDat({
    name: "Nick Cerminara",
    password: "password",
    admin: true
  });

  // save the sample user
  nick.save(function(err) {
    if (err) throw err;

    console.log("User saved successfully");
    res.json({ success: true });
  });
});
*/

// TO DO ---- CRUD REQUESTS FOR Users
//-------------------------------------

app.get("/farm_boys/ads/:_id", function(req, res) {
  console.log("server.js::" + "run get request");
  Ads.findOne({ _id: req.params._id }, function(err, result) {
    if (err) {
      log("get", false, result);
      res.status(500).json(err);
    } else {
      log("get", true, result);
      res.json(result);
    }
  });
});

app.get("/farm_boys/users/:_id", function(req, res) {
  console.log("server.js::" + "run get request");
  Users.findOne({ _id: req.params._id }, function(err, result) {
    if (err) {
      log("get", false, result);
      res.status(500).json(err);
    } else {
      log("get", true, result);
      res.json(result);
    }
  });
});

app.get("/farm_boys/users", function(req, res) {
  console.log("server.js::" + "run get request");
  Users.find(function(err, result) {
    if (err) {
      log("get", false, result);
      res.status(500).json(err);
    } else {
      log("get", true, result);
      res.json(result);
    }
  });
});

app.post("/farm_boys/users", function(req, res) {
  console.log("server.js::" + "run post request");
  new Users({
    username: req.body.username,
    contact: req.body.contact,
    password: req.body.password,
    admin: req.body.admin
  }).save(function(err, result) {
    if (err) {
      log("post", false, result);
      res.status(500).json(err);
    } else {
      log("post", true, result);
      res.json(result);
    }
  });
});

app.put("/farm_boys/users/:_id", function(req, res) {
  console.log("server.js::", req.body);
  Users.findByIdAndUpdate(
    { _id: req.params._id },
    {
      $set: req.body
    },
    { new: true },
    function(err, result) {
      if (err) {
        log("put", false, result);
        res.status(500).json(err);
      } else {
        log("put", true, result);
        console.log(result);
        res.json(result);
      }
    }
  );
});

app.delete("/farm_boys/users/:_id", function(req, res) {
  console.log("server.js::" + "run delete request");
  Users.remove({ _id: req.params._id }, function(err, result) {
    if (err) {
      log("delete", false, result);
      res.status(500).json(err);
    } else {
      log("delete", true, result);
      res.json(result);
    }
  });
});

app.post("/farm_boys/ads", function(req, res) {
  console.log("server.js::" + "run post request");
  new Ads({
    user: req.body.user,
    title: req.body.title,
    type: req.body.type,
    description: req.body.description,
    image: req.body.image,
    price: req.body.price,
    date: Date()
  }).save(function(err, result) {
    if (err) {
      log("post", false, result);
      res.status(500).json(err);
    } else {
      log("post", true, result);
      res.json(result);
    }
  });
});

// app.get("/farm_boys/ads", function(req, res) {
//   console.log("server.js::" + "run get request");
//
//   // Ads.find(query, fields, { skip: 10, limit: 5 }, function(err, results) { ... });
//   Ads.find({ $or: [{ type: "desert" }, { type: "Meat" }] }, function(
//     err,
//     result
//   ) {
//     if (err) {
//       log("get", false, result);
//       res.status(500).json(err);
//     } else {
//       log("get", true, result);
//       res.json(result);
//     }
//   });
// });
//
// app.get("/farm_boys/ads/:skip/:limit", function(req, res) {
//   console.log("server.js::" + "run get request");
//   let skip = req.params.skip;
//   let limit = req.params.limit;
//
//   // Ads.find(query, fields, { skip: 10, limit: 5 }, function(err, results) { ... });
//   Ads.find(function(err, result) {
//     if (err) {
//       log("get", false, result);
//       res.status(500).json(err);
//     } else {
//       log("get", true, result);
//       res.json(result);
//     }
//   })
//     .skip(parseInt(skip))
//     .limit(parseInt(limit));
// });

app.get("/farm_boys/ads", function(req, res) {
  console.log("server.js::" + "run get request");

  // Ads.find(query, fields, { skip: 10, limit: 5 }, function(err, results) { ... });
  Ads.find(function(err, result) {
    if (err) {
      log("get", false, result);
      res.status(500).json(err);
    } else {
      log("get", true, result);
      res.json(result);
    }
  })
    .skip(parseInt(10))
    .limit(parseInt(10));
});

app.put("/farm_boys/ads/:_id", function(req, res) {
  console.log("server.js::", req.body);
  Ads.findByIdAndUpdate(
    { _id: req.params._id },
    {
      $set: req.body
    },
    { new: true },
    function(err, result) {
      if (err) {
        log("put", false, result);
        res.status(500).json(err);
      } else {
        log("put", true, result);
        console.log(result);
        res.json(result);
      }
    }
  );
});

app.delete("/farm_boys/ads/:_id", function(req, res) {
  console.log("server.js::" + "run delete request");
  Ads.remove({ _id: req.params._id }, function(err, result) {
    if (err) {
      log("delete", false, result);
      res.status(500).json(err);
    } else {
      log("delete", true, result);
      res.json(result);
    }
  });
});

function log(requestType, isSuccess, result) {
  let success = isSuccess ? "successful" : "unsuccessful";
  console.log("server.js::" + requestType + " request " + success);
  if (isSuccess) {
    console.log(result);
  }
}

app.listen(3001);
