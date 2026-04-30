// ═══════════════════════════════════════════════════
// POMODORO TIMER
// ═══════════════════════════════════════════════════

const POMO_MODES = {
    '25/5': { work: 25 * 60, breakTime: 5 * 60, label: '25 / 5' },
    '50/10': { work: 50 * 60, breakTime: 10 * 60, label: '50 / 10' },
    'custom': { work: 25 * 60, breakTime: 5 * 60, label: 'Custom' },
};

let pomo = {
    mode: '25/5',
    isWork: true,
    isRunning: false,
    time: 25 * 60,
    interval: null,
    sessionsToday: parseInt(Storage.get('pomo_sessions_today') || 0),
    minsToday: parseInt(Storage.get('pomo_mins_today') || 0),
    lastDate: Storage.get('pomo_last_date') || '',
    customMins: 25,
    customBreakMins: 5
};

function pomoResetDailyIfNeeded() {
    const today = new Date().toISOString().slice(0, 10);
    if (pomo.lastDate !== today) {
        pomo.sessionsToday = 0;
        pomo.minsToday = 0;
        pomo.lastDate = today;
        Storage.set('pomo_last_date', today);
        Storage.set('pomo_sessions_today', 0);
        Storage.set('pomo_mins_today', 0);
    }
}

function renderPomoWidget(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="glass-card" id="pomo-instance-${containerId}" style="max-width:480px; margin: 0 auto; border: 1px solid rgba(255,255,255,0.15)">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:32px">
                <div style="text-align:left">
                    <h3 id="pomo-mode-label-${containerId}" style="font-size:16px; margin:0">MODE: ${POMO_MODES[pomo.mode].label}</h3>
                    <div style="font-family:'JetBrains Mono',monospace; font-size:10px; color:var(--cyan); letter-spacing:0.1em; text-transform:uppercase; margin-top:4px">Focus Protocol</div>
                </div>
                <div style="display:flex; gap:12px">
                    <div style="background:rgba(255,255,255,0.05); padding:8px 14px; border-radius:12px; border:1px solid rgba(255,255,255,0.1); text-align:center">
                        <div style="font-family:'JetBrains Mono',monospace; font-size:16px; font-weight:700; color:var(--text-bright)" id="pomo-count-${containerId}">${pomo.sessionsToday}</div>
                        <div style="font-size:8px; color:var(--muted); text-transform:uppercase">Done</div>
                    </div>
                    <div style="background:rgba(255,255,255,0.05); padding:8px 14px; border-radius:12px; border:1px solid rgba(255,255,255,0.1); text-align:center">
                        <div style="font-family:'JetBrains Mono',monospace; font-size:16px; font-weight:700; color:var(--cyan)" id="pomo-time-today-${containerId}">${pomo.minsToday}m</div>
                        <div style="font-size:8px; color:var(--muted); text-transform:uppercase">Total</div>
                    </div>
                </div>
            </div>

            <div class="pomo-ring-wrap" style="margin-bottom:32px">
                <svg class="pomo-svg" width="220" height="220">
                    <circle class="pomo-track" cx="110" cy="110" r="100" fill="none" stroke-width="8" stroke="rgba(255,255,255,0.05)"></circle>
                    <circle class="pomo-progress" id="pomo-ring-${containerId}" cx="110" cy="110" r="100" fill="none" 
                            stroke="url(#pomo-grad)" stroke-width="8" stroke-dasharray="628.3" 
                            stroke-dashoffset="${628.3 * (1 - pomo.time / (pomo.isWork ? POMO_MODES[pomo.mode].work : POMO_MODES[pomo.mode].breakTime))}"></circle>
                    <defs>
                        <linearGradient id="pomo-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" style="stop-color:var(--violet);stop-opacity:1" />
                            <stop offset="100%" style="stop-color:var(--cyan);stop-opacity:1" />
                        </linearGradient>
                    </defs>
                </svg>
                <div class="pomo-center">
                    <div id="pomo-display-${containerId}" style="font-family:'JetBrains Mono',monospace; font-size:48px; font-weight:800; color:var(--text-bright); text-shadow: 0 0 20px rgba(255,255,255,0.2)">
                        ${Math.floor(pomo.time / 60)}:${(pomo.time % 60).toString().padStart(2, '0')}
                    </div>
                    <div id="pomo-session-info-${containerId}" style="font-family:'JetBrains Mono',monospace; font-size:11px; color:var(--muted); text-transform:uppercase; letter-spacing:0.2em; margin-top:8px">
                        ${pomo.isWork ? '🎯 Focus' : '☕ Break'}
                    </div>
                </div>
            </div>

            <div style="margin-bottom:24px">
                <input type="text" id="pomo-task-input-${containerId}" placeholder="Enter current focus..." 
                       value="${state._currentFocusTask || ''}"
                       oninput="state._currentFocusTask = this.value; document.querySelectorAll('[id^=pomo-task-input-]').forEach(i => i.value = this.value)"
                       style="width:100%; background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.1); color:var(--text-bright); padding:12px 16px; border-radius:12px; text-align:center; font-family:'Inter',sans-serif; font-size:14px">
            </div>

            <div class="radial-setter-container" style="gap:40px; margin-bottom:32px">
                <div class="radial-setter" id="radial-work-${containerId}">
                    ${renderRadialSVG('work', pomo.customMins, 120, 'var(--violet)')}
                    <div class="radial-center">
                        <div class="radial-val" id="radial-val-work-${containerId}">${pomo.customMins}</div>
                        <div class="radial-label">Work</div>
                    </div>
                </div>
                <div class="radial-setter" id="radial-break-${containerId}">
                    ${renderRadialSVG('break', pomo.customBreakMins, 60, 'var(--emerald)')}
                    <div class="radial-center">
                        <div class="radial-val" id="radial-val-break-${containerId}">${pomo.customBreakMins}</div>
                        <div class="radial-label">Rest</div>
                    </div>
                </div>
            </div>
            
            <button class="pomo-btn primary" style="width:100%; margin-bottom:32px; height:48px; font-size:12px" onclick="pomoApplyCustom()">Initialize Custom Session</button>

            <div class="pomo-controls" style="display:grid; grid-template-columns: 2fr 1fr 1fr; gap:12px; margin-bottom:24px">
                <button class="pomo-btn btn-start" onclick="pomoAction('start')" style="height:48px">${pomo.isRunning ? 'Running' : 'Start Focus'}</button>
                <button class="pomo-btn btn-pause" onclick="pomoAction('pause')" style="height:48px">${pomo.isRunning ? 'Pause' : 'Resume'}</button>
                <button class="pomo-btn btn-reset" onclick="pomoAction('reset')" style="height:48px">Reset</button>
            </div>

            <div class="pomo-mode-row" style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:10px">
                <button class="pomo-btn ${pomo.mode === '25/5' ? 'active-mode' : ''}" onclick="pomoSetMode('25/5')">25 / 5</button>
                <button class="pomo-btn ${pomo.mode === '50/10' ? 'active-mode' : ''}" onclick="pomoSetMode('50/10')">50 / 10</button>
                <button class="pomo-btn ${pomo.mode === 'custom' ? 'active-mode' : ''}" onclick="pomoSetMode('custom')">Custom</button>
            </div>
            
            <div id="pomo-progress-stats-${containerId}" style="margin-top:32px"></div>
            <div class="pomo-session-log" id="pomo-session-log-${containerId}" style="margin-top:20px; border-top: 1px solid rgba(255,255,255,0.1); padding-top:20px"></div>
        </div>
    `;

    initRadialEvents(containerId, 'work', 120);
    initRadialEvents(containerId, 'break', 60);
    renderPomoLog(containerId);
    renderProgressStats(containerId);
}

function renderRadialSVG(type, val, max, color) {
    const r = 55;
    const circ = 2 * Math.PI * r;
    const offset = circ - (val / max) * circ;
    const angle = (val / max) * 360;

    return `
        <svg class="radial-svg" width="140" height="140" viewBox="0 0 140 140">
            <circle class="radial-track" cx="70" cy="70" r="${r}" fill="none" stroke-width="8"></circle>
            <circle class="radial-progress" id="radial-prog-${type}" cx="70" cy="70" r="${r}" fill="none" 
                    stroke="${color}" stroke-width="8" stroke-dasharray="${circ}" stroke-dashoffset="${offset}"
                    transform="rotate(-90 70 70)"></circle>
            <g id="radial-handle-group-${type}" transform="rotate(${angle - 90} 70 70)">
                <circle class="radial-handle" cx="${70 + r}" cy="70" r="10"></circle>
            </g>
        </svg>
    `;
}

function initRadialEvents(containerId, type, max) {
    const setter = document.querySelector(`#pomo-instance-${containerId} #radial-${type}-${containerId}`);
    if (!setter) return;

    let isDragging = false;

    const update = (e) => {
        if (!isDragging) return;
        const rect = setter.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        let angle = Math.atan2(clientY - centerY, clientX - centerX) * 180 / Math.PI;
        angle += 90;
        if (angle < 0) angle += 360;

        // Snap to steps of 1 min
        let mins = Math.round((angle / 360) * max);
        mins = Math.max(1, Math.min(max, mins));

        if (type === 'work') pomo.customMins = mins;
        else pomo.customBreakMins = mins;

        updateRadialUI(type, mins, max);
    };

    setter.addEventListener('mousedown', (e) => { isDragging = true; update(e); });
    setter.addEventListener('touchstart', (e) => { isDragging = true; update(e); e.preventDefault(); });
    window.addEventListener('mousemove', update);
    window.addEventListener('touchmove', update);
    window.addEventListener('mouseup', () => isDragging = false);
    window.addEventListener('touchend', () => isDragging = false);
}

