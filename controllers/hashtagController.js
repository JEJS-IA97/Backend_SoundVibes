const { Hashtag } = require('../models');
const resp = require('../utils/responses');

const createHashtag = async (req, res) => {
  try {
    const { name } = req.body;

    const existingHashtag = await Hashtag.findOne({ where: { name, status: 'A' } });
    if (existingHashtag) {
      return resp.makeResponsesError(res, 'Hashtag already exists', 'HFound');
    }

    const hashtag = await Hashtag.create({ name });

    resp.makeResponsesOkData(res, hashtag, 'HCreated');
  } catch (error) {
    resp.makeResponsesError(res, error, 'UnexpectedError');
  }
};

const getAllHashtags = async (req, res) => {
  try {
    const hashtags = await Hashtag.findAll({ where: { status: 'A' } });
    resp.makeResponsesOkData(res, hashtags, 'HGetAll');
  } catch (error) {
    resp.makeResponsesError(res, error, 'UnexpectedError');
  }
};

const getHashtagByName = async (req, res) => {
  try {
    const { name } = req.params;
    const hashtag = await Hashtag.findOne({ where: { name, status: 'A' } });
    if (!hashtag) {
      return resp.makeResponsesError(res, 'Hashtag not found', 'HNotFound');
    }
    resp.makeResponsesOkData(res, hashtag, 'HGetByName');
  } catch (error) {
    resp.makeResponsesError(res, error, 'UnexpectedError');
  }
};

const updateHashtag = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const existingHashtag = await Hashtag.findOne({ where: { name, status: 'A' } });
    if (existingHashtag) {
      return resp.makeResponsesError(res, 'Hashtag already exists', 'HFound');
    }

    const [updated] = await Hashtag.update({ name }, { where: { id, status: 'A' } });
    if (!updated) {
      return resp.makeResponsesError(res, 'Hashtag not found', 'HNotFound');
    }

    resp.makeResponsesOkData(res, { id, name }, 'HUpdated');
  } catch (error) {
    resp.makeResponsesError(res, error, 'UnexpectedError');
  }
};

const deleteHashtag = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Hashtag.update({ status: 'I' }, { where: { id, status: 'A' } });
    if (!deleted) {
      return resp.makeResponsesError(res, 'Hashtag not found', 'HNotFound');
    }

    resp.makeResponsesOkData(res, { id }, 'HDeleted');
  } catch (error) {
    resp.makeResponsesError(res, error, 'UnexpectedError');
  }
};

module.exports = {
  createHashtag,
  getAllHashtags,
  getHashtagByName,
  updateHashtag,
  deleteHashtag,
};
