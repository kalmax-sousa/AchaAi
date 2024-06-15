import { Router } from "express";
import userController from "./app/controllers/userController.js";

const router = Router();

router.get("/users", userController.getAll);
router.get("/users/:id", userController.getUser);
router.get("/users/name/:id", userController.getUserName);
router.get("/users/email/:id", userController.getUserEmail);

router.post("/users/", userController.createUser);

router.put("/users/:id", userController.updateUser);
router.put("/users/password/:id", userController.updateUserPassword);

router.delete("/users/:id", userController.deleteUser);

export default router;
