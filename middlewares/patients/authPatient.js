const patientAuth = (req, res, next) => {
    // const token = req.headers.authToken;
    console.log("patient middleware")
    console.log(token)
    if (!token) {
        return res.status(401).json({ error: 'Authentication token is missing.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Verify the token
        if (decoded.role !== 'patient') {
            return res.status(403).json({ error: 'Access denied. Only patients are allowed.' });
        }

        req.user = decoded; // Attach user info to the request
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token.' });
    }
};

module.exports = patientAuth;