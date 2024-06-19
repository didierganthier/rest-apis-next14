import connect from "@/lib/db";
import Blog from "@/lib/models/blog";
import User from "@/lib/models/user";
import Category from "@/lib/models/category";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");
        const categoryId = searchParams.get("categoryId");
    
        if(!userId) {
          return new NextResponse("Missing required fields", { status: 400 });
        }

        if(!Types.ObjectId.isValid(userId)) {
          return new NextResponse("Invalid user ID", { status: 400 });
        }

        if(!categoryId || !Types.ObjectId.isValid(categoryId)) {
            return new NextResponse("Invalid category ID", { status: 400 });
        }

        await connect();

        const user = await User.findById(userId);
        if(!user) {
            return new NextResponse("User not found", { status: 404 });
        }

        const category = await Category.findById(categoryId);
        if(!category) {
            return new NextResponse("Category not found", { status: 404 });
        }

        const filters:any = { 
            user: new Types.ObjectId(userId),
            category: new Types.ObjectId(categoryId),
        };

        const blogs = await Blog.find(filters);
        return new NextResponse(JSON.stringify({ blogs }), { status: 200 });
    } catch (error: any) {
        return new NextResponse("Error fetching blogs" + error.message, { status: 500 }); 
    }
}

export const POST = async (req: Request) => {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");
        const categoryId = searchParams.get("categoryId");

        const body = await req.json();

        const { title, description } = body;

        if(!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({ message: "Invalid user ID" }), { status: 400 });
        }

        if(!categoryId || !Types.ObjectId.isValid(categoryId)) {
            return new NextResponse(JSON.stringify({ message: "Invalid category ID" }), { status: 400 });
        }

        await connect();

        const user = await User.findById(userId);
        if(!user) {
            return new NextResponse(JSON.stringify({ message: "User not found" }), { status: 404 });
        }

        const category = await Category.findById(categoryId);
        if(!category) {
            return new NextResponse(JSON.stringify({ message: "Category not found" }), { status: 404 });
        }

        const newBlog = new Blog({
            title,
            description,
            user: new Types.ObjectId(userId),
            category: new Types.ObjectId(categoryId),
        });

        await newBlog.save();

        return new NextResponse(JSON.stringify({ message: "Blog is created", blog: newBlog }), { status: 200 });
    } catch (error: any) {
        return new NextResponse("Error creating blog" + error.message, { status: 500 });
    }
}