import express from 'express';
import { signupUser } from '../controllers/usercontroller.js';

const router = express.Router();

//signup
router.post('/signup', signupUser);

//signin

export default router;
