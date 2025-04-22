const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Request:
 *       type: object
 *       required:
 *         - user_id
 *         - title
 *         - description
 *         - status
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the request
 *         user_id:
 *           type: string
 *           description: The id of the user who created the request
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of image URLs or filenames
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         reviews:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of review IDs
 *         interested:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of user IDs that are interested
 *         comments:
 *           type: object
 *         status:
 *           type: string
 *           enum: [valid, expired, in_progress, pending, completed]
 *         assignee:
 *           type: string
 *           description: The id of the user assigned to the request
 *         price:
 *           type: number
 *         offers:
 *           type: array
 *       example:
 *         user_id: "60f72b2f4f1a2b001c8d4567"
 *         images: ["image1.jpg", "image2.jpg"]
 *         title: "Home Nursing Request"
 *         description: "Need a nurse for home care"
 *         reviews: []
 *         interested: []
 *         comments: {}
 *         status: "pending"
 *         assignee: "60f72b2f4f1a2b001c8d4568"
 *         price: 100
 *         offers: []
 */

/**
 * @swagger
 * tags:
 *   name: Requests
 *   description: API for managing nursing requests
 */

/**
 * @swagger
 * /api/requests:
 *   post:
 *     summary: Create a new request
 *     tags: [Requests]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Request'
 *     responses:
 *       201:
 *         description: Request created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Request'
 *       400:
 *         description: Bad Request
 */
router.post('/', requestController.createRequest);

/**
 * @swagger
 * /api/requests:
 *   get:
 *     summary: Retrieve a list of all requests
 *     tags: [Requests]
 *     responses:
 *       200:
 *         description: A list of requests
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Request'
 */
const verifyToken = require("../middlewares/auth");
router.get('/', verifyToken, requestController.getAllRequests);

/**
 * @swagger
 * /api/requests/{id}:
 *   get:
 *     summary: Get a request by ID
 *     tags: [Requests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The request id
 *     responses:
 *       200:
 *         description: The request with the given ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Request'
 *       404:
 *         description: Request not found
 */
router.get('/:id', requestController.getRequestById);

/**
 * @swagger
 * /api/requests/{id}:
 *   put:
 *     summary: Update a request by ID
 *     tags: [Requests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The request id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Request'
 *     responses:
 *       200:
 *         description: Request updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Request'
 *       404:
 *         description: Request not found
 */
router.put('/:id', requestController.updateRequest);

/**
 * @swagger
 * /api/requests/{id}:
 *   delete:
 *     summary: Delete a request by ID
 *     tags: [Requests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The request id
 *     responses:
 *       200:
 *         description: Request deleted successfully
 *       404:
 *         description: Request not found
 */
router.delete('/:id', requestController.deleteRequest);

router.get('/user/:userId', requestController.getRequestsByUserId); 
router.patch("/:id/status", requestController.updateRequestStatus);

module.exports = router;
