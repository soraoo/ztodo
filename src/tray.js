const { Tray, Menu, nativeImage } = require('electron');
const path = require('path');

function createTray(store, windowManager) {
  const iconPath = path.join(__dirname, '..', 'assets', 'icon.png');
  const icon = nativeImage.createFromPath(iconPath);
  const tray = new Tray(icon);
  tray.setToolTip('ZTodo');

  const menu = Menu.buildFromTemplate([
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
