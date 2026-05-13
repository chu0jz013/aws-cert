(function () {
  'use strict';

  const state = {
    examData: null,
    questions: [],
    currentIdx: 0,
    userAnswers: {},
    timerInterval: null,
    secondsLeft: 0,
    submitted: false,
    mode: 'exam',
    noTimer: false,
  };

  const screens = {
    start: document.getElementById('start-screen'),
    quiz: document.getElementById('quiz-screen'),
    result: document.getElementById('result-screen'),
  };

  function showScreen(name) {
    Object.values(screens).forEach((s) => s.classList.remove('active'));
    screens[name].classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  async function loadQuestions() {
    try {
      const res = await fetch('questions.json');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      state.examData = data;
      renderStartInfo();
    } catch (err) {
      const errEl = document.getElementById('load-error');
      errEl.hidden = false;
      errEl.textContent = `Không load được questions.json: ${err.message}. Bạn cần serve app qua HTTP (xem README.md).`;
      document.getElementById('btn-start').disabled = true;
    }
  }

  function renderStartInfo() {
    const examQ = state.examData.examQuestionCount || 75;
    document.getElementById('info-questions').textContent = `${state.examData.totalQuestions} (bank) / ${examQ} (mỗi session)`;
    document.getElementById('info-duration').textContent = `${state.examData.durationMinutes} phút`;
    document.getElementById('info-pass').textContent = `${state.examData.passingScore}%`;

    const ul = document.getElementById('domain-summary');
    ul.innerHTML = '';
    state.examData.domains.forEach((d) => {
      const share = d.examShare != null ? ` · <em>${d.examShare} câu/session</em>` : '';
      const li = document.createElement('li');
      li.innerHTML = `<strong>${d.code} · ${d.name}</strong> <span class="dweight">— ${d.weight}% · ${d.count} câu trong bank${share}</span>`;
      ul.appendChild(li);
    });

    renderDomainCheckboxes();
  }

  function renderDomainCheckboxes() {
    const container = document.getElementById('domain-checkboxes');
    if (!container) return;
    container.innerHTML = '';
    state.examData.domains.forEach((d) => {
      const label = document.createElement('label');
      label.className = 'domain-checkbox';
      label.innerHTML = `<input type="checkbox" value="${d.code}" checked> <strong>${d.code}</strong> · ${d.name} <span class="dweight">(${d.count})</span>`;
      container.appendChild(label);
    });
  }

  function getSelectedDomains() {
    const checkboxes = document.querySelectorAll('#domain-checkboxes input[type=checkbox]');
    return Array.from(checkboxes).filter((c) => c.checked).map((c) => c.value);
  }

  function getSelectedMode() {
    const radio = document.querySelector('input[name="mode"]:checked');
    return radio ? radio.value : 'exam';
  }

  function sampleByDomain(pool, domains) {
    const result = [];
    domains.forEach((d) => {
      const inDomain = pool.filter((q) => q.domainCode === d.code);
      const take = Math.min(d.examShare || 0, inDomain.length);
      result.push(...shuffle(inDomain).slice(0, take));
    });
    return shuffle(result);
  }

  function startExam() {
    const mode = getSelectedMode();
    const domainFilter = getSelectedDomains();

    if (domainFilter.length === 0) {
      alert('Vui lòng chọn ít nhất 1 domain.');
      return;
    }

    let pool = state.examData.questions.filter((q) => domainFilter.includes(q.domainCode));

    if (pool.length === 0) {
      alert('Không có câu hỏi nào trong các domain đã chọn.');
      return;
    }

    state.mode = mode;
    if (mode === 'exam') {
      const filteredDomains = state.examData.domains.filter((d) => domainFilter.includes(d.code));
      state.questions = sampleByDomain(pool, filteredDomains);
      state.secondsLeft = state.examData.durationMinutes * 60;
      state.noTimer = false;
    } else {
      state.questions = shuffle(pool);
      state.secondsLeft = 0;
      state.noTimer = true;
    }

    state.currentIdx = 0;
    state.userAnswers = {};
    state.submitted = false;
    document.getElementById('total-num').textContent = state.questions.length;
    document.getElementById('progress-bar').max = state.questions.length;

    const timerWrap = document.querySelector('.header-right');
    if (timerWrap) timerWrap.style.visibility = state.noTimer ? 'hidden' : 'visible';

    renderQuestion(0);
    if (!state.noTimer) startTimer();
    showScreen('quiz');
  }

  function renderQuestion(idx) {
    const q = state.questions[idx];
    state.currentIdx = idx;

    document.getElementById('current-num').textContent = idx + 1;
    document.getElementById('progress-bar').value = idx + 1;
    document.getElementById('domain-tag').textContent = `${q.domainCode} · ${q.domain}`;
    document.getElementById('type-tag').textContent =
      q.type === 'multiple' ? 'Multiple answer (chọn nhiều)' : 'Single answer (chọn một)';
    document.getElementById('question-text').textContent = q.question;

    const form = document.getElementById('options-form');
    form.innerHTML = '';
    const selected = state.userAnswers[q.id] || [];
    const inputType = q.type === 'multiple' ? 'checkbox' : 'radio';

    q.options.forEach((opt) => {
      const label = document.createElement('label');
      label.dataset.key = opt.key;
      if (selected.includes(opt.key)) label.classList.add('selected');

      const input = document.createElement('input');
      input.type = inputType;
      input.name = `q-${q.id}`;
      input.value = opt.key;
      if (selected.includes(opt.key)) input.checked = true;
      input.addEventListener('change', () => onAnswerChange(q));

      const span = document.createElement('span');
      span.innerHTML = `<span class="opt-key">${opt.key}.</span>${escapeHtml(opt.text)}`;

      label.appendChild(input);
      label.appendChild(span);
      form.appendChild(label);
    });

    document.getElementById('btn-prev').disabled = idx === 0;
    document.getElementById('btn-next').disabled = idx === state.questions.length - 1;
  }

  function onAnswerChange(q) {
    const form = document.getElementById('options-form');
    const inputs = form.querySelectorAll('input');
    const selected = [];
    inputs.forEach((inp) => {
      const label = inp.closest('label');
      if (inp.checked) {
        selected.push(inp.value);
        label.classList.add('selected');
      } else {
        label.classList.remove('selected');
      }
    });
    state.userAnswers[q.id] = selected;
  }

  function startTimer() {
    updateTimerDisplay();
    state.timerInterval = setInterval(() => {
      state.secondsLeft--;
      if (state.secondsLeft <= 0) {
        clearInterval(state.timerInterval);
        submitExam('timeout');
        return;
      }
      updateTimerDisplay();
    }, 1000);
  }

  function updTimerStyle(el) {
    el.classList.remove('warning', 'danger');
    if (state.secondsLeft <= 600 && state.secondsLeft > 300) el.classList.add('warning');
    else if (state.secondsLeft <= 300) el.classList.add('danger');
  }

  function updateTimerDisplay() {
    const el = document.getElementById('timer');
    const h = Math.floor(state.secondsLeft / 3600);
    const m = Math.floor((state.secondsLeft % 3600) / 60);
    const s = state.secondsLeft % 60;
    el.textContent = `${pad(h)}:${pad(m)}:${pad(s)}`;
    updTimerStyle(el);
  }

  function pad(n) { return n < 10 ? `0${n}` : `${n}`; }

  function submitExam(reason) {
    if (state.submitted) return;
    if (reason !== 'timeout') {
      const unanswered = state.questions.filter((q) => !state.userAnswers[q.id] || state.userAnswers[q.id].length === 0).length;
      const msg = unanswered > 0
        ? `Bạn còn ${unanswered} câu chưa trả lời. Vẫn nộp bài?`
        : 'Bạn có chắc muốn nộp bài?';
      if (!confirm(msg)) return;
    }
    state.submitted = true;
    if (state.timerInterval) clearInterval(state.timerInterval);
    renderResult(reason);
    showScreen('result');
  }

  function arraysEqual(a, b) {
    if (a.length !== b.length) return false;
    const sa = a.slice().sort();
    const sb = b.slice().sort();
    return sa.every((v, i) => v === sb[i]);
  }

  function calculateScore() {
    const byDomain = {};
    state.examData.domains.forEach((d) => {
      byDomain[d.code] = { name: d.name, total: 0, correct: 0 };
    });

    let totalCorrect = 0;
    const reviews = [];

    state.questions.forEach((q) => {
      const userAns = state.userAnswers[q.id] || [];
      const isCorrect = userAns.length > 0 && arraysEqual(userAns, q.answer);
      byDomain[q.domainCode].total++;
      if (isCorrect) {
        byDomain[q.domainCode].correct++;
        totalCorrect++;
      }
      reviews.push({ q, userAns, isCorrect, answered: userAns.length > 0 });
    });

    return {
      totalCorrect,
      totalQuestions: state.questions.length,
      percent: Math.round((totalCorrect / state.questions.length) * 100),
      byDomain,
      reviews,
    };
  }

  function renderResult(reason) {
    const score = calculateScore();
    const pass = score.percent >= state.examData.passingScore;

    document.getElementById('score-percent').textContent = `${score.percent}%`;
    document.getElementById('score-fraction').textContent = `${score.totalCorrect} / ${score.totalQuestions}`;
    const circle = document.getElementById('score-circle');
    circle.style.setProperty('--score', `${score.percent}%`);

    const badge = document.getElementById('result-badge');
    badge.textContent = pass ? 'PASS' : 'FAIL';
    badge.className = `badge ${pass ? 'pass' : 'fail'}`;
    const reasonEl = document.getElementById('result-reason');
    if (reason === 'timeout') {
      reasonEl.textContent = 'Hết giờ — bài đã được tự động nộp.';
    } else if (state.mode === 'practice') {
      reasonEl.textContent = pass
        ? `Practice mode: vượt mức ${state.examData.passingScore}%.`
        : `Practice mode: chưa đạt mức ${state.examData.passingScore}%.`;
    } else {
      reasonEl.textContent = pass
        ? `Vượt mức ${state.examData.passingScore}% — bạn có thể tự tin cho kỳ thi thật!`
        : `Chưa đạt mức ${state.examData.passingScore}% — xem lại câu sai ở dưới.`;
    }

    const bars = document.getElementById('domain-bars');
    bars.innerHTML = '';
    Object.entries(score.byDomain).forEach(([code, d]) => {
      if (d.total === 0) return;
      const pct = Math.round((d.correct / d.total) * 100);
      const cls = pct >= 75 ? 'high' : pct >= 50 ? 'mid' : 'low';
      const row = document.createElement('div');
      row.className = 'domain-bar-row';
      row.innerHTML = `
        <div class="domain-bar-label">${code} · ${d.name}</div>
        <div class="domain-bar-track"><div class="domain-bar-fill ${cls}" style="width:${pct}%"></div></div>
        <div class="domain-bar-value">${d.correct}/${d.total} (${pct}%)</div>
      `;
      bars.appendChild(row);
    });

    renderReviewList(score.reviews, 'all');
    document.querySelectorAll('.filter-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.filter === 'all');
      btn.onclick = () => {
        document.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        renderReviewList(score.reviews, btn.dataset.filter);
      };
    });
  }

  function renderReviewList(reviews, filter) {
    const list = document.getElementById('review-list');
    list.innerHTML = '';
    const filtered = reviews.filter((r) => {
      if (filter === 'all') return true;
      if (filter === 'wrong') return !r.isCorrect;
      if (filter === 'correct') return r.isCorrect;
      return true;
    });

    if (filtered.length === 0) {
      list.innerHTML = '<p style="text-align:center;color:#687078;padding:20px;">Không có câu nào trong danh mục này.</p>';
      return;
    }

    filtered.forEach((r) => {
      const item = document.createElement('div');
      let cls = r.isCorrect ? 'correct' : (r.answered ? 'wrong' : 'unanswered');
      item.className = `review-item ${cls}`;

      const statusText = r.isCorrect ? '✓ Đúng' : (r.answered ? '✗ Sai' : '— Chưa trả lời');
      const statusColor = r.isCorrect ? '#166701' : '#B7301B';

      const optionsHtml = r.q.options.map((opt) => {
        const isCorrect = r.q.answer.includes(opt.key);
        const userPicked = r.userAns.includes(opt.key);
        let optCls = '';
        if (isCorrect && userPicked) optCls = 'option-user-correct';
        else if (isCorrect) optCls = 'option-correct';
        else if (userPicked) optCls = 'option-user-wrong';
        return `<li class="${optCls}"><strong>${opt.key}.</strong> ${escapeHtml(opt.text)}</li>`;
      }).join('');

      const refHtml = r.q.reference
        ? `<a class="review-reference" href="${escapeAttr(r.q.reference)}" target="_blank" rel="noopener noreferrer">📖 AWS Docs</a>`
        : '';

      item.innerHTML = `
        <div>
          <span class="review-q-num">#${reviews.indexOf(r) + 1}</span>
          <span class="review-domain-pill">${r.q.domainCode}</span>
          <span style="float:right;color:${statusColor};font-weight:600;">${statusText}</span>
        </div>
        <p class="review-q-text">${escapeHtml(r.q.question)}</p>
        <ul class="review-options">${optionsHtml}</ul>
        <div class="review-explanation"><strong>Giải thích:</strong> ${escapeHtml(r.q.explanation)} ${refHtml}</div>
      `;
      list.appendChild(item);
    });
  }

  function escapeHtml(s) {
    if (typeof s !== 'string') return '';
    return s.replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  function escapeAttr(s) {
    if (typeof s !== 'string') return '';
    return s.replace(/["'<>&]/g, (c) => ({
      '"': '&quot;', "'": '&#39;', '<': '&lt;', '>': '&gt;', '&': '&amp;'
    }[c]));
  }

  function restartExam() {
    state.userAnswers = {};
    state.currentIdx = 0;
    state.submitted = false;
    if (state.timerInterval) clearInterval(state.timerInterval);
    showScreen('start');
  }

  function bindEvents() {
    document.getElementById('btn-start').addEventListener('click', startExam);
    document.getElementById('btn-prev').addEventListener('click', () => {
      if (state.currentIdx > 0) renderQuestion(state.currentIdx - 1);
    });
    document.getElementById('btn-next').addEventListener('click', () => {
      if (state.currentIdx < state.questions.length - 1) renderQuestion(state.currentIdx + 1);
    });
    document.getElementById('btn-submit').addEventListener('click', () => submitExam('manual'));
    document.getElementById('btn-restart').addEventListener('click', restartExam);

    const selectAll = document.getElementById('btn-select-all');
    const deselectAll = document.getElementById('btn-deselect-all');
    if (selectAll) selectAll.addEventListener('click', () => {
      document.querySelectorAll('#domain-checkboxes input[type=checkbox]').forEach((c) => { c.checked = true; });
    });
    if (deselectAll) deselectAll.addEventListener('click', () => {
      document.querySelectorAll('#domain-checkboxes input[type=checkbox]').forEach((c) => { c.checked = false; });
    });

    document.addEventListener('keydown', (e) => {
      if (!screens.quiz.classList.contains('active')) return;
      if (e.key === 'ArrowLeft' && state.currentIdx > 0) renderQuestion(state.currentIdx - 1);
      else if (e.key === 'ArrowRight' && state.currentIdx < state.questions.length - 1) renderQuestion(state.currentIdx + 1);
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    bindEvents();
    loadQuestions();
  });
})();
