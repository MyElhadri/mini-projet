import express from 'express'
const router = express.Router()

import * as competanceControllers from '../controllers/competenceControllers.js'

router.post('/', competanceControllers.createCompetance)
router.get('/', competanceControllers.getCompetences)
router.put('/:id', competanceControllers.updateCompetence)
router.delete('/:id', competanceControllers.deleteCompetence)

export default router