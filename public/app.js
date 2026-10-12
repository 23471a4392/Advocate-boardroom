let currentSessionId = null;
let currentEventSource = null;
let personasCache = {};

const PITCH_TEMPLATES = {
  fintech: {
    title: 'Distributed Sub-Millisecond Settlement & In-Memory Matching Engine',
    content: 'We are deploying a globally replicated, in-memory limit order book with sub-10ms cross-chain settlement. State synchronization leverages optimistic locking over public cloud regions with hot-standby replicas. Monetization takes 0.05% of traded volume without licensing overhead.',
  },
  agent: {
    title: 'Autonomous Multi-Agent DevOps Infrastructure Fleet',
    content: 'An enterprise continuous delivery fleet where autonomous LLM agents monitor live Kubernetes telemetry, debug production stack traces, and execute automated canary rollbacks. Agents run via third-party foundation models with open gateway access to production credentials.',
  },
  health: {
    title: 'Zero-Trust Federated Clinical Data Mesh',
    content: 'A multi-hospital electronic health record aggregation mesh using federated client querying without central database synchronization. Clinicians query patient history through a consumer chat interface with automated HIPAA pseudonymization in post-processing.',
  },
};

// Initialize app on load
window.addEventListener('DOMContentLoaded', () => {
  fetchPersonas();
});

function loadTemplate(key) {
  const template = PITCH_TEMPLATES[key];
  if (template) {
    document.getElementById('proposalTitle').value = template.title;
    document.getElementById('proposalContent').value = template.content;
  }
}

async function fetchPersonas() {
  try {
    const res = await fetch('/api/board/personas');
    const data = await res.json();
    if (data.success) {
      renderPersonas(data.personas);
      populatePersonaDropdown(data.personas);
    }
  } catch (err) {
    console.error('Failed to load personas:', err);
  }
}

function renderPersonas(personas) {
  const container = document.getElementById('personasList');
  container.innerHTML = '';

  personas.forEach((p) => {
    personasCache[p.id] = p;
    const card = document.createElement('div');
    card.id = `card-${p.id}`;
    card.className = 'persona-card';
    card.innerHTML = `
      <img src="${p.avatar}" alt="${p.name}" class="persona-avatar" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&background=1e293b&color=f87171'">
      <div class="persona-details">
        <div class="persona-top">
          <span class="persona-name">${p.name}</span>
          <span class="persona-score-badge" id="score-${p.id}">${p.skepticismScore}% SKEPTIC</span>
        </div>
        <div class="persona-role">${p.role}</div>
        <div class="persona-focus">${p.focusArea}</div>
      </div>
    `;
    container.appendChild(card);
  });
}

function populatePersonaDropdown(personas) {
  const select = document.getElementById('targetPersonaSelect');
  select.innerHTML = '<option value="">Most Skeptical Member (Auto-Detect)</option>';
  personas.forEach((p) => {
    const opt = document.createElement('option');
    opt.value = p.id;
    opt.textContent = `${p.name} (${p.role.split('&')[0].trim()})`;
    select.appendChild(opt);
  });
}

async function conveneBoardroom() {
  const title = document.getElementById('proposalTitle').value.trim();
  const content = document.getElementById('proposalContent').value.trim();
  const conveneBtn = document.getElementById('conveneBtn');

  if (!title || !content) {
    alert('Please provide both proposal title and pitch content.');
    return;
  }

  conveneBtn.disabled = true;
  conveneBtn.innerHTML = '<span class="btn-icon">⏳</span> Convening Adversarial Board...';

  try {
    const res = await fetch('/api/board/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ proposalTitle: title, proposalContent: content }),
    });

    const data = await res.json();
    if (!data.success) {
      alert(`Error convening board: ${data.error || 'Unknown error'}`);
      return;
    }

    currentSessionId = data.sessionId;
    document.getElementById('sessionStatusText').textContent = 'Board Convened';
    document.getElementById('startStreamBtn').disabled = false;
    updateTension(data.overallTension || 65);

    // Refresh persona scores in UI
    data.personas.forEach((p) => {
      const badge = document.getElementById(`score-${p.id}`);
      if (badge) badge.textContent = `${p.skepticismScore}% SKEPTIC`;
    });

    const feed = document.getElementById('transcriptFeed');
    feed.innerHTML = `
      <div class="transcript-item">
        <div class="item-header">
          <span class="speaker-tag">🏛️ Devil's Advocate Boardroom Convened</span>
          <span class="round-pill">Session: ${currentSessionId.slice(0, 8)}</span>
        </div>
        <div class="item-content">
          The board has assembled to dissect <strong>"${data.proposalTitle}"</strong>. Click <strong>"Launch Debate Stream"</strong> to trigger real-time adversarial critiques.
        </div>
      </div>
    `;
  } catch (err) {
    console.error('Session error:', err);
    alert('Failed to convene boardroom. Please check server connection.');
  } finally {
    conveneBtn.disabled = false;
    conveneBtn.innerHTML = '<span class="btn-icon">🏛️</span> Convene Devil\'s Advocate Board';
  }
}

