window.addEventListener('message', (event) => {
  if (event.source !== window) return;

  if (event.data.type === 'SYNC_TODOS') {
    try {
      chrome.runtime.sendMessage({ message: 'SYNC_TODOS', todos: event.data.todos });
    } catch (error) {
      console.error('Failed to send message to the background script:', error);
    }
  } else if (event.data.type === 'DELETE_TODO') {
    try {
      chrome.runtime.sendMessage({ message: 'DELETE_TODO', todoText: event.data.todoText }); // Fix here: Pass `todoText` correctly
    } catch (error) {
      console.error('Failed to send delete message to the background script:', error);
    }
  }
});


// Listen for messages from the extension to update the web page
chrome.runtime.onMessage.addListener((request) => {
  if (request.message === 'SYNC_TODOS') {
    window.postMessage({ type: 'FROM_EXTENSION', todos: request.todos }, '*');
  }
});

// On initial load, retrieve todos from the extension's storage and pass them to the webpage
try {
  chrome.runtime.sendMessage({ message: 'GET_TODOS' }, (response) => {
    if (response.todos) {
      window.postMessage({ type: 'FROM_EXTENSION', todos: response.todos }, '*');
    }
  });
} catch (error) {
  console.error('Failed to retrieve todos from the background script:', error);
}
