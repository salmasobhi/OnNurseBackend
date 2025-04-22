/**
 * @swagger
 * components:
 *   schemas:
 *     NurseDraft:
 *       type: object
 *       required:
 *         - user_id
 *         - status
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the nurse draft
 *         user_id:
 *           type: string
 *           description: The ID of the nurse (as UUID in string format)
 *         patient_id:
 *           type: string
 *           description: The ID of the patient (as UUID in string format)
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
 *           description: The current status of the nurse draft
 *       example:
 *         _id: "60c72b2f4f1a2b001c8d4567"
 *         user_id: "65f1a2b3-c4d5-e6f7-8901-23456789abcd"
 *         patient_id: "65f1a2b3-c4d5-e6f7-8901-23456789abce"
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
 *   name: NurseDraft
 *   description: API for managing nurse drafts
 */

const express = require('express');
const router = express.Router();
const nurseDraftController = require('../controllers/nurseDraftController');

/**
 * @swagger
 * /api/nursedrafts:
 *   post:
 *     summary: Create a new nurse draft
 *     tags: [NurseDraft]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NurseDraft'
 *     responses:
 *       201:
 *         description: Nurse draft created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NurseDraft'
 *       400:
 *         description: Bad Request
 */
router.post('/', nurseDraftController.createNurseDraft);

/**
 * @swagger
 * /api/nursedrafts:
 *   get:
 *     summary: Retrieve a list of nurse drafts
 *     tags: [NurseDraft]
 *     responses:
 *       200:
 *         description: A list of nurse drafts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/NurseDraft'
 */
router.get('/', nurseDraftController.getAllNurseDrafts);

/**
 * @swagger
 * /api/nursedrafts/{id}:
 *   get:
 *     summary: Get a nurse draft by ID
 *     tags: [NurseDraft]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The nurse draft ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Nurse draft found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NurseDraft'
 *       404:
 *         description: Nurse draft not found
 */
router.get('/:id', nurseDraftController.getNurseDraftById);

/**
 * @swagger
 * /api/nursedrafts/{id}:
 *   put:
 *     summary: Update a nurse draft by ID
 *     tags: [NurseDraft]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The nurse draft ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NurseDraft'
 *     responses:
 *       200:
 *         description: Nurse draft updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NurseDraft'
 *       404:
 *         description: Nurse draft not found
 */
router.put('/:id', nurseDraftController.updateNurseDraft);

/**
 * @swagger
 * /api/nursedrafts/{id}:
 *   delete:
 *     summary: Delete a nurse draft by ID
 *     tags: [NurseDraft]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The nurse draft ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Nurse draft deleted successfully
 *       404:
 *         description: Nurse draft not found
 */
router.delete('/:id', nurseDraftController.deleteNurseDraft);

module.exports = router;
