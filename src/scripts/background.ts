chrome.contextMenus.create({
  id: `add-to-todo`,
  title: "Add to TODO",
  contexts: ["selection"],
});
chrome.contextMenus.onClicked.addListener((info, tab) => {
  const todo = info.selectionText;
  try {
    chrome.storage.sync.get("todos", (data) => {
      const todos = data.todos || [];
      todos.push(todo);
      chrome.storage.sync.set({ todos });
    });
  } catch (e) {
    console.log(e);
  }
});

chrome.commands.onCommand.addListener((command) => {
  if (command === "AddTodo") {
    chrome.tabs.query(
      {
        active: true,
        currentWindow: true,
      },
      (tabs) => {
        const todo = String(tabs[0].url);
        try {
          chrome.storage.sync.get("todos", (data) => {
            const todos = data.todos || [];
            todos.push(todo);
            chrome.storage.sync.set({ todos });
          });
        } catch (e) {
          console.log(e);
        }
      }
    );
  }
});

chrome.runtime.onMessage.addListener((request) => {
  if (request.message === "GET_LOGS") {
    const todoLog = request.data;
    try {
      chrome.storage.sync.get("todos", (data) => {
        const todos = data.todos || [];
        todos.push(todoLog);
        chrome.storage.sync.set({ todos });
      });
    } catch (e) {
      console.log(e);
    }
  }
});
