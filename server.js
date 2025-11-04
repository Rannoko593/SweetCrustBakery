require('dotenv').config();
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const app = express();

// ----------------- CORS SETUP -----------------
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3003', 'http://localhost:3005', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ----------------- MIDDLEWARE -----------------
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// ----------------- DATABASE -----------------
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'bakerydb',
  password: process.env.DB_PASSWORD || '1234',
  port: process.env.DB_PORT || 5432,
});

// Initialize Database Tables
const initializeDatabase = async () => {
  try {
    console.log('🔄 Initializing database...');

    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'staff',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create products table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        image_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create orders table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        customer_name VARCHAR(100) NOT NULL,
        product_id INTEGER REFERENCES products(id),
        quantity INTEGER NOT NULL,
        order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(20) DEFAULT 'Pending',
        created_by INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create messages table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create default admin user if not exists
    const adminCheck = await pool.query('SELECT * FROM users WHERE email = $1', ['admin@bakery.com']);
    if (adminCheck.rows.length === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await pool.query(
        'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)',
        ['Admin User', 'admin@bakery.com', hashedPassword, 'admin']
      );
      console.log('✅ Default admin user created: admin@bakery.com / admin123');
    }

    // Create default staff user if not exists
    const staffCheck = await pool.query('SELECT * FROM users WHERE email = $1', ['staff@bakery.com']);
    if (staffCheck.rows.length === 0) {
      const hashedPassword = await bcrypt.hash('staff123', 10);
      await pool.query(
        'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)',
        ['Staff User', 'staff@bakery.com', hashedPassword, 'staff']
      );
      console.log('✅ Default staff user created: staff@bakery.com / staff123');
    }

    // Create some sample products if none exist
    const productsCheck = await pool.query('SELECT * FROM products');
    if (productsCheck.rows.length === 0) {
      const sampleProducts = [
        ['Artisan Bread', 'Freshly baked artisan bread', 25.99],
        ['Chocolate Cake', 'Rich chocolate cake with frosting', 45.50],
        ['Blueberry Muffin', 'Fresh blueberry muffins', 12.75],
        ['Croissant', 'Buttery French croissant', 8.99],
        ['Apple Pie', 'Homemade apple pie', 32.25]
      ];

      for (const [name, description, price] of sampleProducts) {
        await pool.query(
          'INSERT INTO products (name, description, price) VALUES ($1, $2, $3)',
          [name, description, price]
        );
      }
      console.log('✅ Sample products created');
    }

    console.log('✅ Database initialized successfully');
  } catch (err) {
    console.error('❌ Database initialization error:', err);
  }
};

// ----------------- MULTER -----------------
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// ----------------- HELPER FUNCTIONS -----------------
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  
  jwt.verify(token, process.env.JWT_SECRET || 'secretkey', (err, user) => {
    if (err) {
      console.error('JWT verification error:', err);
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

const restrictToAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// ----------------- ROUTES -----------------

// Health check
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'OK', database: 'Connected' });
  } catch (err) {
    res.status(500).json({ status: 'Error', database: 'Disconnected' });
  }
});

// Register
app.post('/api/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields required' });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  const userRole = role === 'admin' ? 'admin' : 'staff';
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const result = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
      [name, email, hashedPassword, userRole]
    );
    
    res.status(201).json({ 
      message: 'User registered successfully',
      user: result.rows[0]
    });
  } catch (err) {
    console.error('Registration error:', err);
    if (err.code === '23505') {
      res.status(400).json({ error: 'Email already registered' });
    } else {
      res.status(500).json({ error: 'Server error during registration' });
    }
  }
});

// Login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { 
        id: user.id, 
        role: user.role, 
        name: user.name 
      }, 
      process.env.JWT_SECRET || 'secretkey', 
      { expiresIn: '24h' }
    );
    
    res.json({ 
      token, 
      role: user.role, 
      name: user.name 
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// PRODUCT ROUTES

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY name');
    res.json(result.rows);
  } catch (err) {
    console.error('Products fetch error:', err);
    res.status(500).json({ error: 'Server error while fetching products' });
  }
});

