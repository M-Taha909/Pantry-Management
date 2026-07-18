import PantryItem from "../models/PantryItem.js";
import { getNotificationMessage } from "../utils/notificationHelper.js";
import { getPriority } from "../utils/getPriority.js";

export const getFinancialSummary = async (req, res) => {
  try {
    const items = await PantryItem.find({
      user: req.user.userId,
    });

    let estimatedWaste = 0;
    let activeInventoryValue = 0;
    let potentialSavings = 0;

    const today = new Date();

    items.forEach((item) => {
      const value = item.estimatedPrice || 0;

      const expiry = new Date(item.expiryDate);

      const diff =
        Math.ceil(
          (expiry - today) /
          (1000 * 60 * 60 * 24)
        );

      if (diff < 0) {
        estimatedWaste += value;
      }
      else {
        activeInventoryValue += (item.remainingQuantity * item.estimatedPrice)/item.quantity;
      }

      if (diff <= 7 && diff >= 0) {
        potentialSavings += value;
      }
    });

    res.json({
      estimatedWaste,
      activeInventoryValue,
      potentialSavings,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getCategoryStats = async (req, res) => {
  try {
    const items = await PantryItem.find({
      user: req.user.userId,
    });

    const categoryCounts = {};
    const wastedCategories = {};

    const today = new Date();

    items.forEach((item) => {
      const category = item.category || "Other";

      categoryCounts[category] =
        (categoryCounts[category] || 0) + 1;

      if (new Date(item.expiryDate) < today) {
        wastedCategories[category] =
          (wastedCategories[category] || 0) + 1;
      }
    });

    res.json({
      categoryCounts,
      wastedCategories,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getNotifications = async (req, res) => {
  try {
    const items = await PantryItem.find({
      user: req.user.userId
    });

    const notifications = [];

    items.forEach((item) => {
      const message =
        getNotificationMessage(item);

      if (message) {
        notifications.push({
          id: item._id,
          message
        });
      }
    });

    res.json(notifications);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const getStats = async (req, res) => {
  try {
    const items = await PantryItem.find({
      user: req.user.userId
    });

    let expired = 0;
    let expiringSoon = 0;
    let safe = 0;
    let healthStatus = 0;
    let critical = 0;

    const today = new Date();

    items.forEach((item) => {
      const expiry = new Date(item.expiryDate);

      const diff =
        Math.ceil(
          (expiry - today) /
          (1000 * 60 * 60 * 24)
        );

      if (diff < 0) {
        expired++;
      }
      else if(diff <= 1)
      {
        critical++;
      }
      else if (diff <= 7) {
        expiringSoon++;
      }
      else {
        safe++;
      }
    });

    const riskCategory = expired === 0 ? "Excellent" : expired <= 3 ? "Moderate Risk" : "High Risk";
    const healthScore = Math.max(0, 100 - (expired * 10) - (critical * 5));

    if(healthScore >= 90)
      healthStatus = "Excellent";
    else if(healthScore >= 75)
      healthStatus = "Good";
    else if(healthScore >= 50)
      healthStatus = "Moderate";
    else
      healthStatus = "Poor";

    res.json({
      total: items.length,
      expired,
      expiringSoon,
      safe,
      critical,
      healthScore,
      healthStatus,
      riskCategory
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const getConsumeFirst =
async (req, res) => {
  try {
    const items = await PantryItem.find({
      user: req.user.userId
    });

    const priorityOrder = {
      Expired: 0,
      Critical: 1,
      High: 2,
      Medium: 3,
      Low: 4
    };

    const recommendations =
      items
        .map(item => ({
          ...item.toObject(),
          priority: getPriority(item.expiryDate)
        }))
        .filter(item => item.priority !== "Expired")
        .sort(
          (a, b) =>
            priorityOrder[a.priority] -
            priorityOrder[b.priority]
        );

    res.json(recommendations);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};