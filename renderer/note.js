let todoId = null;
let currentColor = 'yellow';

const noteEl = document.getElementById('note');
const textEl = document.getElementById('text');
const editorEl = document.getElementById('editor');
const checkboxEl = document.getElementById('checkbox');

// ── Init ──
window.ztodo.onInit((todo) => {
  todoId = todo.id;
  currentColor = todo.color;
  noteEl.classList.add(todo.color);
  textEl.textContent = todo.text || ' ';
  checkboxEl.checked = todo.done;
  if (todo.done) noteEl.classList.add('done');
  highlightDot(currentColor);
});

// ── Checkbox ──
checkboxEl.addEventListener('change', () => {
  if (!todoId) return;
  noteEl.classList.toggle('done', checkboxEl.checked);
  window.ztodo.toggleDone(todoId);
});

// ── Edit (double-click) ──
textEl.addEventListener('dblclick', () => startEditing());

function startEditing() {
  editorEl.value = textEl.textContent === ' ' ? '' : textEl.textContent;
  textEl.style.display = 'none';
  editorEl.style.display = 'block';
  editorEl.focus();
  editorEl.select();
}

function stopEditing(save) {
  if (editorEl.style.display === 'none') return;
  if (save) {
    const newText = editorEl.value.trim();
    textEl.textContent = newText || ' ';
    window.ztodo.updateTodo(todoId, { text: newText });
  }
  textEl.style.display = 'block';
  editorEl.style.display = 'none';
}

editorEl.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); stopEditing(true); }
  if (e.key === 'Escape') stopEditing(false);
});

editorEl.addEventListener('blur', () => stopEditing(true));

// ── Save position after drag ──
let dragStartPos = null;

noteEl.addEventListener('mousedown', () => {
  dragStartPos = { x: window.screenX, y: window.screenY };
});

document.addEventListener('mouseup', () => {
  if (dragStartPos && todoId) {
    const nx = window.screenX, ny = window.screenY;
    if (nx !== dragStartPos.x || ny !== dragStartPos.y) {
      window.ztodo.updateTodo(todoId, { x: nx, y: ny });
    }
    dragStartPos = null;
  }
});

// ── Color dots ──
document.querySelectorAll('.dot').forEach(dot => {
  dot.addEventListener('click', (e) => {
    e.stopPropagation();
    const color = dot.dataset.color;
    noteEl.classList.remove(currentColor);
    noteEl.classList.add(color);
    currentColor = color;
    highlightDot(color);
    window.ztodo.updateTodo(todoId, { color });
  });
});

function highlightDot(color) {
  document.querySelectorAll('.dot').forEach(d => d.classList.remove('active'));
  const active = document.querySelector('.dot.' + color);
  if (active) active.classList.add('active');
}

// ── Buttons ──
document.getElementById('btn-new').addEventListener('click', (e) => {
  e.stopPropagation();
  window.ztodo.createTodo();
});

document.getElementById('btn-delete').addEventListener('click', (e) => {
  e.stopPropagation();
  if (todoId) window.ztodo.deleteTodo(todoId);
});

// ── Right-click context menu ──
document.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  showContextMenu(e.clientX, e.clientY);
});

function showContextMenu(x, y) {
  const existing = document.querySelector('.context-menu');
  if (existing) existing.remove();

  const menu = document.createElement('div');
  menu.className = 'context-menu';
  menu.innerHTML = '<div class="menu-item" data-action="edit">Edit</div><div class="menu-item" data-action="new">+ New Note</div><div class="menu-item danger" data-action="delete">Delete</div>';
  menu.style.left = x + 'px';
  menu.style.top = y + 'px';
  document.body.appendChild(menu);

  menu.querySelector('[data-action="edit"]').onclick = () => { menu.remove(); startEditing(); };
  menu.querySelector('[data-action="new"]').onclick = () => { menu.remove(); window.ztodo.createTodo(); };
  menu.querySelector('[data-action="delete"]').onclick = () => { menu.remove(); window.ztodo.deleteTodo(todoId); };

  setTimeout(() => {
    var close = function(ev) {
      if (!menu.contains(ev.target)) { menu.remove(); document.removeEventListener('click', close); }
    };
    document.addEventListener('click', close);
  }, 0);
}
