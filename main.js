const { app, ipcMain, screen } = require('electron');
const TodoStore = require('./src/todo-store');
const WindowManager = require('./src/window-manager');
const { registerShortcuts, unregisterAll } = require('./src/shortcut');
const { createTray } = require('./src/tray');

let store;
let windowManager;
let tray;

app.whenReady().then(() => {
  store = new TodoStore();
  windowManager = new WindowManager();

  const todos = store.getAll();
  for (const todo of todos) {
    windowManager.createNoteWindow(todo);
  }

  registerShortcuts(store, windowManager);
  tray = createTray(store, windowManager);

  ipcMain.on('update-todo', (_event, id, fields) => {
    store.update(id, fields);
  });

  ipcMain.on('toggle-done', (_event, id) => {
    store.toggleDone(id);
  });

  ipcMain.on('delete-todo', (_event, id) => {
    store.remove(id);
    windowManager.closeNoteWindow(id);
  });

  ipcMain.on('create-todo', () => {
    const cursor = screen.getCursorScreenPoint();
    const todo = store.create('', cursor.x - 120, cursor.y - 25);
    windowManager.createNoteWindow(todo);
  });

  app.on('will-quit', () => {
    unregisterAll();
  });
});

app.on('window-all-closed', () => {});

app.on('activate', () => {
  if (store && windowManager) {
    for (const todo of store.getAll()) {
      if (!windowManager.getNoteWindow(todo.id)) {
        windowManager.createNoteWindow(todo);
      }
    }
  }
});
