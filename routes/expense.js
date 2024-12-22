
import express from "express";
import { createExpense, deleteExpense, downloadUserExpense, getUserExpense, getUserExpensePagination } from "../controllers/expenseControllers.js";
import { authenticateUser } from "../middleware/auth.js";

const router = express.Router();

router.post('/',authenticateUser ,createExpense);
router.get('/',authenticateUser,getUserExpensePagination);
router.delete('/:id',authenticateUser,deleteExpense);
router.get('/download',authenticateUser,downloadUserExpense);
export default router;