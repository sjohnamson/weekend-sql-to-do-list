$(document).ready(function () {
    console.log('jQuery sourced.');
  
    getTask();
    btnHandlers();
})

function btnHandlers() {
    $('#addTaskBtn').on('click', addTask)

}

function addTask(event) {
    event.preventDefault()
    console.log('in addtask')

    // make object /tasks
    let newTask = $('#taskInput').val()

    postToTasks(newTask) 

}

    // ajax post to server
    function postToTasks(dataToPost) {
        console.log('data to post: ', dataToPost)
    $.ajax({
        method: 'POST',
        url: '/tasks',
        data: dataToPost
    })
        .then(response => {
            console.log('post response: ', response)
//    getTask call to reload list
            getTask()
        })
        .catch(err => {
            console.log('post error', err);

        })
}

// retrieves new task list and sends it ot render
function getTask() {
    console.log('in getTask')

    // ajjax get to retrieve task list
    $.ajax({
        method: 'GET',
        url: 'tasks'
    })
        .then(response => {
            console.log('in client get', response);
            // assign response to a variable
            let taskList = response;
            renderTaskList(taskList)
        })
        .catch(err => {
            console.log('error in client get', err)
            alert('Unable to add a new task, try again later')
        })
}

function renderTaskList(list) {
    // empty out the list so it can be reloaded
    $('#taskList').empty();

    // loop through the new list and append them to the DOM
    for (let item of list) {
        // assign newRow to row to be added and make it a jquery thing so we can add ID
        let newRow = $(`
            <li>${item.task} <button>Complete</button> <button>Delete</button></li>
        `)

        newRow.data('id', item.id)

        // append to DOM
        $('#taskList').append(newRow)
    }
}
