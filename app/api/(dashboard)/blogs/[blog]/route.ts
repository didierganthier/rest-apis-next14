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