require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const User = require('./Models/User');
 
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

app.use(express.json());

app.get('/health', (req, res) => {
    res.status(200).json({status: 'ok'})
})

app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json({data: users});
    } catch (error) {
        res.status(500).json({ error: 'Error fetching users' });
    }
})

app.post('/api/users', async(req, res) => {
    const {name, email} = req.body;
    if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required' });  
    }
 
    try {
        const user = new User({ name, email });
        
        await user.save();
        res.status(201).json({ data: user });
    } catch (error) {
        return res.status(500).json({ error: 'Error creating user' });
    }
})

app.listen(process.env.PORT || 3001, () => {
    console.log(`Server is running on port ${process.env.PORT || 3001}`);
});

