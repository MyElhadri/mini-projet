import * as personneModels from '../models/personneModels.js';

export const getPersonne = async (req, res) => {
  try {
    const personne = await personneModels.getAll();
    res.json(personne);
  } catch (err) {
    next(err);
  }
};

export const createPersonne = async (req, res) => {
  try {
    const { nom } = req.body;
    if (!nom ) {
      return res.status(400).json({ message: 'Name is required' });
    }
    const newPerson = await personneModels.create( nom); 
    res.status(201).json({message: "Person added successfully",personne: newPerson});
  } catch (err) {
    next(err);
  }
};

export const updatePersonne = async (req, res) => {
  try {
    const { nom} = req.body;
    if (!nom ) {
      return res.status(400).json({ message: 'Name is required' });
    }
    const updatedPerson = await personneModels.update(req.params.id, {nom });
    if (!updatedPerson) {
      return res.status(404).json({ message: 'Person not found' });
    }
    res.json({message: "Person updated successfully",personne :updatedPerson});
  } catch (err) {
    next(err);
  }
};

export const deletePersonne = async (req, res) => {
  try {
    await personneModels.deletePersonne(req.params.id);
    res.status(200).end();
  } catch (err) {
    next(err);
  }
};