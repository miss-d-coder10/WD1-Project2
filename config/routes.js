const router = require('express').Router();
const jwt = require("jsonwebtoken");
const secret = require("./tokens").secret;

const pizzasController = require("../controllers/pizzasController");
const authController = require("../controllers/authController");
const usersController = require("../controllers/usersController");

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
