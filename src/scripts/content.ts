const script = document.createElement("script");
script.src = chrome.runtime.getURL("inject.js");
document.body.appendChild(script);

console.log("Content Script Loaded");

// listen for message from inject.ts
window.addEventListener("message", (event) => {
  if (event.source !== window) return;
  if (event.data.type && event.data.type === "NEW_LOG") {
    console.log("Content Script Received: " + event.data.text);
    chrome.storage.sync.get("todos", (data) => {
      const todos = data.todos || [];
      todos.push(event.data.text);
      chrome.storage.sync.set({ todos });
    });
  }
});
