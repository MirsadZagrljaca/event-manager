import express from "express";
import authController from "./controllers/auth.controller";
import userController from "./controllers/user.controller";
import eventController from "./controllers/event.controller";
import fileUpload from "./middleware/multer";
import registrationController from "./controllers/registration.controller";
import cacheController from "./controllers/cache.controller";
const router = express.Router();

router.route("/user/register").post(userController.create);
router.route("/user").get(userController.list);
router.param("userId", userController.userByID);
router.route("/user/:userId").get(userController.read);

router.route("/login").post(authController.login);

router.route("/dashboard").get(eventController.list);
router.param("category", eventController.eventByCategory);
router.route("/dashboard/:category").get(eventController.getEventsByCategory);

router.route("/api/user/events").post(eventController.eventByUser);

router.route("/event").post(fileUpload.single("img"), eventController.create);
router.param("eventId", eventController.eventById);
router
  .route("/event/:eventId")
  .get(eventController.read)
  .delete(eventController.remove);

// socket treba za registration

router
  .route("/registration")
  .get(registrationController.list)
  .post(registrationController.create);

router.param("registrationId", registrationController.registrationById);

router
  .route("/registration/:registrationId/approvals")
  .post(registrationController.approve);

router
  .route("/registration/:registrationId/rejections")
  .post(registrationController.reject);

router.route("/cache").get(cacheController.read);

export default router;