function updateRadialUI(type, mins, max) {
    // Sync all displays
    document.querySelectorAll(`[id^="radial-val-${type}-"]`).forEach(el => el.textContent = mins);

    const r = 55;
    const circ = 2 * Math.PI * r;
    const offset = circ - (mins / max) * circ;
    const angle = (mins / max) * 360;

    document.querySelectorAll(`[id^="radial-prog-${type}"]`).forEach(el => el.style.strokeDashoffset = offset);
    document.querySelectorAll(`[id^="radial-handle-group-${type}"]`).forEach(el => {
        el.setAttribute('transform', `rotate(${angle - 90} 70 70)`);
    });
}

function pomoApplyCustom() {
    POMO_MODES['custom'].work = pomo.customMins * 60;
    POMO_MODES['custom'].breakTime = pomo.customBreakMins * 60;
    POMO_MODES['custom'].label = `${pomo.customMins}/${pomo.customBreakMins}`;
    pomoSetMode('custom');
}

function renderProgressStats(containerId) {
    const container = document.getElementById(`pomo-progress-stats-${containerId}`);
    if (!container || !state._currentFocusTopic) return;
    const tid = state._currentFocusTopic;
    const topic = TOPIC_DATA.find(t => t.id === tid);
    const metrics = getTopicMetrics(tid);
    const totalHrs = metrics.totalHours || topic.hrs;
    const doneHrs = state.progress[tid] || 0;
    const remaining = Math.max(0, totalHrs - doneHrs);
    const progress = Math.min(100, Math.round((doneHrs / totalHrs) * 100));

    container.innerHTML = `
        <div style="background:rgba(255,255,255,0.03); padding:16px; border-radius:var(--radius-sm); border:1px solid rgba(255,255,255,0.05)">
            <div style="display:flex; justify-content:space-between; margin-bottom:8px">
                <span style="font-family:'JetBrains Mono',monospace; font-size:10px; color:var(--muted)">TOPIC PROGRESS</span>
                <span style="font-family:'JetBrains Mono',monospace; font-size:10px; color:var(--cyan)">${progress}%</span>
            </div>
            <div class="bar-track" style="margin-bottom:12px">
                <div class="bar-fill" style="width:${progress}%; background:${topic.color}"></div>
            </div>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px">
                <div>
                    <div style="font-size:18px; font-weight:700; color:var(--text-bright)">${doneHrs.toFixed(1)}h</div>
                    <div style="font-size:8px; color:var(--muted); text-transform:uppercase">Completed</div>
                </div>
                <div>
                    <div style="font-size:18px; font-weight:700; color:var(--rose)">${remaining.toFixed(1)}h</div>
                    <div style="font-size:8px; color:var(--muted); text-transform:uppercase">Remaining</div>
                </div>
            </div>
        </div>
    `;
}

