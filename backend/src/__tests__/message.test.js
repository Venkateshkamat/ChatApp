import request from "supertest";
import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import { getUsersForSidebar, getMessages, sendMessage } from "../controllers/message.controller.js";
import { signup } from "../controllers/auth.controller.js";
import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const app = express();
app.use(express.json());
app.use(cookieParser());

// Auth routes
app.post("/api/auth/signup", signup);

// Message routes (all protected)
app.get("/api/message/users", protectRoute, getUsersForSidebar);
app.get("/api/message/:id", protectRoute, getMessages);
app.post("/api/message/send/:id", protectRoute, sendMessage);

const TEST_DB_URI = process.env.TEST_MONGODB_URI;

describe("Message Controller: Integration Tests", () => {
  let user1Cookie;
  let user2Cookie;
  let user1Id;
  let user2Id;

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(TEST_DB_URI);
    }
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clear database
    await User.deleteMany({});
    await Message.deleteMany({});

    // Create two users for testing
    const user1Res = await request(app).post("/api/auth/signup").send({
      fullName: "Alice Smith",
      email: "alice@example.com",
      password: "123456",
    });
    user1Cookie = user1Res.headers["set-cookie"][0];
    user1Id = user1Res.body._id;

    const user2Res = await request(app).post("/api/auth/signup").send({
      fullName: "Bob Jones",
      email: "bob@example.com",
      password: "123456",
    });
    user2Cookie = user2Res.headers["set-cookie"][0];
    user2Id = user2Res.body._id;
  });

  describe("GET /api/message/users", () => {
    it("should return 401 if not authenticated", async () => {
      const res = await request(app).get("/api/message/users");

      expect(res.statusCode).toBe(401);
    });

    it("should return all users except the logged in user", async () => {
      // Create a third user
      await request(app).post("/api/auth/signup").send({
        fullName: "Charlie Brown",
        email: "charlie@example.com",
        password: "123456",
      });

      const res = await request(app)
        .get("/api/message/users")
        .set("Cookie", user1Cookie);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(2); // Bob and Charlie, not Alice
      
      // Should not include password
      res.body.forEach(user => {
        expect(user.password).toBeUndefined();
      });

      // Should not include the logged in user
      const userIds = res.body.map(u => u._id);
      expect(userIds).not.toContain(user1Id);
    });

    it("should return empty array if only one user exists", async () => {
      // Delete user2
      await User.findByIdAndDelete(user2Id);

      const res = await request(app)
        .get("/api/message/users")
        .set("Cookie", user1Cookie);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual([]);
    });
  });

  describe("GET /api/message/:id", () => {
    it("should return 401 if not authenticated", async () => {
      const res = await request(app).get(`/api/message/${user2Id}`);

      expect(res.statusCode).toBe(401);
    });

    it("should return empty array if no messages exist", async () => {
      const res = await request(app)
        .get(`/api/message/${user2Id}`)
        .set("Cookie", user1Cookie);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual([]);
    });

    it("should return messages between two users", async () => {
      // Create some messages
      await Message.create({
        senderId: user1Id,
        receiverId: user2Id,
        text: "Hello from Alice",
      });

      await Message.create({
        senderId: user2Id,
        receiverId: user1Id,
        text: "Hi Alice, this is Bob",
      });

      await Message.create({
        senderId: user1Id,
        receiverId: user2Id,
        text: "How are you?",
      });

      const res = await request(app)
        .get(`/api/message/${user2Id}`)
        .set("Cookie", user1Cookie);

      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(3);
      expect(res.body[0].text).toBe("Hello from Alice");
      expect(res.body[1].text).toBe("Hi Alice, this is Bob");
      expect(res.body[2].text).toBe("How are you?");
    });

    it("should only return messages between the two specific users", async () => {
      // Create a third user
      const user3Res = await request(app).post("/api/auth/signup").send({
        fullName: "Charlie Brown",
        email: "charlie@example.com",
        password: "123456",
      });
      const user3Id = user3Res.body._id;

      // Message between user1 and user2
      await Message.create({
        senderId: user1Id,
        receiverId: user2Id,
        text: "Message for Bob",
      });

      // Message between user1 and user3 (should not be included)
      await Message.create({
        senderId: user1Id,
        receiverId: user3Id,
        text: "Message for Charlie",
      });

      const res = await request(app)
        .get(`/api/message/${user2Id}`)
        .set("Cookie", user1Cookie);

      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].text).toBe("Message for Bob");
    });
  });

  describe("POST /api/message/send/:id", () => {
    it("should return 401 if not authenticated", async () => {
      const res = await request(app)
        .post(`/api/message/send/${user2Id}`)
        .send({ text: "Hello" });

      expect(res.statusCode).toBe(401);
    });

    it("should send a text message successfully", async () => {
      const res = await request(app)
        .post(`/api/message/send/${user2Id}`)
        .set("Cookie", user1Cookie)
        .send({ text: "Hello Bob!" });

      expect(res.statusCode).toBe(201);
      expect(res.body.text).toBe("Hello Bob!");
      expect(res.body.senderId).toBe(user1Id);
      expect(res.body.receiverId).toBe(user2Id);
      expect(res.body.image).toBeUndefined();

      // Verify message was saved in database
      const messageInDb = await Message.findById(res.body._id);
      expect(messageInDb).toBeDefined();
      expect(messageInDb.text).toBe("Hello Bob!");
    });

    it("should send a message with text and image", async () => {
      // Mock base64 image (small test image)
      const base64Image = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

      const res = await request(app)
        .post(`/api/message/send/${user2Id}`)
        .set("Cookie", user1Cookie)
        .send({ 
          text: "Check this out!",
          image: base64Image 
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.text).toBe("Check this out!");
      expect(res.body.image).toBeDefined();
      expect(res.body.image).toContain("http"); // Cloudinary URL
    });

    it("should send a message with only image (no text)", async () => {
      const base64Image = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

      const res = await request(app)
        .post(`/api/message/send/${user2Id}`)
        .set("Cookie", user1Cookie)
        .send({ image: base64Image });

      expect(res.statusCode).toBe(201);
      expect(res.body.image).toBeDefined();
    });

    it("should allow sending empty text with image", async () => {
      const base64Image = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

      const res = await request(app)
        .post(`/api/message/send/${user2Id}`)
        .set("Cookie", user1Cookie)
        .send({ 
          text: "",
          image: base64Image 
        });

      expect(res.statusCode).toBe(201);
    });

    it("should create messages that can be retrieved by both users", async () => {
      // User1 sends message to User2
      await request(app)
        .post(`/api/message/send/${user2Id}`)
        .set("Cookie", user1Cookie)
        .send({ text: "Hello Bob!" });

      // User2 sends message to User1
      await request(app)
        .post(`/api/message/send/${user1Id}`)
        .set("Cookie", user2Cookie)
        .send({ text: "Hi Alice!" });

      // User1 retrieves messages
      const user1Messages = await request(app)
        .get(`/api/message/${user2Id}`)
        .set("Cookie", user1Cookie);

      // User2 retrieves messages
      const user2Messages = await request(app)
        .get(`/api/message/${user1Id}`)
        .set("Cookie", user2Cookie);

      expect(user1Messages.body.length).toBe(2);
      expect(user2Messages.body.length).toBe(2);
    });
  });
});