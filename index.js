// implement your API here
const express = require('express');
const app = express();

app.use(express.json());

const database = require('./data/db.js');

app.get('/api/users', (req, res) => {

    database.find().then(data => {

        res.status(200).json(data);

    }).catch(err => {

        console.log(err);
        res.status(500).json({error: 'An error has occured!'});

    });

});

app.get('/api/users/:ID', (req, res) => {

    database.findById(req.params.ID).then(data => {

        if (data === undefined)
            res.status(404).json({error: 'The user with the specified ID does not exist.'});
        else
            res.status(200).json(data);

    }).catch(err => {

        console.log(err);
        res.status(500).json({error: 'There was an error while saving the user to the database!'});

    });

});

app.post('/api/users', (req, res) => {

    if (req.body.name === undefined || req.body.bio === undefined)
        res.status(400).json({ error: 'Please provide name and bio for the user.' });

    database.insert(req.body).then(result => {

        console.log(result);
        database.findById(result.id).then(user => {
            res.status(201).json({user});
        });

    }).catch(err => {

        console.log(err);
        res.status(500).json({error: 'There was an error while saving the user to the database!'});

    })

});

app.delete('/api/users/:ID', (req, res) => {

    database.remove(req.params.ID).then(data => {

        if (data === undefined)
            res.status(404).json({error: 'The user with the specified ID does not exist.'});
        else
            res.status(200).json(data);

    }).catch(err => {

        console.log(err);
        res.status(500).json({error: 'The user could not be removed!'});

    });

});

app.put('/api/users/:ID', (req, res) => {

    if (req.body.name === undefined || req.body.bio === undefined)
        res.status(400).json({ error: 'Please provide name and bio for the user.' });

    database.update(req.params.ID, req.body).then(data => {

        if (data === undefined)
            res.status(404).json({error: 'The user with the specified ID does not exist.'});
        else
            database.findById(req.params.ID).then(user => res.status(200).json(user));

    }).catch(err => {

        console.log(err);
        res.status(500).json({error: 'The user information could not be modified!'});

    });

});

app.listen(5000, '127.0.0.1', () => console.log('Server listening on port 5000.'));