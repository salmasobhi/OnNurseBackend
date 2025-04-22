/**
 * @swagger
 * components:
 *   schemas:
 *     Nurse:
 *       type: object
 *       required:
 *         - user_id
 *         - certificates
 *         - graduation_college
 *         - bank_details
 *         - status
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the nurse record
 *         user_id:
 *           type: string
 *           description: The ID of the user who is a nurse
 *         certificates:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *               image:
 *                 type: string
 *           description: Array of certificates with their statuses and images
 *         graduation_college:
 *           type: object
 *           properties:
 *             status:
 *               type: string
 *             college:
 *               type: string
 *           description: Details about the nurse's graduation college
 *         bank_details:
 *           type: object
 *           properties:
 *             object:
 *               type: object
 *             status:
 *               type: string
 *           description: Bank details information
 *         status:
 *           type: string
 *           enum: [draft, pending, approved, rejected]
 *           description: The current status of the nurse record
 *       example:
 *         user_id: "65f1a2b3-c4d5-e6f7-8901-23456789abcd"
 *         certificates:
 *           - status: "verified"
 *             image: "cert1.jpg"
 *         graduation_college:
 *           status: "verified"
 *           college: "Medical University"
 *         bank_details:
 *           object: { "account": "123456789" }
 *           status: "verified"
 *         status: "draft"
 */

/**
 * @swagger
 * tags:
 *   name: Nurse
 *   description: API for managing nurse records
 */

const express = require('express');
const router = express.Router();
const { createNurse, updateNurse, deleteNurse,getAllNurses } = require('../controllers/nurseController');

/**
 * @swagger
 * /api/nurse:
 *   post:
 *     summary: Create a new nurse record
 *     tags: [Nurse]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Nurse'
 *     responses:
 *       201:
 *         description: Nurse record created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Nurse'
 *       400:
 *         description: Bad Request
 */
router.post('/', createNurse);

/**
 * @swagger
 * /api/nurse/{id}:
 *   put:
 *     summary: Update an existing nurse record
 *     tags: [Nurse]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The nurse record ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Nurse'
 *     responses:
 *       200:
 *         description: Nurse record updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Nurse'
 *       404:
 *         description: Nurse record not found
 */
router.put('/:id', updateNurse);

/**
 * @swagger
 * /api/nurse/{id}:
 *   delete:
 *     summary: Delete a nurse record by ID
 *     tags: [Nurse]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The nurse record ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Nurse record deleted successfully
 *       404:
 *         description: Nurse record not found
 */
router.delete('/:id', deleteNurse);
router.get('/nurses', getAllNurses);
module.exports = router;

