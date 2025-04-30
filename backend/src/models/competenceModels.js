import pool from '../config/db.js'

export const createCompetence = async (nom) => {
    try {
        const result = await pool.query('INSERT INTO competance (nom) VALUES ($1) RETURNING *', [nom])
        return result.rows[0]
    } catch (error) {
        throw error
    }
}
export const getCompetences = async () => {
    try {
        const result = await pool.query('SELECT * FROM competance')
        return result
    } catch (error) {
        throw error
    }
}
export const updateCompetence = async (id, nom) => {
    try {
        const result = await pool.query('UPDATE competance SET nom = $1 WHERE idc = $2 RETURNING *', [nom, id])
        return result.rows[0]
    } catch (error) {
        throw error
    }
}
export const deleteCompetence = async (id) => {
    try {
        const result = await pool.query('DELETE FROM competance WHERE idc = $1 RETURNING *', [id])
        return result.rows[0]
    } catch (error) {
        throw error
    }
}