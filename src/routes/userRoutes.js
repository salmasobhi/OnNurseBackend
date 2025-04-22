
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middlewares/auth');

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - first_name
 *         - last_name
 *         - email
 *         - password
 *         - user_name
 *         - mobile_number
 *         - is_nurse
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the user
 *         first_name:
 *           type: string
 *         last_name:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         user_name:
 *           type: string
 *         mobile_number:
 *           type: string
 *         is_nurse:
 *           type: boolean
 *       example:
 *         first_name: "Manar"
 *         last_name: "Atef"
 *         email: "manar@example.com"
 *         password: "123456"
 *         user_name: "manar123"
 *         mobile_number: "0123456789"
 *         is_nurse: true
 */

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: The user was successfully created
 *       400:
 *         description: Some error happened
 */
router.post('/register', userController.registerUser);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               email: "manar@example.com"
 *               password: "123456"
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid credentials
 */
router.post('/login', userController.loginUser);
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.put('/', auth, userController.updateUser);
router.delete('/', auth, userController.deleteUser);


module.exports = router;
