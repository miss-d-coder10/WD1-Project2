const express = require("express");
const router = express.Router();
const pizzasController = require("../controllers/saveEventController");
const authController = require("../controllers/authController");
const users = require("../controllers/usersController");
const jwt = require("jsonwebtoken");
const secret = require("./tokens").secret;

function secureRoute(req, res, next) {
 if(!req.headers.authorization) return res.status(401).json({ message: "Unauthorized" });

 let token = req.headers.authorization.replace('Bearer ', '');

 jwt.verify(token, secret, (err, payload) => {
   if(err) return res.status(401).json({ message: "Unauthorized" });
   req.user = payload;

   next();
 });
}

router.route("/register")
  .post(authController.register);

router.route("/login")
  .post(authController.login);

router.route("/events")
  .all(secureRoute)
  .get(saveEventController.index)
  .post(saveEventController.create);

router.route("/events/:id")
  .all(secureRoute)
  .get(saveEventController.show)
  .put(saveEventController.update)
  .delete(saveEventController.delete);

module.exports = router;
