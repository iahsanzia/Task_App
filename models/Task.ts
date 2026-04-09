import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.js";

class Task extends Model {
  declare id: number;
  declare title: string;
  declare completed: boolean;
  declare note: string | null;
}

Task.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      unique: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    completed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
    },
  },
  { sequelize, timestamps: true, modelName: "Task", tableName: "tasks" },
);

export default Task;
