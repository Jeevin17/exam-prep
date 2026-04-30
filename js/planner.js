// ═══════════════════════════════════════════════════
// PLANNER LOGIC
// ═══════════════════════════════════════════════════

let state = {
    startDate: null,
    topicOrder: TOPIC_DATA.map(t => t.id),
    dailyHours: 6,
    examDates: { jam: null, tifr: null, jest: null },
    fullData: null,
    topicPlan: null,
    currentPhases: null,
    progress: Storage.get('progress') || {},
    subtopicProblems: Storage.get('subtopicProblems') || {},
    _prevPage: 'page-2',
    _currentTopic: null,
    _activeSubtopics: {}
};

function calculatePlanPhases(start, primaryExamDate, dailyHours) {
    let totalHours = 0;
    TOPIC_DATA.forEach(t => {
        const metrics = getTopicMetrics(t.id);
        totalHours += metrics.totalHours || t.hrs;
    });
    const totalDaysNeeded = Math.ceil(totalHours / dailyHours);
    const calendarDays = Math.ceil(totalDaysNeeded * 1.2 * (7 / 6));
    return {
        totalHours,
        totalDays: calendarDays,
        theoryEnd: addDays(start, Math.ceil(calendarDays * 0.7)),
        problemEnd: addDays(start, calendarDays),
        avgDaily: dailyHours
    };
}

function generateTopicPlan(order, dailyHours, start) {
    let plan = {};
    let currentStart = new Date(start);
    order.forEach(tid => {
        const metrics = getTopicMetrics(tid);
        const hrs = metrics.totalHours || 80;
        const calendarDays = Math.ceil((hrs / dailyHours) * 1.2 * (7 / 6));
        const end = addDays(currentStart, calendarDays);
        plan[tid] = { start: new Date(currentStart), end: new Date(end) };
        currentStart = addDays(end, 1);
    });
    return plan;
}

function generatePlan() {
    if (!state.startDate) { alert('Please complete setup first.'); return; }
    const primaryExamDate = state.examDates?.jam || null;
    const phases = calculatePlanPhases(state.startDate, primaryExamDate, state.dailyHours);
    state.currentPhases = phases;
    state.topicPlan = generateTopicPlan(state.topicOrder, state.dailyHours, state.startDate);
    updateTimelineDates(state.startDate);
    updateHourAccounting(state.startDate);
    renderSyllabus();
    renderDynamicStats(phases);
    const examDate = primaryExamDate ? new Date(primaryExamDate) : addDays(state.startDate, phases.totalDays);
    const label = document.getElementById('p1-hero-label');
    if (label) label.textContent = `Physics Research Exam Prep · ${fmtDate(state.startDate)} – ${fmtDate(examDate)}`;
    const badge = document.getElementById('plan-status-badge');
    if (badge) {
        badge.style.display = 'inline-flex';
        badge.textContent = `✓ Plan active · ${fmtDate(state.startDate)} → ${fmtDate(examDate)} · ${state.dailyHours}h/day`;
    }
    showPage('page-1');
}

function updateTimelineDates(start) {
    const bar = document.getElementById('timeline-bar');
    if (!bar) return;
    bar.innerHTML = '';
    let cur = new Date(start);
    for (let i = 0; i < 10; i++) {
        const monthStart = new Date(cur.getFullYear(), cur.getMonth(), 1);
        const monthEnd = new Date(cur.getFullYear(), cur.getMonth() + 1, 0);
        let activeTopics = [];
        state.topicOrder.forEach(tid => {
            const plan = state.topicPlan?.[tid];
            if (plan && plan.start <= monthEnd && plan.end >= monthStart) {
                const topic = TOPIC_DATA.find(t => t.id === tid);
                if (topic) activeTopics.push(topic.badge.toUpperCase() || topic.name.split(' ')[0]);
            }
        });
        let typeLabel = activeTopics.length > 0 ? activeTopics.join(' + ') : 'Revision / Exams';
        let cls = i < 2 ? 'mb-intense' : (i >= 4 && i < 7 ? 'mb-problem' : (i >= 7 ? 'mb-final' : 'mb-theory'));
        const el = document.createElement('div');
        el.className = 'month-block ' + cls;
        el.innerHTML = `<span class="m-name">${fmtMonthShort(cur)}</span><span class="m-type">${typeLabel}</span>`;
        bar.appendChild(el);
        const next = new Date(cur);
        next.setMonth(next.getMonth() + 1);
        cur = next;
    }
}

