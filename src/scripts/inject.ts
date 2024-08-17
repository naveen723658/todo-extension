const originalLog = console.log;
function myLog(...args: string[]) {
  window.postMessage({ type: "NEW_LOG", text: args.join("") }, "*");
  originalLog("[NewLog Says]", ...args);
}
console.log = myLog;
