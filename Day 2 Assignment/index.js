const fs = require("fs");
const path = require("path");
const readline = require("readline");

const dataFilePath = path.join(__dirname, "tasks.json");

function readTasks() {
  try {
    const data = fs.readFileSync(dataFilePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

function writeTasks(tasks) {
  fs.writeFileSync(dataFilePath, JSON.stringify(tasks, null, 2), "utf8");
}

function addTask(task) {
  const tasks = readTasks();
  tasks.push({ task, completed: false });
  writeTasks(tasks);
  console.log("Task added successfully!");
}

function viewTasks() {
  const tasks = readTasks();
  console.log("Tasks:");
  tasks.forEach((task, index) => {
    console.log(`${index + 1} - ${task.task}`);
  });
}

function markTaskComplete(index) {
  const tasks = readTasks();
  if (index >= 0 && index < tasks.length) {
    tasks[index].completed = true;
    writeTasks(tasks);
    console.log("Task marked as complete!");
  } else {
    console.log("Invalid task index.");
  }
}

function removeTask(index) {
  const tasks = readTasks();
  if (index >= 0 && index < tasks.length) {
    tasks.splice(index, 1);
    writeTasks(tasks);
    console.log("Task removed successfully!");
  } else {
    console.log("Invalid task index.");
  }
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function promptOperation() {
  console.log("\nAvailable Operations:");
  console.log("1. Add a new task");
  console.log("2. View a list of tasks");
  console.log("3. Mark a task as complete");
  console.log("4. Remove a task");
  console.log("5. Exit");

  rl.question(
    "Enter the number corresponding to the operation you want to perform: ",
    (answer) => {
      const operation = parseInt(answer);
      switch (operation) {
        case 1:
          rl.question("Enter the task: ", (task) => {
            addTask(task);
            promptOperation();
          });
          break;
        case 2:
          viewTasks();
          promptOperation();
          break;
        case 3:
          rl.question(
            "Enter the index of the task to mark as complete: ",
            (index) => {
              markTaskComplete(parseInt(index) - 1);
              promptOperation();
            }
          );
          break;
        case 4:
          rl.question("Enter the index of the task to remove: ", (index) => {
            removeTask(parseInt(index) - 1);
            promptOperation();
          });
          break;
        case 5:
          rl.close();
          break;
        default:
          console.log("Invalid operation.");
          promptOperation();
      }
    }
  );
}

promptOperation();
