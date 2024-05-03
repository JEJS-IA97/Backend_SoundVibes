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
  getFollowersByUser
};