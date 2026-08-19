/**
 * Main Application Controller
 */

import { INTENT_OPTIONS, THEME_TAGS } from './presets.js';
import { loadState, saveState, clearState } from './storage.js';
import { buildIdeationPrompt, buildDevPrompt } from './prompt.js';

let appState = loadState();
let toastTimeout = null;

// DOM Elements
const screens = {
  1: document.getElementById('screen-1'),
  2: document.getElementById('screen-2'),
  3: document.getElementById('screen-3'),
  4: document.getElementById('screen-4'),
  5: document.getElementById('screen-5')
};

const progressBar = document.getElementById('step-progress');
const stepItems = document.querySelectorAll('.step-item');
const toastEl = document.getElementById('toast');

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
  renderIntentOptions();
  renderThemeTags();
  bindEvents();
  setupAutoResize();
  restoreInputs();

  // History state pop handling (browser back/forward)
  window.addEventListener('popstate', (e) => {
    const step = e.state?.step || 1;
    goToStep(step, false);
  });

  const initialStep = appState.currentStep || 1;
  history.replaceState({ step: initialStep }, '', '');
  goToStep(initialStep, false);
});

// Render Intent Options (Step 2)
function renderIntentOptions() {
  const container = document.getElementById('intent-container');
  if (!container) return;
  
  container.innerHTML = INTENT_OPTIONS.map(opt => {
    const isSelected = appState.intentId === opt.id;
    return `
      <div class="card card-interactive intent-card ${isSelected ? 'selected' : ''}" data-intent-id="${opt.id}">
        <div class="intent-num">${opt.number}</div>
        <div class="intent-body">
          <div class="intent-name">${opt.title}</div>
          <div class="intent-desc">${opt.desc}</div>
        </div>
        <div class="intent-check">${isSelected ? 'OK' : ''}</div>
      </div>
    `;
  }).join('');
}

// Render Theme Tags (Step 2)
function renderThemeTags() {
  const container = document.getElementById('tags-container');
  if (!container) return;

  container.innerHTML = THEME_TAGS.map(tag => {
    const isSelected = appState.selectedTags && appState.selectedTags.includes(tag.id);
    return `
      <div class="tag-item ${isSelected ? 'selected' : ''}" data-tag-id="${tag.id}">
        ${tag.label}
      </div>
    `;
  }).join('');
}