function updateHourAccounting(start) {
    const body = document.getElementById('hour-accounting-body');
    if (!body) return;
    const hpd = state.dailyHours || 6;
    const rows = [];
    let cumHrs = 0;
    state.topicOrder.forEach(tid => {
        const topic = TOPIC_DATA.find(t => t.id === tid);
        const plan = state.topicPlan?.[tid];
        if (!topic || !plan) return;
        const metrics = getTopicMetrics(tid);
        const hrs = metrics.totalHours || topic.hrs;
        const calDays = Math.round((plan.end - plan.start) / 86400000);
        const sd = studyDays(calDays);
        cumHrs += hrs;
        rows.push(`<tr>
            <td style="font-family:'JetBrains Mono',monospace;font-size:11px">${fmtDate(plan.start)} – ${fmtDate(plan.end)}</td>
            <td>${calDays}</td>
            <td>${sd}</td>
            <td>${hpd}</td>
            <td style="color:${topic.color};font-family:'JetBrains Mono',monospace"><strong>${hrs}</strong></td>
            <td>${topic.name}</td>
        </tr>`);
    });
    body.innerHTML = rows.join('');
    const totalEl = document.getElementById('accounting-total-hrs');
    if (totalEl) totalEl.textContent = cumHrs + 'h';
}

function showTopic(id) {
    state._currentTopic = id;
    const topic = TOPIC_DATA.find(t => t.id === id);
    if (!topic) return;
    const dates = state.topicPlan ? state.topicPlan[id] : { start: new Date() };
    const mapping = {
        math: 'mathematical_methods', cm: 'classical_mechanics', em: 'electromagnetism',
        qm: 'quantum_mechanics', sm: 'thermodynamics_and_statistical_physics',
        mp: 'modern_physics', ss: 'solid_state_physics', elec: 'electronics'
    };
    const dataSection = state.fullData?.IIT_JAM_Physics?.[mapping[id]];

    let cumulativeHrs = 0;
    function extractSubtopics(obj, prefix = '') {
        let subtopics = {};
        if (!obj || typeof obj !== 'object') return subtopics;
        if (obj.concept || obj.study_hours_int !== undefined) {
            const name = prefix.replace(/_/g, ' ').toUpperCase() || 'GENERAL';
            const startDayOffset = Math.floor(cumulativeHrs / state.dailyHours);
            subtopics[name] = { ...obj, date: addDays(dates.start, startDayOffset) };
            cumulativeHrs += (obj.study_hours_int || 0);
            return subtopics;
        }
        for (const [key, value] of Object.entries(obj)) {
            const currentName = prefix ? `${prefix} > ${key}` : key;
            const sub = extractSubtopics(value, currentName);
            Object.assign(subtopics, sub);
        }
        return subtopics;
    }

    const subtopics = extractSubtopics(dataSection);
    state._activeSubtopics = subtopics;
    const container = document.getElementById('page-topic-content');
    if (!container) return;
    let html = `
        <header class="hero"><div class="hero-inner">
            <button onclick="showPage('page-2')" style="background:none;border:none;color:var(--cyan);cursor:pointer;font-family:'JetBrains Mono',monospace;margin-bottom:20px">← BACK TO SYLLABUS</button>
            <div class="hero-label">${topic.name}</div>
            <h1 class="page-title">${topic.name}</h1>
            <p class="page-sub">Comprehensive breakdown of all modules and expected study schedule.</p>
        </div></header>
        <section class="section">
            <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 450px), 1fr)); gap:24px">
    `;
    Object.entries(subtopics).forEach(([subName, subData]) => {
        const dm = getDifficultyMeta(subData.difficulty_score || 5);
        const probs = state.subtopicProblems[subName] || [];
        const doneCount = probs.filter(p => p.done).length;
        const totalCount = (subData.applications?.length || 0) + (subData.components?.length || 0) || 5;
        html += `
            <div class="glass-card" onclick="showSubtopic('${subName.replace(/'/g, "\\'")}')" style="cursor:pointer">
                <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:16px">
                    <div style="text-align:left">
                        <div class="phase-num" style="font-size:10px">${fmtDate(subData.date)}</div>
                        <div class="phase-name" style="font-size:16px; margin:4px 0">${subName}</div>
                    </div>
                    <span class="diff-badge-s" style="background:${dm.bg};color:${dm.color}">${dm.label}</span>
                </div>
                <div style="font-size:12px; color:var(--muted); font-style:italic; margin-bottom:16px; text-align:left; min-height:3em">
                    ${subData.concept || ''}
                </div>
                <div style="display:flex; align-items:center; gap:12px; margin-top:auto">
                    <div class="bar-track" style="flex:1; height:6px; background:rgba(255,255,255,0.05)">
                        <div class="bar-fill" style="width:${(subData.difficulty_score || 5) * 10}%; background:${dm.color}"></div>
                    </div>
                    <span style="font-family:'JetBrains Mono',monospace; font-size:10px; color:var(--muted)">${(subData.difficulty_score || 5).toFixed(1)}/10</span>
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-top:16px">
                    <span style="font-family:'JetBrains Mono',monospace; font-size:11px; color:var(--cyan)">${subData.study_hours_int || 2}h Session</span>
                    <span style="font-family:'JetBrains Mono',monospace; font-size:11px; color:var(--muted)">${doneCount}/${totalCount} Tasks Done</span>
                </div>
            </div>
        `;
    });
    html += `</div></section>`;
    container.innerHTML = html;
    showPage('page-topic');
}

