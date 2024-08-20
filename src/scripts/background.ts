chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === 'SYNC_TODOS') {
    console.log("Background Script: Received SYNC_TODOS request with data:", request.todos);
    syncTodos(request.todos, false);
    sendResponse({ status: 'success' });
  } else if (request.message === 'GET_TODOS') {
    chrome.storage.sync.get('todos', (data) => {
      console.log("Background Script: Retrieved todos from storage:", data.todos);
      sendResponse({ todos: data.todos || [] });
    });
    return true; // Required to keep the message channel open for async response
  } else if (request.message === 'DELETE_TODO') {
    deleteTodo(request.todoText);
    sendResponse({ status: 'success' });
  }
});

function syncTodos(newTodos: { text: string }[], broadcast: boolean = true) {
  if (!chrome.storage.sync) {
    console.error('Background Script: chrome.storage.sync is undefined.');
    return;
  }

  chrome.storage.sync.get('todos', (data) => {
    let todos: string[] = data.todos || [];

    // Convert all incoming todos to strings
    const formattedTodos = newTodos.map(todo =>
      typeof todo === 'object' && todo.text ? todo.text : String(todo)
    );

    // Merge the existing todos with the new ones
    todos = [...todos, ...formattedTodos];

    console.log("Background Script: Attempting to save todos as strings:", todos);

    chrome.storage.sync.set({ todos }, () => {
      if (chrome.runtime.lastError) {
        console.error("Background Script: Error setting todos in chrome.storage.sync:", chrome.runtime.lastError);
        return;
      }
      console.log("Background Script: Todos successfully saved in storage:", todos);

      if (broadcast) {
        chrome.tabs.query({}, (tabs) => {
          tabs.forEach((tab) => {
            if (tab.id) {
              chrome.tabs.sendMessage(tab.id, { message: 'SYNC_TODOS', todos });
              console.log("Background Script: Broadcasted todos to tab:", tab.id);
            }
          });
        });
      }
    });
  });
}


function deleteTodo(todoText: string) {
  if (!chrome.storage.sync) {
    console.error('Background Script: chrome.storage.sync is undefined.');
    return;
  }

  chrome.storage.sync.get('todos', (data) => {
    let todos: string[] = data.todos || [];
    todos = todos.filter(todo => todo !== todoText);
    console.log(todos);
    

    chrome.storage.sync.set({ todos }, () => {
      if (chrome.runtime.lastError) {
        console.error("Error deleting todo in chrome.storage.sync:", chrome.runtime.lastError);
        return;
      }

      // Broadcast updated todos to all tabs
      chrome.tabs.query({}, (tabs) => {
        tabs.forEach((tab) => {
          if (tab.id) {
            chrome.tabs.sendMessage(tab.id, { message: 'SYNC_TODOS', todos });
          }
        });
      });
    });
  });
}