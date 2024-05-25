import { Router } from 'https://deno.land/x/oak/mod.ts';
import { ObjectId } from "https://deno.land/x/mongo@v0.8.0/mod.ts";


import { getDb } from '../helpers/db_client.ts';


const router = new Router();

interface Todo {
  id?: string;
  text: string;
}

interface MongoTodo {
  _id: ObjectId;
  text: string;
}

router.get('/todos', async (ctx) => {
  const todos = await getDb().collection('todos');
  const todosArr = await todos.find({ text: { $ne: null } }).toArray();
  
  const transformedTodos = _getTransformedTodosArr(todosArr);
  
  ctx.response.body = { todos: transformedTodos };

  function _getTransformedTodosArr(todosArr: MongoTodo[]) {
    const newTodosArr: Todo[] = [];
    
    for (let i = 0; i < todosArr.length; i++) {
      const todo = todosArr[i];
      
      const todoObj = {
        id: todo._id.toString(),
        text: todo.text
      };

      newTodosArr.push(todoObj);
    }
    
    return newTodosArr;
  }
});

router.post('/todos', async (ctx) => {
  const req = await ctx.request.body.json();
  const text = req.text; 

  const newTodo: Todo = {
    text: text,
  };

  const id = await getDb().collection('todos').insertOne(newTodo);

  newTodo.id = id.toString();

  ctx.response.body = { message: 'Created todo!', todo: newTodo };
});

router.put('/todos/:todoId', async (ctx) => {
  const tid = ctx.params.todoId;
  const data = await ctx.request.body();
  const todoIndex = todos.findIndex((todo) => {
    return todo.id === tid;
  });
  todos[todoIndex] = { id: todos[todoIndex].id, text: data.value.text };
  ctx.response.body = { message: 'Updated todo' };
});

router.delete('/todos/:todoId', (ctx) => {
  const tid = ctx.params.todoId;
  todos = todos.filter((todo) => todo.id !== tid);
  ctx.response.body = { message: 'Deleted todo' };
});

export default router;
