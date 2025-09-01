document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('taskTitle');
    const addBtn = document.getElementById('addTask');
    const list = document.getElementById('taskList');
    const empty = document.getElementById('emptyText');

    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const key = userData.email ? `tasks:${userData.email}` : 'tasks:anon';

    function load() { return JSON.parse(localStorage.getItem(key) || '[]'); }
    function save(items) { localStorage.setItem(key, JSON.stringify(items)); }

    function render() {
        const items = load();
        list.innerHTML = '';
        empty.style.display = items.length ? 'none' : '';
        items.forEach((t, idx) => {
            const row = document.createElement('div');
            row.className = 'task-item' + (t.done ? ' completed' : '');
            const check = document.createElement('input');
            check.type = 'checkbox';
            check.checked = !!t.done;
            const title = document.createElement('div');
            title.textContent = t.title;
            title.style.flex = '1';
            const meta = document.createElement('div');
            meta.className = 'task-meta';
            meta.textContent = new Date(t.createdAt).toLocaleDateString();
            const remove = document.createElement('button');
            remove.className = 'btn-secondary';
            remove.textContent = 'Eliminar';
            remove.style.padding = '.25rem .5rem';

            check.addEventListener('change', () => {
                const items2 = load();
                items2[idx].done = check.checked;
                save(items2); render();
            });
            remove.addEventListener('click', () => {
                const items2 = load();
                items2.splice(idx,1);
                save(items2); render();
            });

            row.appendChild(check);
            row.appendChild(title);
            row.appendChild(meta);
            row.appendChild(remove);
            list.appendChild(row);
        });
    }

    addBtn.addEventListener('click', () => {
        const title = input.value.trim();
        if (!title) return;
        const items = load();
        items.unshift({ title, done:false, createdAt: new Date().toISOString() });
        save(items); input.value=''; render();
    });

    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') addBtn.click(); });

    render();
});


