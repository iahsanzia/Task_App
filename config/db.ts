import { Sequelize } from "sequelize";
import path from "node:path";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.resolve(process.cwd(), "dev.sqlite"),
  logging: true,
});

const connectDB = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log("Connected to DB");
  } catch (error) {
    console.error("Unable to connect to the DB", error);
  }
};

export { sequelize, connectDB };
