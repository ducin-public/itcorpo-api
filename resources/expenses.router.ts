import { Router, Request, Response } from 'express';

import { Expense, ErrorResponse } from '../contract-types/data-contracts';
import { Expenses } from '../contract-types/ExpensesRoute';
import { dbConnection } from '../lib/db/db-connection';

const router = Router();

// GET /expenses/count
router.get('/count', async (
    _req: Request<
        Expenses.GetExpensesCount.RequestParams,
        Expenses.GetExpensesCount.ResponseBody,
        Expenses.GetExpensesCount.RequestBody,
        Expenses.GetExpensesCount.RequestQuery
    >,
    res: Response<Expenses.GetExpensesCount.ResponseBody | ErrorResponse>
) => {
    try {
        const expenses = await dbConnection.expenses.findMany();
        res.json(expenses.length);
    } catch (error) {
        res.status(500).json({ message: `Failed to count expenses: ${error}` });
    }
});

// GET /expenses
router.get('/', async (
    _req: Request<
        Expenses.GetExpenses.RequestParams,
        Expenses.GetExpenses.ResponseBody,
        Expenses.GetExpenses.RequestBody,
        Expenses.GetExpenses.RequestQuery
    >,
    res: Response<Expenses.GetExpenses.ResponseBody | ErrorResponse>
) => {
    try {
        const expenses = await dbConnection.expenses.findMany();
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ message: `Failed to fetch expenses: ${error}` });
    }
});

// GET /expenses/:expenseId
router.get('/:expenseId', async (
    req: Request<
        Expenses.GetExpenseById.RequestParams,
        Expenses.GetExpenseById.ResponseBody,
        Expenses.GetExpenseById.RequestBody,
        Expenses.GetExpenseById.RequestQuery
    >,
    res: Response<Expenses.GetExpenseById.ResponseBody | ErrorResponse>
) => {
    try {
        const expense = await dbConnection.expenses.findOne(e => e.id === req.params.expenseId);
        
        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }
        
        res.json(expense);
    } catch (error) {
        res.status(500).json({ message: `Failed to fetch expense: ${error}` });
    }
});

// POST /expenses
router.post('/', async (
    req: Request<
        Expenses.CreateExpense.RequestParams,
        Expenses.CreateExpense.ResponseBody,
        Expenses.CreateExpense.RequestBody,
        Expenses.CreateExpense.RequestQuery
    >,
    res: Response<Expenses.CreateExpense.ResponseBody | ErrorResponse>
) => {
    try {
        const newExpense = {
            ...req.body,
            id: Math.random().toString(36).substr(2, 9)
        };
        
        await dbConnection.expenses.insertOne(newExpense);
        await dbConnection.expenses.flush();
        
        res.status(201).json(newExpense);
    } catch (error) {
        res.status(500).json({ message: `Failed to create expense: ${error}` });
    }
});

// PUT /expenses/:expenseId
router.put('/:expenseId', async (
    req: Request<
        Expenses.UpdateExpense.RequestParams,
        Expenses.UpdateExpense.ResponseBody,
        Expenses.UpdateExpense.RequestBody,
        Expenses.UpdateExpense.RequestQuery
    >,
    res: Response<Expenses.UpdateExpense.ResponseBody | ErrorResponse>
) => {
    try {
        const expenseToUpdate = await dbConnection.expenses.findOne(e => e.id === req.params.expenseId);
        
        if (!expenseToUpdate) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        const updatedExpense: Expense = {
            ...expenseToUpdate,
            ...req.body,
            id: req.params.expenseId
        };

        await dbConnection.expenses.replaceOne(e => e.id === req.params.expenseId, updatedExpense);
        await dbConnection.expenses.flush();
        
        res.json(updatedExpense);
    } catch (error) {
        res.status(500).json({ message: `Failed to update expense: ${error}` });
    }
});

// DELETE /expenses/:expenseId
router.delete('/:expenseId', async (
    req: Request<
        Expenses.DeleteExpense.RequestParams,
        Expenses.DeleteExpense.ResponseBody,
        Expenses.DeleteExpense.RequestBody,
        Expenses.DeleteExpense.RequestQuery
    >,
    res: Response<Expenses.DeleteExpense.ResponseBody | ErrorResponse>
) => {
    try {
        const expenseToDelete = await dbConnection.expenses.findOne(e => e.id === req.params.expenseId);
        
        if (!expenseToDelete) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        await dbConnection.expenses.deleteOne(e => e.id === req.params.expenseId);
        await dbConnection.expenses.flush();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: `Failed to delete expense: ${error}` });
    }
});

export const expensesRouter = router;
