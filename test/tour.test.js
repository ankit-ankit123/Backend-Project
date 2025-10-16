const request = require("supertest");
const app = require("../index");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

beforeEach(async () => {
  try {
    await mongoose.connection.db.dropCollection("tours");
  } catch (err) {
    // Ignore error if collection does not exist yet
    if (err.codeName !== "NamespaceNotFound") {
      throw err;
    }
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("📦 Tour API", () => {
  const tourData = {
    tour_id: 1,
    name: "Shimla Trip",
    location: "Shimla",
    price: 2500,
  };

  it("should insert a new tour", async () => {
    const res = await request(app).post("/api/tour").send(tourData);
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("✅ Data inserted successfully");
    expect(res.body).toHaveProperty("insertedId");
  });

  it("should fetch all tours", async () => {
    await mongoose.connection.db.collection("tours").insertOne(tourData);

    const res = await request(app).get("/api/tour");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  it("should update a tour", async () => {
    await mongoose.connection.db.collection("tours").insertOne(tourData);

    const res = await request(app).put("/api/tour/1").send({ price: 3000 });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("✅ Data updated successfully");
    expect(res.body.modifiedCount).toBe(1);
  });

  it("should delete a tour", async () => {
    await mongoose.connection.db.collection("tours").insertOne(tourData);

    const res = await request(app).delete("/api/tour/1");

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("✅ Data deleted successfully");
    expect(res.body.deletedCount).toBe(1);
  });

  it("should return 404 if deleting non-existent tour", async () => {
    const res = await request(app).delete("/api/tour/999");

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("❌ Tour not found");
  });

  it("should return 400 if tour_id not sent in POST", async () => {
    const res = await request(app).post("/api/tour").send({ name: "No ID Tour" });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("tour_id is required for insert");
  });
});
