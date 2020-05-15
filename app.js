const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json()); //and json 
app.use(bodyParser.urlencoded({ extended: false })); //handles form data 

app.use(express.static('./public'));

let todoList = [ //good luck with const, change to let
  {
    id: 1,
    todo: 'Implement a REST API',
  },
  {
    id: 2,
    todo: 'Build a frontend',
  },
  {
    id: 3,
    todo: '???',
  },
  {
    id: 4,
    todo: 'Profit!',
  },
];

// GET /api/todos
app.get('/api/todos', (req, res) => {
  res.json(todoList)
})

// GET /api/todos/:id
app.get('/api/todos/:id', (req, res) => { // 'api/todos/:id' ******path for user to locate the information. very important
  const todo =
    todoList.find((todo) => { //returns undefined. 
      return todo.id === Number.parseInt(req.params.id);
    }) || {}; //instead of undefined from the find function on line 37, we are setting it an empty object {}
  const status = Object.keys(todo).length ? 200 : 404; //status codes, error code 404 is used when something is not found. /if found - yes, 200, if not, 404. 
  res.status(status).json(todo);
});

// POST /api/todos
app.post('/api/todos', (req, res, next) => { //get all ids and sort them, find max, add 1 to it.  //no harm of keeping the next here. 
  if (req.body.todo) { //if nothing in the req.body.todo (todo, and text is empty.)
    const maxId = todoList.reduce((max, currentTodo) => {    //reduce(('takes a prev', 'current value') => { }, 0)  *****
      if (currentTodo.id > max) {   //if statement to check the array if in order
        max = currentTodo.id;
      }
      return max; //returns the current new max to the array
    }, 0);

    // console.log(req);
    // res.json(req.body) //the received information, josn, put it on req.body
    const newTodo = {
      id: maxId + 1, // after finding the maxId, add 1 to the maxid,   
      todo: req.body.todo,
    };
    todoList.push(newTodo);
    res.json(newTodo); //respond with the new entered information
  } else {
    // return next('Please provide todo text') // throws an error, please provide todo text.
    res.status(400).json({ //better way to handle error, 420 can be used.
      error: 'Please provide todo text',
    });

  };

});

// PUT /api/todos/:id
// app.put('/api/todo/:id', (req, res) => {
//   //put, update something and update the index in the array
// })

// DELETE /api/todos/:id
// app.Delete('/api/todo/:id', (req, res) => {
//   //delete an index and update the array
// })

app.listen(3000, function () {
  console.log('Todo List API is now listening on port 3000...');
});
