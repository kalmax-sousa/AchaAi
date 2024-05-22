const User = require('../models/User');

/**
 * @desc    Get all Users
 * @route   GET /api/Users
 * @access  Public
 *
 * Returns all users in the database
 */
exports.getAll = async (req, res) => {
  try {
    const Users = await User.findAll();
    res.json(Users);
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error });
  }
};

/**
 * 
 * @desc    Get a User
 * @route   GET /api/Users/:id
 * @access  Public
 * 
 * Returns the user with the given id
 */
exports.getUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server Error ' + error });
  }
};

/**
 * 
 * @desc    Get a User Name
 * @route   GET /api/Users/name/:id
 * @access  Public
 * 
 * Returns the user name with the given id
 */
exports.getUserName = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user.name);
  } catch (error) {
    res.status(500).json({ message: 'Server Error ' + error });
  }
};
/**
 * 
 * @desc    Get a User Email
 * @route   GET /api/Users/email/:id
 * @access  Public
 * 
 * Returns the user name with the given id
 */
exports.getUserEmail = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user.email);
  } catch (error) {
    res.status(500).json({ message: 'Server Error ' + error });
  }
};

/**
 * 
 * @desc    Create a User
 * @route   POST /api/Users
 * @access  Public
 * 
 * Creates a new user in the database
 */
exports.createUser = async (req, res) => {
  try {
      const { name, email, password } = req.body;
      const createResult = await User.create({
          name,
          email,
          password
      })
      res.json(createResult);
  } catch (error) {
      res.status(500).json({ message: 'Server Error ' + error });
  }
};

/**
 * 
 * @desc    Update a User
 * @route   PUT /api/Users/:id
 * @access  Public
 * 
 * Updates the user with the given id
 */
exports.updateUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = await User.findByPk(req.params.id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = name ?? user.name;
    user.email = email ?? user.email;
    user.password = password ?? user.password;

    const updatedUser = await user.save();

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Server Error ' + error });
  }
};

/**
 * 
 * @desc    Update a User Password
 * @route   PUT /api/Users/password/:id
 * @access  Public
 * 
 * Updates the user password with the given id
 */
exports.updateUserPassword = async (req, res) => {
  try {
    const { password } = req.body;

    const user = await User.findByPk(req.params.id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    user.password = password ?? user.password;

    const updatedUser = await user.save();

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Server Error ' + error });
  }
};

/**
 * 
 * @desc    Delete a User
 * @route   DELETE /api/Users/:id
 * @access  Public
 * 
 * Deletes the user with the given id
 */
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    User.destroy({ where: { id: req.params.id } });

    res.json({ message: 'User removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
