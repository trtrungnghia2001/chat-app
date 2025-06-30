import mongoose from "mongoose";
import ENV_CONFIG from "./env.config.js";

export async function connectMongoDB() {
  await mongoose
    .connect(ENV_CONFIG.MONGODB_URI, {
      dbName: ENV_CONFIG.MONGODB_DB_NAME,
    })
    .then(function (value) {
      console.log(`Connected to MongoDB:: `, value.connections[0].name);
    })
    .catch(function (error) {
      console.error(`Failed to connect to MongoDB:: `, error);
      process.exit(1);
    });
}
