import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";


export const forgotPasswordRequests = sequelize.define('forgetpassword', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    isActive:{
       type: DataTypes.BOOLEAN, 
    }
});

sequelize.sync();
