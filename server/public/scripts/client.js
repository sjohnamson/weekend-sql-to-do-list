$(document).ready(function () {
    console.log('jQuery sourced.');

    getTasks();
    btnHandlers();
})

function btnHandlers() {
    $('#addTaskBtn').on('click', handleAdd)
    $('#taskList').on('click', '.completeBtn', handleComplete)
    $('#taskList').on('click', '.deleteBtn', startModal)

}

function startModal() {

    console.log('in start modal')

    let taskID = $(this).data('id');

    swal({
        title: "Are you sure you want to delete this task?",
        text: "Once it's gone, it's gone forever!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                handleDelete(taskID)
                swal("Not doing that anymore, your task is gone!", {
                    icon: "success",
                });
            } else {
                swal("Your task is still on your list!");
            }
        });
}

function handleAdd(event) {
    event.preventDefault()
    console.log('in addtask')

    // make object /tasks
    let newTask = {
        task: $('#taskInput').val()
    }

    postToTasks(newTask)
    // clear input fields
    $('input').val('')

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

function handleDelete(idToDelete) {
    console.log('in handle delete')

    // send delete request to the server
    $.ajax({
        method: 'DELETE',
        url: `/tasks/deletetask/${idToDelete}`
    })
        .then((response) => {
            console.log('delete task id: ', `${idToDelete}`)
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
        url: '/tasks'
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
                <td><button class='completeBtn btn btn-outline-success' 
                    data-id='${item.id}' 
                    data-pending='${item.pending}'>
                     ◻️
                </button></td> 
                <td class="text-nowrap">${item.task}</td>
                <td></td>
                <td><button class='deleteBtn btn btn-outline-danger' 
                    data-id='${item.id}'>

                    Delete
                </button></td>
            </tr>
        `)

        if (item.pending == true) {
     console.log('complete time: ', item.completetime)
            newRow = (`
            <tr class="text-success">

                <td><button class='completeBtn btn btn-outline-danger' 
                    data-id='${item.id}' 
                    data-pending='${item.pending}'>
                    ✓
                </button></td> 
                <td class="text-secondary text-decoration-line-through text-nowrap">${item.task}</td>
                <td>${moment(item.completetime).format('MM-DD-YYYY')} </td>
                <td><button class='deleteBtn btn btn-outline-danger' 

                    data-id='${item.id}'>
                    Delete
                </button></td>
            </tr>
        `)

        }

        // newRow.data('id', item.id)

        // append to DOM
        $('#taskList').append(newRow)
    }
}
