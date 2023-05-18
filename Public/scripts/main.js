var rhit = rhit || {};

rhit.mainPageController = class {
  constructor() {
    this.userId = null;
    // Connect to Firestore using a callback
    this.connectToFirestore(() => {
      this.todosCollection = firebase.firestore().collection('Todos');
      this.loadTodos();
    });




    //use a callback to connect to firestore
    this.minutesElement = document.querySelector('.minutes');
    this.secondsElement = document.querySelector('.seconds');
    this.time = 25 * 60;
    this.intervalId = null;
    this.playButton = document.querySelector('#playButton');
    this.pauseButton = document.querySelector('#pauseButton');
    this.resetButton = document.querySelector('#resetButton');
    this.longBreakButton = document.querySelector('.long-break');
    this.shortBreakButton = document.querySelector('.short-break');
    this.pomodoroButton = document.querySelector('.pomodoro-button');
    this.themeSelect = document.querySelector('#themeSelect');
    this.saveSettingsButton = document.querySelector("#saveSettingsButton");
    this.todoList = document.querySelector('#todoList');
    this.saveTodoButton = document.querySelector('#saveTodoButton');


    this.pomodoroDuration = 25 * 60;
    this.longBreakDuration = 15 * 60;
    this.shortBreakDuration = 5 * 60;

    this.pomodoroButton.addEventListener('click', this.setToPomodoro.bind(this));
    this.playButton.addEventListener('click', this.startTimer.bind(this));
    this.pauseButton.addEventListener('click', this.pauseTimer.bind(this));
    this.resetButton.addEventListener('click', this.setToPomodoro.bind(this));
    this.longBreakButton.addEventListener('click', this.setLongBreak.bind(this));
    this.shortBreakButton.addEventListener('click', this.setShortBreak.bind(this));
    this.themeSelect.addEventListener('change', this.changeTheme.bind(this));
    this.saveTodoButton.addEventListener('click', (event) => {
      event.preventDefault();
      const todoText = document.getElementById('todoText').value;
      const cycles = document.getElementById('cycleCount').value;

      if (todoText) {
        this.addTodoItem(todoText, cycles);
        $('#todoModal').modal('hide');
      }

      document.getElementById('todoText').value = '';
    });
    this.saveSettingsButton.addEventListener('click', () => {
      const pomodoroDuration = parseInt(document.querySelector('#pomodoroDuration').value);
      const longBreakDuration = parseInt(document.querySelector('#longBreakDuration').value);
      const shortBreakDuration = parseInt(document.querySelector('#shortBreakDuration').value);


      if (pomodoroDuration >= 0 && longBreakDuration >= 0 && shortBreakDuration >= 0) {
        this.setTimerDurations(pomodoroDuration, longBreakDuration, shortBreakDuration);
        $('#settingsModal').modal('hide');
      } else {
        alert("Invalid durations. Durations must be positive.");
      }


      $('#settingsModal').modal('hide');
    });

  }

  connectToFirestore(callback) {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.userId = user.uid;
        firebase.firestore().enablePersistence()
          .then(() => {
            callback();
          })
          .catch((error) => {
            console.error('Error enabling Firestore persistence: ', error);
            callback();
          });
      } else {
        this.userId = null;
        callback();
      }
    });
  }


  addTodoItem(text, cycles) {
    const todoItem = this.constructTodoItem(text, cycles);

    // Save the todo to Firestore with the associated user ID
    this.todosCollection.add({
        text: text,
        cycles: cycles,
        userId: this.userId,
        lastTouched: firebase.firestore.FieldValue.serverTimestamp()
      })
      .then((docRef) => {
        // Assign a unique ID to the todo item
        todoItem.dataset.todoId = docRef.id;

        // Append the todo item to the list
        this.todoList.appendChild(todoItem);
      })
      .catch((error) => {
        console.error('Error adding todo: ', error);
      });
  }


  setTimerDurations(pomodoroDuration, longBreakDuration, shortBreakDuration) {
    this.pomodoroDuration = pomodoroDuration * 60;
    this.longBreakDuration = longBreakDuration * 60;
    this.shortBreakDuration = shortBreakDuration * 60;
  }

  playSound(soundFilePath) {
    const audio = new Audio(soundFilePath);
    audio.play();
  }

  constructTodoItem(text, cycles) {
    const todoItem = document.createElement('li');
    todoItem.classList.add('todo-item');

    const todoText = document.createElement('div');
    todoText.textContent = `${text} (${cycles} cycles)`;
    todoItem.appendChild(todoText);

    const doneText = document.createElement('button');
    doneText.textContent = 'Done?';
    doneText.classList.add('done-text');
    todoItem.appendChild(doneText);

    doneText.addEventListener('click', () => {
      todoItem.remove();
    });

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.innerHTML = '<i class="fas fa-pencil-alt"></i>Edit';
    editButton.classList.add('edit-button');
    todoItem.appendChild(editButton);

    editButton.addEventListener('click', () => {
      const editTodoText = document.getElementById('editTodoText');
      const editCycleCount = document.getElementById('editCycleCount');
      editTodoText.value = text;
      editCycleCount.value = cycles;


      const saveEditButton = document.getElementById('saveEditButton');
      saveEditButton.addEventListener('click', () => {
        text = editTodoText.value;
        cycles = editCycleCount.value;
        todoText.textContent = `${text} (${cycles} cycles)`;
        $('#editModal').modal('hide');
      });

      $('#editModal').modal('show');

    });

    todoItem.appendChild(editButton);


    return todoItem;
  }


  loadTodos() {
    if (this.userId) {
      this.todosCollection
        .where('userId', '==', this.userId) // Query todos with the current user's ID
        .orderBy('lastTouched', 'desc') // Order by lastTouched field
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            const todoItem = this.constructTodoItem(doc.data().text, doc.data().cycles);
            todoItem.dataset.todoId = doc.id;
            this.todoList.appendChild(todoItem);
          });
        })
        .catch((error) => {
          console.error('Error loading todos: ', error);
        });
    }
  }

  changeTheme() {
    const selectedTheme = themeSelect.value;
    const mainPage = document.getElementById('mainPage');

    switch (selectedTheme) {
      case 'waterfall':
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundImage = "url('https://cdn.wallpapersafari.com/97/35/msafi4.jpg')";
        break;
      case 'beach':
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundImage = "url('https://www.pixelstalk.net/wp-content/uploads/images5/4K-Beach-HD-Wallpaper-Free-download.jpg')";
        break;
      case 'city':
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundImage = "url('https://images5.alphacoders.com/456/456536.jpg')";
        break;

      case 'White Sox':
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundImage = "url('images/whiteSoxPark.jpg')";
        break;
      case 'Rose Hulman':
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundImage = "url('https://www.commonapp.org/static/0343dfd8aab28ca8d9de4a8010a73c61/rose-hulman-institute-technology_865.jpg')";
        break;
    }
  }


  updateTimer() {
    const minutes = Math.floor(this.time / 60);
    const seconds = this.time % 60;

    this.minutesElement.textContent = minutes.toString().padStart(2, '0');
    this.secondsElement.textContent = seconds.toString().padStart(2, '0');

    this.time--;

    if (this.time < 0) {
      clearInterval(this.intervalId);
      this.playSound('soundEffects/bellRinging.mp3');

      // Get the todo item ID
      const todoId = this.todoList.firstElementChild.dataset.todoId;

      // Update the lastTouched field in Firestore
      this.todosCollection.doc(todoId).update({
          lastTouched: firebase.firestore.FieldValue.serverTimestamp()
        })
        .catch((error) => {
          console.error('Error updating todo: ', error);
        });
    }


    if (minutes === 5 && seconds === 1) {
      this.playSound('soundEffects/fiveMins.mp3');
    }

  }

  startTimer() {
    if (!this.intervalId) {
      this.intervalId = setInterval(this.updateTimer.bind(this), 1000);
      this.updateTimer();
    }
  }

  pauseTimer() {
    clearInterval(this.intervalId);
    this.intervalId = null;
  }

  resetTimer() {
    clearInterval(this.intervalId);
    this.intervalId = null;
    this.updateTimer();
  }

  setToPomodoro() {
    this.time = this.pomodoroDuration;
    this.resetTimer();
  }

  setLongBreak() {
    this.time = this.longBreakDuration;
    this.resetTimer();
  }

  setShortBreak() {
    this.time = this.shortBreakDuration;
    this.resetTimer();
  }

};

