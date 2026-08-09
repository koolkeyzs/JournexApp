const Announcement = require("../model/Announcement");

module.exports.getAllAnnouncements = async (req, res, next) => {
    try {
        const announcements = await Announcement.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            announcements
        });
    } catch (err) {
        next(err);
    }
};

// ADMIN — create announcement
module.exports.createAnnouncement = async (req, res, next) => {
    try {

        const { title, message, startsAt, expiresAt } = req.body;

        if (!title || !message || !startsAt || !expiresAt) {
            return res.status(400).json({
                message: "All fields are required."
            });
        }

        if (new Date(expiresAt) <= new Date(startsAt)) {
            return res.status(400).json({
                message: "Expiry time must be after the start time."
            });
        }

        const announcement = new Announcement({
            title,
            message,
            startsAt,
            expiresAt
        });

        await announcement.save();

        res.status(201).json({
            success: true,
            message: "Announcement created successfully.",
            announcement
        });

    } catch (err) {
        next(err);
    }
};


// USER — get currently active announcement
module.exports.getActiveAnnouncement = async (req, res, next) => {
    try {

        const now = new Date();

        const announcement = await Announcement.findOne({
            startsAt: { $lte: now },
            expiresAt: { $gt: now }
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            announcement
        });

    } catch (err) {
        next(err);
    }
};

module.exports.deleteAnnouncement = async (req, res, next) => {
  try {
    const { announcementId } = req.params;

    const announcement = await Announcement.findByIdAndDelete(
      announcementId
    );

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found",
      });
    }

    res.json({
      success: true,
      message: "Announcement deleted",
    });
  } catch (err) {
    next(err);
  }
};