// Auto-resize for all textareas
function setupAutoResize() {
  document.querySelectorAll('textarea').forEach(textarea => {
    const resize = () => {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight + 4}px`;
    };
    textarea.addEventListener('input', resize);
    setTimeout(resize, 0);
  });
}

// Bind Global UI Events
function bindEvents() {
  document.getElementById('btn-start')?.addEventListener('click', () => goToStep(2));

  // Intent Card Click
  document.getElementById('intent-container')?.addEventListener('click', (e) => {
    const card = e.target.closest('.intent-card');
    if (!card) return;
    appState.intentId = card.getAttribute('data-intent-id');
    saveState(appState);
    renderIntentOptions();
  });

  // Tag Click
  document.getElementById('tags-container')?.addEventListener('click', (e) => {
    const tagEl = e.target.closest('.tag-item');
    if (!tagEl) return;
    const tagId = tagEl.getAttribute('data-tag-id');
    if (!appState.selectedTags) appState.selectedTags = [];
    
    if (tagId === 'all') {
      appState.selectedTags = ['all'];
    } else {
      appState.selectedTags = appState.selectedTags.filter(id => id !== 'all');
      if (appState.selectedTags.includes(tagId)) {
        appState.selectedTags = appState.selectedTags.filter(id => id !== tagId);
      } else {
        appState.selectedTags.push(tagId);
      }
    }
    saveState(appState);
    renderThemeTags();
  });

  // Custom Note Input
  const noteInput = document.getElementById('input-custom-note');
  noteInput?.addEventListener('input', (e) => {
    appState.customNote = e.target.value;
    saveState(appState);
  });

  // Step Navigations
  document.getElementById('btn-step2-next')?.addEventListener('click', () => goToStep(3));
  document.getElementById('btn-step2-prev')?.addEventListener('click', () => goToStep(1));
  document.getElementById('btn-step3-next')?.addEventListener('click', () => goToStep(4));
  document.getElementById('btn-step3-prev')?.addEventListener('click', () => goToStep(2));

  // Decision Form Inputs (Step 4)
  const titleInput = document.getElementById('input-decision-title');
  const descInput = document.getElementById('input-decision-desc');

  titleInput?.addEventListener('input', (e) => {
    titleInput.classList.remove('input-error');
    if (!appState.decision) appState.decision = {};
    appState.decision.title = e.target.value;
    saveState(appState);
  });

  descInput?.addEventListener('input', (e) => {
    if (!appState.decision) appState.decision = {};
    appState.decision.description = e.target.value;
    saveState(appState);
  });

  // Step 4 Next (with error highlight instead of native alert)
  document.getElementById('btn-step4-next')?.addEventListener('click', () => {
    const title = titleInput?.value.trim() || '';
    if (!title) {
      titleInput?.classList.add('input-error');
      titleInput?.focus();
      showToast('ツールのタイトル（仮称）を入力してください', true);
      return;
    }
    goToStep(5);
  });
  document.getElementById('btn-step4-prev')?.addEventListener('click', () => goToStep(3));

  // Copy Buttons
  document.getElementById('btn-copy-ideation')?.addEventListener('click', () => {
    const promptText = document.getElementById('prompt-ideation')?.innerText || '';
    copyToClipboard(promptText, 'AI質問文をコピーしました');
  });

  document.getElementById('btn-copy-dev')?.addEventListener('click', () => {
    const promptText = document.getElementById('prompt-dev')?.innerText || '';
    copyToClipboard(promptText, 'Antigravity用プロンプトをコピーしました');
  });

  // Header Home Click
  document.getElementById('brand-home')?.addEventListener('click', () => {
    goToStep(1);
  });

  // Reset Button (Step 5)
  document.getElementById('btn-reset')?.addEventListener('click', () => {
    clearState();
    appState = loadState();
    restoreInputs();
    renderIntentOptions();
    renderThemeTags();
    goToStep(1);
    showToast('最初からやり直します（リセット完了）');
  });
}

// Restore UI Input Values from State
function restoreInputs() {
  const noteInput = document.getElementById('input-custom-note');
  if (noteInput) noteInput.value = appState.customNote || '';
  const titleInput = document.getElementById('input-decision-title');
  if (titleInput) {
    titleInput.value = appState.decision?.title || '';
    titleInput.classList.remove('input-error');
  }
  const descInput = document.getElementById('input-decision-desc');
  if (descInput) descInput.value = appState.decision?.description || '';
}

// Step Navigation with History Support
function goToStep(stepNum, pushToHistory = true) {
  appState.currentStep = stepNum;
  saveState(appState);

  if (pushToHistory && window.history) {
    history.pushState({ step: stepNum }, '', '');
  }

  // Switch Screens
  Object.keys(screens).forEach(key => {
    const screen = screens[key];
    if (screen) {
      if (parseInt(key) === stepNum) {
        screen.classList.add('active');
      } else {
        screen.classList.remove('active');
      }
    }
  });

  // Update Progress Bar
  const percent = ((stepNum - 1) / 4) * 100;
  if (progressBar) progressBar.style.width = `${percent}%`;

  stepItems.forEach((item, index) => {
    const itemStep = index + 1;
    item.classList.remove('active', 'completed');
    if (itemStep === stepNum) {
      item.classList.add('active');
    } else if (itemStep < stepNum) {
      item.classList.add('completed');
    }
  });

  // Step-Specific Preparation
  if (stepNum === 3) {
    const promptBox = document.getElementById('prompt-ideation');
    if (promptBox) promptBox.innerText = buildIdeationPrompt(appState);
  } else if (stepNum === 5) {
    const summaryTitle = document.getElementById('summary-title');
    const summaryDesc = document.getElementById('summary-desc');
    const devPromptBox = document.getElementById('prompt-dev');

    const title = appState.decision?.title || '未設定のツール';
    const desc = appState.decision?.description || '概要未入力';

    if (summaryTitle) summaryTitle.innerText = title;
    if (summaryDesc) summaryDesc.innerText = desc;
    if (devPromptBox) devPromptBox.innerText = buildDevPrompt(appState);
  }

  // Trigger resize on visible textareas
  document.querySelectorAll('textarea').forEach(ta => {
    ta.style.height = 'auto';
    ta.style.height = `${ta.scrollHeight + 4}px`;
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Reliable Copy to Clipboard without native alert
function copyToClipboard(text, successMessage = 'コピーしました') {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(successMessage);
    }).catch(() => fallbackCopy(text, successMessage));
  } else {
    fallbackCopy(text, successMessage);
  }
}

function fallbackCopy(text, successMessage) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-9999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    showToast(successMessage);
  } catch (err) {
    showToast('テキストを手動で選択してコピーしてください', true);
  }
  document.body.removeChild(textArea);
}

// Toast Display
function showToast(message, isError = false) {
  if (!toastEl) return;
  toastEl.innerText = message;
  if (isError) {
    toastEl.classList.add('toast-error');
  } else {
    toastEl.classList.remove('toast-error');
  }
  toastEl.classList.add('show');

  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toastEl.classList.remove('show');
  }, 2400);
}
