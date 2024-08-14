import mongoose from "mongoose";

const connectToDB = async () => {
  try {
    const connection_string = await mongoose.connect(process.env.MONGODB_URI);
    if (connection_string) {
      console.log("connected to mongodb");
    }
  } catch (error) {
    console.log(`Error while connecting to DB: ${error}`);
  }
};

export default connectToDB;
