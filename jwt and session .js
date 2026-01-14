const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');

const app = express();
const PORT = 1591;

app.use(express.json());

/* ---------------- SESSION SETUP ---------------- */
app.use(
  session({
    secret: 'session_secret_key',
    resave: false,
    saveUninitialized: false
  })
);

/* ---------------- JWT SECRET ---------------- */
const JWT_SECRET = 'jwt_secret_key';

/* ---------------- DUMMY USER ---------------- */
const USER = {
  id: 1,
  username: 'admin',
  password: '1234'
};

/* ================= SESSION LOGIN ================= */
app.post('/login-session', (req, res) => {
  const { username, password } = req.body;

  if (username === USER.username && password === USER.password) {
    req.session.userId = USER.id;
    res.send('session login success');
  } else {
    res.status(401).send('invalid credentials');
  }
});

/* ---------------- SESSION PROTECTED ROUTE ---------------- */
app.get('/profile-session', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).send('not logged in');
  }
  res.send('session protected data');
});

/* ---------------- SESSION LOGOUT ---------------- */
app.post('/logout-session', (req, res) => {
  req.session.destroy(() => {
    res.send('session logged out');
  });
});

/* ================= JWT LOGIN ================= */
app.post('/login-jwt', (req, res) => {
  const { username, password } = req.body;

  if (username === USER.username && password === USER.password) {
    const token = jwt.sign(
      { id: USER.id },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } else {
    res.status(401).send('invalid credentials');
  }
});

/* ---------------- JWT MIDDLEWARE ---------------- */
function verifyJWT(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send('token missing');
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send('invalid token');
    }
    req.userId = decoded.id;
    next();
  });
}

/* ---------------- JWT PROTECTED ROUTE ---------------- */
app.get('/profile-jwt', verifyJWT, (req, res) => {
  res.send('jwt protected data');
});

/* ---------------- SERVER ---------------- */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
