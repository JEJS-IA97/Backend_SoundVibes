const { Notification } = require('../models');
const resp = require('../utils/responses');

const createNotification = async (req, res) => {
  try {
    const { user, description, type } = req.body;

    const newNotification = await Notification.create({
      user,
      description,
      type,
    });

    resp.makeResponsesOkData(res, newNotification, 'NCreated');
  } catch (error) {
    resp.makeResponsesError(res, error);
  }
};

const getAllNotification = async (req, res) => {
  try {
    const notifications = await Notification.findAll({ where: { status: 'A' } });
    resp.makeResponsesOkData(res, notifications, 'Success');
  } catch (error) {
    resp.makeResponsesError(res, error);
  }
};

const getNotificationByUser = async (req, res) => {
  try {
    const { id } = req.params;

    const notifications = await Notification.findAll({ where: { user: id, status: 'A' } });
    resp.makeResponsesOkData(res, notifications, 'Success');
  } catch (error) {
    resp.makeResponsesError(res, error);
  }
};

const getNotificationById = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findOne({ where: { id, status: 'A' } });
    resp.makeResponsesOkData(res, notification, 'Success');
  } catch (error) {
    resp.makeResponsesError(res, error);
  }
};

const updateNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;

    const [updatedCount, updatedNotifications] = await Notification.update(
      { description },
      { where: { id, status: 'A' } }
    );

    if (updatedCount === 0) {
      return resp.makeResponsesError(res, 'NNotFound');
    }

    resp.makeResponsesOkData(res, updatedNotifications, 'NUpdated');
  } catch (error) {
    resp.makeResponsesError(res, error);
  }
};

const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCount = await Notification.destroy({ where: { id, status: 'A' } });

    if (deletedCount === 0) {
      return resp.makeResponsesError(res, 'NNotFound');
    }

    resp.makeResponsesOkData(res, deletedCount, 'NDeleted');
  } catch (error) {
    resp.makeResponsesError(res, error);
  }
};

const readNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const [updatedCount, updatedNotifications] = await Notification.update(
      { isRead: true },
      { where: { id, status: 'A' } }
    );

    if (updatedCount === 0) {
      return resp.makeResponsesError(res, 'NNotFound');
    }

    resp.makeResponsesOkData(res, updatedNotifications, 'Success');
  } catch (error) {
    resp.makeResponsesError(res, error);
  }
};

module.exports = {
  createNotification,
  getAllNotification,
  getNotificationByUser,
  getNotificationById,
  updateNotification,
  deleteNotification,
  readNotification
};
