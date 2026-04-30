// ═══════════════════════════════════════════════════
// UTILS
// ═══════════════════════════════════════════════════

const Storage = {
    set: (k, v) => localStorage.setItem('physprep_' + k, JSON.stringify(v)),
    get: (k) => { try { return JSON.parse(localStorage.getItem('physprep_' + k)); } catch (e) { return null; } }
};

// ── Difficulty helpers ──
function getDifficultyMeta(score) {
    if (score >= 9.0) return { label: 'BRUTAL', color: '#ff5f87', bg: 'rgba(255,95,135,.18)' };
    if (score >= 7.5) return { label: 'HARD', color: '#bf616a', bg: 'rgba(191,97,106,.15)' };
    if (score >= 4.6) return { label: 'MEDIUM', color: '#ebcb8b', bg: 'rgba(235,203,139,.15)' };
    return { label: 'EASY', color: '#a3be8c', bg: 'rgba(163,190,140,.15)' };
}

async function loadData() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        state.fullData = data;
        console.log('Data loaded successfully');
        return data;
    } catch (e) {
        console.error('Failed to load data.json:', e);
        return null;
    }
}

function addDays(date, n) {
    const d = new Date(date);
    d.setDate(d.getDate() + n);
    return d;
}

function fmtDate(d) {
    if (!d) return '';
    return d.toLocaleString('default', { month: 'short', day: 'numeric' });
}

function fmtMonth(d) {
    if (!d) return '';
    return d.toLocaleString('default', { month: 'short', year: 'numeric' });
}

function fmtMonthShort(d) {
    if (!d) return '';
    return d.toLocaleString('default', { month: 'short' }).toUpperCase();
}

function studyDays(totalDays) {
    return Math.round(totalDays * 6 / 7);
}

function getTopicMetrics(topicId) {
    const mapping = {
        math: 'mathematical_methods', cm: 'classical_mechanics', em: 'electromagnetism',
        qm: 'quantum_mechanics', sm: 'thermodynamics_and_statistical_physics',
        mp: 'modern_physics', ss: 'solid_state_physics', elec: 'electronics'
    };
    const dataSection = state.fullData?.IIT_JAM_Physics?.[mapping[topicId]];
    if (!dataSection) return { totalHours: 0, subtopicCount: 0, trapCount: 0, avgDifficulty: 5 };
    let totalHours = 0, subtopicCount = 0, trapCount = 0, totalDifficulty = 0;
    function traverse(obj) {
        if (!obj || typeof obj !== 'object') return;
        if (obj.concept || obj.study_hours_int !== undefined) {
            totalHours += obj.study_hours_int || 0;
            subtopicCount++;
            trapCount += (obj.common_traps || []).length;
            totalDifficulty += obj.difficulty_score || 5;
            return;
        }
        for (const value of Object.values(obj)) traverse(value);
    }
    traverse(dataSection);
    return { totalHours, subtopicCount, trapCount, avgDifficulty: subtopicCount > 0 ? totalDifficulty / subtopicCount : 5 };
}

function calculateProgress(topicId) {
    const topic = TOPIC_DATA.find(t => t.id === topicId);
    if (!topic) return 0;
    const metrics = getTopicMetrics(topicId);
    const totalHrs = metrics.totalHours || topic.hrs;
    const done = state.progress[topicId] || 0;
    return Math.min(100, Math.round((done / totalHrs) * 100));
}

function logProgress(topicId, subKey, hrs) {
    state.progress[topicId] = (state.progress[topicId] || 0) + hrs;
    Storage.set('progress', state.progress);
    renderSyllabus();
}

function renderSyllabus() {
    const container = document.getElementById('syllabus-explorer');
    if (!container) return;
    const mapping = {
        math: 'mathematical_methods', cm: 'classical_mechanics', em: 'electromagnetism',
        qm: 'quantum_mechanics', sm: 'thermodynamics_and_statistical_physics',
        mp: 'modern_physics', ss: 'solid_state_physics', elec: 'electronics'
    };
    container.innerHTML = state.topicOrder.map(tid => {
        const topic = TOPIC_DATA.find(t => t.id === tid);
        if (!topic) return '';
        const progress = calculateProgress(tid);
        const dates = state.topicPlan ? state.topicPlan[tid] : null;
        const metrics = getTopicMetrics(tid);
        const displayHrs = metrics.totalHours || topic.hrs;
        const displayDiff = metrics.avgDifficulty || topic.difficulty || 5;
        const dm = getDifficultyMeta(displayDiff);
        
        return `
            <div class="topic-header ${topic.badge}" id="topic-card-${tid}" onclick="showTopic('${tid}')"
                 style="cursor:pointer;border-left:3px solid ${topic.color}; margin-bottom:12px; padding: 20px">
                <div style="display:flex; justify-content:space-between; align-items:center; width: 100%">
                    <div style="flex:1">
                        <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:4px">
                            <div class="topic-title" style="color: var(--text-bright); font-weight: bold">${topic.name}</div>
                            <span style="font-size:10px;font-family:'JetBrains Mono',monospace;padding:2px 9px;border-radius:20px;background:${dm.bg};color:${dm.color}">${dm.label}</span>
                        </div>
                        <div class="topic-meta">
                            <span class="topic-total-hrs">${displayHrs} hrs</span>
                            ${dates ? `<span>· ${fmtDate(dates.start)} – ${fmtDate(dates.end)}</span>` : ''}
                        </div>
                    </div>
                    <div style="display:flex; align-items:center; gap:20px">
                        <div style="text-align:right">
                            <div style="font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--muted)">${progress}%</div>
                            <div class="bar-track" style="width:60px; height:4px; margin-top:4px"><div class="bar-fill" style="width:${progress}%;background:${topic.color}"></div></div>
                        </div>
                        <span style="color:var(--muted); font-size:18px">→</span>
                    </div>
                </div>
            </div>`;
    }).join('');
}

