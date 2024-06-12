import connect from "@/lib/db";
import User from "@/lib/models/user";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

const ObjectId = require("mongoose").Types.ObjectId;

export const GET = async () => {
  try {
    await connect();
    const users = await User.find();
    return new NextResponse(JSON.stringify(users), { status: 200 });
  } catch (error: any) {
    return new NextResponse("Error fetching users" + error.message, { status: 500 });
  }
}

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    await connect();
    const newUser = new User(body);
    await newUser.save();
    return new NextResponse(JSON.stringify({ message: "User is created", user: newUser}), { status: 200 });
  } catch (error: any) {
    return new NextResponse("Error creating user" + error.message, { status: 500 });
  }
}

export const PATCH = async (req: Request) => {
  try {
    const body = await req.json();
    const { userId, newUsername } = body;

    await connect();
    if(!userId || !newUsername) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    if(!Types.ObjectId.isValid(userId)) {
      return new NextResponse("Invalid user ID", { status: 400 });
    }

    const user = await User.findOneAndUpdate(
      { _id: new ObjectId(userId) }, 
      { username: newUsername }, 
      { new: true },
    );

    if(!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    return new NextResponse(JSON.stringify({ message: "User is updated", user }), { status: 200 });

  } catch (error: any) {
    return new NextResponse("Error updating user" + error.message, { status: 500 });
  }
}