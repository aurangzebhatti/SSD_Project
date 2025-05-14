const express = require('express');
const db = require('./db');
const verificationEmail = require('./mailer');
const multer = require('multer');
const cors = require('cors');
const crypto = require('crypto');
const session = require('express-session');
const bcrypt = require('bcrypt');
const path = require('path');
const { on } = require('events');
const app = express();
const PORT = 3000;

app.use(express.json());

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

app.use('/images', express.static(path.join(__dirname, 'images')));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

app.use(session({
  secret: 'your-secret-key', // Change this to a strong secret in production
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true only if using HTTPS
}));

// API to handle product upload
app.post('/add-product', upload.single('image'), (req, res) => {
  
  const { name, description, price, category } = req.body;
  const image = req.file ? req.file.filename : null;

  const checkSql = 'SELECT * FROM products WHERE name = ? AND category = ?';
  db.query(checkSql, [name, category], (err, results) => {
    if (err) {
      console.error('Error checking for duplicate product:', err);
      return res.status(500).json({ message: 'Database error during duplication check' });
    }

    if (results.length > 0) {
      // Duplicate found
      return res.json({ message: 'Product with same name and category already exists' });
    }

  const sql = 'INSERT INTO products (name, description, price, category,imgaddress) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [name, description, price, category, image], (err, result) => {
    if (err) {
      console.error('Error inserting product:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.status(200).json({ message: 'Product saved!', productId: result.insertId });
  });
});
});

app.get('/home', (req, res) => {
  const sql = 'SELECT * FROM products';
  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error fetching products:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.status(200).json({ p: result });
  });
});

app.post('/signup', (req, res) => {
  const { name, email, password } = req.body;

  // Password validation
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({ 
      message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
      exitsEmail: false 
    });
  }

  const checkEmailSql = 'SELECT * FROM users WHERE email = ?';
  db.query(checkEmailSql, [email], (err, results) => {
    if (err) {
      console.error('Database error during email check:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (results.length > 0) {
      return res.json({ message: 'Email already registered. Please log in.' ,exitsEmail: true});
    }

    const code = crypto.randomInt(100000, 999999).toString();
    req.session.verification = { email, name, password, code };
    verificationEmail(email, code);
    res.status(200).json({ message: 'Verification code sent to email' ,exitsEmail: false});
  });
});

app.post('/verify', async (req, res) => {
  const { code } = req.body;

  if (!req.session.verification) {
    return res.status(400).json({ message: 'No verification session found.' });
  }

  const { email, name, password, code: sessionCode } = req.session.verification;

  if (code !== sessionCode) {
    return res.status(400).json({ message: 'Invalid verification code.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10); // 10 = salt rounds

    const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    db.query(sql, [name, email, hashedPassword], (err, result) => {
      if (err) {
        console.error('Database error during user registration:', err);
        return res.status(500).json({ message: 'Failed to register user.' });
      }

      req.session.verification = null; // Clear session after success
      return res.status(200).json({ message: 'Verification successful. Account created.' });
    });
  } catch (err) {
    console.error('Error hashing password:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if(email=="admin@gmail.com" && password=="admin"){
    return res.json({ isAdmin: true});
  }

  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [email], async (err, result) => {
    if (err) {
      console.error('Database error during login:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (result.length === 0) {
      return res.status(400).json({ message: 'User not found.' , isAdmin:false});
    }

    // Compare the password with the hashed password stored in the database
    const user = result[0];
    
    const match = await bcrypt.compare(password, user.password);

    if (match) {
      
      const code = crypto.randomInt(100000, 999999).toString();
      req.session.user=user;
      req.session.code=code;
      verificationEmail(email, code);
      res.status(200).json({ message: 'Verification code sent to email' });
    } else {
      return res.status(400).json({ message: 'Incorrect password.' });
    }
  });
});

app.post('/loginVerify', async (req, res) => {

  const {code} =req.body;
  if (!req.session.code) {
    return res.status(400).json({ message: 'No verification session found.' });
  }

  const sessioncode = req.session.code;

  if (code === sessioncode) {
    req.session.userId = req.session.user.id;  
    return res.json({ valid: true});
  }

  else{
    return res.json({ valid: false});
  }

});

app.get('/checklogin', (req, res) => {
  if (req.session.userId) {
    res.status(200).json({
      loggedIn: true
    });
  } else {
    res.status(200).json({ loggedIn: false });
  }
});

app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to log out' });
    }
    res.status(200).json({ message: 'Logged out successfully' });
  });
});

app.post('/add-to-cart', (req, res) => {
   const { Id, Name, Description, qty, Price, Total } = req.body;

   if(!req.session.userId){
    return res.json({ message: 'You must be logged in to add items to your cart.' });
  
   }
  if (!req.session.cart) {
    req.session.cart = [];
  }

  const existingItemIndex = req.session.cart.findIndex(item => item.id === Id);

  if (existingItemIndex !== -1) {
    
    req.session.cart[existingItemIndex].quantity += qty;
    req.session.cart[existingItemIndex].total += Total;
    req.session.cart[existingItemIndex].pricePerItem = Price;

  } else {

    const cartItem = {
      id: Id,
      name: Name,
      description: Description,
      quantity: qty,
      pricePerItem: Price,
      total: Total
    };
    req.session.cart.push(cartItem);
   
  }

  res.status(200).json({ message: 'Item added to cart.' });
});

app.get('/get-cart',(req,res)=>{
  if (!req.session.cart) {
    req.session.cart = [];
  }

  res.json({cartData: req.session.cart});

});

app.put('/update-cart', (req, res) => {
  const { cart } = req.body;

  if (!Array.isArray(cart)) {
      return res.status(400).json({ error: 'Invalid cart data' });
  }

  req.session.cart = cart;

  res.json({ message: 'Cart updated successfully', cart });
});

app.post('/create-order', (req, res) => {
  const { email, name, city, address, paymentMethod, total } = req.body;
  const userId = req.session.userId;
  const cart = req.session.cart || [];

  // Insert into orders table
  db.query(
    "INSERT INTO orders (userId, name, email, city, address, paymentMethod, total) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [userId, name, email, city, address, paymentMethod, total],
    (err, orderResult) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Order failed" });
      }

      const orderId = orderResult.insertId;

      // Insert each cart item into orderdetail table
      const insertItem = (index) => {
        if (index >= cart.length) {
          req.session.cart = [];
          return res.json({ message: "Order placed successfully" });
        }

        const item = cart[index];
        db.query(
          "INSERT INTO orderdetail (orderId, name, description, quantity, pricePerItem, charges, tax, total) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
          [orderId, item.name, item.description, item.quantity, item.pricePerItem, 150, item.total*0.15, item.total],
          (err) => {
            if (err) {
              console.error(err);
              return res.status(500).json({ message: "Failed to insert order item" });
            }
            insertItem(index + 1);
          }
        );
      };

      insertItem(0);
    }
  );
});




app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});