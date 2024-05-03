const { Comment } = require('../models');
const resp = require('../utils/responses');

const createComment = async (req, res) => {
  try {
    const { post_id, user_id, content } = req.body;

    const newComment = await Comment.create({
      post_id,
      user_id,
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
    const { post_id } = req.params;

    const comments = await Comment.findAll({ where: { post_id }, order: [['createdAt', 'DESC']] });
    resp.makeResponsesOkData(res, comments, 'Success');
  } catch (error) {
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
