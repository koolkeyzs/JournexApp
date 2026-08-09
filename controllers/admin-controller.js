const User = require("../model/user");
const Journex = require("../model/journex");
const Comment = require("../model/comments");
const Report = require("../model/report");

module.exports.dashBoard = async (req, res, next) => {
    try {

        const totalUsers = await User.countDocuments();

        const totalEntries = await Journex.countDocuments();

        const totalComments = await Comment.countDocuments();

        // Placeholder until we build the report feature
        const totalReports = await Report.countDocuments()

        res.status(200).json({
            success: true,

            admin: {
                username: req.user.username,
                email: req.user.email
            },

            stats: {
                users: totalUsers,
                entries: totalEntries,
                comments: totalComments,
                reports: totalReports
            }

        });

    } catch (err) {
        next(err);
    }
};

module.exports.getReports = async (req, res, next) => {

    try {

        const reports = await Report.find()

            .populate("reporter", "username email")

            .populate("entry", "title author")

            .sort({ createdAt: -1 });

        res.status(200).json({

            success: true,

            reports

        });

    }

    catch (err) {

        next(err);

    }

}


module.exports.markReviewed = async (req, res, next) => {
    try {

        const report = await Report.findById(req.params.id);

        if (!report) {
            return res.status(404).json({
                message: "Report not found."
            });
        }

        report.status = "reviewed";

        await report.save();

        res.status(200).json({
            success: true,
            message: "Report marked as reviewed."
        });

    } catch (err) {
        next(err);
    }
};

module.exports.resolveReport = async (req, res, next) => {
    try {

        const report = await Report.findById(req.params.id);

        if (!report) {
            return res.status(404).json({
                message: "Report not found."
            });
        }

        report.status = "resolved";

        await report.save();

        res.status(200).json({
            success: true,
            message: "Report resolved."
        });

    } catch (err) {
        next(err);
    }
};

module.exports.getUsers = async (req, res, next) => {
    try {
        const users = await User.find().lean();

        for (const user of users) {
            const entries = await Journex.find({ author: user._id });

            user.entryCount = entries.length;
            user.commentCount = await Comment.countDocuments({ author: user._id });
            user.likeCount = entries.reduce((total, entry) => total + entry.likes.length, 0);
            user.publicEntries = entries.filter(e => e.isPublic).length;
            user.privateEntries = entries.filter(e => !e.isPublic).length;
        }

        res.status(200).json({
            success: true,
            users
        });

    } catch (err) {
        next(err);
    }
};




module.exports.getEntries = async (req, res, next) => {
    try {

        const { search } = req.query;

        let filter = {};

        if (search) {
            filter.title = {
                $regex: search,
                $options: "i"
            };
        }

        const entries = await Journex.find({
            ...filter,
            isPublic: true
        })
            .populate("author", "username email")
            .populate("comment")
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            entries
        });

    } catch (err) {
        next(err);
    }
};


module.exports.getComments = async (req, res, next) => {
    try {

        const { search } = req.query;

        let filter = {};

        if (search) {
            filter.text = {
                $regex: search,
                $options: "i"
            };
        }

        const comments = await Comment.find(filter)
            .populate("author", "username")
            .populate("entry", "title")
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            comments
        });

    } catch (err) {
        next(err);
    }
};