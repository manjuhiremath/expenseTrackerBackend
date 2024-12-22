import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import { Expense } from "./expense.js";  // Import the Expense model to set up associations
import { Orders } from "./orders.js";

export const Users = sequelize.define(
  "Users",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      // unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isPremium: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    totalamount: {
      type: DataTypes.INTEGER,

    }

  }
);


sequelize.sync();
