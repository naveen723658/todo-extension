import "../styles/index.css";
const button = document.getElementById("Add")! as HTMLButtonElement;
const input = document.getElementById("inputbox")! as HTMLInputElement;

chrome.storage.sync.get("todos", (data) => {
  const todos = data.todos || [];
  todos.forEach((todo: string) => {
    if (!todo) return;
    createTodo(todo);
  });
});

const createTodo = (todo: string) => {
  const ul = document.getElementById("todos");
  const li = document.createElement("li");
  const p = document.createElement("p");
  const div = document.createElement("div");
  div.className = "content";

  // checkbox
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "check";
  div.appendChild(checkbox);
  if (todo.startsWith("http")) {
    const a = document.createElement("a");
    a.href = todo;
    a.target = "_blank";
    a.innerText = todo.split("/")[2];
    p.appendChild(a);
  } else {
    p.innerText = todo;
  }
  const deleteButton = document.createElement("button");
  deleteButton.className = "delete";
  deleteButton.innerText = "X";
  deleteButton.addEventListener("click", () => {
    li.remove();
    chrome.storage.sync.get("todos", (data) => {
      const todos = data.todos || [];
      const newTodos = todos.filter((t: string) => t !== todo);
      chrome.storage.sync.set({ todos: newTodos });
    });
  });
  div.appendChild(p);
  li.appendChild(div);
  li.appendChild(deleteButton);
  ul.appendChild(li);
};

button.addEventListener("click", () => {
  const todo = input.value;
  console.log(todo);
  createTodo(todo);
  input.value = "";
  chrome.storage.sync.get("todos", (data) => {
    const todos = data.todos || [];
    todos.push(todo);
    chrome.storage.sync.set({ todos });
  });
});

button.addEventListener("click", () => {
  console.log("button clicked");
});

console.log("TEST");
