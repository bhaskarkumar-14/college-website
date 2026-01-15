import express from 'express';
import { getResult, createResult } from '../controllers/resultController.js';

const router = express.Router();

router.get('/', getResult);
router.get('/:rollNo', getResult);
router.post('/', createResult);

export default router;