function extractSubtopicMetadata(obj, prefix = '', acc = [], ctx = { hrs: 0 }) {
    if (!obj || typeof obj !== 'object') return acc;
    if (obj.concept || obj.study_hours_int !== undefined) {
        const name = prefix.replace(/_/g, ' ').toUpperCase() || 'GENERAL';
        acc.push({ name: name, hours: obj.study_hours_int || 2, offset: Math.floor(ctx.hrs / (state.dailyHours || 6)) });
        ctx.hrs += (obj.study_hours_int || 2);
        return acc;
    }
    for (const [key, value] of Object.entries(obj)) {
        const nextPrefix = prefix ? `${prefix} > ${key}` : key;
        extractSubtopicMetadata(value, nextPrefix, acc, ctx);
    }
    return acc;
}

function renderDynamicStats(phases) {
    const update = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    update('stat-total-hrs', phases.totalHours + 'h');
    update('stat-daily-avg', phases.avgDaily + 'h');
}

function buildSortableList() {
    const ul = document.getElementById('ol-topic-sort-list');
    if (!ul) return;
    ul.innerHTML = '';
    state.topicOrder.forEach((tid, idx) => {
        const td = TOPIC_DATA.find(t => t.id === tid);
        if (!td) return;
        const metrics = getTopicMetrics(tid);
        const displayHrs = metrics.totalHours || td.hrs;
        const displayDiff = metrics.avgDifficulty || td.difficulty || 5;
        const dm = getDifficultyMeta(displayDiff);
        const li = document.createElement('li');
        li.className = 'sortable-item';
        li.dataset.id = tid;
        li.draggable = true;
        const cls = displayDiff >= 7.5 ? 'hard' : displayDiff >= 4.6 ? 'med' : 'easy';
        li.innerHTML = `<span class="drag-handle">⠿</span><span class="item-num">${idx + 1}</span><span class="item-name">${td.name}</span><span class="diff-badge-s ${cls}" style="background:${dm.bg}; color:${dm.color}">${dm.label}</span><span class="item-hrs">${displayHrs}h</span>`;
        ul.appendChild(li);
    });
    initDragAndDrop('ol-topic-sort-list');
}

function initDragAndDrop(uIId) {
    const ul = document.getElementById(uIId);
    if (!ul) return;
    let dragging = null;
    ul.querySelectorAll('.sortable-item').forEach(item => {
        item.addEventListener('dragstart', e => { dragging = item; item.classList.add('dragging'); e.dataTransfer.effectAllowed = 'move'; });
        item.addEventListener('dragend', () => {
            item.classList.remove('dragging');
            ul.querySelectorAll('.sortable-item').forEach(i => i.classList.remove('drag-over'));
            state.topicOrder = [...ul.querySelectorAll('.sortable-item')].map(i => i.dataset.id);
            ul.querySelectorAll('.sortable-item').forEach((i, idx) => { i.querySelector('.item-num').textContent = idx + 1; });
            dragging = null;
        });
        item.addEventListener('dragover', e => {
            e.preventDefault();
            if (dragging && item !== dragging) {
                item.classList.add('drag-over');
                const r = item.getBoundingClientRect();
                const mid = r.top + r.height / 2;
                if (e.clientY < mid) ul.insertBefore(dragging, item);
                else ul.insertBefore(dragging, item.nextSibling);
            }
        });
        item.addEventListener('dragleave', () => item.classList.remove('drag-over'));
        item.addEventListener('drop', e => { e.preventDefault(); item.classList.remove('drag-over'); });
    });
    ul.querySelectorAll('.sortable-item').forEach(item => {
        let startY, startIndex;
        item.addEventListener('touchstart', e => { startY = e.touches[0].clientY; startIndex = [...ul.children].indexOf(item); item.classList.add('dragging'); }, { passive: true });
        item.addEventListener('touchmove', e => {
            const y = e.touches[0].clientY;
            const els = [...ul.querySelectorAll('.sortable-item:not(.dragging)')];
            const after = els.find(el => { const r = el.getBoundingClientRect(); return y < r.top + r.height / 2; });
            if (after) ul.insertBefore(item, after);
            else ul.appendChild(item);
        }, { passive: false });
        item.addEventListener('touchend', () => {
            item.classList.remove('dragging');
            state.topicOrder = [...ul.querySelectorAll('.sortable-item')].map(i => i.dataset.id);
            ul.querySelectorAll('.sortable-item').forEach((i, idx) => { i.querySelector('.item-num').textContent = idx + 1; });
        });
    });
}

window.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.glass-card, .phase-block, .setup-card, .pomodoro-widget, .topic-header, .subtopic-item-row, .todo-item');
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});
