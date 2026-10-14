
const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const list = document.getElementById("task-list");
const count = document.getElementById("task-count");
const emptyState = document.getElementById("empty-state");
const clearButton = document.getElementById("clear-completed");

let tasks = [];

try {
  const saved = JSON.parse(
    localStorage.getItem("taskflow-tasks") || "[]"
  );

  if (Array.isArray(saved)) {
    tasks = saved.filter(
      task =>
        task &&
        typeof task.text === "string" &&
        typeof task.completed === "boolean"
    );
  }
} catch {
  tasks = [];
}

function saveTasks() {
  try {
    localStorage.setItem("taskflow-tasks", JSON.stringify(tasks));
  } catch {
    alert("Tasks could not be saved in this browser.");
  }
}

function renderTasks() {
  list.replaceChildren();

  tasks.forEach(task => {
    const item = document.createElement("li");
    item.className = task.completed ? "completed" : "";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", "Complete " + task.text);

    checkbox.addEventListener("change", () => {
      task.completed = checkbox.checked;
      saveTasks();
      renderTasks();
    });

    const text = document.createElement("span");
    text.textContent = task.text;

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "delete-button";
    remove.textContent = "Delete";
    remove.setAttribute("aria-label", "Delete " + task.text);

    remove.addEventListener("click", () => {
      tasks = tasks.filter(current => current.id !== task.id);
      saveTasks();
      renderTasks();
    });

    item.append(checkbox, text, remove);
    list.appendChild(item);
  });

  const remaining = tasks.filter(task => !task.completed).length;
  count.textContent = `${remaining} remaining · ${tasks.length} total`;
  emptyState.hidden = tasks.length > 0;
}

form.addEventListener("submit", event => {
  event.preventDefault();

  const text = input.value.trim();
  if (!text) return;

  tasks.push({
    id: Date.now() + Math.random(),
    text,
    completed: false
  });

  saveTasks();
  renderTasks();
  input.value = "";
  input.focus();
});

clearButton.addEventListener("click", () => {
  tasks = tasks.filter(task => !task.completed);
  saveTasks();
  renderTasks();
});

renderTasks();
