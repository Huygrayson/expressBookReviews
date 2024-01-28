const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;
const cors = require('cors');

const app = express();

app.use(express.json());

app.use(cors({
    origin: '*',
    methods: 'GET,POST,PUT,PATCH', // Specify allowed HTTP methods
}))

app.use("/customer", session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true }))

app.use("/customer/auth/*", function auth(req, res, next) {
    //Write the authenication mechanism here
    let tkn = req.header('Authorization');
    var tokenValue;
    if (!tkn) return res.status(401).send("No Token");
    if (tkn.startsWith('Bearer ')) {
        tokenValue = tkn.slice(7, tkn.length).trimStart();
    }
    const verificationStatus = jwt.verify(tokenValue, "Thesecret");
    if (verificationStatus.user === "user") {
        console.log("Allow to access");
        next();
    }
    else {
        return res.status(401).json({ message: "Please login to access" });
    }
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
