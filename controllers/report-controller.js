const Report = require("../model/report");

module.exports.createReport = async (req, res, next) => {

    try {

        const { reason } = req.body;


        // validate reason 

        if(!reason || !reason.trim()){
            return res.status(400).json({
                message: 'Please provide a reason for the report'
            })
        }

        // Check if the user has already reported this entry
        const existingReport = await Report.findOne({
            reporter: req.user._id,
            entry: req.params.id
        });

        if (existingReport) {
            return res.status(400).json({
                success: false,
                message: "You have already reported this entry."
            });
        }

        // Create new report
        const report = new Report({
            reporter: req.user._id,
            entry: req.params.id,
            reason
        });

        await report.save();

        res.status(201).json({
            success: true,
            message: "Report submitted successfully."
        });

    } catch (err) {
        next(err);
    }

};

