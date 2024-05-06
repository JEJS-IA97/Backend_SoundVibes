const authenticateToken = require('../middlewares/authenticateToken');
const { Comment, User } = require('../models');
const resp = require('../utils/responses');


const createComment = async (req, res) => {
  try {

    const auth = await authenticateToken(req, res);
    if (!auth) return resp.makeResponse400(res, 'Unauthorized user.', 'Unauthorized', 401);

    const user = await User.findByPk(auth.id);
    if (!user) {
      return resp.makeResponsesError(res, `User with ID ${auth.id} not found`, 'UserNotFound');
    }

    const { post_id, content } = req.body;

    const newComment = await Comment.create({
      post_id,
      user_id: user.id,
      content
    });

    resp.makeResponsesOkData(res, newComment, 'CommentCreated');
  } catch (error) {
    resp.makeResponsesError(res, error, 'UnexpectedError');
  }
};

const getAllComments = async (req, res) => {
  try {

    const comments = await Comment.findAll({ order: [['createdAt', 'DESC']] });
    resp.makeResponsesOkData(res, comments, 'Success');
  } catch (error) {
    resp.makeResponsesError(res, error, 'UnexpectedError');
  }
};

const getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.findAll({ 
      where: { 
        post_id: postId 
      }, 
      order: [['createdAt', 'DESC']]
    });
    
    const userComments = comments.map(async comment => {

      const { id, content, post_id, user_id, createdAt } = comment;
      
      const user = await User.findOne({
        where: {
          id: user_id
        }
      });

      return {
        id,
        post_id,
        user: {
          id: user.id,
          username: user.username,
          profile: user.profile
        },
        content,
        createdAt,
      };
    });

    const respComment = await Promise.all(userComments);

    resp.makeResponsesOkData(res, respComment, 'Success');
  } catch (error) {
    console.log(error);
    resp.makeResponsesError(res, error, 'UnexpectedError');
  }
};

const getCommentById = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findByPk(id);
    if (!comment) {
      return resp.makeResponsesError(res, 'Comment not found', 'CommentNotFound');
    }

    resp.makeResponsesOkData(res, comment, 'Success');
  } catch (error) {
    resp.makeResponsesError(res, error, 'UnexpectedError');
  }
};

const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const updatedComment = await Comment.update({ content }, { where: { id } });
    if (!updatedComment) {
      return resp.makeResponsesError(res, 'Comment not found', 'CommentNotFound');
    }

    resp.makeResponsesOkData(res, updatedComment, 'CommentUpdated');
  } catch (error) {
    resp.makeResponsesError(res, error, 'UnexpectedError');
  }
};

const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedComment = await Comment.destroy({ where: { id } });
    if (!deletedComment) {
      return resp.makeResponsesError(res, 'Comment not found', 'CommentNotFound');
    }

    resp.makeResponsesOkData(res, deletedComment, 'CommentDeleted');
  } catch (error) {
    resp.makeResponsesError(res, error, 'UnexpectedError');
  }
};

module.exports = {
  createComment,
  getAllComments,
  getCommentsByPost,
  getCommentById,
  updateComment,
  deleteComment
};
