const resp = require('../utils/responses');
const { Post, LikePost, UserTag, PostTag, User, Follow } = require('../models');
const authenticateToken = require('../middlewares/authenticateToken');

const createPost = async (req, res) => {
  try {

    const auth = await authenticateToken(req, res)

    if (!auth) return resp.makeResponse400(res, 'Unauthorized user.', 'Unauthorized', 401);

    const user = await User.findByPk(auth.id);

    if (!user) {
      return resp.makeResponsesError(res, `User with ID ${auth.id} not found`, 'UserNotFound');
    }

    const { description, title, year, image, gender, link_spotify, link_youtube, link_soundcloud } = req.body

    const post = new Post({
      user_id: user.id,
      descripcion: description,
      title,
      year,
      gender,
      link_spotify,
      link_youtube,
      link_soundcloud,
      image,
    })

    await post.save()

    resp.makeResponsesOkData(res, { id: post.id, user_id: user.id, description, title, year, gender, link_spotify, link_youtube, link_soundcloud, image }, 'PCreated')

  } catch (error) {
    console.log(error);
    resp.makeResponsesError(res, error)
  }
}

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      where: {
        deletedAt: null
      },
      include: [
        {
          model: User,
          attributes: ['id', 'username']
        }
      ],
      order: [['updatedAt', 'DESC']]
    });

    const likesPromises = posts.map(async post => {

      const { id, User, descripcion, title, year, gender, link_spotify, link_youtube, link_soundcloud, image, createdAt, updatedAt } = post;


      const { count, rows } = await LikePost.findAndCountAll({
        where: {
          post_id: id
        }
      });

      return {
        id,
        User,
        description: descripcion,
        title,
        year,
        gender,
        link_spotify,
        link_youtube,
        link_soundcloud,
        image,
        likes: count,
        createdAt,
        updatedAt,
      };
    });

    const respPost = await Promise.all(likesPromises);

    resp.makeResponsesOkData(res, respPost, 'Success')

  } catch (error) {
    resp.makeResponsesError(res, error, 'UnexpectedError')
  }
};