function showSubtopic(subName) {
    const subData = state._activeSubtopics[subName];
    if (!subData) return;
    const container = document.getElementById('page-subtopic-content');
    if (!container) return;
    const dm = getDifficultyMeta(subData.difficulty_score || 5);
    const review1 = addDays(subData.date, 1);
    const review2 = addDays(subData.date, 7);
    const review3 = addDays(subData.date, 30);
    if (!state.subtopicProblems[subName]) {
        const probs = [];
        (subData.components || []).forEach(c => probs.push({ task: `Verify: ${c}`, done: false }));
        (subData.applications || []).forEach(a => probs.push({ task: `Solve: ${a}`, done: false }));
        if (probs.length === 0) for (let i = 1; i <= 5; i++) probs.push({ task: `Practice Problem #${i}`, done: false });
        state.subtopicProblems[subName] = probs;
    }
    const problems = state.subtopicProblems[subName];
    let html = `
        <header class="hero"><div class="hero-inner">
            <button onclick="showPage('page-topic')" style="background:none;border:none;color:var(--cyan);cursor:pointer;font-family:'JetBrains Mono',monospace;margin-bottom:20px">← BACK TO LIST</button>
            <div class="hero-label">${subName}</div>
            <h1 class="page-title" style="font-size:28px">${subName}</h1>
            <p class="page-sub">${subData.concept || ''}</p>
        </div></header>
        <section class="section">
            <div style="display:flex; flex-direction:column; gap:32px">
                <div id="subtopic-pomo-container" class="glass-card" style="max-width:800px; margin: 0 auto; width:100%">
                    <div class="section-tag" style="text-align:center">Active Session</div>
                    <div id="subtopic-pomo-widget"></div>
                </div>
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:30px">
                    <div class="glass-card" style="text-align:left">
                        <div class="section-tag">Key Theory</div>
                        <label class="config-note" style="color:var(--cyan)">FORMULA</label>
                        <div style="font-family:'JetBrains Mono',monospace; font-size:15px; color:var(--text-bright); background:rgba(0,0,0,0.25); padding:16px; border-radius:8px; margin:10px 0 20px; border:1px solid rgba(255,255,255,0.05)">${subData.formula || 'N/A'}</div>
                        <label class="config-note">SPACED REPETITION</label>
                        <div class="review-schedule" style="margin-top:10px">
                            <div class="review-item"><span>Review 1</span> <strong>${fmtDate(review1)}</strong></div>
                            <div class="review-item"><span>Review 2</span> <strong>${fmtDate(review2)}</strong></div>
                            <div class="review-item"><span>Review 3</span> <strong>${fmtDate(review3)}</strong></div>
                        </div>
                    </div>
                    <div class="glass-card" style="text-align:left">
                        <div class="section-tag">Task Board (${problems.filter(p => p.done).length}/${problems.length})</div>
                        <div class="todo-list">${problems.map((p, i) => `
                            <div class="todo-item ${p.done ? 'done' : ''}" onclick="toggleProblem('${subName.replace(/'/g, "\\'")}', ${i})">
                                <div class="todo-check">${p.done ? '✓' : ''}</div>
                                <div class="todo-text">${p.task}</div>
                            </div>`).join('')}
                        </div>
                    </div>
                </div>
                <div class="glass-card" style="background:rgba(191,97,106,0.05); border-color:rgba(191,97,106,0.2); text-align:left">
                    <div class="section-tag" style="color:var(--rose)">CRITICAL TRAPS</div>
                    <ul class="clean-list" style="margin-top:10px">${(subData.common_traps || []).map(t => `<li style="font-size:13px; color:var(--text); margin-bottom:8px">${t}</li>`).join('')}</ul>
                </div>
            </div>
        </section>
    `;
    container.innerHTML = html;
    state._currentFocusTopic = state._currentTopic;
    state._currentFocusTask = subName;
    state._currentFocusHrs = subData.study_hours_int || 1;
    renderPomoWidget('subtopic-pomo-widget');
    showPage('page-subtopic');
}

