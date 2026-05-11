const { globalShortcut, screen } = require('electron');

function registerShortcuts(store, windowManager) {
  globalShortcut.register('Alt+T', () => {
    const cursor = screen.getCursorScreenPoint();
    const todo = store.create('', cursor.x - 120, cursor.y - 25);
    windowManager.createNoteWindow(todo);
  });

  globalShortcut.register('Alt+Shift+T', () => {
    windowManager.toggleAll();
  });
}

function unregisterAll() {
  globalShortcut.unregisterAll();
}

module.exports = { registerShortcuts, unregisterAll };
