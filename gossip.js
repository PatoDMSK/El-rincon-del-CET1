document.addEventListener('DOMContentLoaded', () => {
    const text = document.getElementById('gossipText');
    const publish = document.getElementById('publishBtn');
    const feed = document.getElementById('gossipFeed');
    const empty = document.getElementById('emptyFeed');
    const count = document.getElementById('charCount');

    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    // Demo: clave compartida para simular "usuarios conectados" en el mismo navegador.
    // Para producción real, usar WebSocket/Backend y base de datos
    const key = 'gossip:global';

    const emojis = ['👍','😂','😮','😢','❤️'];

    function load() { return JSON.parse(localStorage.getItem(key) || '[]'); }
    function save(items) { localStorage.setItem(key, JSON.stringify(items)); }

    function render() {
        const items = load();
        feed.innerHTML = '';
        empty.style.display = items.length ? 'none' : '';
        items.slice().reverse().forEach((p, idx) => {
            const card = document.createElement('div');
            card.className = 'gossip-card';
            const meta = document.createElement('div');
            meta.className = 'gossip-meta';
            const author = p.author || 'Anónimo';
            meta.textContent = `${author} • ${new Date(p.createdAt).toLocaleString()}`;
            const body = document.createElement('div');
            body.textContent = p.text;

            // Reacciones
            const actions = document.createElement('div');
            actions.className = 'gossip-actions';
            const reactions = document.createElement('div');
            reactions.className = 'reactions';
            const userId = userData.email || userData.name || 'anon';
            emojis.forEach(em => {
                const btn = document.createElement('button');
                btn.className = 'emoji-btn';
                const count = (p.reacts && p.reacts[em]) ? p.reacts[em].count : 0;
                const reacted = !!(p.reacts && p.reacts[em] && p.reacts[em].users && p.reacts[em].users.includes(userId));
                btn.innerHTML = `${em} <span class="emoji-count">${count}</span>`;
                if (reacted) btn.classList.add('reacted');
                btn.addEventListener('click', () => {
                    const items2 = load();
                    const realIndex = items.length - 1 - idx; // porque invertimos visualmente
                    items2[realIndex].reacts = items2[realIndex].reacts || {};
                    const bucket = items2[realIndex].reacts[em] || { count: 0, users: [] };
                    const hasUser = bucket.users.includes(userId);
                    // Limitar a una reacción por usuario: toggle
                    if (hasUser) {
                        bucket.users = bucket.users.filter(u => u !== userId);
                        bucket.count = Math.max(0, (bucket.count || 0) - 1);
                    } else {
                        bucket.users.push(userId);
                        bucket.count = (bucket.count || 0) + 1;
                    }
                    items2[realIndex].reacts[em] = bucket;
                    save(items2);
                    // animación suave
                    btn.classList.add('pop');
                    setTimeout(() => btn.classList.remove('pop'), 250);
                    render();
                });
                reactions.appendChild(btn);
            });

            // Comentarios
            const comments = document.createElement('div');
            comments.className = 'comments';
            (p.comments || []).forEach(c => {
                const row = document.createElement('div');
                row.className = 'comment';
                row.textContent = `${c.author || 'Anónimo'}: ${c.text}`;
                comments.appendChild(row);
            });
            const commentBox = document.createElement('div');
            commentBox.className = 'comment-box';
            const input = document.createElement('input');
            input.placeholder = 'Escribe un comentario...';
            const send = document.createElement('button');
            send.className = 'btn-secondary';
            send.textContent = 'Comentar';
            send.addEventListener('click', () => {
                const val = input.value.trim();
                if (!val) return;
                const items2 = load();
                const realIndex = items.length - 1 - idx;
                items2[realIndex].comments = items2[realIndex].comments || [];
                items2[realIndex].comments.push({
                    text: val,
                    author: userData.name || userData.email || 'Anónimo',
                    createdAt: new Date().toISOString()
                });
                save(items2); input.value=''; render();
            });
            commentBox.appendChild(input);
            commentBox.appendChild(send);

            actions.appendChild(reactions);

            card.appendChild(meta);
            card.appendChild(body);
            card.appendChild(actions);
            card.appendChild(comments);
            card.appendChild(commentBox);
            feed.appendChild(card);
        });
    }

    publish.addEventListener('click', () => {
        const val = (text.value || '').trim();
        if (!val) return;
        if (val.length > 300) return;
        const items = load();
        items.push({
            text: val,
            author: userData.name || userData.email || 'Anónimo',
            createdAt: new Date().toISOString(),
            reacts: {},
            comments: []
        });
        save(items); text.value=''; updateCount(); render();
    });

    function updateCount() {
        const l = (text.value || '').length;
        count.textContent = `${l}/300`;
        count.style.color = l > 300 ? '#e74c3c' : '#6c757d';
    }
    text.addEventListener('input', updateCount);
    updateCount();

    // Simulación de sincronización entre pestañas (storage event)
    window.addEventListener('storage', (e) => {
        if (e.key === key) render();
    });

    render();
});


