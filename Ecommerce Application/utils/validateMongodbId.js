import mongoose from "mongoose";

const validateMongoDbId = (id) => {
  console.log("🚀 ~ validateMongoDbId ~ id:", id);
  const isValid = mongoose.Types.ObjectId.isValid(id);
  console.log("🚀 ~ validateMongoDbId ~ isValid:", isValid);
  if (!isValid) {
    throw new Error("This id is not valid or not found");
  }
};

export default validateMongoDbId;
