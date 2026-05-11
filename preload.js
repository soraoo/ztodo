const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('ztodo', {
  onInit: (callback) => {
    ipcRenderer.on('init-todo', (_event, todo) => callback(todo));
  },

  updateTodo: (id, fields) => {
    ipcRenderer.send('update-todo', id, fields);
  },

  toggleDone: (id) => {
    ipcRenderer.send('toggle-done', id);
  },

  deleteTodo: (id) => {
    ipcRenderer.send('delete-todo', id);
  },

  createTodo: () => {
    ipcRenderer.send('create-todo');
  }
});
