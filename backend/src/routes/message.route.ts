import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getMessages,
  getUsersForSidebar,
  sendMessage,
} from "../controllers/message.controller.js";

import { validate } from "../middleware/validate.middleware.js";
import {
  sendMessageSchema,
  getMessagesSchema,
} from "../schemas/message.schema.js";

const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar);
router.get(
  "/:id",
  protectRoute,
  validate(getMessagesSchema),
  getMessages as any
);
router.post(
  "/send/:id",
  protectRoute,
  validate(sendMessageSchema),
  sendMessage as any
);

export default router;
