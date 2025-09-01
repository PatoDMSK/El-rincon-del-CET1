document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('calendarGrid');
    const meta = document.getElementById('calendarMeta');
    const modal = document.getElementById('eventModal');
    const saveBtn = document.getElementById('saveEvent');
    const deleteBtn = document.getElementById('deleteEvent');
    const titleInput = document.getElementById('eventTitle');
    const notesInput = document.getElementById('eventNotes');
    const modalTitle = document.getElementById('modalTitle');

    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const userKey = userData.email ? `calendarEvents:${userData.email}` : 'calendarEvents:anon';

    let current = new Date();
    let selectedDateStr = null;

    function loadEvents() { return JSON.parse(localStorage.getItem(userKey) || '{}'); }
    function saveEvents(events) { localStorage.setItem(userKey, JSON.stringify(events)); }

    function getMonthMatrix(date) {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const startDay = new Date(firstDay);
        startDay.setDate(firstDay.getDate() - ((firstDay.getDay() + 6) % 7)); // semana inicia lunes
        const cells = [];
        for (let i = 0; i < 42; i++) { // 6 semanas
            const d = new Date(startDay);
            d.setDate(startDay.getDate() + i);
            cells.push(d);
        }
        return cells;
    }

    function render() {
        const year = current.getFullYear();
        const month = current.getMonth();
        meta.textContent = current.toLocaleString('es-ES', { month: 'long', year: 'numeric' }).toUpperCase();
        grid.innerHTML = '';

        const weekdayNames = ['L','M','X','J','V','S','D'];
        weekdayNames.forEach(w => {
            const head = document.createElement('div');
            head.className = 'calendar-day';
            head.style.minHeight = 'auto'; head.style.background = 'transparent'; head.style.border = 'none'; head.style.textAlign = 'center'; head.style.fontWeight = '700'; head.style.color = '#6c757d';
            head.textContent = w;
            grid.appendChild(head);
        });

        const events = loadEvents();
        const cells = getMonthMatrix(current);
        cells.forEach(d => {
            const div = document.createElement('div');
            div.className = 'calendar-day' + (d.getMonth() !== month ? ' other' : '');
            const dateSpan = document.createElement('div');
            dateSpan.className = 'date';
            dateSpan.textContent = d.getDate();
            div.appendChild(dateSpan);

            const key = d.toISOString().slice(0,10);
            const dayEvents = events[key] || [];
            dayEvents.slice(0,3).forEach(ev => {
                const badge = document.createElement('span');
                badge.className = 'event-badge';
                badge.textContent = ev.title || 'Sin título';
                div.appendChild(badge);
            });
            if (dayEvents.length > 3) {
                const more = document.createElement('span');
                more.className = 'event-badge';
                more.textContent = `+${dayEvents.length - 3} más`;
                div.appendChild(more);
            }

            div.addEventListener('click', () => openModal(key));
            grid.appendChild(div);
        });
    }

    function openModal(dateStr) {
        selectedDateStr = dateStr;
        const events = loadEvents();
        const list = events[dateStr] || [];
        modalTitle.textContent = `Eventos del ${dateStr}`;
        titleInput.value = list[0]?.title || '';
        notesInput.value = list[0]?.notes || '';
        modal.classList.add('show');
    }

    saveBtn.addEventListener('click', () => {
        const title = titleInput.value.trim();
        const notes = notesInput.value.trim();
        const events = loadEvents();
        const arr = events[selectedDateStr] || [];
        if (title || notes) {
            arr[0] = { title, notes };
            events[selectedDateStr] = arr;
            saveEvents(events);
        } else {
            delete events[selectedDateStr];
            saveEvents(events);
        }
        modal.classList.remove('show');
        render();
    });

    deleteBtn.addEventListener('click', () => {
        const events = loadEvents();
        delete events[selectedDateStr];
        saveEvents(events);
        modal.classList.remove('show');
        render();
    });

    modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('show'); });

    document.getElementById('prevMonth').addEventListener('click', () => { current.setMonth(current.getMonth() - 1); render(); });
    document.getElementById('nextMonth').addEventListener('click', () => { current.setMonth(current.getMonth() + 1); render(); });
    document.getElementById('todayBtn').addEventListener('click', () => { current = new Date(); render(); });

    render();
});


