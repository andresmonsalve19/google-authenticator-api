const getCode = require('./authenticatorCode');
const express = require('express');
const {PORT} = require('./config')

const app = express();

app.get('/api/:MFAKey', (req, res) => {
    let MFAKey = req.params.MFAKey;
    
    try {
        let currentSecret = getCode(MFAKey, new Date().getTime());
    
        res.send({
            code: currentSecret
        })
    } catch (error) {
        res.status(500).json({
            message: "MFA Key not valid",
            error: error.message
        })
    }
    
})

app.use((req, res, next) => {
    console.log(req.query)
    res.status(404).json({
        message: "MFA Key not found or not exist"
    })
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});