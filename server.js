const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json()); // Middleware to parse JSON

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/selectionDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Define a schema for selections
const selectionSchema = new mongoose.Schema({
    selectedOption: String,
    timestamp: { type: Date, default: Date.now }
});

const Selection = mongoose.model('Selection', selectionSchema);

// Handle selection submission
app.post('/submit-selection', async (req, res) => {
    const { selectedOption } = req.body;

    try {
        // Save selection to the database
        const newSelection = new Selection({ selectedOption });
        await newSelection.save();
        res.json({ message: 'Selection saved successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error saving selection' });
    }
});

// Aggregation endpoint to get tally
app.get('/get-tally', async (req, res) => {
    try {
        const results = await Selection.aggregate([
            { $group: { _id: "$selectedOption", count: { $sum: 1 } } }
        ]);
        res.json(results); // Send the aggregated results back as JSON
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving tally' });
    }
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
