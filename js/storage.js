/**
 * LocalStorage State Management
 */

const STORAGE_KEY = 'nani_wo_tsukuru_ka_state_v1';

export const defaultState = {
  currentStep: 1,
  intentId: 'quick',
  selectedTags: [],
  customNote: '',
  decision: {
    title: '',
    description: ''
  },
  updatedAt: null
};

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultState };
    const parsed = JSON.parse(raw);
    return { ...defaultState, ...parsed };
  } catch (err) {
    console.warn('[Storage] Failed to load state:', err);
    return { ...defaultState };
  }
}

export function saveState(state) {
  try {
    const payload = {
      ...state,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (err) {
    console.warn('[Storage] Failed to save state:', err);
  }
}

export function clearState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.warn('[Storage] Failed to clear state:', err);
  }
}
