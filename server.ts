import app from "./app.js";
import { connectDB } from "./config/db.js";

const PORT = Number(process.env.PORT) || 3000;

const start = async (): Promise<void> => {
  await connectDB();

  app.listen(PORT, "127.0.0.1", () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

start();
