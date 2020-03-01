//importing
const express = require('express');
const cors    = require('cors');
const bodyParser = require('body-parser')
const monk = require('monk')
const rateLimit = require("express-rate-limit");

// initialises //
const app = express();
const db = monk(process.env.MONGO_URI || 'localhost/twiver')
const twivs = db.get('twivs')

app.use(cors());
app.use(bodyParser.json());


// routes //
app.get('/', (req, res) => {
    res.json({
        message: 'nice'
    });
});

app.get('/twivs', (req, res) => {
    twivs
        .find()
        .then (twivs => {
            res.json(twivs)
        });
});

// validations //
// checking that they're sending information before sending to db, could use a validator package if this goes further
const validTwiv = (twiv) => {
    return twiv.name && twiv.name.toString().trim() !== '' &&
        twiv.content && twiv.content.toString().trim() !== '';
}

// using middleswares works depending on where you put it, being here it'll own limit the post
app.use(rateLimit({
    windowMs: 15 * 1000, // 15 seconds
    max: 1
  }))

app.post('/twivs', (req, res) => {
    if (validTwiv(req.body)) {
        const twiv = {
            name: req.body.name.toString(),
            content: req.body.content.toString(),
            created: new Date()
        };
        // db insert using monk
        twivs
            .insert(twiv)
            .then(createdTwiv => {
                res.json(createdTwiv)
            });
    } else {
        res.status(442);
        res.json({
            message: 'Please fill in the fields'
        });
    };
});

// starting server //
app.listen(5000, () => {
    console.log('Listening on http://localhost:5000')
});
