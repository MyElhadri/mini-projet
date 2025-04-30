import pool from '../config/db.js';

export const getAll = async () => {
  const result = await pool.query('SELECT * FROM personne');
  return result.rows;
};


export const create = async ( nom) => {
  const result = await pool.query(
    'INSERT INTO personne (nom) VALUES ($1) RETURNING *',
    [nom]
  );
  return result.rows[0];
};

export const update = async (id, nom) => {
  const result = await pool.query(
    'UPDATE personne SET nom = $1 WHERE idp = $2 RETURNING *',
    [nom, id]
  );
  return result.rows[0];
};

export const deletePersonne = async (id) => {
  await pool.query('DELETE FROM personne WHERE idp = $1', [id]);
  return result.rows[0];
};