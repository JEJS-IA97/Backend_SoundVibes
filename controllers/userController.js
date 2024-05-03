const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { User } = require('../models');
const resp = require('../utils/responses')
const validate = require('../utils/validate')

const createUser = async (req, res) => {
  try {

    const { username, firstName, lastName, gender, birthday, phone, email, password } = req.body

    const user = new User({
      username,
      firstName,
      lastName,
      gender,
      birthday,
      phone,
      email,
      password: bcrypt.hashSync(password),
    })

    await user.save()

    if (!email) {
      return resp.makeResponsesError(
        res,
        'Provide values for email.',
        'UnexpectedError'
      )
    }

    resp.makeResponsesOkData(res, { username, firstName, lastName, gender, birthday, phone, email, password }, 'UCreated')

  } catch (error) {
    resp.makeResponsesError(res, error, 'UnexpectedError')
  }
}

const login = async (req, res) => {
  try {

    const { username, password } = req.body

    const valUser = await User.findOne({ username })

    if (!valUser) {
      return resp.makeResponsesError(res, 'Incorrect credentials', 'ULoginError1')
    }

    const valPass = await validate.comparePassword(password, valUser.password)

    if (!valPass) {
      return resp.makeResponsesError(res, 'Incorrect credentials', 'ULoginError2')
    }

    const secret = process.env.SECRET_KEY
    const token = jwt.sign({ id: valUser._id, }, secret, { expiresIn: '1w' })

    const user = {
      id: valUser._id,
      token: token
    }

    resp.makeResponsesOkData(res, user, 'Success')

  } catch (error) {
    console.log(error);
    resp.makeResponsesError(res, error, 'UnexpectedError')
  }
}

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      order: [['createdAt', 'DESC']]
    });

    resp.makeResponsesOkData(res, users, 'Success')

  } catch (error) {
    console.log(error)
    resp.makeResponsesError(res, error, 'UnexpectedError')
  }
}

const getUser = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findByPk(id, {
      where: {
        status: 'A'
      }
    });
    response.makeResponsesOkData(res, user, 'Success')
  } catch (error) {
    response.makeResponsesError(res, error, 'UnexpectedError')
  }
}
const getUserProfileImage = async (req, res) => {
  try {
    const user_id = req.params.id;
    const user = await User.findByPk(user_id);
  
    if (!user) {
      return resp.makeResponsesError(res, `User with ID ${user_id} not found`, 'UserNotFound');
    }
  
    const profileImageURL = user.profile;
    resp.makeResponsesOkData(res, { profileImageURL }, 'UserProfileImageRetrieved');
  } catch (error) {
    resp.makeResponsesError(res, error, 'UnexpectedError');
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const userData = req.body;

    const user = await User.findByPk(userId);

    if (!user) {
      return resp.makeResponsesError(res, `User doesn't exist`, 'UNotFound');
    }

    await user.update(userData);

    resp.makeResponsesOkData(res, user, 'UUpdated');
  } catch (error) {
    resp.makeResponsesError(res, error, 'UnexpectedError');
  }
};

const updateUserImage = async (req, res) => {
  try {
    const userId = req.params.id;
    const { imageUrl } = req.body;

    const user = await User.findByPk(userId);

    if (!user) {
      return resp.makeResponsesError(res, `User doesn't exist`, 'UNotFound');
    }

    user.profile = imageUrl; 
    await user.save();

    resp.makeResponsesOkData(res, user, 'User image updated successfully');
  } catch (error) {
    resp.makeResponsesError(res, error, 'UnexpectedError');
  }
};
const deleteUser = async (req, res) => {

  try {

    const id = req.params.id;

    const user = await User.findByPk(id, {
      where: {
        status: 'A'
      }
    });

    if (!user) {
      return response.makeResponsesError(res, `User doesn't exist`, 'UNotFound')
    }

    const saveUser = await user.update({
      status: false,
      deleted_at: Date.now(),
      where: { id }
    });

    response.makeResponsesOkData(res, saveUser, 'UDeleted')


  } catch (error) {
    response.makeResponsesError(res, error, 'UnexpectedError')

  }
};

const changePassword = async (req, res) => {
  try {

    const user = await User.findByPk(req.params.id, {
      where: {
        status: 'A'
      }
    });


    if (!user) {
      return resp.makeResponsesError(res, `User don't exist`, 'UNotFound')
    }

    const valPass = await validate.comparePassword(req.body.password, valUser.password)

    if (!valPass) {
      return resp.makeResponsesError(res, 'Incorrect credentials', 'UChangePasswordError')
    }

    const valNewPass = await validate.comparePassword(req.body.newPassword, valUser.password)

    if (valNewPass) {
      return resp.makeResponsesError(res, 'Incorrect credentials', 'UChangePasswordError1')
    }


    user.password = bcrypt.hashSync(req.body.newPassword) ? bcrypt.hashSync(req.body.newPassword) : user.password

    await user.save()

    resp.makeResponsesOkData(res, saveUser, 'UChangePasswordSuccess')

  } catch (error) {
    resp.makeResponsesError(res, error, 'UnexpectedError')
  }
}

const setFavorite = async (req, res) => {
  try {
    const { user_id , post_id } = req.body;

    const favorite = await Favorite.create({ user_id , post_id });

    resp.makeResponsesOkData(res, favorite, 'FavoriteCreated');
  } catch (error) {
    resp.makeResponsesError(res, error, 'UnexpectedError');
  }
};

const getFavoritesByUser = async (req, res) => {
  try {
    const user_id  = req.params.userId;

    const favorites = await Favorite.findAll({ where: { user_id } });

    resp.makeResponsesOkData(res, favorites, 'FavoritesRetrieved');
  } catch (error) {
    resp.makeResponsesError(res, error, 'UnexpectedError');
  }
};

const setFollow = async (req, res) => {
  try {
    const { follower_id, following_id } = req.body;

    const follow = await Follow.create({ follower_id, following_id });

    resp.makeResponsesOkData(res, follow, 'FollowCreated');
  } catch (error) {
    resp.makeResponsesError(res, error, 'UnexpectedError');
  }
};

const getFollowersByUser = async (req, res) => {
  try {
    const following_id = req.params.user_id;

    const followers = await Follow.findAll({ where: { following_id } });

    resp.makeResponsesOkData(res, followers, 'FollowersRetrieved');
  } catch (error) {
    resp.makeResponsesError(res, error, 'UnexpectedError');
  }
};

module.exports = {
  createUser,
  login,
  getAllUsers,
  setFavorite,
  getFavoritesByUser,
  setFollow,
  getFollowersByUser,
  getUser,
  updateUser,
  deleteUser,
  changePassword,
  updateUserImage,
  getUserProfileImage
};