import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import type { Request, Response } from "express";
import type { IUser } from "../models/user.model.js";
import type { Types } from "mongoose";

interface AuthRequest<P={},ResBody={},ReqBody={},ReqQuery={}> extends Request<P, ResBody, ReqBody, ReqQuery> {
  user?: IUser;
}

interface SendMessageBody {
  text?: string;
  image?: string;
}

interface GetMessagesParams {
  id: string;
}

interface SendMessageParams {
  id: string;
}

export const getUsersForSidebar = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthoized" });
      return;
    }

    const loggedInUserId = String(req.user._id);
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    res.status(200).json(filteredUsers);
    return;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error in getUsersForSidebar: ", errorMessage);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (
  req: AuthRequest<GetMessagesParams>,
  res: Response
): Promise<void> => {
  try {

    if(!req.user) {
        res.status(401).json({error: "Unauthorized"});
        return;
    }

    const { id: userToChatId } = req.params;
    const myId = String(req.user._id);

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
    return;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.log("Error in getMessages controller: ", errorMessage);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};

export const sendMessage = async (
  req: AuthRequest<SendMessageParams, {},SendMessageBody>,
  res: Response
): Promise<void> => {
  try {
if (!req.user){
    res.status(401).json({error: "Unauthorized"});
    return;
}

    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = String(req.user._id);

    let imageUrl: string | undefined;
    if (image) {
      // Upload base64 image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url as string;
    }

    const newMessage = new Message({
      senderId: senderId as unknown as Types.ObjectId,
      receiverId: receiverId as unknown as Types.ObjectId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.log("Error in sendMessage controller: ", errorMessage);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};