const getFeed = async (req, res) => {
  try {

    const auth = await authenticateToken(req, res)

    if (!auth) return resp.makeResponse400(res, 'Unauthorized user.', 'Unauthorized', 401);

    const user = await User.findByPk(auth.id);

    if (!user) {
      return resp.makeResponsesError(res, `User with ID ${auth.id} not found`, 'UserNotFound');
    }

    const follows = await Follow.findAll({
      where: {
        user_id: user.id
      }
    });

    const followsId = follows.map(follow => follow.follower_id);

    const posts = await Post.findAll({
      where: {
        user_id: [...followsId, user.id],
        deletedAt: null
      },
      include: [
        {
          model: User,
          attributes: ['id', 'username', 'profile']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    const likesPromises = posts.map(async post => {

      const { id, User, descripcion, title, year, gender, link_spotify, link_youtube, link_soundcloud, image, createdAt, updatedAt } = post;


      const { count, rows } = await LikePost.findAndCountAll({
        where: {
          post_id: id
        }
      });

      return {
        id,
        User,
        description: descripcion,
        title,
        year,
        gender,
        link_spotify,
        link_youtube,
        link_soundcloud,
        image,
        likes: count,
        isLiked: rows.find(item => item.user_id === user.id) ? true : false,
        createdAt,
        updatedAt,
      };
    });

    const respPost = await Promise.all(likesPromises);

    resp.makeResponsesOkData(res, respPost, 'Success')

  } catch (error) {
    resp.makeResponsesError(res, error, 'UnexpectedError')
  }
};

const getPostByUser = async (req, res) => {
  try {
    const user_id = req.params.id;

    const posts = await Post.findAndCountAll({
      where: {
        user_id,
        status: 'A'
      },
      include: [
        {
          model: User,
          attributes: ['id', 'username']
        }
      ],
      order: [['updated', 'DESC']]
    });

    resp.makeResponsesOkData(res, posts, "PGetByUser");

  } catch (error) {
    console.log(error);
    resp.makeResponsesError(res, error);
  }
};

const getPostById = async (req, res) => {
  try {
    const postId = req.params.id;

    const post = await Post.findOne({
      where: {
        id: postId,
        deletedAt: null
      },
      include: [
        {
          model: User,
          attributes: ['id', 'username']
        }
      ],
      order: [['updatedAt', 'DESC']]
    });

    if (!post) {
      return resp.makeResponsesError(res, { message: 'Post not found' }, 404);
    }

    resp.makeResponsesOkData(res, post, "Success");

  } catch (error) {
    resp.makeResponsesError(res, error);
  }
};

const updatePost = async (req, res) => {
  try {
    const { description } = req.body;
    const postId = req.params.id;

    const updatedPost = await Post.update(
      { description },
      {
        where: {
          id: postId,
          status: 'A'
        }
      }
    );

    resp.makeResponsesOkData(res, updatedPost, "Success");

  } catch (error) {
    console.log(error);
    resp.makeResponsesError(res, error);
  }
};

const updatePostImage = async (req, res) => {
  try {
    const post_id = req.params.id;
    const post = await Post.findByPk(post_id);

    if (!post) {
      return resp.makeResponsesError(res, `Post with ID ${post_id} not found`, 'PostNotFound');
    }

    const { imageUrl } = req.body;
    console.log("Imagen recibida:", imageUrl);

    if (!imageUrl) {
      return resp.makeResponsesError(res, 'Image file is missing.', 'ImageNotFound');
    }

    post.image = imageUrl;
    await post.save();

    resp.makeResponsesOkData(res, post, 'Post image updated successfully');
  } catch (error) {
    resp.makeResponsesError(res, error, 'UnexpectedError');
  }
};

const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;

    const deletedPost = await Post.update(
      { status: 'I', deletedAt: new Date() },
      {
        where: {
          id: postId,
          status: 'A'
        }
      }
    );

    resp.makeResponsesOkData(res, deletedPost, "PDeleted");

  } catch (error) {
    console.log(error);
    resp.makeResponsesError(res, error);
  }
};

// User tag & Hashtag

const setUserTag = async (req, res) => {
  try {
    const post = await Post.findOne({ where: { id: req.params.id, status: 'A' } });

    if (!post) {
      return resp.makeResponsesError(res, "PNotFound");
    } else {
      const userTag = await UserTag.findOne({ where: { post_id: req.params.id } });

      if (userTag) {
        await UserTag.update({ users: req.body }, { where: { post_id: req.params.id } });

        const updatedUserTag = await UserTag.findOne({ where: { post_id: req.params.id } });

        resp.makeResponsesOkData(res, updatedUserTag, "Success");
      } else {
        const newUserTag = await UserTag.create({
          post_id: req.params.id,
          users: req.body
        });

        resp.makeResponsesOkData(res, newUserTag, "Success");
      }
    }
  } catch (error) {
    console.log(error);
    resp.makeResponsesError(res, error);
  }
}

const getUserTagByPost = async (req, res) => {
  try {
    const usertags = await UserTag.findAll({
      where: { post_id: req.params.id },
      include: [{ model: User, as: 'users' }]
    });
    resp.makeResponsesOkData(res, usertags, "Success");
  } catch (error) {
    resp.makeResponsesError(res, error);
  }
};

const setHashtagTag = async (req, res) => {
  try {
    // Buscar la publicación por ID y estado activo ('A')
    const post = await Post.findOne({ where: { id: req.params.id, status: 'A' } });

    if (!post) {
      return resp.makeResponsesError(res, "PNotFound");
    } else {
      // Verificar si ya existe un registro de etiquetas para esta publicación
      const existingPostTag = await PostTag.findOne({ where: { post_id: req.params.id } });

      if (existingPostTag) {
        // Actualizar las etiquetas de la publicación existente
        const updatePostTags = await PostTag.update({ hashtags: req.body }, { where: { post_id: req.params.id } });
        resp.makeResponsesOkData(res, updatePostTags, "Success");
      } else {
        // Crear un nuevo registro de etiquetas para la publicación
        const hashtagTag = await PostTag.create({
          post_id: req.params.id,
          hashtags: req.body,
        });
        resp.makeResponsesOkData(res, hashtagTag, "Success");
      }
    }
  } catch (error) {
    console.log(error)
    resp.makeResponsesError(res, error);
  }
};

const setLikePost = async (req, res, postId) => {
  try {
    const auth = await authenticateToken(req, res);
    if (!auth) return resp.makeResponse400(res, 'Unauthorized user.', 'Unauthorized', 401);

    const user = await User.findByPk(auth.id);
    if (!user) {
      return resp.makeResponsesError(res, `User with ID ${auth.id} not found`, 'UserNotFound');
    }

    const post = await Post.findOne({ where: { id: postId, deletedAt: null } });

    if (!post) {
      return resp.makeResponsesError(res, "PNotFound");
    }

    const existingLike = await LikePost.findOne({
      where: {
        post_id: postId,
        user_id: user.id
      }
    });

    if (existingLike) {
      existingLike.deletedAt = new Date();
      await existingLike.save();
      resp.makeResponsesOkData(res, "Success");
    } else {
      await LikePost.create({ post_id: postId, user_id: user.id });
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
  updatePostImage,
  updatePost,
  deletePost,

  getFeed,

  setLikePost,
  getLikePost,

  setUserTag,
  getUserTagByPost,

  setHashtagTag,
};
