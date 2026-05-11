# ZTodo

桌面便签式 Todo 工具。Electron 多窗口架构，每条 todo 是一个独立无边框 BrowserWindow，贴在桌面上。

## 项目结构

```
ztodo/
├── main.js                  # Electron 主进程入口：初始化 store/shortcut/tray/window-manager，注册 IPC handlers
├── preload.js               # contextBridge，暴露 window.ztodo API 给渲染进程
├── package.json             # 依赖 + electron-builder 构建配置
├── src/
│   ├── todo-store.js        # JSON 持久化（~/.ztodo/data.json），EventEmitter，CRUD + toggleDone
│   ├── window-manager.js    # 无边框 BrowserWindow 创建/销毁/显示隐藏，每 todo 一个窗口
│   ├── shortcut.js          # 全局快捷键：Alt+T 新建，Alt+Shift+T 切换显示/隐藏
│   └── tray.js              # 系统托盘：Show/Hide All、Quit，图标 assets/icon.png
├── renderer/
│   ├── note.html            # 便签 DOM：checkbox + text + editor + 底部按钮（+ / x / 色点）
│   ├── note.js              # 渲染逻辑：初始化、双击编辑、checkbox 完成、拖拽存位置、色点、右键菜单
│   └── style.css            # 5 种配色（yellow/pink/green/blue/white），完成态划线+半透明
├── assets/
│   └── icon.png             # 16x16 托盘图标（黄色便签+折角）
├── .github/workflows/
│   └── build.yml            # CI：push 时并行构建 win(.exe) + mac(.dmg) + linux(.AppImage)
├── LICENSE                   # MIT
└── README.md
```

## 架构

```
Main Process                     Renderer Process
┌─────────────────┐              ┌──────────────────┐
│ TodoStore        │              │ note.html         │
│ (JSON CRUD)      │              │ note.js           │
│                  │   IPC        │ style.css         │
│ WindowManager    │◄────────────►│                   │
│ (BrowserWindow)  │  preload.js  │ window.ztodo API: │
│                  │              │  onInit           │
│ GlobalShortcut   │              │  updateTodo       │
│ (Alt+T/Shift+T)  │              │  toggleDone       │
│                  │              │  deleteTodo       │
│ SystemTray       │              │  createTodo       │
└─────────────────┘              └──────────────────┘
```

**数据流：**
1. 用户操作（双击/勾选/拖拽/按钮）→ 渲染进程调用 `window.ztodo.*`
2. preload.js 通过 `ipcRenderer.send` 发送到主进程
3. 主进程 `ipcMain.on` 处理 → TodoStore 更新 JSON → 保存文件
4. 窗口创建/删除由 WindowManager 管理，每 todo.id 对应一个 BrowserWindow

**进程模型：** 1 主进程 + N 渲染进程（每 todo 一个窗口）

## 数据格式

```json
{
  "todos": [
    {
      "id": "lx...",     // 生成: Date.now().toString(36) + random
      "text": "...",     // todo 文字
      "done": false,     // 完成状态
      "color": "yellow", // yellow | pink | green | blue | white
      "x": 300,          // 窗口 X 坐标
      "y": 200           // 窗口 Y 坐标
    }
  ]
}
```

存储路径：`~/.ztodo/data.json`

## 窗口配置

- 240px 宽，自适应高度（100~320px）
- `frame: false` 无边框
- `transparent: true` 圆角
- `alwaysOnTop: true` 贴桌面
- `skipTaskbar: true` 不显示在任务栏
- `resizable: false` 固定宽度
- `-webkit-app-region: drag` 拖拽移动（CSS），交互元素 `no-drag`

## 开发

```bash
npm install        # 安装依赖（electron + electron-builder）
npm start          # 启动开发
npm run build:win  # 构建 Windows .exe
npm run build:mac  # 构建 macOS .dmg
npm run build:linux # 构建 Linux .AppImage
```

## 关键交互

| 功能 | 实现位置 | 机制 |
|------|----------|------|
| 新建 | shortcut.js / note.js | Alt+T 或 + 按钮或右键菜单 → ipcMain 'create-todo' → 主进程取光标位置 → store.create + windowManager.createNoteWindow |
| 编辑 | note.js | 双击 text → 切换 editor display → Enter/blur 保存 → updateTodo IPC |
| 完成 | note.js | checkbox change → toggleDone IPC → CSS .done class 加删除线+半透明 |
| 换色 | note.js | 点击色点 → 切换 note classList + updateTodo IPC |
| 拖拽 | style.css + note.js | CSS -webkit-app-region:drag 移动窗口，mouseup 时保存新坐标 |
| 删除 | note.js | x 按钮或右键 → deleteTodo IPC → store.remove + windowManager.closeNoteWindow |
| 显示/隐藏 | shortcut.js / tray.js | Alt+Shift+T 或托盘 → windowManager.toggleAll |
| 持久化 | todo-store.js | 每次 CRUD 操作后同步 fs.writeFileSync |

## 扩展指南

- **新增便签配色**：在 style.css 添加 `.note.{color} .note-inner` 和 `.dot.{color}`，在 note.html 添加色点 span，note.js 无需改动
- **新增快捷键**：在 shortcut.js 注册，如需新 IPC 通道则在 preload.js 和 main.js 同步添加
- **新增数据字段**：在 todo-store.js 的 create() 方法添加默认值，renderer 对应读取和保存
- **修改窗口样式**：窗口配置在 window-manager.js createNoteWindow()，便签 UI 在 style.css
