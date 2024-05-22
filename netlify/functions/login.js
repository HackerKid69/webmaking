const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI; // Replace with your MongoDB connection string
const jwtSecret = process.env.JWT_SECRET; // Replace with your JWT secret

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

        const user = await users.findOne({ username });
        if (!user) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Invalid username or password' })
            };
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Invalid username or password' })
            };
        }

        const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '1h' });
        return {
            statusCode: 200,
            body: JSON.stringify({ token })
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
