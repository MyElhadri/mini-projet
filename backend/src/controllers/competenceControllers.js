import * as competenceModels from '../models/competenceModels.js'

export const createCompetance = async (req, res, next) => {
    const {nom} = req.body
    try {
        await competenceModels.createCompetence(nom)
        res.status(201).json({message: 'competance added succesfully'})
    } catch (error) {
        return next (error)
    }
}
export const getCompetences = async (req, res, next) => {
    try {
        const result = await competenceModels.getCompetences()
        if(!result)
            return res.status(404).json({message: 'no competence found'})
        res.status(200).json(result)
    } catch (error) {
        return next (error)
    }
}
export const updateCompetence = async (req, res, next) => {
    const {nom} = req.body
    const {id} = req.params
    try {
        const result = competenceModels.updateCompetence(id, nom)
        if (!result)
            res.status(404).json({message: 'competance not found'})
        res.status(201).json({message: 'competance updated succesfully'})
    } catch (error) {
        return next (error)
    }
}
export const deleteCompetence = async (req, res, next) => {
    const {id} = req.params
    try {
        const result = await competenceModels.deleteCompetence(id)
        if (!result)
            res.status(404).json({message: 'competance not found'})
        res.status(200).json({message: 'competance deleted succesfully'})
    } catch (error) {
        return next (error)
    }
}