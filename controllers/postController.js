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
    const { page, limit } = req.params;
    const offset = (page - 1) * limit;

    const postsPaginate = await Post.findAndCountAll({
      where: { status: 'A' }, 
      include: [{ model: User, as: 'user' }], 
      order: [['createdAt', 'DESC']],
      offset: offset, 
      limit: parseInt(limit) 
    });

    const response = {
      docs: postsPaginate.rows, 
      totalDocs: postsPaginate.count,
      page: parseInt(page), 
      limit: parseInt(limit), 
      totalPages: Math.ceil(postsPaginate.count / limit), 
      hasPrevPage: offset > 0, 
      hasNextPage: offset + parseInt(limit) < postsPaginate.count
    };

    resp.makeResponsesOkData(res, response, "PGetAll");
  } catch (error) {
    resp.makeResponsesError(res, error);
  }
};

const getPostByUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const page = parseInt(req.params.page);
    const limit = parseInt(req.params.limit);

    const posts = await Post.findAndCountAll({
      where: {
        userId, 
        status: 'A'
      },
      include: [
        {
          model: User, 
          attributes: ['id', 'username'] 
        }
      ],
      order: [['createdAt', 'DESC']], 
      limit, 
      offset: (page - 1) * limit 
    });

    const responseData = {
      posts: posts.rows,
      totalPosts: posts.count,
      currentPage: page,
      totalPages: Math.ceil(posts.count / limit)
    };

    resp.makeResponsesOkData(res, responseData, "PGetByUser");

  } catch (error) {
    resp.makeResponsesError(res, error);
  }
};

const getPostById = async (req, res) => {
  try {
    const postId = req.params.id;

    const post = await Post.findOne({
      where: {
        id: postId, 
        status: 'A' 
      },
      include: [
        {
          model: User, 
          attributes: ['id', 'username'] 
        }
      ],
      order: [['createdAt', 'DESC']] 
    });

    if (!post) {
      return resp.makeResponsesError(res, { message: 'Post not found' }, 404);
    }

    resp.makeResponsesOkData(res, post, "PGetById");

  } catch (error) {
    resp.makeResponsesError(res, error);
  }
};

const getFeedPosts = async (req, res) => {
  try {
    const { page, limit } = req.params;
    const userIds = req.body;

    const posts = await Post.findAndCountAll({
      where: {
        userId: userIds, 
        status: 'A' 
      },
      include: [
        {
          model: User, 
          attributes: ['id', 'username'] 
        }
      ],
      order: [['createdAt', 'DESC']], 
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit) 
    });

    const responseData = {
      posts: posts.rows,
      totalPosts: posts.count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(posts.count / parseInt(limit))
    };

    resp.makeResponsesOkData(res, responseData, "PGetPosts");

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
    const basePath = `${req.protocol}://${req.get('host')}`;

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
