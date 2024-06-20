import connect from "@/lib/db";
import Blog from "@/lib/models/blog";
import User from "@/lib/models/user";
import Category from "@/lib/models/category";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

export const GET = async (req: Request, context: {params: any}) => {
    const blogId = context.params.blog;

    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");
        const categoryId = searchParams.get("categoryId");

        if(!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({ message: "Invalid user ID" }), { status: 400 });
        }

        if(!categoryId || !Types.ObjectId.isValid(categoryId)) {
            return new NextResponse(JSON.stringify({ message: "Invalid category ID" }), { status: 400 });
        }

        if(!blogId || !Types.ObjectId.isValid(blogId)) {
            return new NextResponse(JSON.stringify({ message: "Invalid blog ID" }), { status: 400 });
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

        const blog = await Blog.findOne({
            _id: blogId,
            user: userId,
            category: categoryId,
        });

        if(!blog) {
            return new NextResponse(JSON.stringify({ message: "Blog not found" }), { status: 404 });
        }

        return new NextResponse(JSON.stringify({ blog }), { status: 200 });
        
    } catch (error: any) {
        return new NextResponse("Error fetching blog" + error.message, { status: 500 }); 
    }
}

export const PATCH = async (req: Request, context: {params: any}) => {
    const blogId = context.params.blog;

    try {
        const body = await req.json();
        const { title, description } = body;

        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        if(!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({ message: "Invalid user ID" }), { status: 400 });
        }


        if(!blogId || !Types.ObjectId.isValid(blogId)) {
            return new NextResponse(JSON.stringify({ message: "Invalid blog ID" }), { status: 400 });
        }

        await connect();

        const user = await User.findById(userId);

        if(!user) {
            return new NextResponse(JSON.stringify({ message: "User not found" }), { status: 404 });
        }


        const blog = await Blog.findOne(
            { _id: blogId, user: userId }
        )

        if(!blog) {
            return new NextResponse(JSON.stringify({ message: "Blog not found" }), { status: 404 });
        }

        const updatedBlog = await Blog.findByIdAndUpdate(
            blogId,
            { title, description },
            { new: true }
    );

        return new NextResponse(JSON.stringify({ message: "Blog is updated", blog: updatedBlog }), { status: 200 });
    } catch (error: any) {
        return new NextResponse("Error updating blog" + error.message, { status: 500 });
    }
}

export const DELETE = async (req: Request, context: {params: any}) => {
    const blogId = context.params.blog;

    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        if(!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({ message: "Invalid user ID" }), { status: 400 });
        }

        if(!blogId || !Types.ObjectId.isValid(blogId)) {
            return new NextResponse(JSON.stringify({ message: "Invalid blog ID" }), { status: 400 });
        }

        await connect();

        const user = await User.findById(userId);
        if(!user) {
            return new NextResponse(JSON.stringify({ message: "User not found" }), { status: 404 });
        }

        const blog = await Blog.findOne({ _id: blogId, user: userId });
        if(!blog) {
            return new NextResponse(JSON.stringify({ message: "Blog not found" }), { status: 404 });
        }

        const deletedBlog = await Blog.findByIdAndDelete(
            blogId
        );

        if(!deletedBlog) {
            return new NextResponse(JSON.stringify({ message: "Blog not found" }), { status: 404 });
        }

        return new NextResponse(JSON.stringify({ message: "Blog is deleted", blog: deletedBlog }), { status: 200 });
    } catch (error: any) {
        return new NextResponse("Error deleting blog" + error.message, { status: 500 });
    }
}