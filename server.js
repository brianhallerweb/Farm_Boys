var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Users = require("./models/users");
var Ads = require("./models/ads");
var jwt = require("jsonwebtoken");
var config = require("./config.js");
mongoose.connect(config.database);
var app = express();

app.use(bodyParser.json());
var morgan = require("morgan");

app.use(morgan("dev"));

app.set("key", config.key);

var protectedRoute = express.Router();
app.use("/api", protectedRoute);

protectedRoute.use(function(req, res, next) {
  var token = req.headers["authorization"];

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
  let query = {};
  if (req.query.username) {
    query.username = req.query.username;
  }
  Users.findOne(query, function(err, result) {
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
  let date = new Date();
  new Ads({
    userId: req.body.userId,
    username: req.body.username,
    title: req.body.title,
    type: req.body.type,
    description: req.body.contentState,
    image: req.body.image,
    price: req.body.price,
    contact: req.body.contact,
    date: date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear()
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
  let filter = {};
  let itemsPerPage = 10;
  if (req.query.type) {
    filter.type = req.query.type;
  }
  if (req.query.title) {
    filter.$or = [
      {
        title: new RegExp(req.query.title, "i")
      },
      {
        searchText: new RegExp(req.query.title, "i")
      }
    ];
  }
  if (req.query.id) {
    filter.userId = req.query.id;
  }
  if (req.query.page) {
    Ads.find(filter);
    Ads.find(filter)
      .count()
      .exec((err, count) => {
        Ads.find(filter)
          .skip(parseInt(req.query.page * itemsPerPage))
          .sort("-date")
          .limit(parseInt(itemsPerPage))
          .exec(function(err, result) {
            if (err) {
              log("get", false, result);
              res.status(500).json(err);
            } else {
              log("get", true, result);
              res.json({ count, result });
            }
          });
      });
  } else {
    Ads.find(filter, function(err, result) {
      if (err) {
        log("get", false, result);
        res.status(500).json(err);
      } else {
        log("get", true, result);
        res.json(result);
      }
    });
  }
});

app.put("/farm_boys/ads/:_id", function(req, res) {
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

app.use(express.static("build"));
app.use(express.static("public"));

app.get("*", (req, res) => {
  console.log("dirname", __dirname);
  res.sendFile(path.join(__dirname, "/build/index.html"));
});

app.listen(process.env.PORT || 3001);
