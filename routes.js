// routes.js
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Tour schema
const tourSchema = new mongoose.Schema({
  tour_id: Number,
  name: String,
  location: String,
  price: Number,
});

//  Prevent OverwriteModelError
const Tour = mongoose.models.Tour || mongoose.model("Tour", tourSchema);

/**
 * @swagger
 * components:
 *   schemas:
 *     Tour:
 *       type: object
 *       required:
 *         - tour_id
 *         - name
 *         - location
 *         - price
 *       properties:
 *         tour_id:
 *           type: integer
 *           description: Unique tour ID
 *         name:
 *           type: string
 *           description: Name of the tour
 *         location:
 *           type: string
 *           description: Location of the tour
 *         price:
 *           type: number
 *           description: Price of the tour
 *       example:
 *         tour_id: 1
 *         name: Shimla Trip
 *         location: Shimla
 *         price: 2500
 */

/**
 * @swagger
 * tags:
 *   name: Tours
 *   description: Tour management API
 */

/**
 * @swagger
 * /tours:
 *   get:
 *     summary: Get all tours
 *     tags: [Tours]
 *     responses:
 *       200:
 *         description: A list of all tours
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Tour'
 */
router.get("/tours", async (req, res) => {
  const tours = await Tour.find();
  res.json(tours);
});

/**
 * @swagger
 * /tour:
 *   post:
 *     summary: Create a new tour
 *     tags: [Tours]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Tour'
 *     responses:
 *       201:
 *         description: Tour created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.post("/tour", async (req, res) => {
  const tour = new Tour(req.body);
  await tour.save();
  res.status(201).json({ message: "Tour created successfully" });
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
 *         description: Numeric ID of the tour to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Tour'
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
 *                 modifiedCount:
 *                   type: integer
 */
router.put("/tour/:id", async (req, res) => {
  const { id } = req.params;
  const result = await Tour.updateOne({ tour_id: parseInt(id) }, { $set: req.body });
  res.status(200).json({
    message: "Tour updated successfully",
    modifiedCount: result.modifiedCount,
  });
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
 *         description: Numeric ID of the tour to delete
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
 *                 deletedCount:
 *                   type: integer
 *       404:
 *         description: Tour not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.delete("/tour/:id", async (req, res) => {
  const { id } = req.params;
  const result = await Tour.deleteOne({ tour_id: parseInt(id) });

  if (result.deletedCount === 0) {
    return res.status(404).json({ message: " Tour not found" });
  }

  res.status(200).json({
    message: " Tour deleted successfully",
    deletedCount: result.deletedCount,
  });
});

module.exports = router;
