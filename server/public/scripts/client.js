$(document).ready(function () {
    console.log('jQuery sourced.');

    getTasks();
    btnHandlers();
})

function btnHandlers() {
    $('#addTaskBtn').on('click', handleAdd)
    $('#taskList').on('click', '.completeBtn', handleComplete)
    $('#taskList').on('click', '.deleteBtn', handleDelete)

}

function handleAdd(event) {
    event.preventDefault()
    console.log('in addtask')

    // make object /tasks
    let newTask = {
        task: $('#taskInput').val()
    }

    postToTasks(newTask)

}

function handleComplete() {
    console.log('in handle complete')
    // set task id to the id of the li
    const taskID = $(this).data('id');
    const pendingStatus = $(this).data('pending');
    console.log('pending status: ', pendingStatus)
    console.log('taskID: ', taskID)
    // send put request to the server
    $.ajax({
        method: 'PUT',
        url: `/tasks/updatetask/${taskID}`,
        data: {
            newPending: !pendingStatus
        }
    })
        .then((response) => {
            console.log('update task id: ', `${taskID}`)
            getTasks()
        })
        .catch((response) => {
            console.log('error in put ajax')
        })

}

function handleDelete() {
    console.log('in handle delete')
    // set task id to the id of the li
    let taskID = $(this).data('id');

    // send delete request to the server
    $.ajax({
        method: 'DELETE',
        url: `/tasks/deletetask/${taskID}`
    })
        .then((response) => {
            console.log('delete task id: ', `${taskID}`)
            getTasks()
        })
        .catch((response) => {
            console.log('error in delete ajax')
        })
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
            getTasks()
        })
        .catch(err => {
            console.log('post error', err);

        })
}



// retrieves new task list and sends it ot render
function getTasks() {
    console.log('in getTasks')

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
        let newRow = (`
            <tr>
                <td>${item.task}</td>
                <td><button class='completeBtn btn btn-outline-success' 
                    data-id='${item.id}' 
                    data-pending='${item.pending}'>
                    Mark Finished!
                </button></td> 
                <td><button class='deleteBtn btn btn-outline-danger' 
                    data-id='${item.id}'>
                    Delete
                </button></td>
            </tr>
        `)

        if (item.pending == true) {
     
            newRow = (`
            <tr class="text-decoration-line-through text-success">
                <td class="text-secondary">${item.task}</td>
                <td><button class='completeBtn btn btn-outline-danger' 
                    data-id='${item.id}' 
                    data-pending='${item.pending}'>
                    ✓
                </button></td> 
                <td><button class='deleteBtn btn btn-outline-danger' 
                    data-id='${item.id}'>
                    Delete
                </button></td>
            </tr>
        `)
        $('#completeBtn').button('clickstringvalue')
            
        }

        // newRow.data('id', item.id)

        // append to DOM
        $('#taskList').append(newRow)
    }
}
