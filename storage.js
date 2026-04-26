'use strict';

const Storage = {
  prefix: 'worshati_',

  set(key, value) {
    try {
      localStorage.setItem(this.prefix + key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.warn('Storage set failed:', e);
      return false;
    }
  },

  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(this.prefix + key);
      return item !== null ? JSON.parse(item) : defaultValue;
    } catch (e) {
      return defaultValue;
    }
  },

  remove(key) {
    localStorage.removeItem(this.prefix + key);
  },

  clear() {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(this.prefix)) {
        localStorage.removeItem(key);
      }
    });
  },

  setEmergencyPhone(phone) {
    this.set('emergency_phone', phone);
  },

  getEmergencyPhone() {
    return this.get('emergency_phone', '');
  },

  addRecentSearch(query) {
    if (!query || query.trim().length < 2) return;
    let recent = this.getRecentSearches();
    recent = recent.filter(q => q !== query);
    recent.unshift(query);
    recent = recent.slice(0, 10);
    this.set('recent_searches', recent);
  },

  getRecentSearches() {
    return this.get('recent_searches', []);
  },

  clearRecentSearches() {
    this.remove('recent_searches');
  },

  addFavorite(type, id) {
    let favorites = this.getFavorites();
    const key = `${type}_${id}`;
    if (!favorites.includes(key)) {
      favorites.push(key);
      this.set('favorites', favorites);
      return true;
    }
    return false;
  },

  removeFavorite(type, id) {
    let favorites = this.getFavorites();
    const key = `${type}_${id}`;
    favorites = favorites.filter(f => f !== key);
    this.set('favorites', favorites);
  },

  isFavorite(type, id) {
    const favorites = this.getFavorites();
    return favorites.includes(`${type}_${id}`);
  },

  getFavorites() {
    return this.get('favorites', []);
  },

  toggleFavorite(type, id) {
    if (this.isFavorite(type, id)) {
      this.removeFavorite(type, id);
      return false;
    } else {
      this.addFavorite(type, id);
      return true;
    }
  },

  addRecentlyViewed(type, id) {
    let recent = this.getRecentlyViewed();
    const key = `${type}_${id}`;
    recent = recent.filter(r => r !== key);
    recent.unshift(key);
    recent = recent.slice(0, 20);
    this.set('recently_viewed', recent);
  },

  getRecentlyViewed() {
    return this.get('recently_viewed', []);
  },

  setPreference(key, value) {
    let prefs = this.get('preferences', {});
    prefs[key] = value;
    this.set('preferences', prefs);
  },

  getPreference(key, defaultValue = null) {
    const prefs = this.get('preferences', {});
    return prefs[key] !== undefined ? prefs[key] : defaultValue;
  },

  setSelectedCarType(type) {
    this.set('selected_car_type', type);
  },

  getSelectedCarType() {
    return this.get('selected_car_type', null);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const page = window.location.pathname.split('/').pop();
  const params = new URLSearchParams(window.location.search);

  if (page === 'part-details.html' && params.get('id')) {
    Storage.addRecentlyViewed('part', params.get('id'));
  } else if (page === 'fault-details.html' && params.get('id')) {
    Storage.addRecentlyViewed('fault', params.get('id'));
  }

  if (page === 'search.html') {
    renderRecentSearches();
  }
});

function renderRecentSearches() {
  const container = document.querySelector('#recent-searches');
  if (!container) return;

  const recent = Storage.getRecentSearches();
  const lang = Lang.get();

  if (recent.length === 0) {
    container.innerHTML = '';
    return;
  }

  container.innerHTML = `
    <div style="margin-bottom:2rem;">
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:1rem;">
        <h3 style="font-size:1rem; font-weight:700; color:var(--text-primary);">
          <i class="fas fa-history" style="color:var(--gold); margin-left:0.5rem;"></i>
          ${lang === 'ar' ? 'عمليات البحث الأخيرة' : 'Recent Searches'}
        </h3>
        <button onclick="Storage.clearRecentSearches(); renderRecentSearches();" style="font-size:0.8rem; color:var(--text-muted); background:none; border:none; cursor:pointer; font-family:var(--font-arabic);">
          ${lang === 'ar' ? 'مسح الكل' : 'Clear All'}
        </button>
      </div>
      <div class="tags-cloud">
        ${recent.map(q => `
          <button class="tag" onclick="document.querySelector('#main-search-input').value='${q}'; SearchEngine.currentQuery='${q}'; SearchEngine.renderResults(SearchEngine.search('${q}'), '${q}');">
            <i class="fas fa-search" style="font-size:0.7rem; margin-left:0.3rem;"></i>
            ${q}
          </button>
        `).join('')}
      </div>
    </div>
  `;
}

window.Storage = Storage;
window.renderRecentSearches = renderRecentSearches;