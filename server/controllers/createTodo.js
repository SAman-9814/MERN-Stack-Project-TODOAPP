//import the model
const Todo = require("../models/Todo");

//define route handler

exports.createTodo = async (req, res) => {
    try {
        //extract title, description, completed, priority, dueDate, and tags from request body
        const { title, description, completed, priority, dueDate, tags } = req.body;

        //create a new Todo Obj and insert in DB
        const response = await Todo.create({ title, description, completed, priority, dueDate, tags });

        //send a Json response with a sucess flag
        res.status(200).json(
            {
                success: true,
                data: response,
                message: "Entry Created Successfully"

            }
        )
    }
    catch (err) {
        console.error(err);
        console.log(err);
        res.status(500).json(
            {
                success: false,
                data: "Internal server error",
                message: err.message,
            })
    }
}