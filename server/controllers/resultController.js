import Result from '../models/Result.js';

// @desc    Get result by Roll Number
// @route   GET /api/results?rollNo=... or /api/results/:rollNo
// @access  Public
export const getResult = async (req, res) => {
    try {
        const rollNo = req.query.rollNo || req.params.rollNo;

        if (!rollNo) {
            return res.status(400).json({ success: false, message: 'Please provide a Roll Number' });
        }

        const result = await Result.findOne({ rollNo: rollNo.toUpperCase() });

        if (!result) {
            return res.status(404).json({ success: false, message: 'Result not found' });
        }

        res.status(200).json(result);
    } catch (error) {
        console.error('Error fetching result:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Create/Update Result
// @route   POST /api/results
// @access  Private (should be restricted, but keeping public for now as per missing context)
export const createResult = async (req, res) => {
    try {
        console.log('Creating result:', req.body);
        const { rollNo, ...data } = req.body;

        // Upsert: Update if exists, otherwise insert
        const result = await Result.findOneAndUpdate(
            { rollNo: rollNo.toUpperCase() },
            { rollNo: rollNo.toUpperCase(), ...data },
            { new: true, upsert: true, runValidators: true }
        );

        res.status(201).json({ success: true, data: result });
    } catch (error) {
        console.error('Error creating result:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};
