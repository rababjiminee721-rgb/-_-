'use strict';

const SearchEngine = {
  data: null,
  currentResults: [],
  currentQuery: '',

  init() {
    this.data = WorkshatiData;
    this.bindEvents();
    this.checkURLQuery();
  },

  buildIndex() {
    const index = [];

    this.data.parts.forEach(part => {
      const system = this.data.systems.find(s => s.id === part.systemId);
      index.push({
        id: part.id,
        type: 'part',
        typeLabel: { ar: 'قطعة', en: 'Part' },
        name: part.name,
        description: part.description,
        systemName: system ? system.name : { ar: '', en: '' },
        icon: part.icon || 'fa-cog',
        url: `part-details.html?id=${part.id}`,
        image: part.image,
        keywords: [
          part.name.ar, part.name.en,
          part.description?.ar, part.description?.en,
          system?.name?.ar, system?.name?.en
        ].filter(Boolean).join(' ').toLowerCase()
      });
    });

    this.data.faults.forEach(fault => {
      const system = this.data.systems.find(s => s.id === fault.systemId);
      index.push({
        id: fault.id,
        type: 'fault',
        typeLabel: { ar: 'عطل', en: 'Fault' },
        name: fault.name,
        description: fault.description,
        systemName: system ? system.name : { ar: '', en: '' },
        icon: fault.icon || 'fa-triangle-exclamation',
        url: `fault-details.html?id=${fault.id}`,
        severity: fault.severity,
        keywords: [
          fault.name.ar, fault.name.en,
          fault.description?.ar, fault.description?.en,
          ...(fault.symptoms?.ar || []),
          ...(fault.symptoms?.en || []),
          system?.name?.ar, system?.name?.en
        ].filter(Boolean).join(' ').toLowerCase()
      });
    });

    this.data.systems.forEach(system => {
      index.push({
        id: system.id,
        type: 'system',
        typeLabel: { ar: 'نظام', en: 'System' },
        name: system.name,
        description: system.description,
        systemName: system.name,
        icon: system.icon || 'fa-car-engine',
        url: `systems.html?system=${system.id}`,
        image: system.image,
        keywords: [
          system.name.ar, system.name.en,
          system.description?.ar, system.description?.en
        ].filter(Boolean).join(' ').toLowerCase()
      });
    });

    return index;
  },

  search(query) {
    if (!query || query.trim().length < 2) return [];

    const index = this.buildIndex();
    const q = query.trim().toLowerCase();
    const lang = Lang.get();

    const results = index.filter(item => {
      return item.keywords.includes(q) ||
             item.name[lang]?.toLowerCase().includes(q) ||
             item.name.ar?.toLowerCase().includes(q) ||
             item.name.en?.toLowerCase().includes(q) ||
             item.keywords.split(' ').some(word => word.startsWith(q));
    });

    results.sort((a, b) => {
      const aName = (a.name[lang] || a.name.ar || '').toLowerCase();
      const bName = (b.name[lang] || b.name.ar || '').toLowerCase();
      const aExact = aName.startsWith(q) ? 1 : 0;
      const bExact = bName.startsWith(q) ? 1 : 0;
      return bExact - aExact;
    });

    return results.slice(0, 20);
  },

  quickSearch(query) {
    return this.search(query).slice(0, 6);
  },

  renderResults(results, query) {
    const container = document.querySelector('#search-results');
    const countEl = document.querySelector('#results-count');
    const lang = Lang.get();

    if (countEl) {
      countEl.textContent = lang === 'ar'
        ? `${results.length} نتيجة لـ "${query}"`
        : `${results.length} results for "${query}"`;
    }

    if (!container) return;

    if (results.length === 0) {
      container.innerHTML = `
        <div style="text-align:center; padding: 4rem 2rem; color: var(--text-muted);">
          <i class="fas fa-search" style="font-size:3rem; color:var(--gold); margin-bottom:1rem; display:block;"></i>
          <h3 style="font-size:1.3rem; margin-bottom:0.5rem; color:var(--text-primary);">
            ${lang === 'ar' ? 'لا توجد نتائج' : 'No Results Found'}
          </h3>
          <p>${lang === 'ar' ? `لم نجد نتائج لـ "${query}"، جرب كلمات أخرى` : `No results for "${query}", try different keywords`}</p>
        </div>
      `;
      return;
    }

    container.innerHTML = results.map(item => this.renderResultCard(item)).join('');

    container.querySelectorAll('.search-result-card').forEach((card, i) => {
      card.style.animationDelay = `${i * 0.05}s`;
      card.classList.add('fade-in', 'visible');
    });
  },

  renderResultCard(item) {
    const lang = Lang.get();
    const name = item.name[lang] || item.name.ar;
    const desc = item.description ? (item.description[lang] || item.description.ar) : '';
    const systemName = item.systemName ? (item.systemName[lang] || item.systemName.ar) : '';
    const typeLabel = item.typeLabel[lang] || item.typeLabel.ar;

    const severityBadge = item.severity ? `
      <span class="badge badge-${item.severity === 'critical' ? 'danger' : item.severity === 'warning' ? 'warning' : 'gold'}">
        ${item.severity === 'critical' ? (lang === 'ar' ? 'حرج' : 'Critical') :
          item.severity === 'warning' ? (lang === 'ar' ? 'تحذير' : 'Warning') :
          (lang === 'ar' ? 'معلومة' : 'Info')}
      </span>
    ` : '';

    return `
      <a href="${item.url}" class="search-result-card" style="
        display: flex;
        align-items: center;
        gap: 1.25rem;
        padding: 1.25rem 1.5rem;
        background: var(--white);
        border-radius: var(--radius-lg);
        border: 1px solid rgba(76,175,80,0.04);
        margin-bottom: 0.75rem;
        text-decoration: none;
        color: inherit;
        transition: var(--transition);
      " onmouseover="this.style.borderColor='rgba(76,175,80,0.3)'; this.style.boxShadow='0 8px 30px rgba(76,175,80,0.05)'"
         onmouseout="this.style.borderColor='rgba(76,175,80,0.04)'; this.style.boxShadow='none'">
        ${item.image ? `
          <img src="${item.image}" alt="${name}" style="
            width: 80px;
            height: 80px;
            object-fit: cover;
            border-radius: var(--radius-md);
            flex-shrink: 0;
          ">
        ` : `
          <div style="
            width: 80px;
            height: 80px;
            background: rgba(201,168,76,0.1);
            border-radius: var(--radius-md);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.8rem;
            color: var(--gold-dark);
            flex-shrink: 0;
          ">
            <i class="fas ${item.icon}"></i>
          </div>
        `}
        <div style="flex: 1; min-width: 0;">
          <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.35rem; flex-wrap:wrap;">
            <span class="badge badge-gold">${typeLabel}</span>
            ${systemName ? `<span style="font-size:0.8rem; color:var(--text-muted);">${systemName}</span>` : ''}
            ${severityBadge}
          </div>
          <h3 style="font-size:1rem; font-weight:700; color:var(--text-primary); margin-bottom:0.35rem;">${name}</h3>
          <p style="font-size:0.85rem; color:var(--text-secondary); line-height:1.6; overflow:hidden; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical;">${desc}</p>
        </div>
        <i class="fas fa-chevron-${lang === 'ar' ? 'left' : 'right'}" style="color:var(--gold); font-size:0.9rem; flex-shrink:0;"></i>
      </a>
    `;
  },

  renderDropdown(results, container) {
    const lang = Lang.get();
    if (!container) return;

    if (results.length === 0) {
      container.classList.remove('active');
      return;
    }

    container.innerHTML = results.map(item => {
      const name = item.name[lang] || item.name.ar;
      const typeLabel = item.typeLabel[lang] || item.typeLabel.ar;
      return `
        <a href="${item.url}" class="search-result-item">
          <div class="search-result-icon">
            <i class="fas ${item.icon}"></i>
          </div>
          <div>
            <div class="search-result-title">${name}</div>
            <div class="search-result-type">${typeLabel}</div>
          </div>
        </a>
      `;
    }).join('') + `
      <a href="search.html?q=${encodeURIComponent(this.currentQuery)}" class="search-result-item" style="background:rgba(201,168,76,0.05); border-top:1px solid rgba(201,168,76,0.1);">
        <div class="search-result-icon" style="background:var(--green-gradient); color:var(--white);">
          <i class="fas fa-search"></i>
        </div>
        <div>
          <div class="search-result-title">${lang === 'ar' ? 'عرض كل النتائج' : 'View all results'}</div>
        </div>
      </a>
    `;

    container.classList.add('active');
  },

  bindEvents() {
    const mainInput = document.querySelector('#main-search-input');
    const mainDropdown = document.querySelector('#main-search-dropdown');

    if (mainInput) {
      const debouncedSearch = Utils.debounce((query) => {
        this.currentQuery = query;
        if (query.length >= 2) {
          const results = this.quickSearch(query);
          if (mainDropdown) this.renderDropdown(results, mainDropdown);
        } else {
          if (mainDropdown) mainDropdown.classList.remove('active');
        }
      }, 300);

      mainInput.addEventListener('input', (e) => debouncedSearch(e.target.value));

      mainInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const query = mainInput.value.trim();
          if (query) {
            if (mainDropdown) mainDropdown.classList.remove('active');
            this.currentQuery = query;
            const results = this.search(query);
            this.renderResults(results, query);
            const url = new URL(window.location);
            url.searchParams.set('q', query);
            window.history.pushState({}, '', url);
          }
        }
      });

      const searchBtn = document.querySelector('#main-search-btn');
      if (searchBtn) {
        searchBtn.addEventListener('click', () => {
          const query = mainInput.value.trim();
          if (query) {
            if (mainDropdown) mainDropdown.classList.remove('active');
            const results = this.search(query);
            this.renderResults(results, query);
          }
        });
      }

      document.addEventListener('click', (e) => {
        if (!mainInput.contains(e.target) && mainDropdown && !mainDropdown.contains(e.target)) {
          mainDropdown.classList.remove('active');
        }
      });
    }

    document.querySelectorAll('.hero-search-input').forEach(input => {
      const wrapper = input.closest('.search-bar-wrapper');
      const dropdown = wrapper?.querySelector('.search-results-dropdown');

      if (!input) return;

      const debouncedSearch = Utils.debounce((query) => {
        if (query.length >= 2) {
          const results = this.quickSearch(query);
          if (dropdown) this.renderDropdown(results, dropdown);
        } else {
          if (dropdown) dropdown.classList.remove('active');
        }
      }, 300);

      input.addEventListener('input', (e) => debouncedSearch(e.target.value));

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const query = input.value.trim();
          if (query) {
            window.location.href = `search.html?q=${encodeURIComponent(query)}`;
          }
        }
      });
    });
  },

  checkURLQuery() {
    const query = Utils.getParam('q');
    if (query) {
      const mainInput = document.querySelector('#main-search-input');
      if (mainInput) mainInput.value = query;
      this.currentQuery = query;
      const results = this.search(query);
      this.renderResults(results, query);
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  if (typeof WorkshatiData !== 'undefined') {
    SearchEngine.init();
  }
});

window.SearchEngine = SearchEngine;