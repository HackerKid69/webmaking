const bcrypt = require('bcryptjs');
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI; // Replace with your MongoDB connection string

exports.handler = async (event, context) => {
    const { username, password } = JSON.parse(event.body);

    if (!username || !password) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Username and password are required' })
        };
    }

    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        const db = client.db('website-maker');
        const users = db.collection('users');

        const existingUser = await users.findOne({ username });
        if (existingUser) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Username already exists' })
            };
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = { username, password: hashedPassword };

        await users.insertOne(newUser);
        return {
            statusCode: 201,
            body: JSON.stringify({ message: 'User registered successfully' })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' })
        };
    } finally {
        await client.close();
    }
};
