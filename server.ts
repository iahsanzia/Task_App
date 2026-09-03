import app from "./app.js";
import { connectDB } from "./config/db.js";

const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST ?? "127.0.0.1";

const start = async (): Promise<void> => {
  await connectDB();

  app.listen(PORT, HOST, () => {
    console.log(`Server is running at ${HOST}:${PORT}`);
  });
};

start();