function toggleProblem(subName, index) {
    state.subtopicProblems[subName][index].done = !state.subtopicProblems[subName][index].done;
    Storage.set('subtopicProblems', state.subtopicProblems);
    showSubtopic(subName);
}

function showPage(id) {
    if (!id) return;
    const pageId = id.startsWith('#') ? id.slice(1) : id;
    document.querySelectorAll('.spa-page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-link[data-page]').forEach(l => l.classList.remove('active'));
    const target = document.getElementById(pageId);
    if (target) {
        target.classList.add('active');
        const link = document.querySelector(`.nav-link[data-page="${pageId}"]`);
        if (link) link.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (window.location.hash !== '#' + pageId) history.pushState({ page: pageId }, '', '#' + pageId);
    }
}

function commitSetup() {
    const startVal = document.getElementById('ol-start-date')?.value;
    if (!startVal) { alert('Please pick a start date.'); return; }
    state.startDate = new Date(startVal + 'T00:00:00');
    state.dailyHours = parseFloat(document.getElementById('ol-hours-slider')?.value) || 6;
    state.examDates = {
        jam: document.getElementById('ol-exam-jam')?.value || null,
        tifr: document.getElementById('ol-exam-tifr')?.value || null,
        jest: document.getElementById('ol-exam-jest')?.value || null,
    };
    const olList = document.getElementById('ol-topic-sort-list');
    if (olList) state.topicOrder = [...olList.querySelectorAll('.sortable-item')].map(i => i.dataset.id);
    localStorage.setItem('physprep_setup', JSON.stringify({
        startDate: startVal, dailyHours: state.dailyHours, examDates: state.examDates, topicOrder: state.topicOrder, setupDone: true
    }));
    generatePlan();
    const overlay = document.getElementById('first-load-overlay');
    if (overlay) { overlay.classList.add('fade-out'); setTimeout(() => overlay.style.display = 'none', 650); }
    const editBtn = document.getElementById('edit-plan-btn');
    if (editBtn) editBtn.style.display = 'block';
}

