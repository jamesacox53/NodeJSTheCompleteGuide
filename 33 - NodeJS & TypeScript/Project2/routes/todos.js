"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
let todos = [];
const router = (0, express_1.Router)();
router.get('/', (req, res, next) => {
    res.status(200).json({ todos: todos });
});
router.post('/todo', (req, res, next) => {
    const newTodo = {
        id: new Date().toISOString(),
        text: req.body.text
    };
    todos.push(newTodo);
    return res.status(201).json({
        message: 'Added todo.',
        todo: newTodo,
        todos: todos
    });
});
router.put('/todo/:todoId', (req, res, next) => {
    const todoId = req.params.todoId;
    const todoIndex = todos.findIndex(item => item.id === todoId);
    if (todoIndex >= 0) {
        todos[todoIndex] = {
            id: todos[todoIndex].id,
            text: req.body.text
        };
        return res.status(200).json({
            message: 'Updated todo.',
            todos: todos
        });
    }
    else {
        return res.status(404).json({
            message: "Couldn't find a todo with this id."
        });
    }
});
router.delete('/todo/:todoId', (req, res, next) => {
    const todoId = req.params.todoId;
    todos = todos.filter(item => item.id !== todoId);
    return res.status(200).json({
        message: 'Deleted todo.',
        todos: todos
    });
});
exports.default = router;
