import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
// import  {Users}  from "./User.js";


export const Orders = sequelize.define('order', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    paymentid:DataTypes.STRING,
    orderid:DataTypes.STRING,
    status:DataTypes.STRING
});
sequelize.sync();




