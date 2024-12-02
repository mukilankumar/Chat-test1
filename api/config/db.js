const mongoose = require("mongoose");
const PATH = "mongodb+srv://hr1qsis:62X7OOFWB0jLVs3J@qsis.ndk49xu.mongodb.net/?retryWrites=true&w=majority";

const connectMongoDB = async () => {
  try {
    await mongoose.connect(PATH);
    console.log("connect mongodb");
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectMongoDB;
