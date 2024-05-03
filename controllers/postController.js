const resp = require('../utils/responses');
const { Post, LikePost, UserTag, PostTag } = require('../models');

const createPost = async (req, res) => {
  try {
    const { user, description } = req.body;

    const post = await Post.create({ user, description });

    const postPopulate = await Post.findOne({ where: { id: post.id }, include: 'User' });

    resp.makeResponsesOkData(res, postPopulate, "PCreated");
  } catch (error) {
    resp.makeResponsesError(res, error);
  }
};

const getAllPosts = async (req, res) => {
  try {
    const postsPaginate = await Post.findAndCountAll({
      where: { status: 'A' },
      include: 'User',
      order: [['createdAt', 'DESC']],
      limit: parseInt(req.params.limit),
      offset: (parseInt(req.params.page) - 1) * parseInt(req.params.limit)
    });

    resp.makeResponsesOkData(res, postsPaginate, "PGetAll");
  } catch (error) {
    resp.makeResponsesError(res, error);
  }
};

const getPostByUser = async (req, res) => {
  try {
    const postsPaginate = await Post.findAndCountAll({
      where: { user: req.params.id, status: 'A' },
      include: 'User',
      order: [['createdAt', 'DESC']],
      limit: parseInt(req.params.limit),
      offset: (parseInt(req.params.page) - 1) * parseInt(req.params.limit)
    });

    resp.makeResponsesOkData(res, postsPaginate, "PGetByUser");
  } catch (error) {
    resp.makeResponsesError(res, error);
  }
};

const getPostById = async (req, res) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.id, status: 'A' },
      include: 'User'
    });

    resp.makeResponsesOkData(res, post, "PGetById");
  } catch (error) {
    resp.makeResponsesError(res, error);
  }
};

const getFeedPosts = async (req, res) => {
  try {
    const postsPaginate = await Post.findAndCountAll({
      where: { user: req.body, status: 'A' },
      include: 'User',
      order: [['createdAt', 'DESC']],
      limit: parseInt(req.params.limit),
      offset: (parseInt(req.params.page) - 1) * parseInt(req.params.limit)
    });

    resp.makeResponsesOkData(res, postsPaginate, "PGetPosts");
  } catch (error) {
    resp.makeResponsesError(res, error);
  }
};

const uploadImage = async (req, res) => {
  try {
    const post = await Post.findOne({ where: { id: req.params.id, status: 'A' } });

    if (!post) {
      return resp.makeResponsesError(res, "UNotFound");
    }

    const file = req?.file;
    if (!file) {
      return resp.makeResponsesError(res, "UImageError");
    }

    const filename = file?.filename;
    const basePath = `${req.protocol}://${req.get('host')}/flymagine/public/images/`;

    await Post.update({ photo: `${basePath}${filename}` }, { where: { id: req.params.id, status: 'A' } });

    resp.makeResponsesOkData(res, "PUpdated");
  } catch (error) {
    resp.makeResponsesError(res, error);
  }
};

const updatePost = async (req, res) => {
  try {
    const { description } = req.body;

    await Post.update({ description }, { where: { id: req.params.id, status: 'A' } });

    resp.makeResponsesOkData(res, "PUpdated");
  } catch (error) {
    resp.makeResponsesError(res, error);
  }
};

const deletePost = async (req, res) => {
  try {
    await Post.update({ status: 'I', deletedAt: new Date() }, { where: { id: req.params.id, status: 'A' } });

    resp.makeResponsesOkData(res, "PDeleted");
  } catch (error) {
    resp.makeResponsesError(res, error);
  }
};

const getPostByHashtags = async (req, res) => {
  try {
    const postsPaginate = await PostTag.findAndCountAll({
      where: { hashtags: req.body, status: 'A' },
      include: [
        { model: Post, as: 'Post', include: 'User' }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(req.params.limit),
      offset: (parseInt(req.params.page) - 1) * parseInt(req.params.limit)
    });

    resp.makeResponsesOkData(res, postsPaginate, "PGetByHashtags");
  } catch (error) {
    resp.makeResponsesError(res, error);
  }
};

const setUserTag = async (req, res) => {
  try {
    const post = await Post.findOne({ where: { id: req.params.id, status: 'A' } });

    if (!post) {
      return resp.makeResponsesError(res, "PNotFound");
    }

    const existingUserTag = await UserTag.findOne({ where: { post: req.params.id } });

    if (existingUserTag) {
      await UserTag.update({ users: req.body }, { where: { post: req.params.id } });
      resp.makeResponsesOkData(res, "Success");
    } else {
      await UserTag.create({ post: req.params.id, users: req.body });
      resp.makeResponsesOkData(res, "Success");
    }
  } catch (error) {
    resp.makeResponsesError(res, error);
  }
};

const getUserTagByPost = async (req, res) => {
  try {
    const usertags = await UserTag.findAll({
      where: { post: req.params.id }
    });

    resp.makeResponsesOkData(res, usertags, "Success");
  } catch (error) {
    resp.makeResponsesError(res, error);
  }
};

const setHashtagTag = async (req, res) => {
  try {
    const post = await Post.findOne({ where: { id: req.params.id, status: 'A' } });

    if (!post) {
      return resp.makeResponsesError(res, "PNotFound");
    }

    const existingPostTag = await PostTag.findOne({ where: { post: req.params.id } });

    if (existingPostTag) {
      await PostTag.update({ hashtags: req.body }, { where: { post: req.params.id } });
      resp.makeResponsesOkData(res, "Success");
    } else {
      await PostTag.create({ post: req.params.id, hashtags: req.body });
      resp.makeResponsesOkData(res, "Success");
    }
  } catch (error) {
    resp.makeResponsesError(res, error);
  }
};

const getHashtagTagByPost = async (req, res) => {
  try {
    const hashtags = await PostTag.findAll({
      where: { post: req.params.id }
    });

    resp.makeResponsesOkData(res, hashtags, "Success");
  } catch (error) {
    resp.makeResponsesError(res, error);
  }
};

const setLikePost = async (req, res) => {
  try {
    const post = await Post.findOne({ where: { id: req.params.id, status: 'A' } });

    if (!post) {
      return resp.makeResponsesError(res, "PNotFound");
    }

    const existingLike = await LikePost.findOne({ where: { post: req.params.id } });

    if (existingLike) {
      await LikePost.update({ users: req.body }, { where: { post: req.params.id } });
      resp.makeResponsesOkData(res, "Success");
    } else {
      await LikePost.create({ post: req.params.id, users: req.body });
      resp.makeResponsesOkData(res, "LikeCreated");
    }
  } catch (error) {
    resp.makeResponsesError(res, error);
  }
};

const getLikePost = async (req, res) => {
  try {
    const likes = await LikePost.findAll({
      where: { post: req.params.id, status: 'A' }
    });

    resp.makeResponsesOkData(res, likes, "Success");
  } catch (error) {
    resp.makeResponsesError(res, error);
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getPostByUser,
  getPostById,
  getFeedPosts,
  uploadImage,
  updatePost,
  deletePost,

  getPostByHashtags,

  setLikePost,
  getLikePost,

  setUserTag,
  getUserTagByPost,

  setHashtagTag,
  getHashtagTagByPost,
};
