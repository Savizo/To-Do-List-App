document.addEventListener('DOMContentLoaded', getTasks);

async function getTasks() {
    const response = await fetch('http://localhost:2000/tasks');
    const tasks = await response.json();
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    tasks.forEach(task => {
        const li = document.createElement('li');
        li.innerHTML = `<span>${task.text}</span> <span class="deadline"> - Due: ${task.date} ${task.time}</span>`;

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.classList.add('delete-btn');

        li.appendChild(deleteBtn);
        taskList.appendChild(li);

        // Mark task as completed on click
        li.addEventListener('click', function () {
            li.classList.toggle('completed');
        });

        // Delete task on button click
        deleteBtn.addEventListener('click', function () {
            deleteTask(task._id);
        });
    });
}

document.getElementById('addTaskBtn').addEventListener('click', async function () {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();
    const taskDate = document.getElementById('taskDate').value;
    const taskTime = document.getElementById('taskTime').value;

    if (taskText !== "" && taskDate !== "" && taskTime !== "") {
        await addTask(taskText, taskDate, taskTime);

        // Clear input fields after adding
        taskInput.value = '';
        document.getElementById('taskDate').value = '';
        document.getElementById('taskTime').value = '';
    }
});

async function addTask(taskText, taskDate, taskTime) {
    const response = await fetch('http://localhost:2000/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            text: taskText,
            date: taskDate,
            time: taskTime
        })
    });

    const newTask = await response.json();
    getTasks(); // Обнови списъка със задачи след добавяне
}

async function deleteTask(id) {
    await fetch(`http://localhost:2000/tasks/${id}`, {
        method: 'DELETE'
    });

    getTasks(); // Обнови списъка със задачи след изтриване
}
