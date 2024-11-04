import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI);

module.exports = async function (req, res) {
    if (req.method === 'POST') {
        const { selectedOption } = req.body;

        try {
            if (!selectedOption) {
                throw new Error('No selectedOption provided');
            }

            await client.connect();
            const database = client.db('selectionDB');
            const collection = database.collection('selections');

            await collection.insertOne({
                selectedOption,
                timestamp: new Date()
            });

            res.status(200).json({ message: 'Selection saved successfully' });
        } catch (error) {
            console.error('Error in submit-selection handler:', error.message);
            res.status(500).json({ message: 'Error saving selection', error: error.message });
        } finally {
            await client.close();
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
};
