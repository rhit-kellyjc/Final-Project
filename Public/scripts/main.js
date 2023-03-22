// Get the timer elements
const minutesElement = document.querySelector('.minutes');
const secondsElement = document.querySelector('.seconds');

// Set the initial time
let time = 25 * 60; // 25 minutes in seconds

// Create an interval ID variable
let intervalId;
const audio = new Audio('Downloads/timer-done.mp3');

// Get the progress bar element
const progressBar = document.querySelector('.progress-bar');


// update progress bar width
function updateProgressBar(timeLeft) {
  const totalTime = 25 * 60; // 25 minutes in seconds
  const percentComplete = (totalTime - timeLeft) / totalTime * 100;
  progressBar.style.width = `${percentComplete}%`;
}

function updateTimer() {
  // Calculate the remaining minutes and seconds
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  // Update the timer elements
  minutesElement.textContent = minutes.toString().padStart(2, '0');
  secondsElement.textContent = seconds.toString().padStart(2, '0');

  // Update the progress bar
  const totalTime = time === 0 ? 1 : 25 * 60; // set a minimum value for totalTime to prevent division by zero
  const progress = ((totalTime - time) / totalTime) * 100;
  progressBar.style.width = `${progress}%`;

  // Decrement the time
  time--;

  // Stop the timer when the time reaches zero
  if (time < 0) {
    clearInterval(intervalId);

    // Play the sound
    audio.play();

    // Do something when the timer reaches zero
  }
}


// Start the timer
function startTimer() {
  // Only start a new interval if the timer isn't already running
  if (!intervalId) {
    intervalId = setInterval(updateTimer, 1000);
    updateTimer(); // Call updateTimer() immediately after setting up the interval
  }

}

// Pause the timer
function pauseTimer() {
  clearInterval(intervalId);
  intervalId = null;
}

// Reset the timer to its initial value
function resetTimer() {
  clearInterval(intervalId);
  intervalId = null;
  updateTimer();
}

function setToPomodoro() {
  time = 25 * 60;
  resetTimer();
}

// Set the time to 15 minutes for the long break
function setLongBreak() {
  time = 15 * 60;
  resetTimer();
}

// Set the time to 5 minutes for the short break
function setShortBreak() {
  time = 5 * 60;
  resetTimer();
}

// Get the add todo button and modal elements
const addTodoBtn = document.querySelector('.add-todo');
const modal = document.querySelector('.modal');
const taskInput = document.querySelector('#task-input');
const addTaskBtn = document.querySelector('#add-task-btn');
const closeBtn = document.querySelector('.close-modal-btn');

// Get the todo list element
const todoList = document.querySelector('#todo-list');

// Set the maximum number of tasks
const maxTasks = 10;
const placeHolder = document.querySelector(".todo-item-place-holder");
// Add event listener for add task button
addTaskBtn.addEventListener('click', () => {
  if (todoList.children.length > 0) {
    if (placeHolder) {
      placeHolder.remove();
    }
  }
  // Get the task from the input field
  const task = taskInput.value.trim();
  if (task && todoList.childElementCount < maxTasks) {
    // Create a new todo item element
    const todoItem = document.createElement('li');
    const todoText = document.createElement('span');
    todoText.innerText = task;
    const todoCheckbox = document.createElement('input');
    todoCheckbox.type = 'checkbox';
    const removeBtn = document.createElement('button');
    removeBtn.classList.add('remove-btn');

    removeBtn.addEventListener('click', () => {
      todoList.removeChild(todoItem);
      if (todoList.childElementCount < maxTasks) {
        todoList.classList.remove('shake');
      } else if (todoList.childElementCount === maxTasks) {
        todoList.classList.add('shake');
      }
    });

    // Add the todo item elements to the list
    todoItem.appendChild(todoCheckbox);
    todoItem.appendChild(todoText);
    todoItem.appendChild(removeBtn);
    todoList.appendChild(todoItem);

    // Clear the task input field and hide the modal
    taskInput.value = '';
    modal.style.display = 'none';

    // Add shake animation if maximum number of tasks is reached
    if (todoList.childElementCount >= maxTasks) {
      todoList.classList.add('shake');
    }
  }
});

// Add event listener for input field
taskInput.addEventListener('keydown', (event) => {
  if (event.keyCode === 13) { // Check if "Enter" key was pressed
    if (todoList.children.length > 0) {
      if (placeHolder) {
        placeHolder.remove();
      }
    }
    // Get the task from the input field
    const task = taskInput.value.trim();
    if (task && todoList.childElementCount < maxTasks) {
      // Create a new todo item element
      const todoItem = document.createElement('li');
      const todoText = document.createElement('span');
      todoText.innerText = task;
      const todoCheckbox = document.createElement('input');
      todoCheckbox.type = 'checkbox';
      const removeBtn = document.createElement('button');
      removeBtn.classList.add('remove-btn');

      removeBtn.addEventListener('click', () => {
        todoList.removeChild(todoItem);
        if (todoList.childElementCount < maxTasks) {
          todoList.classList.remove('shake');
        } else if (todoList.childElementCount === maxTasks) {
          todoList.classList.add('shake');
        }
      });

      // Add the todo item elements to the list
      todoItem.appendChild(todoCheckbox);
      todoItem.appendChild(todoText);
      todoItem.appendChild(removeBtn);
      todoList.appendChild(todoItem);

      // Clear the task input field and hide the modal
      taskInput.value = '';
      modal.style.display = 'none';

      // Add shake animation if maximum number of tasks is reached
      if (todoList.childElementCount >= maxTasks) {
        todoList.classList.add('shake');
      }
    }
  }
});

// Add event listener for close button
closeBtn.addEventListener('click', () => {
  // Hide the modal
  modal.style.display = 'none';
});

// Add event listener for todo list
todoList.addEventListener('click', (event) => {
  const element = event.target;
  if (element.type === 'checkbox') {
    const todoItem = element.parentNode;
    if (element.checked) {
      todoItem.classList.add('checked');
    } else {
      todoItem.classList.remove('checked');
    }
  } else if (element.classList.contains('remove-btn')) {
    const todoItem = element.parentNode;
    todoList.removeChild(todoItem);
  }
});




// Add event listeners to the buttons
const playButton = document.querySelector('.play-btn');
const pauseButton = document.querySelector('.pause-btn');
const resetButton = document.querySelector('.reset-btn');
const longBreakButton = document.querySelector('.long-break');
const shortBreakButton = document.querySelector('.short-break');

playButton.addEventListener('click', startTimer);
pauseButton.addEventListener('click', pauseTimer);
resetButton.addEventListener('click', setToPomodoro);
longBreakButton.addEventListener('click', setLongBreak);
shortBreakButton.addEventListener('click', setShortBreak);
addTodoBtn.addEventListener('click', () => {
  modal.style.display = 'block';
});