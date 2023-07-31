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
    let sort = req.query.sort;
    let query = `SELECT * FROM "tasks" ORDER BY "id" ASC;`

    // send request to database
    pool.query(query)
        .then(result => {
            let newTasks = result.rows
            // if request comes from reSort button reverse the order of the array
            if (sort == 'switch') {
                newTasks = newTasks.reverse()
            }
            res.send(newTasks)
        })
        .catch(err => {
            console.log('error in router get: ', err);
        })
})

tasksRouter.put( '/updatetask/:id', (req, res) => {
    console.log( 'in route put:', req.params.id, req.body );
    const taskID = req.params.id
    const taskPending = req.body.newPending

    // set database query
    const query = `UPDATE "tasks" SET pending = $1, completetime = now() WHERE id=$2;`;
    const values =[taskPending, taskID];

    pool.query(query, values)
        .then( (results)=>{
        res.sendStatus( 200 );
    }).catch( ( err )=>{
        console.log( 'error with update:', err );
        res.sendStatus( 500 );
    })
})

tasksRouter.delete('/deletetask/:id', (req, res) => {
    const taskID = req.params.id
    let query = `DELETE FROM "tasks" WHERE id=$1`

    pool.query(query, [taskID]) 
        .then((response) => {
            res.sendStatus(200)
        })
        .catch(err => {
            console.log('error deleting book', err);
            res.sendStatus(500);
        });
})


module.exports = tasksRouter