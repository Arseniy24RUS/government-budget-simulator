(function () {
  'use strict';

  const SUPPORTED = new Set(['en', 'ru']);
  const STORAGE_KEY = 'lang';
  const ATTRS = ['placeholder', 'title', 'alt', 'aria-label'];
  const OBSERVER_OPTIONS = {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: true,
    attributeFilter: ATTRS
  };
  const scriptUrl = document.currentScript ? document.currentScript.src : window.location.href;
  const localeBase = new URL('../locales/', new URL(scriptUrl));

  const state = {
    language: detectLanguage(),
    locales: {},
    reverse: {},
    observer: null,
    applying: false,
    originalText: new WeakMap(),
    originalAttrs: new WeakMap(),
    chartInstances: new Set(),
    chartPatched: false,
    toggleBound: false
  };

  function normalizeLanguage(value) {
    const lang = String(value || '').toLowerCase().slice(0, 2);
    return SUPPORTED.has(lang) ? lang : null;
  }

  function detectLanguage() {
    try {
      const saved = normalizeLanguage(window.localStorage && window.localStorage.getItem(STORAGE_KEY));
      if (saved) return saved;
    } catch (_) {
      // Ignore inaccessible storage.
    }

    const navLanguages = [];
    if (Array.isArray(navigator.languages)) navLanguages.push(...navigator.languages);
    if (navigator.language) navLanguages.push(navigator.language);
    return navLanguages.some(lang => String(lang || '').toLowerCase().includes('ru')) ? 'ru' : 'en';
  }

  function localeUrl(lang) {
    return new URL(lang + '.json', localeBase).toString();
  }

  async function loadLocale(lang) {
    if (state.locales[lang]) return state.locales[lang];
    const response = await fetch(localeUrl(lang));
    if (!response.ok) {
      throw new Error('Failed to load locale ' + lang + ': ' + response.status);
    }
    const data = await response.json();
    state.locales[lang] = data;
    rebuildReverseMaps();
    return data;
  }

  function stringsFor(lang) {
    const locale = state.locales[lang] || {};
    return Object.assign({}, locale.regions || {}, locale.strings || {});
  }

  function patternsFor(lang) {
    const locale = state.locales[lang] || {};
    return Array.isArray(locale.patterns) ? locale.patterns : [];
  }

  function rebuildReverseMaps() {
    state.reverse = {};
    Object.keys(state.locales).forEach(lang => {
      const strings = stringsFor(lang);
      Object.keys(strings).forEach(source => {
        const translated = strings[source];
        if (typeof translated === 'string' && translated) {
          state.reverse[translated] = source;
        }
      });
    });
  }

  function compact(value) {
    return String(value || '').replace(/\s+/g, ' ').trim();
  }

  function preserveSpace(original, translated) {
    const leading = String(original).match(/^\s*/)[0];
    const trailing = String(original).match(/\s*$/)[0];
    return leading + translated + trailing;
  }

  function toSource(value) {
    const text = compact(value);
    return state.reverse[text] || text;
  }

  function translateCore(source, lang) {
    const text = toSource(source);
    const strings = stringsFor(lang);
    if (Object.prototype.hasOwnProperty.call(strings, text)) return strings[text];
    if (lang === 'ru') return text;

    const exactPatternTranslation = applyPatterns(text, lang, true);
    if (exactPatternTranslation !== text) return exactPatternTranslation;

    let translated = text;
    const entries = Object.entries(strings)
      .filter(([key, value]) => {
        if (!key || !value || key === value || compact(key).length < 3) return false;
        return !key.startsWith('app.') && !key.startsWith('language.');
      })
      .sort((a, b) => b[0].length - a[0].length);

    entries.forEach(([key, value]) => {
      if (translated.includes(key)) translated = translated.split(key).join(value);
    });

    translated = applyPatterns(translated, lang, false);

    return translated;
  }

  function applyPatterns(value, lang, anchoredOnly) {
    let translated = value;
    patternsFor(lang).forEach(pattern => {
      if (!pattern || !pattern.source) return;
      if (anchoredOnly && !pattern.source.startsWith('^')) return;
      try {
        translated = translated.replace(new RegExp(pattern.source, pattern.flags || 'g'), pattern.target || '');
      } catch (_) {
        // Bad custom patterns should not break the app.
      }
    });
    return translated;
  }

  function translateText(value, lang = state.language) {
    if (value === null || value === undefined) return value;
    const text = String(value);
    if (!compact(text)) return text;
    return preserveSpace(text, translateCore(text, lang));
  }

  function t(key, params) {
    let value = translateCore(key, state.language);
    if (value === key) {
      const strings = stringsFor(state.language);
      value = strings[key] || key;
    }
    if (params && typeof params === 'object') {
      Object.keys(params).forEach(name => {
        value = value.split('{' + name + '}').join(String(params[name]));
      });
    }
    return value;
  }

  function shouldSkipElement(element) {
    return !element ||
      element.nodeType !== Node.ELEMENT_NODE ||
      element.tagName === 'SCRIPT' ||
      element.tagName === 'STYLE' ||
      element.dataset.i18nManaged === 'language-toggle';
  }

  function applyTextNode(node, forceSource) {
    if (!node || node.nodeType !== Node.TEXT_NODE || !compact(node.nodeValue)) return;
    if (forceSource || !state.originalText.has(node)) {
      state.originalText.set(node, toSource(node.nodeValue));
    }
    const nextValue = translateText(state.originalText.get(node));
    if (node.nodeValue !== nextValue) node.nodeValue = nextValue;
  }

  function applyAttrs(element, forceSource) {
    if (!element || element.nodeType !== Node.ELEMENT_NODE) return;
    let originals = state.originalAttrs.get(element);
    if (!originals || forceSource) {
      originals = {};
      state.originalAttrs.set(element, originals);
    }
    ATTRS.forEach(attr => {
      if (!element.hasAttribute(attr)) return;
      if (forceSource || !Object.prototype.hasOwnProperty.call(originals, attr)) {
        originals[attr] = toSource(element.getAttribute(attr));
      }
      const nextValue = translateText(originals[attr]);
      if (element.getAttribute(attr) !== nextValue) element.setAttribute(attr, nextValue);
    });
  }

  function applyNode(node, forceSource) {
    if (!node) return;
    if (node.nodeType === Node.TEXT_NODE) {
      applyTextNode(node, forceSource);
      return;
    }
    if (shouldSkipElement(node)) return;
    applyAttrs(node, forceSource);
    Array.from(node.childNodes || []).forEach(child => applyNode(child, forceSource));
  }

  function updateLanguageToggle() {
    const button = document.querySelector('[data-testid="language-toggle"]');
    if (!button) return;
    if (!state.toggleBound) {
      button.addEventListener('click', () => toggleLanguage());
      state.toggleBound = true;
    }
    const nextText = state.language === 'ru' ? 'EN' : 'RU';
    const nextLabel = t('language.toggle.aria');
    if (button.textContent !== nextText) button.textContent = nextText;
    if (button.getAttribute('aria-label') !== nextLabel) button.setAttribute('aria-label', nextLabel);
    if (button.getAttribute('title') !== nextLabel) button.setAttribute('title', nextLabel);
  }

  function translateChartData(chart) {
    if (!chart || !chart.data) return;
    if (Array.isArray(chart.data.labels)) {
      chart.data.labels = chart.data.labels.map(label => translateText(label));
    }
    if (Array.isArray(chart.data.datasets)) {
      chart.data.datasets.forEach(dataset => {
        if (typeof dataset.label === 'string') {
          dataset.label = translateText(dataset.label);
        }
      });
    }
  }

  function patchChart() {
    if (state.chartPatched || !window.Chart) return;
    const OriginalChart = window.Chart;
    const originalUpdate = OriginalChart.prototype.update;

    OriginalChart.prototype.update = function patchedUpdate(...args) {
      translateChartData(this);
      return originalUpdate.apply(this, args);
    };

    function WrappedChart(ctx, config) {
      const chart = new OriginalChart(ctx, config);
      state.chartInstances.add(chart);
      translateChartData(chart);
      return chart;
    }

    WrappedChart.prototype = OriginalChart.prototype;
    Object.setPrototypeOf(WrappedChart, OriginalChart);
    Object.getOwnPropertyNames(OriginalChart).forEach(name => {
      if (name === 'length' || name === 'name' || name === 'prototype') return;
      try {
        Object.defineProperty(WrappedChart, name, Object.getOwnPropertyDescriptor(OriginalChart, name));
      } catch (_) {
        // Non-configurable static members can stay on the original prototype chain.
      }
    });

    window.Chart = WrappedChart;
    state.chartPatched = true;
  }

  function apply() {
    pauseObserver();
    state.applying = true;
    try {
      document.documentElement.lang = state.language;
      document.title = t('app.title');
      applyNode(document.body, false);
      updateLanguageToggle();
      state.chartInstances.forEach(chart => {
        translateChartData(chart);
        if (typeof chart.update === 'function') chart.update('none');
      });
    } finally {
      state.applying = false;
      resumeObserver();
    }
  }

  async function setLanguage(lang) {
    const normalized = normalizeLanguage(lang);
    if (!normalized) return state.language;
    await loadLocale(normalized);
    state.language = normalized;
    try {
      window.localStorage && window.localStorage.setItem(STORAGE_KEY, normalized);
    } catch (_) {
      // Ignore inaccessible storage.
    }
    apply();
    window.dispatchEvent(new CustomEvent('app:i18n:change', { detail: { language: normalized } }));
    return normalized;
  }

  function toggleLanguage() {
    return setLanguage(state.language === 'ru' ? 'en' : 'ru');
  }

  function startObserver() {
    if (state.observer || !document.body) return;
    state.observer = new MutationObserver(mutations => {
      if (state.applying) return;
      pauseObserver();
      state.applying = true;
      try {
        mutations.forEach(mutation => {
          if (mutation.type === 'characterData') {
            applyTextNode(mutation.target, true);
          } else if (mutation.type === 'attributes') {
            applyAttrs(mutation.target, true);
          } else if (mutation.type === 'childList') {
            mutation.addedNodes.forEach(node => applyNode(node, true));
          }
        });
        updateLanguageToggle();
      } finally {
        state.applying = false;
        resumeObserver();
      }
    });
    resumeObserver();
  }

  function pauseObserver() {
    if (state.observer) state.observer.disconnect();
  }

  function resumeObserver() {
    if (state.observer && document.body) state.observer.observe(document.body, OBSERVER_OPTIONS);
  }

  const nativeAlert = window.alert.bind(window);
  const nativeConfirm = window.confirm.bind(window);
  window.alert = message => nativeAlert(translateText(message));
  window.confirm = message => nativeConfirm(translateText(message));

  const ready = Promise.all([loadLocale('ru'), loadLocale('en'), loadLocale(state.language)])
    .then(() => {
      patchChart();
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          apply();
          startObserver();
        }, { once: true });
      } else {
        apply();
        startObserver();
      }
      return state.language;
    })
    .catch(error => {
      console.error('i18n initialization failed', error);
      return state.language;
    });

  window.AppI18n = {
    t,
    getLanguage: () => state.language,
    setLanguage,
    toggleLanguage,
    apply,
    ready
  };
})();
