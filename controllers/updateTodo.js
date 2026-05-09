//import the model
const Todo = require("../models/Todo");

//define route handler

exports.updateTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description } = req.body;

        const todo = await Todo.findByIdAndUpdate(
            { _id: id },
            { title, description, updateAt: Date.now() },
        )

        //send a Json response with a sucess flag
        res.status(200).json(
            {
                success: true,
                data: todo,
                message: `Updated Successfully`,
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