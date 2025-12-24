const express = require("express");
const noteController = require("../controllers/noteShare.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.use(authMiddleware);

router.post("/", noteController.share);
router.get("/", noteController.sharedNotes);

module.exports = router;


/**
 * @swagger
 * tags:
 *   name: Note Sharing
 *   description: APIs for sharing notes with other users
 *
 * components:
 *   schemas:
 *     ShareNoteRequest:
 *       type: object
 *       required:
 *         - noteId
 *         - sharedWithId
 *         - permission
 *       properties:
 *         noteId:
 *           type: integer
 *           example: 12
 *         sharedWithId:
 *           type: integer
 *           example: 5
 *         permission:
 *           type: string
 *           enum: [read, edit]
 *
 *     SharedNoteResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         title:
 *           type: string
 *         content:
 *           type: string
 *         permission:
 *           type: string
 *           enum: [read, edit]
 *
 * /note-share:
 *   post:
 *     summary: Share a note with another user
 *     tags: [Note Sharing]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ShareNoteRequest'
 *     responses:
 *       200:
 *         description: Note shared successfully
 *       422:
 *         description: Validation error
 *       400:
 *         description: Share failed
 *
 *   get:
 *     summary: Get notes shared with the logged-in user
 *     tags: [Note Sharing]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of shared notes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SharedNoteResponse'
 */
