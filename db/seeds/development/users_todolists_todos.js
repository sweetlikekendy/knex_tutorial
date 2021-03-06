// 1. Load the JSON data from each data file
const usersData = require("../../../data/users");
const todolistsData = require("../../../data/todolists");
const todosData = require("../../../data/todos");

// 2. Create a knex seed (and export it)
exports.seed = function (knex) {
  // Deletes ALL existing entries
  // 3. Delete any existing data in all of the tables
  return (
    knex("todolists")
      .del()
      .then(function () {
        return knex("users").del();
      })
      .then(() => {
        // 4. Seed all of the merchants first because we need the primary key to exist as a foreign key for each product
        return knex("users").insert(usersData);
      })
      // 5. Seed each product
      .then(() => {
        //  - Create an empty array where each promise will go
        let todolistsPromises = [];
        todolistsData.forEach((todolist) => {
          let firstName = todolist.user_first_name;
          todolistsPromises.push(createTodolist(knex, todolist, firstName));
        });
        // 6. Resolve all of the product's promises
        return Promise.all(todolistsPromises);
      })
      .then(() => {
        let todoPromises = [];
        todosData.forEach((todo) => {
          let title = todo.todolist_title;
          todoPromises.push(createTodo(knex, todo, title));
        });
        return Promise.all(todoPromises);
      })
  );
};

const createTodolist = (knex, todolist, firstName) => {
  //  - Find the merchant 'id' for the current product being inserted
  return knex("users")
    .where("first_name", firstName)
    .first()
    .then((userRecord) => {
      //  - Insert the product with the merchant 'id' as the foreign key
      return knex("todolists").insert({
        title: todolist.title,
        created_at: todolist.created_at,
        user_id: userRecord.id,
      });
    })
    .catch((err) => console.error(err));
};

const createTodo = (knex, todo, title) => {
  return knex("todolists")
    .where("title", title)
    .first()
    .then((todolistRecord) => {
      //  - Insert the product with the merchant 'id' as the foreign key
      return knex("todos").insert({
        description: todo.description,
        created_at: todo.created_at,
        todolist_id: todolistRecord.id,
      });
    })
    .catch((err) => console.error(err));
};
