document.addEventListener("DOMContentLoaded", function () {
    const taskInput = document.getElementById("task");
    const taskList = document.getElementById("task-list");
    const addTaskButton = document.getElementById("add-task");
    const clearCompletedButton = document.getElementById("clear-completed");

    // Function to fetch tasks from the backend and update the task list
    function fetchTasks() {
        fetch('http://127.0.0.1:5000/api/tasks')
            .then(response => response.json())
            .then(data => {
                // Clear the current task list
                taskList.innerHTML = '';

                // Populate the task list with data from the API
                data.forEach(task => {
                    const listItem = document.createElement("li");

                    const taskContainer = document.createElement("div");
                    taskContainer.className = "task-container";

                    const checkbox = document.createElement("input");
                    checkbox.type = "checkbox";
                    checkbox.className = "task-checkbox";
                    checkbox.checked = task.completed;

                    const checkboxTextContainer = document.createElement("div");
                    checkboxTextContainer.className = "checkbox-text-container";

                    const taskTextSpan = document.createElement("span");
                    taskTextSpan.textContent = task.text;
                    if (task.completed) {
                        taskTextSpan.classList.add("completed");
                    }

                    const deleteButton = document.createElement("button");
                    deleteButton.textContent = "Delete";
                    deleteButton.className = "delete";

                    checkboxTextContainer.appendChild(checkbox);
                    checkboxTextContainer.appendChild(taskTextSpan);

                    taskContainer.appendChild(checkboxTextContainer);
                    taskContainer.appendChild(deleteButton);

                    listItem.appendChild(taskContainer);
                    taskList.appendChild(listItem);
                });
            });
    }

    // Call fetchTasks to populate the task list initially
    fetchTasks();

    // Function to add a new task using the API
    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText !== "") {
            fetch('http://127.0.0.1:5000/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text: taskText })
            })
            .then(response => {
                if (response.status === 201) {
                    // Task created successfully, so fetch updated task list
                    fetchTasks();
                } else {
                    // Handle errors here, e.g., show an alert
                    console.error('Error creating task');
                }
            });
        } else {
            alert('Please enter a valid value');
        }
    }

    // Add an event listener for adding tasks
    addTaskButton.addEventListener("click", addTask);

    // Function to delete a task using the API
    taskList.addEventListener("click", function (e) {
        if (e.target.classList.contains("delete")) {
            const listItem = e.target.parentElement.parentElement;
            const taskId = listItem.getAttribute("data-task-id");
            
            fetch(`http://127.0.0.1:5000/api/tasks/${taskId}`, {
                method: 'DELETE'
            })
            .then(response => {
                if (response.status === 204) {
                    // Task deleted successfully, so fetch updated task list
                    fetchTasks();
                } else {
                    // Handle errors here, e.g., show an alert
                    console.error('Error deleting task');
                }
            });
        }
    });

    // Function to clear completed tasks using the API
    clearCompletedButton.addEventListener("click", function () {
        const completedTasks = document.querySelectorAll(".completed");
        completedTasks.forEach(function (task) {
            const listItem = task.parentElement.parentElement;
            const taskId = listItem.getAttribute("data-task-id");

            fetch(`http://127.0.0.1:5000/api/tasks/${taskId}`, {
                method: 'DELETE'
            })
            .then(response => {
                if (response.status === 204) {
                    // Task deleted successfully, so fetch updated task list
                    fetchTasks();
                } else {
                    // Handle errors here, e.g., show an alert
                    console.error('Error deleting task');
                }
            });
        });
    });

    // Function to update task completion status using the API
    taskList.addEventListener("change", function (e) {
        if (e.target.classList.contains("task-checkbox")) {
            const listItem = e.target.parentElement.parentElement;
            const taskId = listItem.getAttribute("data-task-id");
            const completed = e.target.checked;

            fetch(`http://127.0.0.1:5000/api/tasks/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ completed })
            })
            .then(response => {
                if (response.status === 200) {
                    // Task updated successfully, so fetch updated task list
                    fetchTasks();
                } else {
                    // Handle errors here, e.g., show an alert
                    console.error('Error updating task');
                }
            });
        }
    });
});