rhit.main = function () {
  const inputEmailEl = document.querySelector("#inputEmail");
  const inputPasswordEl = document.querySelector("#inputPassword");

  const signOutButton = document.querySelector("#signOutButton");
  if (signOutButton) {
    signOutButton.onclick = (event) => {
      console.log(`Sign out`);
      firebase.auth().signOut().then(function () {
        console.log("You are now signed out");
      }).catch(function (error) {
        console.log("Sign out error");
      });
    };
  }


  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      const displayName = user.displayName;
      const email = user.email;
      const photoURL = user.photoURL;
      const isAnonymous = user.isAnonymous;
      const uid = user.uid;

      console.log("The user is signed in ", uid);
      console.log('displayName :>> ', displayName);
      console.log('email :>> ', email);
      console.log('photoURL :>> ', photoURL);
      console.log('isAnonymous :>> ', isAnonymous);
      console.log('uid :>> ', uid);

      if (document.querySelector("#mainPage")) {
        rhit.mainPageController = new rhit.mainPageController();
      }
    } else {
      console.log("There is no user signed in!");
      rhit.startFirebaseUI();
    }
  });
};

rhit.startFirebaseUI = function () {
  var uiConfig = {
    signInSuccessUrl: '/mainPage.html',
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
      firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
    ],
  };
  const ui = new firebaseui.auth.AuthUI(firebase.auth());
  ui.start('#firebaseui-auth-container', uiConfig);
};

rhit.main();