// Add product (Admin only)
app.post('/api/products', authenticate, restrictToAdmin, upload.single('image'), async (req, res) => {
  const { name, description, price } = req.body;
  const image_url = req.file ? `/uploads/${req.file.filename}` : null;

  if (!name || !price) {
    return res.status(400).json({ error: 'Name and price required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO products (name, description, price, image_url) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, description, parseFloat(price), image_url]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Product creation error:', err);
    res.status(500).json({ error: 'Server error while creating product' });
  }
});

// Update product (Admin only)
app.put('/api/products/:id', authenticate, restrictToAdmin, upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { name, description, price } = req.body;

  if (!name || !price) {
    return res.status(400).json({ error: 'Name and price required' });
  }

  try {
    const productCheck = await pool.query('SELECT * FROM products WHERE id = $1', [parseInt(id)]);
    if (productCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    let image_url = productCheck.rows[0].image_url;
    if (req.file) {
      image_url = `/uploads/${req.file.filename}`;
    }

    const result = await pool.query(
      `UPDATE products SET name = $1, description = $2, price = $3, image_url = $4 WHERE id = $5 RETURNING *`,
      [name, description, parseFloat(price), image_url, parseInt(id)]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Product update error:', err);
    res.status(500).json({ error: 'Server error while updating product' });
  }
});

// Delete product (Admin only)
app.delete('/api/products/:id', authenticate, restrictToAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const productCheck = await pool.query('SELECT * FROM products WHERE id = $1', [parseInt(id)]);
    if (productCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const ordersCheck = await pool.query('SELECT * FROM orders WHERE product_id = $1', [parseInt(id)]);
    if (ordersCheck.rows.length > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete product. There are existing orders for this product.' 
      });
    }

    await pool.query('DELETE FROM products WHERE id = $1', [parseInt(id)]);
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Product deletion error:', err);
    res.status(500).json({ error: 'Server error while deleting product' });
  }
});

// ORDER ROUTES

// Add order (Staff or Admin)
app.post('/api/orders', authenticate, async (req, res) => {
  const { customer_name, product_id, quantity, order_date, status } = req.body;

  console.log('Creating order with data:', { customer_name, product_id, quantity, order_date, status });

  if (!customer_name || !customer_name.trim()) {
    return res.status(400).json({ error: 'Customer name is required' });
  }
  if (!product_id) {
    return res.status(400).json({ error: 'Product is required' });
  }
  if (!quantity || quantity < 1) {
    return res.status(400).json({ error: 'Valid quantity is required' });
  }
  if (!order_date) {
    return res.status(400).json({ error: 'Order date is required' });
  }

  // Validate status
  const validStatuses = ['Pending', 'Completed', 'Cancelled'];
  const orderStatus = status && validStatuses.includes(status) ? status : 'Pending';

  try {
    const productCheck = await pool.query('SELECT * FROM products WHERE id = $1', [parseInt(product_id)]);
    if (productCheck.rows.length === 0) {
      return res.status(400).json({ error: 'Product not found' });
    }

    const result = await pool.query(
      `INSERT INTO orders (customer_name, product_id, quantity, order_date, status, created_by) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [
        customer_name.trim(),
        parseInt(product_id),
        parseInt(quantity),
        new Date(order_date),
        orderStatus,
        req.user.id
      ]
    );

    console.log('Order created successfully with status:', orderStatus);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Order creation error:', err);
    res.status(500).json({ error: 'Server error while creating order' });
  }
});

// View orders (Admin sees all, staff sees own)
app.get('/api/orders', authenticate, async (req, res) => {
  try {
    let result;
    if (req.user.role === 'admin') {
      result = await pool.query(
        `SELECT o.*, p.name AS product_name, p.price 
         FROM orders o JOIN products p ON o.product_id = p.id 
         ORDER BY o.order_date DESC, o.id DESC`
      );
    } else {
      result = await pool.query(
        `SELECT o.*, p.name AS product_name, p.price 
         FROM orders o JOIN products p ON o.product_id = p.id 
         WHERE o.created_by = $1 
         ORDER BY o.order_date DESC, o.id DESC`,
        [req.user.id]
      );
    }
    
    console.log(`Found ${result.rows.length} orders`);
    res.json(result.rows);
  } catch (err) {
    console.error('Orders fetch error:', err);
    res.status(500).json({ error: 'Server error while fetching orders' });
  }
});

// Update order status (Admin only)
app.put('/api/orders/:id', authenticate, restrictToAdmin, async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  if (!['Pending', 'Completed', 'Cancelled'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  try {
    const result = await pool.query(
      'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
      [status, parseInt(id)]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Order update error:', err);
    res.status(500).json({ error: 'Server error while updating order' });
  }
});

// Contact messages
app.post('/api/messages', async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields required' });
  }

  try {
    await pool.query(
      'INSERT INTO messages (name, email, message) VALUES ($1, $2, $3)',
      [name, email, message]
    );
    res.json({ message: 'Message sent successfully' });
  } catch (err) {
    console.error('Message creation error:', err);
    res.status(500).json({ error: 'Server error while sending message' });
  }
});

// Initialize database when server starts
initializeDatabase();

// ----------------- START SERVER -----------------
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
  console.log(`🔑 Default admin: admin@bakery.com / admin123`);
  console.log(`👨‍💼 Default staff: staff@bakery.com / staff123`);
});