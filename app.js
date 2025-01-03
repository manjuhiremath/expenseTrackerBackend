import express, { json } from 'express';
import cors from 'cors';
const app = express();
import dotenv from "dotenv";
import { sequelize } from './config/database.js';
import helmet from 'helmet';
import compression from 'compression';
// import fs from "fs";
import { fileURLToPath } from 'url';
//Routes
import loginRouter from './routes/userLogin.js';
import expenseRouter from './routes/expense.js'
import orderRoutes from './routes/order.js';
import { Users } from './models/User.js';
import { Expense } from './models/expense.js';
import { Orders } from './models/orders.js';
import { forgotPasswordRequests } from './models/forgotPasswordRequests.js';
import path from 'path';
// import morgan from 'morgan';
// import path from 'path';

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// const logsData = fs.createWriteStream(path.join(__dirname, "access.log"), { flags: 'a' });
app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet());
app.use(compression());
// app.use(morgan('combined',{stream:logsData}))
app.use(express.urlencoded({ extended: true }));
app.use(json());
app.use("/api/premium", orderRoutes);
app.use("/api/expense", expenseRouter);
app.use("/api", loginRouter);
// app.use((req, res) => {
//   res.sendFile(path.join(__dirname, 'public', path.normalize(req.url)));
// });
app.use((req, res) => {
  res.status(404).send('File not found');
});
const start = async () => {
  try {
    app.listen(process.env.PORT, () => {
      console.log(process.env.PORT + " : connected");
    });
  } catch (error) {
    console.log(error);
  }
};
Users.hasMany(Expense, { foreignKey: "UserId" });
Expense.belongsTo(Users, { foreignKey: "UserId" });

Users.hasMany(Orders, { foreignKey: "UserId" });
Orders.belongsTo(Users, { foreignKey: "UserId" });

Users.hasMany(forgotPasswordRequests, { foreignKey: "UserId" });
forgotPasswordRequests.belongsTo(Users, { foreignKey: "UserId" });
// Sync models
sequelize
  .sync({ alter: true }) // use { force: true } only in development; it drops and recreates tables
  .then(() => {
    console.log("Database & tables created!");
  })
  .catch((error) => {
    console.error("Error creating database:", error);
  });

start();