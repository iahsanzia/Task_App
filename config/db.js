import { Sequelize } from "sequelize";
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./dev.sqlite",
  logging: true,
});
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log("Connected to DB");
  } catch (error) {
    console.error("Unable to connect to the DB", error);
  }
};
module.exports = { sequelize, connectDB };
