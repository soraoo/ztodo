# ZTodo

桌面便签式 Todo 工具，灵感来自 Snipaste 的操作习惯。每条 todo 是一个独立的无边框窗口，贴在桌面上，随时查看和编辑。

## 特性

- **贴桌面便签** — 无边框窗口，always-on-top，类似 Snipaste
- **快捷键操作** — `Alt+T` 新建便签，`Alt+Shift+T` 显示/隐藏全部
- **多色便签** — 5 种便签配色（黄/粉/绿/蓝/白）
- **右键菜单** — Edit / New Note / Delete
- **拖拽摆放** — 按住便签拖到任意位置，位置自动保存
- **本地持久化** — JSON 文件存储（`~/.ztodo/data.json`），无网络依赖
- **跨平台** — Windows / macOS / Linux

## 安装

```bash
git clone <repo-url>
cd ztodo
npm install
npm start
```

## 使用

| 操作 | 方式 |
|------|------|
| 新建便签 | `Alt+T` / 右键菜单 / 底部 + 按钮 |
| 编辑文字 | 双击便签文字 |
| 切换完成 | 点击 ☐ |
| 换颜色 | 点击底部彩色圆点 |
| 移动便签 | 拖拽便签任意位置 |
| 删除便签 | `x` 按钮 / 右键菜单 |
| 显示/隐藏 | `Alt+Shift+T` / 托盘菜单 |

## 技术栈

- Electron 28+
- 原生 JavaScript（无框架）
- JSON 本地存储

## 作者

本项目的全部代码由 AI（Claude Code / DeepSeek-V4-Pro）创作，人工仅提供需求描述和设计决策。

## License

MIT
