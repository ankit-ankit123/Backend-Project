const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Tours
 *   description: Tour management API using native MongoDB
 */

/**
 * @swagger
 * /tour:
 *   get:
 *     summary: Get all tours
 *     tags: [Tours]
 *     responses:
 *       200:
 *         description: List of all tours from database
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: MongoDB Object ID
 *                     example: "68dd62cc3e9957cb7912905f"
 *                   tour_id:
 *                     type: integer
 *                     example: 12345
 *                   name:
 *                     type: string
 *                     example: "Test Tour"
 *                   description:
 *                     type: string
 *                     example: "Test description"
 */
router.get('/tour', async (req, res) => {
  try {
    const collection = mongoose.connection.db.collection('tours');
    const tours = await collection.find({}).toArray();
    res.json(tours);
  } catch (err) {
    console.error('Error fetching tours:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * @swagger
 * /tour:
 *   post:
 *     summary: Add a new tour
 *     tags: [Tours]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tour_id:
 *                 type: integer
 *                 example: 12346
 *               name:
 *                 type: string
 *                 example: "New Tour"
 *               description:
 *                 type: string
 *                 example: "Description of new tour"
 *     responses:
 *       201:
 *         description: Tour added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "✅ Data inserted successfully"
 *                 insertedId:
 *                   type: string
 *                   example: "618c1f1a5b3c4a3d5e123456"
 */
router.post('/tour', async (req, res) => {
  try {
    const collection = mongoose.connection.db.collection('tours');
    const result = await collection.insertOne(req.body);
    res.status(201).json({
      message: '✅ Data inserted successfully',
      insertedId: result.insertedId,
    });
  } catch (err) {
    console.error('Error inserting tour:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * @swagger
 * /tour/{id}:
 *   put:
 *     summary: Update a tour by tour_id
 *     tags: [Tours]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric tour_id to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated Tour Name"
 *               description:
 *                 type: string
 *                 example: "Updated description"
 *     responses:
 *       200:
 *         description: Tour updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "✅ Data updated successfully"
 *                 modifiedCount:
 *                   type: integer
 *                   example: 1
 */
router.put('/tour/:id', async (req, res) => {
  try {
    const collection = mongoose.connection.db.collection('tours');
    const id = parseInt(req.params.id);

    const result = await collection.updateOne(
      { tour_id: id },
      { $set: req.body }
    );

    res.status(200).json({
      message: '✅ Data updated successfully',
      modifiedCount: result.modifiedCount,
    });
  } catch (err) {
    console.error('Error updating tour:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * @swagger
 * /tour/{id}:
 *   delete:
 *     summary: Delete a tour by tour_id
 *     tags: [Tours]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric tour_id to delete
 *     responses:
 *       200:
 *         description: Tour deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "✅ Data deleted successfully"
 *                 deletedCount:
 *                   type: integer
 *                   example: 1
 *       404:
 *         description: Tour not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "❌ Tour not found"
 */
router.delete('/tour/:id', async (req, res) => {
  try {
    const collection = mongoose.connection.db.collection('tours');
    const id = parseInt(req.params.id);

    const result = await collection.deleteOne({ tour_id: id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: '❌ Tour not found' });
    }

    res.status(200).json({
      message: '✅ Data deleted successfully',
      deletedCount: result.deletedCount,
    });
  } catch (err) {
    console.error('Error deleting tour:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