function pomoUpdateDisplay() {
    const m = Math.floor(pomo.time / 60);
    const s = pomo.time % 60;
    const timeStr = `${m}:${s < 10 ? '0' : ''}${s}`;

    document.querySelectorAll('[id^="pomo-display-"]').forEach(el => el.textContent = timeStr);
    const globalTime = document.getElementById('global-pomo-time');
    if (globalTime) globalTime.textContent = timeStr;

    const total = pomo.isWork ? POMO_MODES[pomo.mode].work : POMO_MODES[pomo.mode].breakTime;
    const offset = 628.3 * (1 - pomo.time / total); // Correct for r=100

    document.querySelectorAll('[id^="pomo-ring-"]').forEach(el => el.style.strokeDashoffset = offset);

    const infoStr = pomo.isWork ? '🎯 Focus' : '☕ Break';
    document.querySelectorAll('[id^="pomo-session-info-"]').forEach(el => el.textContent = infoStr);

    const bubble = document.getElementById('global-pomo-bar');
    const pauseBtn = document.getElementById('global-pomo-pause-btn');
    if (bubble) {
        bubble.classList.add('visible'); // Always visible as requested
    }
    if (pauseBtn) {
        pauseBtn.textContent = pomo.isRunning ? '⏸' : '▶';
    }
}

