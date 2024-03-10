const jwt = require('jsonwebtoken');
const keys = require('./../../config/db.config');


let generateToken = (data) => {
   // console.log("data", data)
    let token = jwt.sign({ userId: data.userId, email: data.email, mobile: data.mobile, role: data.role }, keys.jwtSecret, {
        expiresIn: 365 * 60 * 60 * 24 //'365d'  // expires in 365 days  //"1h"
    });
    return token
}

const decodeJwtToken = (jwtToken) => {
    let secretCode = keys.jwtSecret;

    return new Promise((resolve, reject) => {
        jwt.verify(jwtToken, secretCode, (error, decodedData) => {
            if (!error) resolve(decodedData);
            else reject({ status: 'unauthorised', message: 'jwt expired' });
        });
    });
};

let hasLecturerRole = (req, res, next) => {
    const token = req.headers['x-access-code'];
    if (!token)
        return res.status(401).json({ success: false, message: "You are not authorised." });

    decodeJwtToken(token)
        .then(decoded => {
//console.log("de", decoded)
            req.decoded = decoded;
            req.userID = decoded.userID;
            let isLecturer = 'lecturer';
            if (isLecturer === decoded.role) {
                next();
                return null;
            } else
                res.status(401).json({ success: false, message: "You don't have access." });
        })
        .catch((error) => {
            res.status(401).json({ success: false, message: "Your Login Token Expired. Please Login." });
        });

};

let hasLearnerRole = (req, res, next) => {
    const token = req.headers['x-access-code'];
    if (!token)
        return res.status(401).json({ success: false, message: "You are not authorised." });

    decodeJwtToken(token)
        .then(decoded => {
           // console.log("de", decoded)
            req.decoded = decoded;
            req.userID = decoded.userID;
            let isLearner = 'learner';
            if (isLearner === decoded.role) {
                //console.log("learner")
                next();
                return null;
            } else
                res.status(401).json({ success: false, message: "You don't have access." });
        })
        .catch((error) => {
            res.status(401).json({ success: false, message: "Your Login Token Expired. Please Login." });
        });

};

let authenticateJWT = (req, res, next) => {
    let authHeader;
    let token;
    authHeader = req.headers.authorization;
    //console.log('authHeader', authHeader);
    if (authHeader == "" || typeof authHeader === 'undefined') {
        authHeader = req.headers['x-access-code'];
        //console.log('authHeader', authHeader);
        token = authHeader;
    } else {
        token = authHeader.split(' ')[1];
    }
    if (authHeader) {
        jwt.verify(token, keys.jwtSecret, (err, user) => {
            if (err) {
                //console.log('err', err)
                res.status(401).send({
                    status: false,
                    message: "Un-Authorized / token expired"
                });
            } else if (user) {
               // console.log("user---", user)
                req.user = user;
                next();
            }
            // console.log("cc", user)

        });
    } else {
        res.status(401).send({
            status: false,
            message: "Un-Authorized"
        });
    }
};

let decodeJWTForUser = (token) => {

    return jwt.verify(token, keys.jwt.secret)
}


module.exports = {
    generateToken,
    hasLecturerRole,
    authenticateJWT,
    decodeJWTForUser,
    hasLearnerRole
}