const express = require('express');
const bodyParser = require('body-parser');
// const pause = require('pause');
const pause = require('pause');

// import Axios from "axios";

const app = express();
app.use(bodyParser.json()); //and json 
app.use(bodyParser.urlencoded({ extended: false })); //handles form data 

app.use(express.static('./public'));

// function App() {
//   Axios({
//     method: "GET",
//     url:"http://localhost:5000/",
//     headers: {
//       "Content-Type": "application/json"
//     }
//   }).then(res => {
//     console.log(res.data.message);
//   })
// }

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
      error: 'Please provide todo text- you know something is not right',
    });

  };

});

// PUT /api/todos/:id
app.put('/api/todos/:id', (req, res) => {
  console.log('This is req: ' + req.body.todo);
  console.log('This is res: ' + res.body);
  if (!req.body || !req.body.todo) {
    console.log('!!!!!!');
    // console.log(req);
    res.status(400).json({
      error: 'hey, we meet again, Provide todo text',
    });
    return;
  }
  // console.log('received the put request') //we want to update the id with the information they sent 
  // let idToBeModified = req.params.id //now we know what they are trying to modify 
  // let newInfo = req.body //obtains the information from the user
  //id match what we have on the database 
  // let indexOfItem = todoList.findIndex((missions => {
  //   if (missions.id == idToBeModified) {  //find the req.params.id (ids) to see if it matches the database 
  //     console.log(newInfo);
  //     return true;
  //   }
  // }))
  //if find index, it will return -1, if it's -1, return 404, message to user. error status code. 

  //put replaces something there, 
  //patch will modify the object in place 
  let updatedToDoPair = {};
  todoList.forEach((todoPair) => {
    if (todoPair.id === Number.parseInt(req.params.id)) {
      todoPair.todo = req.body.todo;
      updatedToDoPair = todoPair;
    }
  });
  // pause();
  todoList.forEach((todoPair) => {
    console.log('This is updatedTodo ' + todoPair);
  });
  const status = Object.keys(updatedToDoPair).length ? 200 : 404;
  res.status(status).json(updatedToDoPair);

});

// DELETE /api/todos/:id
app.delete('/api/todos/:id', (req, res) => {
  //delete an index and update the array
  //give a if statement to do check if it's in the database 
  // if (!res.body || !req.body.todo) {
  //   res.status(400).json({
  //     error: 'you know something is wrong if you see this message. haha',
  //   });
  // } else { 
  //first identify a name holder "youaregoingtobedeleted", 
  let youAreGoingToBeDeleted = false;
  todoList = todoList.filter((todo) => {
    if (todo.id === Number.parseInt(req.params.id)) {
      youAreGoingToBeDeleted = true;
      return false;
    }
    return true;
    // return youAreGoingToBeDeleted.id === Number.parseInt(req.params.id);    //see if we can return whatever the user entered
  })
  console.log(youAreGoingToBeDeleted);
  console.log("do you see what's above?");
  // const status = found ? 200 : 404;
  // res.status(status).json(todoList);

  // var newArray = array.filter(function(item) {
  //   return condition;
  // });
  //now we got the information 
  //if youAreGoingToBeDeleted is found, then delete it.

  // todoList = todoList.filter((youAreGoingToBeDeleted) => {

  // }


  // pop the array from the index. 

  // app.delete('/api/todos/:id', (req, res) => {
  //   let found = false;
  //   todoList = todoList.filter((todo) => {
  //     if (todo.id === Number.parseInt(req.params.id)) {
  //       found = true;
  //       return false;
  //     }
  //     return true;
  //   });
  const status = youAreGoingToBeDeleted ? 200 : 404;
  res.status(status).json(todoList);
  // });
})

// });

app.listen(3000, function () {
  console.log('Todo List API is now listening on port 3000...');
});