function startDebateStream() {
  if (!currentSessionId) return;

  if (currentEventSource) {
    currentEventSource.close();
  }

  const startBtn = document.getElementById('startStreamBtn');
  startBtn.disabled = true;
  startBtn.innerHTML = '<span class="btn-icon">⚡</span> Debating in Real-Time...';

  const roundBadge = document.getElementById('roundIndicator');
  roundBadge.textContent = 'Live Hearing';
  roundBadge.className = 'round-badge live';

  let currentSpeakerDiv = null;
  let currentContentSpan = null;

  currentEventSource = new EventSource(`/api/board/session/${currentSessionId}/stream`);

  currentEventSource.addEventListener('board_convened', (e) => {
    console.log('[SSE] Board convened:', e.data);
  });

  currentEventSource.addEventListener('round_started', (e) => {
    const data = JSON.parse(e.data);
    appendSystemNotice(`🚩 ${data.roundName}: ${data.description}`);
  });

  currentEventSource.addEventListener('persona_started', (e) => {
    const data = JSON.parse(e.data);

    // Highlight card
    document.querySelectorAll('.persona-card').forEach((c) => c.classList.remove('active-speaking'));
    const card = document.getElementById(`card-${data.speakerId}`);
    if (card) card.classList.add('active-speaking');

    // Create stream message box
    const feed = document.getElementById('transcriptFeed');
    currentSpeakerDiv = document.createElement('div');
    currentSpeakerDiv.className = `transcript-item ${data.round === 2 ? 'crossfire' : 'salvo'}`;

    const speakerMeta = personasCache[data.speakerId] || { name: data.speakerName || data.speakerId };
    const targetMeta = data.targetId ? personasCache[data.targetId] : null;

    currentSpeakerDiv.innerHTML = `
      <div class="item-header">
        <div>
          <span class="speaker-tag">${speakerMeta.name}</span>
          ${targetMeta ? `<span class="target-tag"> ➔ attacking ${targetMeta.name}</span>` : ''}
        </div>
        <span class="round-pill">Round ${data.round}</span>
      </div>
      <div class="item-content">
        <span class="stream-text"></span><span class="typing-cursor"></span>
      </div>
    `;

    feed.appendChild(currentSpeakerDiv);
    currentContentSpan = currentSpeakerDiv.querySelector('.stream-text');
    feed.scrollTop = feed.scrollHeight;
  });

  currentEventSource.addEventListener('persona_token', (e) => {
    const data = JSON.parse(e.data);
    if (currentContentSpan) {
      currentContentSpan.textContent += data.token;
      const feed = document.getElementById('transcriptFeed');
      feed.scrollTop = feed.scrollHeight;
    }
  });

  currentEventSource.addEventListener('persona_finished', (e) => {
    const data = JSON.parse(e.data);
    if (currentSpeakerDiv) {
      const cursor = currentSpeakerDiv.querySelector('.typing-cursor');
      if (cursor) cursor.remove();
    }

    const badge = document.getElementById(`score-${data.speakerId}`);
    if (badge) {
      badge.textContent = `${data.skepticismScore}% SKEPTIC`;
    }
  });

  currentEventSource.addEventListener('tension_update', (e) => {
    const data = JSON.parse(e.data);
    updateTension(data.overallTension);
  });

  currentEventSource.addEventListener('round_transition', (e) => {
    const data = JSON.parse(e.data);
    appendSystemNotice(`⚡ ${data.roundName}: ${data.description}`);
  });

  currentEventSource.addEventListener('debate_concluded', (e) => {
    const data = JSON.parse(e.data);
    document.querySelectorAll('.persona-card').forEach((c) => c.classList.remove('active-speaking'));
    appendSystemNotice(`🏁 Hearing Concluded: Overall Boardroom Tension at ${data.overallTension}%. Ready for defense or Pre-Mortem.`);

    roundBadge.textContent = 'Hearing Concluded';
    roundBadge.className = 'round-badge';

    startBtn.disabled = false;
    startBtn.innerHTML = '<span class="btn-icon">🔄</span> Re-Run Debate';

    document.getElementById('defendBtn').disabled = false;
    document.getElementById('preMortemBtn').disabled = false;
    document.getElementById('sessionStatusText').textContent = 'Defense Phase';

    if (currentEventSource) {
      currentEventSource.close();
      currentEventSource = null;
    }
  });

  currentEventSource.addEventListener('error', (err) => {
    console.warn('[SSE] Stream ended or connection closed:', err);
    if (currentEventSource) {
      currentEventSource.close();
      currentEventSource = null;
    }
    startBtn.disabled = false;
    startBtn.innerHTML = '<span class="btn-icon">🔥</span> Launch Debate Stream';
    document.getElementById('defendBtn').disabled = false;
    document.getElementById('preMortemBtn').disabled = false;
  });
}

