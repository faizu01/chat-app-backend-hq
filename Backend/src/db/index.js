import mongoose from "mongoose";

const connectToDb = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/hirequotient");
    console.log("DB connected Successfully");
  } catch (error) {
    throw error;
  }
};

export default connectToDb;
