import { Router } from 'https://deno.land/x/oak/mod.ts';
import { ObjectId } from "https://deno.land/x/mongo@v0.33.0/mod.ts";


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
  const tid = ctx.params.todoId!;
  const req = await ctx.request.body.json();
  const text = req.text;

  const filterObj = {
    _id: new ObjectId(tid)
  };
  
  const updateObj = {
    $set: {
      text: text
    }
  };

  await getDb().collection('todos').updateOne(filterObj, updateObj);

  ctx.response.body = { message: 'Updated todo' };
});

router.delete('/todos/:todoId', async (ctx) => {
  const tid = ctx.params.todoId!;
  
  const filterObj = {
    _id: new ObjectId(tid)
  };
  
  await getDb().collection('todos').deleteOne(filterObj);
  
  ctx.response.body = { message: 'Deleted todo' };
});

export default router;
