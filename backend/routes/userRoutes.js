const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/', userController.getAll);
router.get('/:id', userController.getUser);
router.get('/name/:id', userController.getUserName);
router.get('/email/:id', userController.getUserEmail);

router.post('/', userController.createUser);

router.put('/:id', userController.updateUser);
router.put('/password/:id', userController.updateUserPassword);

router.delete('/:id', userController.deleteUser);

module.exports = router;