function pomoSetMode(modeKey) {
    pomo.mode = modeKey;
    clearInterval(pomo.interval);
    pomo.isRunning = false;
    pomo.isWork = true;
    const cfg = POMO_MODES[modeKey];
    pomo.time = cfg.work;
    pomoUpdateDisplay();
    document.querySelectorAll('[id^="pomo-mode-label-"]').forEach(el => el.textContent = `MODE: ${cfg.label}`);
}

function pomoAction(action) {
    pomoResetDailyIfNeeded();
    const bubble = document.getElementById('global-pomo-bar');

    if (action === 'start' && !pomo.isRunning) {
        pomo.isRunning = true;
        if (bubble) bubble.classList.add('visible');

        const globalTask = document.getElementById('global-pomo-task');
        if (globalTask) {
            let task = state._currentFocusTask || 'Studying';
            document.querySelectorAll('[id^="pomo-task-input-"]').forEach(el => {
                if (el.value) task = el.value;
            });
            globalTask.textContent = task;
        }

        pomo.interval = setInterval(() => {
            pomo.time--;
            pomoUpdateDisplay();

            if (pomo.time <= 0) {
                if (pomo.isWork) {
                    pomo.sessionsToday++;
                    const cfg = POMO_MODES[pomo.mode];
                    const sessionMins = Math.round(cfg.work / 60);
                    pomo.minsToday += sessionMins;
                    Storage.set('pomo_sessions_today', pomo.sessionsToday);
                    Storage.set('pomo_mins_today', pomo.minsToday);

                    document.querySelectorAll('[id^="pomo-count-"]').forEach(el => el.textContent = pomo.sessionsToday);
                    document.querySelectorAll('[id^="pomo-time-today-"]').forEach(el => el.textContent = pomo.minsToday + ' min');

                    if (window.state && state._currentFocusTopic) {
                        logProgress(state._currentFocusTopic, '', sessionMins / 60);
                        document.querySelectorAll('[id^="pomo-progress-stats-"]').forEach(el => {
                            const containerId = el.id.replace('pomo-progress-stats-', '');
                            renderProgressStats(containerId);
                        });
                    }

                    addPomoLog(true);
                    pomo.isWork = false;
                    pomo.time = POMO_MODES[pomo.mode].breakTime;
                    pomoUpdateDisplay();
                    alert('Focus session done! Break starting now.');
                } else {
                    pomo.isWork = true;
                    pomo.time = POMO_MODES[pomo.mode].work;
                    pomoUpdateDisplay();
                    addPomoLog(false);
                    alert('Break over! Focus session starting now.');
                }
            }
        }, 1000);

    } else if (action === 'pause') {
        clearInterval(pomo.interval);
        pomo.isRunning = false;
        pomoUpdateDisplay();
    } else if (action === 'reset') {
        clearInterval(pomo.interval);
        pomo.interval = null;
        pomo.isRunning = false;
        pomo.isWork = true;
        pomo.time = POMO_MODES[pomo.mode].work;
        pomoUpdateDisplay();
        if (bubble) bubble.classList.remove('visible');
    }
}

