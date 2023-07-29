const express = require('express');
const tasksRouter = express.Router();
const bodyParser = require('body-parser');

const pool = require('../modules/pool');

tasksRouter.post('/', (req, res) => {
    let newTask = req.body;
    console.log('new task in router post: ', newTask)
    let query = `INSERT INTO "tasks" ("task") VALUES ($1);`

        // send request to database
    pool.query(query, [newTask.task])
        .then(response => {
            res.sendStatus(201);
        })
        .catch(err => {
            console.log('error in server post', err)
            res.sendStatus(500)
        })
})

tasksRouter.get('/', (req, res) => {
    console.log('in router get')
    let query = `SELECT * FROM "tasks";`

    // send request to database
    pool.query(query)
        .then(result => {
            res.send(result.rows)
        })
        .catch (err => {
            console.log('error in router get: ', err);
        })
})


module.exports = tasksRouter