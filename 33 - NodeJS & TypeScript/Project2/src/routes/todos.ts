import { Router } from 'express';

import { Todo } from '../models/todo.js'

type RequestBody = {
    text: string
};

type RequestParams = {
    todoId: string
};

let todos: Todo[] = [];

const router = Router();

router.get('/', (req, res, next) => {
    res.status(200).json({ todos: todos });
});

router.post('/todo', (req, res, next) => {
    const body = req.body as RequestBody;
    
    const newTodo: Todo = {
        id: new Date().toISOString(),
        text: body.text
    };

    todos.push(newTodo);

    return res.status(201).json({
        message: 'Added todo.',
        todo: newTodo,
        todos: todos
    });
});

router.put('/todo/:todoId', (req, res, next) => {
    const body = req.body as RequestBody;
    const params = req.params as RequestParams;
    
    const todoId = params.todoId;
    const todoIndex = todos.findIndex(item => item.id === todoId);
    
    if (todoIndex >= 0) {
        todos[todoIndex] = {
            id: todos[todoIndex].id,
            text: body.text
        };

        return res.status(200).json({
            message: 'Updated todo.',
            todos: todos
        });
        
    } else {
        return res.status(404).json({
            message: "Couldn't find a todo with this id."
        });
    }
});

router.delete('/todo/:todoId', (req, res, next) => {
    const params = req.params as RequestParams;
    
    const todoId = params.todoId;
    todos = todos.filter(item => item.id !== todoId);
    
    return res.status(200).json({
        message: 'Deleted todo.',
        todos: todos
    });
});

export default router;