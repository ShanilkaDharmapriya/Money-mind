const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');
const Goal = require('../models/Goal');

exports.getDashboard = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message:"User not found" });
        }

        if (user.role === "admin") {
            const users = await User.countDocuments();
            const transactions = await Transaction.countDocuments();
            const totalIncome = await Transaction.aggregate([
                { $match: { type: "income" } },
                { $group: { _id: null, total: { $sum: "$amount" } } }
            ]);
            const totalExpenses = await Transaction.aggregate([
                { $match: { type: "expense" } },
                { $group: { _id: null, total: { $sum: "$amount" } } }
            ]);

            return res.json({
                role: "admin",
                usersCount: users,
                totalTransactions: transactions,
                totalIncome: totalIncome.length ? totalIncome[0].total : 0,
                totalExpenses: totalExpenses.length ? totalExpenses[0].total : 0,
                message: "Admin Dashboard Data"
            });
        } else {
            const transactions = await Transaction.find({ user: req.user.id }).sort({ date: -1 }).limit(5);
            const totalIncome = await Transaction.aggregate([
                { $match: { user: req.user.id, type: "income" } },
                { $group: { _id: null, total: { $sum: "$amount" } } }
            ]);
            const totalExpenses = await Transaction.aggregate([
                { $match: { user: req.user.id, type: "expense" } },
                { $group: { _id: null, total: { $sum: "$amount" } } }
            ]);
            const goals = await Goal.find({ user: req.user.id });
            const budgets = await Budget.find({ user: req.user.id });

            return res.json({
                role: "user",
                totalIncome: totalIncome.length ? totalIncome[0].total : 0,
                totalExpenses: totalExpenses.length ? totalExpenses[0].total : 0,
                recentTransactions: transactions,
                goals,
                budgets,
                message:"User Dashboard Data"
            });
        }
    } catch (error) {
        res.status(500).json({message: error.message });
    }
};
