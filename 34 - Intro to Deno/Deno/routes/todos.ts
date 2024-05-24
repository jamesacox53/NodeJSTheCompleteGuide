import { Router } from "jsr:@oak/oak/router";

interface Todo {
    id: string;
    text: string;
};

let todos: Todo[] = [];

const router = new Router();

router.get('/todos', (ctx) => {
    ctx.response.body = { todos: todos };
});

router.post('/todos', async (ctx) => {
    const req = await ctx.request.body.json();
    const text = req.text; 
    
    const newTodo: Todo = {
        id: new Date().toISOString(),
        text: text
    };

    todos.push(newTodo);

    return ctx.response.body = {
        message: 'Added todo.',
        todo: newTodo,
        todos: todos
    };
});

router.put('/todos/:todoId', async (ctx) => {
    const todoId = ctx.params.todoId;
    const todoIndex = todos.findIndex(item => item.id === todoId);
    
    if (todoIndex >= 0) {
        const req = await ctx.request.body.json();
        const text = req.text;

        todos[todoIndex] = {
            id: todos[todoIndex].id,
            text: text
        };

        ctx.response.body = {
            message: 'Updated todo.',
            todos: todos
        };
        
    } else {
        ctx.response.body = {
            message: "Couldn't find a todo with this id."
        };
    }
});

router.delete('/todos/:todoId', (ctx) => {
    const todoId = ctx.params.todoId;
    todos = todos.filter(item => item.id !== todoId);
    
    ctx.response.body = {
        message: 'Deleted todo.',
        todos: todos
    };
});

export default router;