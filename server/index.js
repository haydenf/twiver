//importing
const express = require('express');
const cors    = require('cors');
const bodyParser = require('body-parser')
const monk = require('monk')
const morgan  = require('morgan')

// initialises //
app = express();
db = monk('localhost/twiver')
twivs = db.get('twivs')

app.use(cors());
app.use(bodyParser.json());


// validations //
// checking that they're sending information before sending to db, could use a validator package if this goes further
const validTwiv = (twiv) => {
    return twiv.name && twiv.name.toString().trim() !== '' &&
        twiv.content && twiv.content.toString().trim() !== '';
}

// routes //
app.get('/', (req, res) => {
    res.json({
        message: 'nice'
    });
});

app.post('/twivs', (req, res) => {
    if (validTwiv(req.body)) {
        const twiv = {
            name: req.body.name.toString(),
            content: req.body.content.toString()
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

app.get('/twivs', (req, res) => {
    twivs
        .find()
        .then (twivs => {
            res.json(twivs)
        });
});

// starting server //
app.listen(5000, () => {
    console.log('Listening on http://localhost:5000')
});
