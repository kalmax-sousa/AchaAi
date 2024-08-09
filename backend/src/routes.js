import { Router } from "express";
import multer from "multer";

import UserController from "./app/controllers/UserController.js";
import SessionController from "./app/controllers/SessionController.js";
import CategoryController from "./app/controllers/CategoryController.js";

import auth, { isAdmin } from "./app/middlewares/auth.js";

const router = Router();

const upload = multer({ dest: "./tmp" });

router.post("/session", SessionController.store);
router.post("/session/confirmation", SessionController.accountConfirmation);
router.post("/session/recovery", SessionController.recoverPassword);

router.put("/users/recovery", UserController.recoverUserPassword);

router.get("/users", auth, UserController.getAll);
router.get("/users/:id", auth, UserController.getUser);

router.post("/users/", UserController.createUser);

router.put(
  "/users/updateAvatar",
  upload.single("file"),
  auth,
  UserController.updateUserAvatar,
);

router.post("/users/updatePassword", auth, UserController.updateUserPassword);
router.put("/users/updateProfile", auth, UserController.updateUserProfile);

router.get("/categories", auth, CategoryController.getAllCategories);
router.get("/categories/:id", auth, CategoryController.getCategoryById);
router.post("/categories", auth, isAdmin, CategoryController.createCategory);
router.put(
  "/categories/:id",
  auth,
  isAdmin,
  CategoryController.updateCategoryById,
);
router.delete(
  "/categories/:id",
  auth,
  isAdmin,
  CategoryController.deleteCategoryById,
);

export default router;
