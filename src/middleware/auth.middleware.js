const jwt = require('jsonwebtoken')

module.exports = {
    requireAuth: (req, res, next) => {
        // console.log('requireAuth');
        // console.log(req.url);
        const token = req.cookies.jwt;
        if (req.url === '/login') {
            next();
        }
        else if (token) {
            jwt.verify(token, 'mySecretKey', (err, decodedToken) => {
                if (err) {
                    console.log(err.message)
                    res.redirect('/login')
                } else {
                    next();
                }
            })
        }
        else {
            res.redirect('/login');
        }
    }
}