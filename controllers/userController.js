const User = require("../models/user");
const Joi = require("joi");
const { use } = require("../routes/userRoutes");
const { Op } = require("sequelize");

// Schema for request validation
const userSchema = Joi.object({
    firstName: Joi.string().min(2).required(),
    lastName: Joi.string().min(2).required(),
    email: Joi.string().email().required()
});

// Create a new user
const createUser = async (req, res) => {
    try {
        // validate request data 
        const { error } = userSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const { firstName, lastName, email } = req.body;
        const newUser = await User.create({ firstName, lastName, email });
        return res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ message: `Error creating user ${error}` });
    }
};

// Like Query
const findUsersByEmailDomain = async (req, res) => {
    try {
        const users = await User.findAll({
            where: {
                email: {
                    [Op.like]: '%@yahoo.com'
                }
            }
        });

        res.status(200).json(users);
    } catch (error) {
        console.error('Error', error);

    }
}

// Get users 
const getUsers = async (req, res) => {
    try {
        // Get page and pageSize from query parameters, default to 1 and 10 if not provided
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;

        const offset = (page - 1) * pageSize;
        const limit = pageSize;

        const results = await User.findAndCountAll({
            offset: offset,
            limit: limit
        });

        const totalUsers = results.count;
        const totalPages = Math.ceil(totalUsers / pageSize);

        res.status(201).json({
            data: results.rows.map(user => user.toJSON()),
            currentPage: page,
            totalPages: totalPages,
            pageSize: pageSize,
            totalUsers: totalUsers
        });
    } catch (error) {
        res.status(500).json({ message: `Error fetching user ${error}` });
    }
}

// Get a single user by ID
const getUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: `Error creating user ${error}` });
    }
}

// Update a user
const updateUser = async (req, res) => {
    try {
        const { error } = userSchema.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        const { firstName, lastName, email } = req.body;

        const user = await User.findByPk(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Prepare an object to hold updates
        const updates = {};

        // Only add fields that are provided
        if (firstName) updates.firstName = firstName;
        if (lastName) updates.lastName = lastName;
        if (email) updates.email = email;

        // If email is being updated, check for uniqueness
        if (email) {
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser && existingUser.id !== user.id) {
                return res.status(400).json({ message: 'Email already in use' });
            }
        }

        // Update the user with the fields provided
        await user.update(updates);

        // Return the updated user
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error });
    }
};

// Delete a user
const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;

        const user = User.findByPk(req.params.id);
        if (!user) {
            res.status(404).json({ message: "User not found!" });
        }

        await user.destroy();
        res.status(200).json({ message: "User Deleted" });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error });
    }
}

module.exports = { createUser, getUsers, getUserById, updateUser, deleteUser, findUsersByEmailDomain };