function appendSystemNotice(text) {
  const feed = document.getElementById('transcriptFeed');
  const div = document.createElement('div');
  div.style.textAlign = 'center';
  div.style.padding = '8px 12px';
  div.style.fontSize = '0.8rem';
  div.style.color = '#94a3b8';
  div.style.background = 'rgba(255,255,255,0.03)';
  div.style.borderRadius = '6px';
  div.textContent = text;
  feed.appendChild(div);
  feed.scrollTop = feed.scrollHeight;
}

function updateTension(val) {
  const bar = document.getElementById('tensionBar');
  const text = document.getElementById('tensionValue');
  const clamped = Math.max(0, Math.min(100, Math.round(val)));
  if (bar) bar.style.width = `${clamped}%`;
  if (text) text.textContent = `${clamped}%`;
}

async function submitDefense() {
  if (!currentSessionId) {
    alert('Please convene a boardroom session first.');
    return;
  }

  const argument = document.getElementById('defenseArgument').value.trim();
  const targetPersonaId = document.getElementById('targetPersonaSelect').value;
  const defendBtn = document.getElementById('defendBtn');

  if (!argument) {
    alert('Please enter your defense argument.');
    return;
  }

  defendBtn.disabled = true;
  defendBtn.innerHTML = '<span class="btn-icon">⏳</span> Submitting Defense...';

  try {
    const res = await fetch(`/api/board/session/${currentSessionId}/defend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userArgument: argument, targetPersonaId: targetPersonaId || undefined }),
    });

    const data = await res.json();
    if (!data.success) {
      alert(`Defense evaluation failed: ${data.error}`);
      return;
    }

    // Append user defense to transcript
    const feed = document.getElementById('transcriptFeed');
    const userDiv = document.createElement('div');
    userDiv.className = 'transcript-item defense';
    userDiv.innerHTML = `
      <div class="item-header">
        <span class="speaker-tag">🛡️ Founder Strategic Defense</span>
        <span class="round-pill">Phase 3</span>
      </div>
      <div class="item-content">${argument}</div>
    `;
    feed.appendChild(userDiv);

    // Append persona rebuttal
    const rebuttalDiv = document.createElement('div');
    rebuttalDiv.className = 'transcript-item rebuttal';
    const persona = personasCache[data.targetPersonaId] || { name: 'Board Member' };
    const deltaTag = data.skepticismDelta < 0
      ? `<span style="color: #10b981; font-weight: bold;">(Skepticism ${data.skepticismDelta}%)</span>`
      : `<span style="color: #ef4444; font-weight: bold;">(Skepticism +${data.skepticismDelta}%)</span>`;

    rebuttalDiv.innerHTML = `
      <div class="item-header">
        <span class="speaker-tag">${persona.name} Rebuttal ${deltaTag}</span>
        <span class="round-pill">Quality: ${data.argumentQuality}</span>
      </div>
      <div class="item-content">${data.rebuttal}</div>
    `;
    feed.appendChild(rebuttalDiv);
    feed.scrollTop = feed.scrollHeight;

    // Update persona score badges
    Object.entries(data.updatedScores).forEach(([id, score]) => {
      const badge = document.getElementById(`score-${id}`);
      if (badge) badge.textContent = `${score}% SKEPTIC`;
    });

    document.getElementById('defenseArgument').value = '';
  } catch (err) {
    console.error('Defense error:', err);
    alert('Failed to evaluate defense argument.');
  } finally {
    defendBtn.disabled = false;
    defendBtn.innerHTML = '<span class="btn-icon">🛡️</span> Present Concrete Defense';
  }
}

async function generatePreMortemReport() {
  if (!currentSessionId) return;

  const btn = document.getElementById('preMortemBtn');
  btn.disabled = true;
  btn.innerHTML = '<span class="btn-icon">⏳</span> Synthesizing Pre-Mortem...';

  try {
    const res = await fetch(`/api/board/session/${currentSessionId}/pre-mortem`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await res.json();
    if (!data.success) {
      alert(`Pre-mortem failed: ${data.error}`);
      return;
    }

    renderPreMortemModal(data);
  } catch (err) {
    console.error('Pre-mortem error:', err);
    alert('Failed to generate Pre-Mortem report.');
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<span class="btn-icon">📋</span> Generate Executive Pre-Mortem';
  }
}

function renderPreMortemModal(report) {
  const modal = document.getElementById('preMortemModal');
  const body = document.getElementById('modalBody');

  const survivalColor = report.survivalScore > 60 ? '#10b981' : report.survivalScore > 40 ? '#f59e0b' : '#ef4444';

  body.innerHTML = `
    <div class="score-banner">
      <div>
        <div style="font-size: 0.82rem; color: #94a3b8; font-weight: 700; letter-spacing: 1px;">AGGREGATE SURVIVAL PROBABILITY</div>
        <div class="score-desc">Calculated across SRE, Financial, Security, and Market stress tests</div>
      </div>
      <div class="score-number" style="color: ${survivalColor};">${report.survivalScore}%</div>
    </div>

    <div class="dossier-section">
      <h4>RISK MATRIX EVALUATION</h4>
      <div class="risk-matrix-grid">
        <div class="risk-cell">
          <div class="risk-title">Technical (SRE)</div>
          <div class="risk-val">${report.riskMatrix.technicalRisk}%</div>
        </div>
        <div class="risk-cell">
          <div class="risk-title">Financial (CFO)</div>
          <div class="risk-val">${report.riskMatrix.financialRisk}%</div>
        </div>
        <div class="risk-cell">
          <div class="risk-title">Security (CSO)</div>
          <div class="risk-val">${report.riskMatrix.securityRisk}%</div>
        </div>
        <div class="risk-cell">
          <div class="risk-title">Market / UX</div>
          <div class="risk-val">${report.riskMatrix.marketRisk}%</div>
        </div>
      </div>
    </div>

    <div class="dossier-section">
      <h4>TOP 3 CRITICAL FATAL FLAWS</h4>
      <ul class="flaw-list">
        ${report.fatalFlaws.map((f) => `<li>${f}</li>`).join('')}
      </ul>
    </div>

    <div class="dossier-section">
      <h4>MANDATORY STRATEGIC PIVOTS</h4>
      <ul class="pivot-list">
        ${report.recommendedPivots.map((p) => `<li>${p}</li>`).join('')}
      </ul>
    </div>

    <div class="dossier-section">
      <h4>EXECUTIVE SUMMARY</h4>
      <div class="exec-summary-text">${report.executiveSummary}</div>
    </div>
  `;

  modal.classList.remove('hidden');
}

function closePreMortemModal() {
  document.getElementById('preMortemModal').classList.add('hidden');
}
