const fs = require('fs');
const path = require('path');
const os = require('os');
const { EventEmitter } = require('events');

const DATA_DIR = path.join(os.homedir(), '.ztodo');
const DATA_FILE = path.join(DATA_DIR, 'data.json');

class TodoStore extends EventEmitter {
  constructor() {
    super();
    this.todos = [];
    this._ensureDir();
    this._load();
  }

  _ensureDir() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  _load() {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
        this.todos = data.todos || [];
      }
    } catch (e) {
      const backup = DATA_FILE + '.bak.' + Date.now();
      try { fs.copyFileSync(DATA_FILE, backup); } catch (_) {}
      this.todos = [];
    }
  }

  _save() {
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify({ todos: this.todos }, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to save todos:', e.message);
    }
  }

  _generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  getAll() { return this.todos; }

  create(text, x, y) {
    const todo = { id: this._generateId(), text: text || '', done: false, color: 'yellow', x: x || 400, y: y || 300 };
    this.todos.push(todo);
    this._save();
    this.emit('created', todo);
    return todo;
  }

  update(id, fields) {
    const todo = this.todos.find(t => t.id === id);
    if (!todo) return null;
    Object.assign(todo, fields);
    this._save();
    this.emit('updated', todo);
    return todo;
  }

  remove(id) {
    const idx = this.todos.findIndex(t => t.id === id);
    if (idx === -1) return false;
    const [removed] = this.todos.splice(idx, 1);
    this._save();
    this.emit('removed', removed);
    return true;
  }

  toggleDone(id) {
    const todo = this.todos.find(t => t.id === id);
    if (!todo) return null;
    todo.done = !todo.done;
    this._save();
    this.emit('updated', todo);
    return todo;
  }
}

module.exports = TodoStore;