function addPomoLog(isWorkFinished) {
    let task = isWorkFinished ? (state._currentFocusTask || 'Study session') : 'Break Session';
    document.querySelectorAll('[id^="pomo-task-input-"]').forEach(el => {
        if (el.value && isWorkFinished) task = el.value;
    });

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const sessionMins = Math.round(POMO_MODES[pomo.mode][isWorkFinished ? 'work' : 'breakTime'] / 60);

    let logs = Storage.get('pomo_logs') || [];
    logs.unshift({
        id: Date.now(),
        task,
        time: timeStr,
        mode: pomo.mode,
        mins: sessionMins,
        isWork: isWorkFinished,
        date: now.toISOString().slice(0, 10)
    });

    if (logs.length > 30) logs = logs.slice(0, 30);
    Storage.set('pomo_logs', logs);

    document.querySelectorAll('[id^="pomo-session-log-"]').forEach(el => {
        const containerId = el.id.replace('pomo-session-log-', '');
        renderPomoLog(containerId);
    });
}

function deletePomoLog(id) {
    let logs = Storage.get('pomo_logs') || [];
    const logToDelete = logs.find(l => l.id === id);

    if (logToDelete) {
        const today = new Date().toISOString().slice(0, 10);
        // Only decrement if it was a Study session from today
        if (logToDelete.date === today && logToDelete.isWork) {
            pomo.sessionsToday = Math.max(0, pomo.sessionsToday - 1);
            pomo.minsToday = Math.max(0, pomo.minsToday - (logToDelete.mins || 0));

            Storage.set('pomo_sessions_today', pomo.sessionsToday);
            Storage.set('pomo_mins_today', pomo.minsToday);

            // Update UI stats at top of card
            document.querySelectorAll('[id^="pomo-count-"]').forEach(el => el.textContent = pomo.sessionsToday);
            document.querySelectorAll('[id^="pomo-time-today-"]').forEach(el => el.textContent = pomo.minsToday + 'm');
        }
    }

    logs = logs.filter(l => l.id !== id);
    Storage.set('pomo_logs', logs);

    document.querySelectorAll('[id^="pomo-session-log-"]').forEach(el => {
        const containerId = el.id.replace('pomo-session-log-', '');
        renderPomoLog(containerId);
    });
}

function renderPomoLog(containerId) {
    const log = document.getElementById(`pomo-session-log-${containerId}`);
    if (!log) return;
    const logs = Storage.get('pomo_logs') || [];
    if (!logs.length) { log.innerHTML = '<div style="color:var(--muted);font-size:11px;padding:6px">No sessions yet.</div>'; return; }
    log.innerHTML = logs.map(l => `
        <div class="pomo-log-item">
            <span class="pomo-log-task">${l.task}</span>
            <div style="display:flex; align-items:center; gap:10px">
                <span class="pomo-log-time">${l.time}</span>
                <button class="delete-pomo-btn" onclick="deletePomoLog(${l.id})">×</button>
            </div>
        </div>`).join('');
}

window.renderPomoWidget = renderPomoWidget;
window.pomoAction = pomoAction;
window.pomoSetMode = pomoSetMode;
window.pomoApplyCustom = pomoApplyCustom;
window.deletePomoLog = deletePomoLog;