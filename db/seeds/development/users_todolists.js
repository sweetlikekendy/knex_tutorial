// 1. Load the JSON data from each data file
const usersData = require("../../../data/users");
const todolistsData = require("../../../data/todolists");

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
