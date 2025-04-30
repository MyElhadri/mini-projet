import express from 'express';
import * as personneControllers from '../controllers/personneControllers.js';

const router = express.Router();

router.get('/', personneControllers.getPersonne);
router.post('/', personneControllers.createPersonne);
router.put('/:id', personneControllers.updatePersonne);
router.delete('/:id',personneControllers. deletePersonne);

export default router;