import express from 'express';
import { createPost, getPost, deletePost } from '../controllers/postcontroller.js';
import protectRoute from '../middleware/protectRoute.js';

const router = express.Router();

router.post('/create', protectRoute, createPost);
router.get("/:id", getPost);
router.delete("/:id", protectRoute, deletePost);


export default router;