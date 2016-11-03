const router = require('express').Router();

const saveEventsController = require("../controllers/saveEventsController");
const authController = require("../controllers/authController");
const usersController = require("../controllers/usersController");
const skiddleController = require('../controllers/skiddleController');

const jwt = require("jsonwebtoken");
const secret = require("./tokens").secret;


function secureRoutes(req, res, next) {
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
  .get(skiddleController.index);

router.route("/users")
  // .all(secureRoutes)
  .get(usersController.index);

router.route("/users/:id")
  // .all(secureRoutes)
  .get(usersController.show)
  .put(usersController.update)
  .delete(usersController.delete);

router.route("/users/:id/events")
  .get(usersController.eventIndex);

router.route("/users/:id/events/:eventId")
  .get(usersController.eventSearch);

router.route("/saveEvents")
  // .all(secureRoutes)
  .get(saveEventsController.index)
  .post(saveEventsController.create);

router.route("/saveEvents/:id")
  // .all(secureRoutes)
  .get(saveEventsController.show)
  .put(saveEventsController.update)
  .delete(saveEventsController.delete);

module.exports = router;
