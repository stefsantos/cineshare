import express from 'express';
import { createPost, getPost } from '../controllers/postcontroller.js';
import protectRoute from '../middleware/protectRoute.js';

const router = express.Router();

router.get("/:id", getPost);
router.post("/create", protectRoute, createPost);

export default router;