const { Tray, Menu, nativeImage, screen } = require('electron');
const path = require('path');

function createTray(store, windowManager) {
  const iconPath = path.join(__dirname, '..', 'assets', 'icon.png');
  const icon = nativeImage.createFromPath(iconPath);
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

module.exports = { createTray };
