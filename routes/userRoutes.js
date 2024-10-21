const express = require("express");
const { createUser, getUsers, getUserById, updateUser, deleteUser, findUsersByEmailDomain } = require("../controllers/userController");
const router = express.Router();

router.post('/users', createUser);
router.get('/users', getUsers);
router.get('/users/findUsersByEmailDomain', findUsersByEmailDomain);
router.get('/users/:userId', getUserById);
router.put('/users/:userId', updateUser);
router.delete('/users/:userId', deleteUser);

module.exports = router;