const express = require('express');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { 
    DynamoDBDocumentClient, 
    GetCommand, 
    PutCommand, 
    DeleteCommand, 
    ScanCommand 
} = require('@aws-sdk/lib-dynamodb');

const app = express();
app.use(express.json());

// Initialize DynamoDB client
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.TABLE_NAME || "express-ddb-table";

// List all items
app.get('/items', async (req, res) => {
    try {
        const command = new ScanCommand({
            TableName: TABLE_NAME
        });
        
        const response = await docClient.send(command);
        res.json(response.Items);
    } catch (error) {
        console.error('Error listing items:', error);
        res.status(500).json({ error: 'Failed to list items' });
    }
});

// Get single item
app.get('/items/:id', async (req, res) => {
    try {
        const command = new GetCommand({
            TableName: TABLE_NAME,
            Key: {
                id: req.params.id
            }
        });
        
        const response = await docClient.send(command);
        
        if (!response.Item) {
            return res.status(404).json({ error: 'Item not found' });
        }
        
        res.json(response.Item);
    } catch (error) {
        console.error('Error getting item:', error);
        res.status(500).json({ error: 'Failed to get item' });
    }
});

// Create item
app.post('/items', async (req, res) => {
    try {
        const item = {
            id: Date.now().toString(), // Simple ID generation
            ...req.body,
            createdAt: new Date().toISOString()
        };

        const command = new PutCommand({
            TableName: TABLE_NAME,
            Item: item
        });
        
        await docClient.send(command);
        res.status(201).json(item);
    } catch (error) {
        console.error('Error creating item:', error);
        res.status(500).json({ error: 'Failed to create item' });
    }
});

// Delete item
app.delete('/items/:id', async (req, res) => {
    try {
        const command = new DeleteCommand({
            TableName: TABLE_NAME,
            Key: {
                id: req.params.id
            }
        });
        
        await docClient.send(command);
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting item:', error);
        res.status(500).json({ error: 'Failed to delete item' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});