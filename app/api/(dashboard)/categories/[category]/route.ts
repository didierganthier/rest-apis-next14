import connect from "@/lib/db";
import User from "@/lib/models/user";
import Category from "@/lib/models/category";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

export const PATCH = async (req: Request, context: {params: any}) => {
    const categoryId = context.params.category;
    try {
        const body = await req.json();
        const { title } = body;

        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");


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

        const category = await Category.findOne(
            { _id: categoryId, user: userId }
        )

        if(!category) {
            return new NextResponse(JSON.stringify({ message: "Category not found" }), { status: 404 });
        }

        const updatedCategory = await Category.findOneAndUpdate(
            { _id: categoryId, user: userId },
            { title },
            { new: true }
        );

        return new NextResponse(JSON.stringify({ message: "Category is updated", category: updatedCategory }), { status: 200 });
    } catch (error: any) {
        return new NextResponse("Error updating category" + error.message, { status: 500 });
    }
}

    export const DELETE = async (req: Request, context: {params: any}) => {
        const categoryId = context.params.category;
        try {
            const { searchParams } = new URL(req.url);
            const userId = searchParams.get("userId");
        
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
        
            const category = await Category.findOne(
                { _id: categoryId, user: userId }
            )
        
            if(!category) {
                return new NextResponse(JSON.stringify({ message: "Category not found" }), { status: 404 });
            }
        
            const deletedCategory = await Category.findOneAndDelete(
                { _id: categoryId, user: userId }
            );
        
            return new NextResponse(JSON.stringify({ message: "Category is deleted", category: deletedCategory }), { status: 200 });
        } catch (error: any) {
            return new NextResponse("Error deleting category" + error.message, { status: 500 });
        }
    }