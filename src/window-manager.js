const { BrowserWindow } = require('electron');
const path = require('path');

class WindowManager {
  constructor() {
    this.windows = new Map();
    this.hidden = false;
  }

  createNoteWindow(todo) {
    const win = new BrowserWindow({
      width: 240,
      height: 120,
      x: todo.x,
      y: todo.y,
      frame: false,
      transparent: true,
      alwaysOnTop: true,
      skipTaskbar: true,
      resizable: false,
      hasShadow: true,
      webPreferences: {
        preload: path.join(__dirname, '..', 'preload.js'),
        contextIsolation: true,
        nodeIntegration: false
      }
    });

    win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
    win.loadFile(path.join(__dirname, '..', 'renderer', 'note.html'));

    win.webContents.once('dom-ready', () => {
      win.webContents.send('init-todo', todo);
    });

    this.windows.set(todo.id, win);

    win.on('closed', () => {
      this.windows.delete(todo.id);
    });

    return win;
  }

  closeNoteWindow(id) {
    const win = this.windows.get(id);
    if (win && !win.isDestroyed()) win.close();
    this.windows.delete(id);
  }

  showAll() {
    this.hidden = false;
    for (const win of this.windows.values()) {
      if (!win.isDestroyed()) win.show();
    }
  }

  hideAll() {
    this.hidden = true;
    for (const win of this.windows.values()) {
      if (!win.isDestroyed()) win.hide();
    }
  }

  toggleAll() {
    if (this.hidden) this.showAll();
    else this.hideAll();
  }

  getNoteWindow(id) {
    return this.windows.get(id);
  }
}

module.exports = WindowManager;
