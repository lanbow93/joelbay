import sequelize from "../config/database.js";
import { DataTypes } from "sequelize";

const Listing = sequelize.define(
  "Listing",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(500),
      defaultValue: "No Description",
    },
    imageUrls: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 50.0,
    },
    discount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    quantityAvailable: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    brand: {
      type: DataTypes.STRING(100),
      defaultValue: "UNKNOWN",
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    condition: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  },
  { timestamps: true },
);

export default Listing;
