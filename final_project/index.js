const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customerRoutes = require('./router/auth_users.js').router;
const generalRoutes = require('./router/general.js').router;

const app = express();
app.use(express.json());
app.use("/customer", session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}));
app.use("/customer/auth/*", (req, res, next) => {
  const { authorization } = req.session;
  if (!authorization || !authorization.accessToken) return res.status(403).json({message: "User not logged in"});
  const { accessToken } = authorization;
  jwt.verify(accessToken, "access", (err, user) => {
    if (err) return res.status(403).json({message: "User not authenticated"});
    req.user = user;
    next();
  });
});
const PORT = 5000;
app.use("/customer", customerRoutes);
app.use("/", generalRoutes);
app.listen(PORT, () => console.log("Server is running"));