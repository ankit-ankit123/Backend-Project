const express=require('express');
const mongoose=require('mongoose');
const router=express.Router(); 

router.get('/tour',async(req,res)=>{
    try {
    const collection = mongoose.connection.db.collection("tours");
    const data = await collection.find({}).toArray(); // fetch all docs
    res.json(data);
  } catch (err) {
    console.error("Error fetching data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


router.post("/tour", async (req, res) => {
  try {

    const collection = mongoose.connection.db.collection("tours");

    // Insert data coming from body
    const result = await collection.insertOne(req.body);

    res.status(201).json({
      message: "✅ Data inserted successfully",
      insertedId: result.insertedId,
    });
  } catch (err) {
    console.error("Error inserting data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


router.put("/tour/:id", async (req, res) => {
  try {
    const collection = mongoose.connection.db.collection("tours");
    const id = req.params.id;

    // update the tour by id
  const result = await collection.updateOne(
  { tour_id: parseInt(id) },   
  { $set: req.body }
);
    res.status(200).json({
      message: "✅ Data updated successfully",
      modifiedCount: result.modifiedCount,
    });
    console.log(result);
  } catch (err) {
    console.error("Error in updating data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/tour/:id", async (req, res) => {
  try {
    const collection = mongoose.connection.db.collection("tours");
    const id = req.params.id;

    // Delete the tour by tour_id
    const result = await collection.deleteOne({ tour_id: parseInt(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "❌ Tour not found" });
    }

    res.status(200).json({
      message: "✅ Data deleted successfully",
      deletedCount: result.deletedCount,
    });

    console.log(result);
  } catch (err) {
    console.error("Error in deleting data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});







module.exports=router;