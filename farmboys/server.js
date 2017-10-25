var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Users = require("./models/users");
var Ads = require("./models/ads");
var jwt = require("jsonwebtoken");
var config = require("./config.js");
mongoose.connect("mongodb://localhost/farm_boys");
var app = express();
app.use(express.static("public"));
app.use(bodyParser.json());
var morgan = require("morgan");

app.use(morgan("dev"));

app.set("key", config.key);

var protectedRoute = express.Router();
app.use("/api", protectedRoute);

protectedRoute.use(function(req, res, next) {
  var token =
    req.body.token ||
    req.query.token ||
    req.headers["x-access-token"] ||
    req.headers["authorization"];

  if (token) {
    jwt.verify(token, app.get("key"), function(err, decoded) {
      if (err) {
        return res.json({
          success: false,
          message: "Failed to authenticate token."
        });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.status(403).send({
      success: false,
      message: "No token provided."
    });
  }
});

protectedRoute.get("/farm_boys/users", function(req, res) {
  console.log("server.js::" + "run get request");
  Users.findOne({ username: req.decoded.username }, function(err, result) {
    if (err) {
      log("get", false, result);
      res.status(500).json(err);
    } else {
      log("get", true, result);
      res.json(result);
    }
  });
});

app.post("/authenticate", function(req, res) {
  var auth = req.headers["authorization"];
  var tmp = auth.split(" ");
  var buf = new Buffer(tmp[1], "base64");
  var plain_auth = buf.toString();
  var creds = plain_auth.split(":");
  var username = creds[0];
  var password = creds[1];
  Users.findOne(
    {
      username: username
    },
    function(err, user) {
      if (err) throw err;
      if (!user) {
        res.json({
          success: false,
          message: "Authentication failed. User not found."
        });
      } else if (user.username) {
        if (user.password != password) {
          res.json({
            success: false,
            message: "Authentication failed. Wrong password."
          });
        } else {
          const payload = {
            admin: user.admin,
            username: user.username
          };
          var token = jwt.sign(payload, app.get("key"), {
            expiresIn: 60 * 60 * 1140
          });

          res.json({
            success: true,
            message: "Validation successful",
            token: token
          });
        }
      }
    }
  );
});

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
  console.log("req.body", req.body);
  new Users({
    username: req.body.username,
    phonenumber: req.body.phonenumber,
    password: req.body.password,
    email: req.body.email,
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
    description: req.body.contentState,
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

app.get("/farm_boys/ads", function(req, res) {
  console.log("server.js::" + "run get request");
  let filter = {};
  if (req.query.type) {
    filter.type = req.query.type;
  }
  if (req.query.title) {
    filter.title = req.query.title;
  }
  Ads.find(filter, function(err, result) {
    if (err) {
      log("get", false, result);
      res.status(500).json(err);
    } else {
      log("get", true, result);
      res.json(result);
    }
  })
    .skip(parseInt(0))
    .sort("-date")
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

protectedRoute.get("/users/:name", function(req, res) {
  Users.findOne({ name: req.params.name }, function(err, result) {
    if (err) {
      log("get", false, result);
      res.status(500).json(err);
    } else {
      log("get", true, result);
      res.json(result);
    }
  });
});

protectedRoute.get("/users/:_id", function(req, res) {
  console.log("working?");
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

function log(requestType, isSuccess, result) {
  let success = isSuccess ? "successful" : "unsuccessful";
  console.log("server.js::" + requestType + " request " + success);
  if (isSuccess) {
    console.log(result);
  }
}

app.listen(3001);
