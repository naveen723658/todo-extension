window.addEventListener('message', (event) => {
  if (event.source !== window) return;

  if (event.data.type === 'SYNC_TODOS') {
    // Post message to content.js instead of calling chrome.runtime.sendMessage directly
    window.postMessage({ type: 'SYNC_TODOS_FROM_PAGE', todos: event.data.todos }, '*');
  }
});

// Only log interception in inject.js
const originalLog = console.log;
console.log = function (...args) {
  window.postMessage({ type: "NEW_LOG", text: args.join("") }, "*");
  originalLog("[Inject Script]", ...args);
};
