import PantryItem from "../models/PantryItem.js";

export const consumeItem = async (req, res) => {
    try {
        const { quantity } = req.body;

        const item =
            await PantryItem.findOne({
                _id: req.params.id,
                user: req.user.userId
            });

        if (!item) {
            return res.status(404).json({
                message: "Item not found"
            });
        }

        if (quantity > item.remainingQuantity) {
            return res.status(400).json({
                message: "Cannot consume more than remaining quantity."
            });
        }

        item.remainingQuantity -= quantity;
        item.consumedQuantity += quantity;
        item.lastConsumedAt = new Date();

        item.consumptionHistory.push({
            quantity,
            consumedAt: new Date()
        });

        await item.save();

        res.json(item);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};