import { Router } from "express";
import multer from "multer";

import userController from "./app/controllers/UserController.js";
import sessionController from "./app/controllers/SessionController.js";

import auth, { isAdmin } from "./app/middlewares/auth.js";

const router = Router();

const upload = multer({ dest: "./tmp" });

router.post("/session", sessionController.store);
router.post("/session/confirmation", sessionController.accountConfirmation);
router.post("/session/recovery", sessionController.recoverPassword);

router.put("/users/recovery", userController.recoverUserPassword);

router.get("/users", auth, userController.getAll);
router.get("/users/:id", auth, userController.getUser);

router.post("/users/", userController.createUser);

router.put(
  "/users/updateAvatar",
  upload.single("file"),
  auth,
  userController.updateUserAvatar,
);

router.delete("/users/:id", auth, isAdmin, userController.deleteUser);

export default router;
