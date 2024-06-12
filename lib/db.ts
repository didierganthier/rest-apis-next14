import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/test";

const connect = async () => {
    const connectionState = mongoose.connection.readyState;

    if (connectionState === 1) {
        console.log("Already connected to MongoDB");
        return;
    }

    if (connectionState === 2) {
        console.log("Connecting")
        return;
    }

    try {
        await mongoose.connect(MONGODB_URI, {
            dbName: "next14restapi",
            bufferCommands: true,
        });
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB", error);
    }
}

export default connect;