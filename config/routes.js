const express = require("express");
const router = express.Router();
const pizzasController = require("../controllers/pizzas");
const authController = require("../controllers/auth");
const users = require("../controllers/users");
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

router.route("/pizzas")
  .all(secureRoute)
  .get(pizzasController.index)
  .post(pizzasController.create);

router.route("/pizzas/:id")
  .all(secureRoute)
  .get(pizzasController.show)
  .put(pizzasController.update)
  .delete(pizzasController.delete);

module.exports = router;
