const { Tray, Menu, nativeImage, screen } = require('electron');

function createTray(store, windowManager) {
  const icon = nativeImage.createFromBuffer(_trayIconPng(), { width: 16, height: 16 });
  const tray = new Tray(icon);
  tray.setToolTip('ZTodo');

  const menu = Menu.buildFromTemplate([
    {
      label: 'New Note',
      click: () => {
        const cursor = screen.getCursorScreenPoint();
        const todo = store.create('', cursor.x - 120, cursor.y - 25);
        windowManager.createNoteWindow(todo);
      }
    },
    { type: 'separator' },
    {
      label: 'Show/Hide All',
      click: () => windowManager.toggleAll()
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => require('electron').app.quit()
    }
  ]);

  tray.setContextMenu(menu);
  return tray;
}

function _trayIconPng() {
  const b64 = 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAXElEQVQ4y2P4//8/AzmAiYEMwEQuA2TCLgbYAmJb0tAN+xkYGP5DFcAamEUBbBgswCnFxMDA8B+qABaA+BNUAEwPEGG0nKILwM5CoMG0oK8TBRRFwOXCKDoCAPtOJkGaOYSWAAAAAElFTkSuQmCC';
  return Buffer.from(b64, 'base64');
}

module.exports = { createTray };
