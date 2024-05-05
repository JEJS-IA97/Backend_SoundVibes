const resp = require('../utils/responses');
const { Post, LikePost, UserTag, PostTag, User } = require('../models');

const createPost = async (req, res) => {
  try {
    const { user_id, description, title, year, gender, spotify, youtube, soundcloud } = req.body

    const post = new Post({
      user_id,
      description,
      title,
      year,
      gender,
      spotify,
      youtube,
      soundcloud,
      image,
    })

    await post.save()

    resp.makeResponsesOkData(res, { user_id, description, title, year, gender, spotify, youtube, soundcloud, image }, 'PCreated')

  } catch (error) {
    console.log(error);
    resp.makeResponsesError(res, error)
  }
}

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      order: [['createdAt', 'DESC']]
    });

    resp.makeResponsesOkData(res, posts, 'Success')

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
      order: [['createdAt', 'DESC']]
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
  updatePostImage,
  updatePost,
  deletePost,


  setLikePost,
  getLikePost,

  setUserTag,
  getUserTagByPost,

  setHashtagTag,
};
