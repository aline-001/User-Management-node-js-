const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const db = require('./database');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// --- SWAGGER DEFINITION (Fixed) ---
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'User Management API',
            version: '1.0.0',
            description: 'Internship Backend Task',
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        paths: {
            '/api/users/register': {
                post: {
                    summary: 'Register a user',
                    requestBody: {
                        required: true,
                        content: { 'application/json': { schema: { type: 'object', properties: { name: {type:'string'}, email: {type:'string'}, password: {type:'string'} } } } }
                    },
                    responses: { 201: { description: 'Success' } }
                }
            },
            '/api/users/login': {
                post: {
                    summary: 'Login',
                    requestBody: {
                        required: true,
                        content: { 'application/json': { schema: { type: 'object', properties: { email: {type:'string'}, password: {type:'string'} } } } }
                    },
                    responses: { 200: { description: 'Success' } }
                }
            },
            '/api/users': {
                get: {
                    summary: 'Get all users',
                    security: [{ bearerAuth: [] }],
                    responses: { 200: { description: 'Success' } }
                }
            }
        }
    },
    apis: [], // Keep this empty now to avoid the crash
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// --- ROUTES ---

app.get('/', (req, res) => res.send("API is working! Go to /api-docs for testing."));

app.post('/api/users/register', async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "Fields missing" });
    
    const hashedPassword = await bcrypt.hash(password, 10);
    db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: "User registered!" });
    });
});

app.post('/api/users/login', (req, res) => {
    const { email, password } = req.body;
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
        if (results.length === 0) return res.status(401).json({ message: "User not found" });
        const isMatch = await bcrypt.compare(password, results[0].password);
        if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: results[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user: { name: results[0].name, email: results[0].email } });
    });
});

app.get('/api/users', (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: "No token" });

    jwt.verify(token, process.env.JWT_SECRET, (err) => {
        if (err) return res.status(403).json({ message: "Invalid token" });
        db.query('SELECT id, name, email FROM users', (err, results) => {
            res.json(results);
        });
    });
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
    console.log('Test your API here: http://localhost:3000/api-docs');
});