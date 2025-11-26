import request from "supertest";
import express from "express";
import mongoose from "mongoose";
import { signup, login, logout, checkAuth } from "../controllers/auth.controller.js";
import User from "../models/user.model.js";
import cookieParser from "cookie-parser";
import { protectRoute } from "../middleware/auth.middleware.js"; // Adjust path as needed

const app = express();
app.use(express.json());
app.use(cookieParser());
app.post("/api/auth/signup", signup);
app.post("/api/auth/login", login);
app.post("/api/auth/logout", logout);
app.get("/api/auth/check", protectRoute, checkAuth);

// Test database connection
const TEST_DB_URI = process.env.TEST_MONGODB_URI;


describe("Auth Controller: Integration Tests", () => {
  beforeAll(async () => {
    // Connect to test database
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(TEST_DB_URI);
    }
  });

  afterAll(async () => {
    // Clean up and disconnect
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clear users collection before each test
    await User.deleteMany({});
  });

  describe("POST /api/auth/signup", () => {
    it("should return 400 if fields are missing", async () => {
      const res = await request(app).post("/api/auth/signup").send({});
      
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("All fields are required");
    });

    it("should return 400 if only some fields are provided", async () => {
      const res = await request(app).post("/api/auth/signup").send({
        email: "john@example.com",
        password: "123456"
      });
      
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("All fields are required");
    });

    it("should return 400 if password is too short", async () => {
      const res = await request(app).post("/api/auth/signup").send({
        fullName: "John Doe",
        email: "john@example.com",
        password: "123",
      });
      
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("Password must be atleast 6 characters");
    });

    it("should return 400 if user already exists", async () => {
      // Create a user first
      await request(app).post("/api/auth/signup").send({
        fullName: "John Doe",
        email: "john@example.com",
        password: "123456",
      });

      // Try to create the same user again
      const res = await request(app).post("/api/auth/signup").send({
        fullName: "John Doe",
        email: "john@example.com",
        password: "123456",
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("Email already exists");
    });

    it("should create a new user and return 201", async () => {
      const res = await request(app).post("/api/auth/signup").send({
        fullName: "John Doe",
        email: "john@example.com",
        password: "123456",
      });

      expect(res.statusCode).toBe(201);
      expect(res.body.email).toBe("john@example.com");
      expect(res.body.fullName).toBe("John Doe");
      expect(res.body._id).toBeDefined();
      expect(res.body.password).toBeUndefined();
      expect(res.body.profilePic).toBeDefined();
    });

    it("should hash the password before saving", async () => {
      const plainPassword = "123456";
      
      await request(app).post("/api/auth/signup").send({
        fullName: "Jane Doe",
        email: "jane@example.com",
        password: plainPassword,
      });

      const user = await User.findOne({ email: "jane@example.com" });
      
      expect(user.password).not.toBe(plainPassword);
      expect(user.password.length).toBeGreaterThan(20);
    });

    it("should set a JWT cookie on successful signup", async () => {
      const res = await request(app).post("/api/auth/signup").send({
        fullName: "John Doe",
        email: "john@example.com",
        password: "123456",
      });

      expect(res.headers["set-cookie"]).toBeDefined();
      const cookie = res.headers["set-cookie"][0];
      expect(cookie).toContain("jwt=");
    });
  });

  describe("POST /api/auth/login", () => {
    beforeEach(async () => {
      // Create a user for login tests
      await request(app).post("/api/auth/signup").send({
        fullName: "John Doe",
        email: "john@example.com",
        password: "123456",
      });
    });

    it("should return 400 if user does not exist", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "nonexistent@example.com",
        password: "123456",
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("Invalid credentials");
    });

    it("should return 400 if password is incorrect", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "john@example.com",
        password: "wrongpassword",
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("Invalid credentials");
    });

    it("should login successfully with correct credentials", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "john@example.com",
        password: "123456",
      });

      expect(res.statusCode).toBe(200);
      expect(res.body.email).toBe("john@example.com");
      expect(res.body.fullName).toBe("John Doe");
      expect(res.body._id).toBeDefined();
      expect(res.body.password).toBeUndefined();
    });

    it("should set a JWT cookie on successful login", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "john@example.com",
        password: "123456",
      });

      expect(res.headers["set-cookie"]).toBeDefined();
      const cookie = res.headers["set-cookie"][0];
      expect(cookie).toContain("jwt=");
    });
  });

  describe("POST /api/auth/logout", () => {
    it("should clear the JWT cookie", async () => {
      const res = await request(app).post("/api/auth/logout").send({});

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Logged out succesfully");
      
      const cookie = res.headers["set-cookie"][0];
      expect(cookie).toContain("jwt=;");
      expect(cookie).toContain("Max-Age=0");
    });
  });

  describe("GET /api/auth/check", () => {
    it("should return user data if authenticated", async () => {
      // Signup to get a cookie
      const signupRes = await request(app).post("/api/auth/signup").send({
        fullName: "John Doe",
        email: "john@example.com",
        password: "123456",
      });

      const cookie = signupRes.headers["set-cookie"][0];

      // Use the cookie to access protected route
      const res = await request(app)
        .get("/api/auth/check")
        .set("Cookie", cookie);

      expect(res.statusCode).toBe(200);
      expect(res.body.email).toBe("john@example.com");
      expect(res.body.fullName).toBe("John Doe");
    });

    it("should return 401 if not authenticated", async () => {
      const res = await request(app).get("/api/auth/check");

      expect(res.statusCode).toBe(401);
    });
  });
});