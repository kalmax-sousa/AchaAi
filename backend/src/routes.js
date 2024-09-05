import { Router } from "express";
import multer from "multer";

import UserController from "./app/controllers/UserController.js";
import ItemController from "./app/controllers/ItemController.js";
import SessionController from "./app/controllers/SessionController.js";
import CategoryController from "./app/controllers/CategoryController.js";

import auth, { isAdmin } from "./app/middlewares/auth.js";

const router = Router();
const upload = multer({ dest: "./tmp" });

router.post("/session", SessionController.store);
router.post("/session/confirmation", SessionController.accountConfirmation);
router.post("/session/recovery", SessionController.recoverPassword);

router.get("/users", auth, UserController.show);
router.get("/users/:id", auth, UserController.index);
router.post("/users/", UserController.store);
router.put("/users/recovery", UserController.recoverPassword);
router.post("/users/updatePassword", auth, UserController.updatePassword);
router.put("/users/updateProfile", auth, UserController.updateProfile);
router.put(
  "/users/updateAvatar",
  upload.single("file"),
  auth,
  UserController.updateAvatar,
);

router.get("/items", auth, ItemController.show);
router.get("/items/:id", auth, ItemController.index);
router.post("/items", upload.single("file"), auth, ItemController.store);
router.put("/items/:id", auth, isAdmin, ItemController.update);
router.delete("/items/:id", auth, isAdmin, ItemController.delete);

router.get("/categories", auth, CategoryController.show);
router.get("/categories/:id", auth, CategoryController.index);
router.post("/categories", auth, isAdmin, CategoryController.store);
router.put("/categories/:id", auth, isAdmin, CategoryController.update);
router.delete("/categories/:id", auth, isAdmin, CategoryController.delete);

export default router;