function openEditPlan() {
    const overlay = document.getElementById('first-load-overlay');
    const cancelBtn = document.getElementById('ol-cancel-btn');
    if (overlay) { overlay.style.display = 'flex'; overlay.style.opacity = '1'; overlay.classList.remove('fade-out'); }
    if (cancelBtn && state.startDate) cancelBtn.style.display = 'block';
}

function closeEditPlan() {
    const overlay = document.getElementById('first-load-overlay');
    if (overlay) { overlay.classList.add('fade-out'); setTimeout(() => overlay.style.display = 'none', 650); }
}

function loadSavedSetup() {
    const saved = localStorage.getItem('physprep_setup');
    if (!saved) return false;
    try {
        const data = JSON.parse(saved);
        if (!data.setupDone) return false;
        if (data.startDate) {
            state.startDate = new Date(data.startDate + 'T00:00:00');
            const olStart = document.getElementById('ol-start-date');
            if (olStart) olStart.value = data.startDate;
        }
        if (data.dailyHours) {
            state.dailyHours = data.dailyHours;
            const olSlider = document.getElementById('ol-hours-slider');
            if (olSlider) olSlider.value = data.dailyHours;
        }
        if (data.examDates) {
            state.examDates = data.examDates;
            if (data.examDates.jam) { const el = document.getElementById('ol-exam-jam'); if (el) el.value = data.examDates.jam; }
            if (data.examDates.tifr) { const el = document.getElementById('ol-exam-tifr'); if (el) el.value = data.examDates.tifr; }
            if (data.examDates.jest) { const el = document.getElementById('ol-exam-jest'); if (el) el.value = data.examDates.jest; }
        }
        if (data.topicOrder) state.topicOrder = data.topicOrder;
        return true;
    } catch (e) { return false; }
}

function setDefaultOverlayDates() {
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const olStart = document.getElementById('ol-start-date');
    if (olStart) olStart.value = todayStr;
}

function sortTopicsBy(criteria) {
    const topics = state.topicOrder.map(tid => {
        const metrics = getTopicMetrics(tid);
        const data = TOPIC_DATA.find(t => t.id === tid);
        return { id: tid, metrics, data };
    });
    if (criteria === 'hours') {
        topics.sort((a, b) => (b.metrics.totalHours - a.metrics.totalHours) || (b.metrics.avgDifficulty - a.metrics.avgDifficulty));
    } else if (criteria === 'complexity') {
        topics.sort((a, b) => (b.metrics.avgDifficulty * b.metrics.totalHours - a.metrics.avgDifficulty * a.metrics.totalHours) || (b.metrics.totalHours - a.metrics.totalHours));
    } else if (criteria === 'traps') {
        topics.sort((a, b) => (b.metrics.trapCount - a.metrics.trapCount) || (b.metrics.avgDifficulty - a.metrics.avgDifficulty));
    } else if (criteria === 'difficulty') {
        topics.sort((a, b) => (b.metrics.avgDifficulty - a.metrics.avgDifficulty) || (b.metrics.totalHours - a.metrics.totalHours));
    } else if (criteria === 'name') {
        topics.sort((a, b) => a.data.name.localeCompare(b.data.name));
    } else {
        topics.sort((a, b) => (b.metrics.avgDifficulty - a.metrics.avgDifficulty) || (b.metrics.totalHours - a.metrics.totalHours));
    }
    state.topicOrder = topics.map(t => t.id);
    refreshSortableUIs();
}

function refreshSortableUIs() { buildSortableList(); renderSyllabus(); }
function sortHardFirst() { sortTopicsBy('default'); }
function resetSetup() { if (confirm('Reset all setup data?')) { localStorage.clear(); location.reload(); } }

window.showTopic = showTopic;
window.showSubtopic = showSubtopic;
window.toggleProblem = toggleProblem;
window.showPage = showPage;
window.commitSetup = commitSetup;
window.openEditPlan = openEditPlan;
window.closeEditPlan = closeEditPlan;
window.sortTopicsBy = sortTopicsBy;
window.resetSetup = resetSetup;