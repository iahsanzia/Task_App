import app from "./app.js";
import { connectDB } from "./config/db.js";

const PORT = 3000;

const start = async (): Promise<void> => {
  await connectDB();

  app.listen(PORT, () => {
    console.log("Server is running");
  });
};

start();
