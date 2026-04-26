'use strict';

const SystemRenderer = {
  data: null,

  init() {
    this.data = WorkshatiData;
    this.detectPage();
  },

  detectPage() {
    const page = window.location.pathname.split('/').pop() || 'index.html';

    switch (page) {
      case 'index.html':
      case '':
        this.renderHomeSystems();
        this.renderHomeFaults();
        this.renderHomeParts();
        break;
      case 'systems.html':
        this.renderSystemsPage();
        break;
      case 'parts.html':
        this.renderPartsPage();
        break;
      case 'faults.html':
        this.renderFaultsPage();
        break;
      case 'part-details.html':
        this.renderPartDetails();
        break;
      case 'fault-details.html':
        this.renderFaultDetails();
        break;
    }
  },

  renderHomeSystems() {
    const container = document.querySelector('#home-systems-grid');
    if (!container) return;

    const lang = Lang.get();
    const systems = this.data.systems.slice(0, 8);

    container.innerHTML = systems.map(system => `
      <a href="systems.html?system=${system.id}" class="system-card fade-in">
        <div class="system-card-image-wrapper">
          <img src="${system.image}" alt="${Lang.t(system.name)}" class="system-card-image" loading="lazy">
          <span class="system-card-badge">${Lang.t(system.badge)}</span>
        </div>
        <div class="system-card-body">
          <div class="system-card-icon">
            <i class="fas ${system.icon}"></i>
          </div>
          <h3 class="system-card-title">${Lang.t(system.name)}</h3>
          <p class="system-card-desc">${Lang.t(system.description)}</p>
          <div class="system-card-meta">
            <span><i class="fas fa-cog"></i> ${system.partsCount} ${lang === 'ar' ? 'قطعة' : 'parts'}</span>
            <span><i class="fas fa-triangle-exclamation"></i> ${system.faultsCount} ${lang === 'ar' ? 'عطل' : 'faults'}</span>
          </div>
        </div>
      </a>
    `).join('');

    ScrollAnimations.init();
  },

  renderHomeFaults() {
    const container = document.querySelector('#home-faults-grid');
    if (!container) return;

    const lang = Lang.get();
    const faults = this.data.faults.filter(f => f.severity === 'critical').slice(0, 6);

    container.innerHTML = faults.map(fault => {
      const system = this.data.systems.find(s => s.id === fault.systemId);
      return `
        <a href="fault-details.html?id=${fault.id}" class="fault-card fade-in">
          <div class="fault-card-header">
            <div class="fault-severity ${fault.severity}">
              <i class="fas ${fault.icon}"></i>
            </div>
            <div>
              <h3 class="fault-card-title">${Lang.t(fault.name)}</h3>
              <span class="fault-card-system">${system ? Lang.t(system.name) : ''}</span>
            </div>
          </div>
          <div class="fault-card-body">
            <p class="fault-card-desc">${Lang.t(fault.description)}</p>
            <div class="fault-symptoms">
              ${(fault.symptoms[lang] || fault.symptoms.ar || []).slice(0, 3).map(s =>
                `<span class="fault-symptom-tag">${s}</span>`
              ).join('')}
            </div>
          </div>
        </a>
      `;
    }).join('');

    ScrollAnimations.init();
  },

  renderHomeParts() {
    const container = document.querySelector('#home-parts-grid');
    if (!container) return;

    const lang = Lang.get();
    const parts = this.data.parts.slice(0, 8);

    container.innerHTML = parts.map(part => {
      const system = this.data.systems.find(s => s.id === part.systemId);
      return `
        <a href="part-details.html?id=${part.id}" class="part-card fade-in">
          <div class="part-card-image-wrapper">
            <img src="${part.image}" alt="${Lang.t(part.name)}" class="part-card-image" loading="lazy">
            <div class="part-card-overlay"></div>
          </div>
          <div class="part-card-body">
            <span class="part-card-system">${system ? Lang.t(system.name) : ''}</span>
            <h3 class="part-card-name">${Lang.t(part.name)}</h3>
            <p class="part-card-desc">${Lang.t(part.description)}</p>
            <div class="part-card-info">
              <span class="part-info-badge">
                <i class="fas fa-clock"></i>
                ${Lang.t(part.lifespan)}
              </span>
              <span class="part-info-badge">
                <i class="fas fa-tag"></i>
                ${Lang.t(part.replacementCost)}
              </span>
            </div>
          </div>
        </a>
      `;
    }).join('');

    ScrollAnimations.init();
  },

  renderSystemsPage() {
    const container = document.querySelector('#systems-grid');
    if (!container) return;

    const lang = Lang.get();
    const systemParam = Utils.getParam('system');

    container.innerHTML = this.data.systems.map(system => `
      <a href="systems.html?system=${system.id}" class="system-card fade-in" data-category="${system.id}">
        <div class="system-card-image-wrapper">
          <img src="${system.image}" alt="${Lang.t(system.name)}" class="system-card-image" loading="lazy">
          <span class="system-card-badge">${Lang.t(system.badge)}</span>
        </div>
        <div class="system-card-body">
          <div class="system-card-icon">
            <i class="fas ${system.icon}"></i>
          </div>
          <h3 class="system-card-title">${Lang.t(system.name)}</h3>
          <p class="system-card-desc">${Lang.t(system.description)}</p>
          <div class="system-card-meta">
            <span><i class="fas fa-cog"></i> ${system.partsCount} ${lang === 'ar' ? 'قطعة' : 'parts'}</span>
            <span><i class="fas fa-triangle-exclamation"></i> ${system.faultsCount} ${lang === 'ar' ? 'عطل' : 'faults'}</span>
          </div>
        </div>
      </a>
    `).join('');

    if (systemParam) {
      this.renderSystemDetail(systemParam);
    }

    ScrollAnimations.init();
  },

  renderSystemDetail(systemId) {
    const system = this.data.systems.find(s => s.id === systemId);
    const detailContainer = document.querySelector('#system-detail');
    if (!system || !detailContainer) return;

    const lang = Lang.get();
    const parts = this.data.parts.filter(p => p.systemId === systemId);
    const faults = this.data.faults.filter(f => f.systemId === systemId);

    detailContainer.style.display = 'block';
    detailContainer.innerHTML = `
      <div style="background:var(--white); border-radius:var(--radius-xl); overflow:hidden; box-shadow:var(--shadow-dark); margin-bottom:3rem;">
        <div style="position:relative; height:300px; overflow:hidden;">
          <img src="${system.image}" alt="${Lang.t(system.name)}" style="width:100%; height:100%; object-fit:cover;">
          <div style="position:absolute; inset:0; background:linear-gradient(to bottom, transparent 30%, rgba(76,175,80,0.35) 100%);"></div>
          <div style="position:absolute; bottom:2rem; right:2rem; left:2rem;">
            <h2 style="font-size:2rem; font-weight:900; color:var(--white); margin-bottom:0.5rem;">${Lang.t(system.name)}</h2>
            <p style="color:rgba(255,255,255,0.8);">${Lang.t(system.description)}</p>
          </div>
        </div>
        <div style="padding:2rem;">
          <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:1rem; margin-bottom:2rem;">
            <div style="text-align:center; padding:1.5rem; background:var(--white-soft); border-radius:var(--radius-md);">
              <span style="font-size:2rem; font-weight:900; color:var(--green);">${parts.length}</span>
              <p style="font-size:0.85rem; color:var(--text-muted);">${lang === 'ar' ? 'قطعة' : 'Parts'}</p>
            </div>
            <div style="text-align:center; padding:1.5rem; background:var(--white-soft); border-radius:var(--radius-md);">
              <span style="font-size:2rem; font-weight:900; color:var(--green);">${faults.length}</span>
              <p style="font-size:0.85rem; color:var(--text-muted);">${lang === 'ar' ? 'عطل شائع' : 'Common Faults'}</p>
            </div>
            <div style="text-align:center; padding:1.5rem; background:var(--white-soft); border-radius:var(--radius-md);">
              <span style="font-size:2rem; font-weight:900; color:var(--green);">
                <i class="fas ${system.icon}" style="font-size:1.5rem;"></i>
              </span>
              <p style="font-size:0.85rem; color:var(--text-muted);">${Lang.t(system.badge)}</p>
            </div>
          </div>

          <h3 style="font-size:1.2rem; font-weight:700; margin-bottom:1rem; color:var(--text-primary);">
            <i class="fas fa-cog" style="color:var(--gold);"></i>
            ${lang === 'ar' ? 'القطع الرئيسية' : 'Main Parts'}
          </h3>
          <div style="display:grid; grid-template-columns:repeat(auto-fill,minmax(200px,1fr)); gap:0.75rem; margin-bottom:2rem;">
            ${parts.map(part => `
              <a href="part-details.html?id=${part.id}" style="
                display:flex; align-items:center; gap:0.75rem;
                padding:0.875rem 1rem; background:var(--white-soft);
                border-radius:var(--radius-md); border:1px solid rgba(76,175,80,0.03);
                text-decoration:none; color:inherit; transition:var(--transition);
              " onmouseover="this.style.borderColor='rgba(76,175,80,0.3)'"
                 onmouseout="this.style.borderColor='rgba(76,175,80,0.03)'">
                <div style="width:36px; height:36px; background:var(--green-gradient); border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:0.9rem; color:var(--white); flex-shrink:0;">
                  <i class="fas ${part.icon || 'fa-cog'}"></i>
                </div>
                <span style="font-size:0.875rem; font-weight:600; color:var(--text-primary);">${Lang.t(part.name)}</span>
              </a>
            `).join('')}
          </div>

          <h3 style="font-size:1.2rem; font-weight:700; margin-bottom:1rem; color:var(--text-primary);">
            <i class="fas fa-triangle-exclamation" style="color:var(--danger);"></i>
            ${lang === 'ar' ? 'الأعطال الشائعة' : 'Common Faults'}
          </h3>
          <div style="display:flex; flex-direction:column; gap:0.75rem;">
            ${faults.map(fault => `
              <a href="fault-details.html?id=${fault.id}" style="
                display:flex; align-items:center; gap:1rem;
                padding:1rem 1.25rem; background:var(--white-soft);
                border-radius:var(--radius-md); border:1px solid rgba(76,175,80,0.03);
                text-decoration:none; color:inherit; transition:var(--transition);
              " onmouseover="this.style.borderColor='rgba(76,175,80,0.3)'"
                 onmouseout="this.style.borderColor='rgba(76,175,80,0.03)'">
                <div style="width:40px; height:40px; background:${fault.severity === 'critical' ? 'rgba(214,64,69,0.1)' : 'rgba(244,162,97,0.1)'}; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:1rem; color:${fault.severity === 'critical' ? 'var(--danger)' : 'var(--warning)'}; flex-shrink:0;">
                  <i class="fas ${fault.icon}"></i>
                </div>
                <div>
                  <div style="font-size:0.9rem; font-weight:700; color:var(--text-primary); margin-bottom:0.2rem;">${Lang.t(fault.name)}</div>
                  <div style="font-size:0.8rem; color:var(--text-muted);">${Lang.t(fault.description).substring(0, 80)}...</div>
                </div>
                <span class="badge badge-${fault.severity === 'critical' ? 'danger' : 'warning'}" style="margin-right:auto;">
                  ${fault.severity === 'critical' ? (lang === 'ar' ? 'حرج' : 'Critical') : (lang === 'ar' ? 'تحذير' : 'Warning')}
                </span>
              </a>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  },

  renderPartsPage() {
    const container = document.querySelector('#parts-grid');
    if (!container) return;

    const lang = Lang.get();
    const systemFilter = Utils.getParam('system');
    const parts = systemFilter
      ? this.data.parts.filter(p => p.systemId === systemFilter)
      : this.data.parts;

    container.innerHTML = parts.map(part => {
      const system = this.data.systems.find(s => s.id === part.systemId);
      return `
        <a href="part-details.html?id=${part.id}" class="part-card fade-in" data-category="${part.systemId}">
          <div class="part-card-image-wrapper">
            <img src="${part.image}" alt="${Lang.t(part.name)}" class="part-card-image" loading="lazy">
            <div class="part-card-overlay"></div>
          </div>
          <div class="part-card-body">
            <span class="part-card-system">${system ? Lang.t(system.name) : ''}</span>
            <h3 class="part-card-name">${Lang.t(part.name)}</h3>
            <p class="part-card-desc">${Lang.t(part.description)}</p>
            <div class="part-card-info">
              <span class="part-info-badge">
                <i class="fas fa-clock"></i>
                ${Lang.t(part.lifespan)}
              </span>
              <span class="part-info-badge">
                <i class="fas fa-tag"></i>
                ${Lang.t(part.replacementCost)}
              </span>
            </div>
          </div>
        </a>
      `;
    }).join('');

    this.renderSystemFilterTabs('#parts-filter-tabs', 'parts-grid');
    ScrollAnimations.init();
  },

  renderFaultsPage() {
    const container = document.querySelector('#faults-grid');
    if (!container) return;

    const lang = Lang.get();
    const systemFilter = Utils.getParam('system');
    const severityFilter = Utils.getParam('severity');

    let faults = this.data.faults;
    if (systemFilter) faults = faults.filter(f => f.systemId === systemFilter);
    if (severityFilter) faults = faults.filter(f => f.severity === severityFilter);

    container.innerHTML = faults.map(fault => {
      const system = this.data.systems.find(s => s.id === fault.systemId);
      return `
        <a href="fault-details.html?id=${fault.id}" class="fault-card fade-in" data-category="${fault.systemId}">
          <div class="fault-card-header">
            <div class="fault-severity ${fault.severity}">
              <i class="fas ${fault.icon}"></i>
            </div>
            <div>
              <h3 class="fault-card-title">${Lang.t(fault.name)}</h3>
              <span class="fault-card-system">${system ? Lang.t(system.name) : ''}</span>
            </div>
            <span class="badge badge-${fault.severity === 'critical' ? 'danger' : fault.severity === 'warning' ? 'warning' : 'gold'}" style="margin-right:auto;">
              ${fault.severity === 'critical' ? (lang === 'ar' ? 'حرج' : 'Critical') :
                fault.severity === 'warning' ? (lang === 'ar' ? 'تحذير' : 'Warning') :
                (lang === 'ar' ? 'معلومة' : 'Info')}
            </span>
          </div>
          <div class="fault-card-body">
            <p class="fault-card-desc">${Lang.t(fault.description)}</p>
            <div class="fault-symptoms">
              ${(fault.symptoms[lang] || fault.symptoms.ar || []).slice(0, 3).map(s =>
                `<span class="fault-symptom-tag">${s}</span>`
              ).join('')}
            </div>
          </div>
        </a>
      `;
    }).join('');

    this.renderSystemFilterTabs('#faults-filter-tabs', 'faults-grid');
    ScrollAnimations.init();
  },

  renderPartDetails() {
    const partId = Utils.getParam('id');
    if (!partId) return;

    const part = this.data.parts.find(p => p.id === partId);
    if (!part) {
      document.querySelector('.detail-main').innerHTML = `
        <div style="text-align:center; padding:4rem;">
          <i class="fas fa-exclamation-circle" style="font-size:3rem; color:var(--danger); margin-bottom:1rem; display:block;"></i>
          <h2>القطعة غير موجودة</h2>
        </div>
      `;
      return;
    }

    const lang = Lang.get();
    const system = this.data.systems.find(s => s.id === part.systemId);
    const relatedFaults = this.data.faults.filter(f =>
      f.relatedParts && f.relatedParts.includes(part.id)
    );

    document.title = `${Lang.t(part.name)} | ورشتي`;

    const breadcrumb = document.querySelector('#part-breadcrumb');
    if (breadcrumb) {
      breadcrumb.innerHTML = `
        <a href="index.html">${lang === 'ar' ? 'الرئيسية' : 'Home'}</a>
        <span class="breadcrumb-sep"><i class="fas fa-chevron-${lang === 'ar' ? 'left' : 'right'}"></i></span>
        <a href="parts.html">${lang === 'ar' ? 'القطع' : 'Parts'}</a>
        <span class="breadcrumb-sep"><i class="fas fa-chevron-${lang === 'ar' ? 'left' : 'right'}"></i></span>
        <span>${Lang.t(part.name)}</span>
      `;
    }

    const mainEl = document.querySelector('#part-main');
    if (mainEl) {
      mainEl.innerHTML = `
        <img src="${part.image}" alt="${Lang.t(part.name)}" class="detail-image-main">
        <h1 class="detail-title">${Lang.t(part.name)}</h1>
        <p class="detail-subtitle">${system ? Lang.t(system.name) : ''}</p>
        <p class="detail-description">${Lang.t(part.description)}</p>

        <h3 class="detail-section-title"><i class="fas fa-bullseye"></i> ${lang === 'ar' ? 'وظيفة القطعة' : 'Part Function'}</h3>
        <p style="font-size:0.95rem; color:var(--text-secondary); line-height:1.9; margin-bottom:2rem; padding:1.25rem; background:rgba(201,168,76,0.05); border-radius:var(--radius-md); border-right:3px solid var(--gold);">
          ${Lang.t(part.function)}
        </p>

        <div class="detail-info-grid">
          <div class="detail-info-item">
            <div class="detail-info-label">${lang === 'ar' ? 'العمر الافتراضي' : 'Lifespan'}</div>
            <div class="detail-info-value gold"><i class="fas fa-clock" style="margin-left:0.4rem;"></i>${Lang.t(part.lifespan)}</div>
          </div>
          <div class="detail-info-item">
            <div class="detail-info-label">${lang === 'ar' ? 'تكلفة الاستبدال' : 'Replacement Cost'}</div>
            <div class="detail-info-value gold"><i class="fas fa-tag" style="margin-left:0.4rem;"></i>${Lang.t(part.replacementCost)}</div>
          </div>
          <div class="detail-info-item">
            <div class="detail-info-label">${lang === 'ar' ? 'صعوبة الاستبدال' : 'Replacement Difficulty'}</div>
            <div class="detail-info-value">${Lang.t(part.difficulty)}</div>
          </div>
          <div class="detail-info-item">
            <div class="detail-info-label">${lang === 'ar' ? 'النظام' : 'System'}</div>
            <div class="detail-info-value">${system ? Lang.t(system.name) : '-'}</div>
          </div>
        </div>

        <h3 class="detail-section-title"><i class="fas fa-lightbulb"></i> ${lang === 'ar' ? 'نصيحة الصيانة' : 'Maintenance Tip'}</h3>
        <div style="padding:1.25rem; background:rgba(45,106,79,0.05); border-radius:var(--radius-md); border-right:3px solid var(--success); margin-bottom:2rem;">
          <p style="font-size:0.95rem; color:var(--text-secondary); line-height:1.8;">${Lang.t(part.maintenanceTip)}</p>
        </div>

        ${relatedFaults.length > 0 ? `
          <h3 class="detail-section-title"><i class="fas fa-triangle-exclamation"></i> ${lang === 'ar' ? 'الأعطال المرتبطة' : 'Related Faults'}</h3>
          <div style="display:flex; flex-direction:column; gap:0.75rem;">
            ${relatedFaults.map(fault => `
              <a href="fault-details.html?id=${fault.id}" style="
                display:flex; align-items:center; gap:1rem;
                padding:1rem 1.25rem; background:var(--white-soft);
                border-radius:var(--radius-md); border:1px solid rgba(76,175,80,0.03);
                text-decoration:none; color:inherit; transition:var(--transition);
              " onmouseover="this.style.borderColor='rgba(214,64,69,0.2)'"
                 onmouseout="this.style.borderColor='rgba(76,175,80,0.03)'">
                <div class="fault-severity ${fault.severity}" style="flex-shrink:0;">
                  <i class="fas ${fault.icon}"></i>
                </div>
                <div>
                  <div style="font-size:0.9rem; font-weight:700;">${Lang.t(fault.name)}</div>
                  <div style="font-size:0.8rem; color:var(--text-muted);">${Lang.t(fault.description).substring(0, 70)}...</div>
                </div>
              </a>
            `).join('')}
          </div>
        ` : ''}
      `;
    }

    const sidebarEl = document.querySelector('#part-sidebar');
    if (sidebarEl) {
      const relatedParts = this.data.parts
        .filter(p => p.systemId === part.systemId && p.id !== part.id)
        .slice(0, 5);

      sidebarEl.innerHTML = `
        <div class="sidebar-card">
          <h3 class="sidebar-card-title"><i class="fas fa-info-circle"></i> ${lang === 'ar' ? 'ملخص سريع' : 'Quick Summary'}</h3>
          <div style="display:flex; flex-direction:column; gap:0.75rem;">
            <div style="display:flex; justify-content:space-between; align-items:center; padding:0.75rem; background:var(--white-soft); border-radius:var(--radius-sm);">
              <span style="font-size:0.85rem; color:var(--text-muted);">${lang === 'ar' ? 'العمر الافتراضي' : 'Lifespan'}</span>
              <span style="font-size:0.85rem; font-weight:700; color:var(--gold-dark);">${Lang.t(part.lifespan)}</span>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; padding:0.75rem; background:var(--white-soft); border-radius:var(--radius-sm);">
              <span style="font-size:0.85rem; color:var(--text-muted);">${lang === 'ar' ? 'التكلفة' : 'Cost'}</span>
              <span style="font-size:0.85rem; font-weight:700; color:var(--gold-dark);">${Lang.t(part.replacementCost)}</span>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; padding:0.75rem; background:var(--white-soft); border-radius:var(--radius-sm);">
              <span style="font-size:0.85rem; color:var(--text-muted);">${lang === 'ar' ? 'الصعوبة' : 'Difficulty'}</span>
              <span style="font-size:0.85rem; font-weight:700;">${Lang.t(part.difficulty)}</span>
            </div>
          </div>
        </div>

        ${relatedParts.length > 0 ? `
          <div class="sidebar-card">
            <h3 class="sidebar-card-title"><i class="fas fa-cogs"></i> ${lang === 'ar' ? 'قطع مشابهة' : 'Related Parts'}</h3>
            <div style="display:flex; flex-direction:column; gap:0.5rem;">
              ${relatedParts.map(rp => `
                <a href="part-details.html?id=${rp.id}" style="
                  display:flex; align-items:center; gap:0.75rem;
                  padding:0.75rem; background:var(--white-soft);
                  border-radius:var(--radius-sm); text-decoration:none; color:inherit;
                  transition:var(--transition);
                " onmouseover="this.style.background='rgba(201,168,76,0.08)'"
                   onmouseout="this.style.background='var(--white-soft)'">
                  <img src="${rp.image}" alt="${Lang.t(rp.name)}" style="width:40px; height:40px; object-fit:cover; border-radius:6px; flex-shrink:0;">
                  <span style="font-size:0.85rem; font-weight:600; color:var(--text-primary);">${Lang.t(rp.name)}</span>
                </a>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <div class="sidebar-card" style="background:linear-gradient(135deg,#0A0A0A,#1A1510); color:var(--white);">
          <h3 class="sidebar-card-title" style="color:var(--white);"><i class="fas fa-phone-alt"></i> ${lang === 'ar' ? 'تحتاج مساعدة؟' : 'Need Help?'}</h3>
          <p style="font-size:0.85rem; color:rgba(255,255,255,0.6); margin-bottom:1rem; line-height:1.7;">
            ${lang === 'ar' ? 'إذا كنت تواجه مشكلة في هذه القطعة، يمكنك الاستعانة بأقرب ورشة.' : 'If you have a problem with this part, you can get help from the nearest workshop.'}
          </p>
          <a href="emergency.html" class="btn btn-primary btn-sm" style="width:100%; justify-content:center;">
            <i class="fas fa-location-dot"></i>
            ${lang === 'ar' ? 'أقرب ورشة' : 'Nearest Workshop'}
          </a>
        </div>
      `;
    }
  },

  renderFaultDetails() {
    const faultId = Utils.getParam('id');
    if (!faultId) return;

    const fault = this.data.faults.find(f => f.id === faultId);
    if (!fault) return;

    const lang = Lang.get();
    const system = this.data.systems.find(s => s.id === fault.systemId);
    const relatedParts = fault.relatedParts
      ? this.data.parts.filter(p => fault.relatedParts.includes(p.id))
      : [];

    document.title = `${Lang.t(fault.name)} | ورشتي`;

    const breadcrumb = document.querySelector('#fault-breadcrumb');
    if (breadcrumb) {
      breadcrumb.innerHTML = `
        <a href="index.html">${lang === 'ar' ? 'الرئيسية' : 'Home'}</a>
        <span class="breadcrumb-sep"><i class="fas fa-chevron-${lang === 'ar' ? 'left' : 'right'}"></i></span>
        <a href="faults.html">${lang === 'ar' ? 'الأعطال' : 'Faults'}</a>
        <span class="breadcrumb-sep"><i class="fas fa-chevron-${lang === 'ar' ? 'left' : 'right'}"></i></span>
        <span>${Lang.t(fault.name)}</span>
      `;
    }

    const mainEl = document.querySelector('#fault-main');
    if (mainEl) {
      const severityColor = fault.severity === 'critical' ? 'var(--danger)' : fault.severity === 'warning' ? 'var(--warning)' : 'var(--info)';
      const severityLabel = fault.severity === 'critical' ? (lang === 'ar' ? 'حرج - توقف فوراً' : 'Critical - Stop Immediately') :
                            fault.severity === 'warning' ? (lang === 'ar' ? 'تحذير - راجع الورشة' : 'Warning - Visit Workshop') :
                            (lang === 'ar' ? 'معلومة' : 'Info');

      mainEl.innerHTML = `
        <div style="padding:1.25rem; background:${fault.severity === 'critical' ? 'rgba(214,64,69,0.08)' : 'rgba(244,162,97,0.08)'}; border-radius:var(--radius-md); border-right:4px solid ${severityColor}; margin-bottom:2rem; display:flex; align-items:center; gap:1rem;">
          <i class="fas ${fault.icon}" style="font-size:1.5rem; color:${severityColor};"></i>
          <div>
            <div style="font-size:0.85rem; font-weight:700; color:${severityColor};">${severityLabel}</div>
            <div style="font-size:0.8rem; color:var(--text-muted);">${system ? Lang.t(system.name) : ''}</div>
          </div>
        </div>

        <h1 class="detail-title">${Lang.t(fault.name)}</h1>
        <p class="detail-description">${Lang.t(fault.description)}</p>

        <h3 class="detail-section-title"><i class="fas fa-list-check"></i> ${lang === 'ar' ? 'الأعراض' : 'Symptoms'}</h3>
        <ul style="display:flex; flex-direction:column; gap:0.5rem; margin-bottom:2rem; padding:0;">
          ${(fault.symptoms[lang] || fault.symptoms.ar || []).map(s => `
            <li style="display:flex; align-items:center; gap:0.75rem; padding:0.75rem 1rem; background:var(--white-soft); border-radius:var(--radius-sm);">
              <i class="fas fa-circle-dot" style="color:${severityColor}; font-size:0.7rem; flex-shrink:0;"></i>
              <span style="font-size:0.9rem; color:var(--text-secondary);">${s}</span>
            </li>
          `).join('')}
        </ul>

        <h3 class="detail-section-title"><i class="fas fa-magnifying-glass"></i> ${lang === 'ar' ? 'الأسباب المحتملة' : 'Possible Causes'}</h3>
        <ul style="display:flex; flex-direction:column; gap:0.5rem; margin-bottom:2rem; padding:0;">
          ${(fault.causes[lang] || fault.causes.ar || []).map(c => `
            <li style="display:flex; align-items:center; gap:0.75rem; padding:0.75rem 1rem; background:var(--white-soft); border-radius:var(--radius-sm);">
              <i class="fas fa-circle-question" style="color:var(--gold); font-size:0.7rem; flex-shrink:0;"></i>
              <span style="font-size:0.9rem; color:var(--text-secondary);">${c}</span>
            </li>
          `).join('')}
        </ul>

        <h3 class="detail-section-title"><i class="fas fa-wrench"></i> ${lang === 'ar' ? 'الحلول المقترحة' : 'Suggested Solutions'}</h3>
        <ol style="display:flex; flex-direction:column; gap:0.5rem; margin-bottom:2rem; padding:0; counter-reset:solution-counter;">
          ${(fault.solutions[lang] || fault.solutions.ar || []).map((sol, i) => `
            <li style="display:flex; align-items:flex-start; gap:0.75rem; padding:0.875rem 1rem; background:rgba(45,106,79,0.05); border-radius:var(--radius-sm); border-right:3px solid var(--success);">
              <span style="width:24px; height:24px; background:var(--green-gradient); border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:0.75rem; font-weight:700; color:var(--white); flex-shrink:0;">${i + 1}</span>
              <span style="font-size:0.9rem; color:var(--text-secondary); line-height:1.6;">${sol}</span>
            </li>
          `).join('')}
        </ol>

        <div class="detail-info-grid">
          <div class="detail-info-item">
            <div class="detail-info-label">${lang === 'ar' ? 'التكلفة التقديرية' : 'Estimated Cost'}</div>
            <div class="detail-info-value gold">${Lang.t(fault.estimatedCost)}</div>
          </div>
          <div class="detail-info-item">
            <div class="detail-info-label">${lang === 'ar' ? 'مستوى الخطورة' : 'Severity Level'}</div>
            <div class="detail-info-value" style="color:${severityColor};">${severityLabel}</div>
          </div>
        </div>

        ${relatedParts.length > 0 ? `
          <h3 class="detail-section-title"><i class="fas fa-cog"></i> ${lang === 'ar' ? 'القطع المرتبطة' : 'Related Parts'}</h3>
          <div style="display:grid; grid-template-columns:repeat(auto-fill,minmax(200px,1fr)); gap:0.75rem;">
            ${relatedParts.map(rp => `
              <a href="part-details.html?id=${rp.id}" style="
                display:flex; align-items:center; gap:0.75rem;
                padding:0.875rem 1rem; background:var(--white-soft);
                border-radius:var(--radius-md); border:1px solid rgba(76,175,80,0.03);
                text-decoration:none; color:inherit; transition:var(--transition);
              " onmouseover="this.style.borderColor='rgba(76,175,80,0.3)'"
                 onmouseout="this.style.borderColor='rgba(76,175,80,0.03)'">
                <img src="${rp.image}" alt="${Lang.t(rp.name)}" style="width:40px; height:40px; object-fit:cover; border-radius:6px; flex-shrink:0;">
                <span style="font-size:0.875rem; font-weight:600;">${Lang.t(rp.name)}</span>
              </a>
            `).join('')}
          </div>
        ` : ''}
      `;
    }

    const sidebarEl = document.querySelector('#fault-sidebar');
    if (sidebarEl) {
      sidebarEl.innerHTML = `
        <div class="sidebar-card" style="border:2px solid ${fault.severity === 'critical' ? 'rgba(214,64,69,0.3)' : 'rgba(244,162,97,0.3)'};">
          <h3 class="sidebar-card-title" style="color:${severityColor};"><i class="fas fa-triangle-exclamation"></i> ${lang === 'ar' ? 'مستوى الخطورة' : 'Severity Level'}</h3>
          <div style="text-align:center; padding:1rem 0;">
            <i class="fas ${fault.icon}" style="font-size:3rem; color:${severityColor}; margin-bottom:0.75rem; display:block;"></i>
            <span style="font-size:1rem; font-weight:700; color:${severityColor};">${severityLabel}</span>
          </div>
          <div style="padding:0.75rem; background:${fault.severity === 'critical' ? 'rgba(214,64,69,0.08)' : 'rgba(244,162,97,0.08)'}; border-radius:var(--radius-sm); margin-top:0.75rem;">
            <p style="font-size:0.8rem; color:var(--text-secondary); line-height:1.7; margin:0;">
              ${fault.severity === 'critical'
                ? (lang === 'ar' ? 'هذا العطل خطير جداً. أوقف السيارة فوراً وتصل بالسحب.' : 'This fault is very dangerous. Stop the car immediately and call towing.')
                : (lang === 'ar' ? 'هذا العطل يحتاج إصلاحاً قريباً. توجه للورشة في أقرب وقت.' : 'This fault needs repair soon. Go to the workshop as soon as possible.')}
            </p>
          </div>
        </div>

        <div class="sidebar-card">
          <h3 class="sidebar-card-title"><i class="fas fa-tag"></i> ${lang === 'ar' ? 'التكلفة التقديرية' : 'Estimated Cost'}</h3>
          <div style="text-align:center; padding:1rem 0;">
            <span style="font-size:1.5rem; font-weight:900; color:var(--green);">
              ${Lang.t(fault.estimatedCost)}
            </span>
          </div>
          <p style="font-size:0.8rem; color:var(--text-muted); text-align:center;">
            ${lang === 'ar' ? '* التكلفة تقديرية وقد تختلف حسب الموقع والورشة' : '* Cost is estimated and may vary by location and workshop'}
          </p>
        </div>

        <div class="sidebar-card" style="background:linear-gradient(135deg,#0A0A0A,#1A1510); color:var(--white);">
          <h3 class="sidebar-card-title" style="color:var(--white);"><i class="fas fa-phone-alt"></i> ${lang === 'ar' ? 'طوارئ السيارة' : 'Car Emergency'}</h3>
          <p style="font-size:0.85rem; color:rgba(255,255,255,0.6); margin-bottom:1rem; line-height:1.7;">
            ${lang === 'ar' ? 'هل تواجه هذا العطل الآن؟ احصل على مساعدة فورية.' : 'Experiencing this fault now? Get immediate help.'}
          </p>
          <a href="emergency.html" class="btn btn-danger btn-sm" style="width:100%; justify-content:center;">
            <i class="fas fa-phone-alt"></i>
            ${lang === 'ar' ? 'طوارئ الآن' : 'Emergency Now'}
          </a>
        </div>
      `;
    }
  },

  renderSystemFilterTabs(tabsSelector, gridId) {
    const container = document.querySelector(tabsSelector);
    if (!container) return;

    const lang = Lang.get();
    const allLabel = lang === 'ar' ? 'الكل' : 'All';

    container.innerHTML = `
      <button class="filter-tab active" data-filter="all" data-target="#${gridId}">${allLabel}</button>
      ${this.data.systems.map(s => `
        <button class="filter-tab" data-filter="${s.id}" data-target="#${gridId}">
          <i class="fas ${s.icon}" style="margin-left:0.3rem;"></i>
          ${Lang.t(s.name)}
        </button>
      `).join('')}
    `;

    FilterTabs.init();
  }
};

document.addEventListener('DOMContentLoaded', () => {
  if (typeof WorkshatiData !== 'undefined') {
    SystemRenderer.init();
  }
});

window.SystemRenderer = SystemRenderer;