/**
 * FONTX — Main Application Controller
 * High-performance batch rendering, favorites manager & symbol vault handler
 */

document.addEventListener('DOMContentLoaded', () => {

  const BATCH_SIZE = 24;
  let currentResults = [];
  let renderedCount = 0;
  let favorites = JSON.parse(localStorage.getItem('FONTX_FAVS') || '[]');

  const introOverlay = document.getElementById('intro-overlay');
  const textInput = document.getElementById('text-input');
  const charCounter = document.getElementById('char-counter');
  const btnSearch = document.getElementById('btn-search');
  const btnReset = document.getElementById('btn-reset');
  const btnRandom = document.getElementById('btn-random');
  const resultsGrid = document.getElementById('results-grid');
  const resultsCount = document.getElementById('results-count');
  const btnLoadMore = document.getElementById('btn-loadmore');
  const loadMoreWrap = document.getElementById('loadmore-wrap');
  const symbolGrid = document.getElementById('symbol-grid');
  const toastNotice = document.getElementById('toast-notice');

  setTimeout(() => {
    if (introOverlay) {
      introOverlay.style.opacity = '0';
      introOverlay.style.visibility = 'hidden';
    }
  }, 1500);

  const SYMBOL_CATEGORIES = {
    ALL: [
      '✦','✧','★','☆','亗','乂','メ','么','彡','〆','♡','♥','⚡','☠','⚔','☯',
      '→','←','↑','↓','↗','↘','❖','◆','◇','❀','✿','♛','♔','👑','🔥','💎','🎯',
      '☣','☢','⚠','♾','⚓','⚙','🧿','🔮','🔱','𓆩','𓆪','𓄂','ᯓ','༒','𖤍','⧉'
    ],
    GAMING: ['亗','乂','メ','么','彡','〆','☠','⚔','♛','♔','👑','🎯','☣','☢','🔱','𓆩','𓆪','𓄂','༒','𖤍'],
    AESTHETIC: ['✦','✧','❀','✿','♡','♥','☾','☽','✨','💎','🧿','🔮','𓍢','𓍲','ᯓ','⧉','◦','▫','◊'],
    ARROWS: ['→','←','↑','↓','↗','↘','➔','➻','➽','➸','⫷','⫸','❮','❯','❰','❱'],
    HEARTS: ['♡','♥','❥','❦','❧','𓆩♥𓆪','💕','💖','🖤','🤍'],
    STARS: ['✦','✧','★','☆','✵','✶','✷','✸','✹','❖','◆','◇','◈','◉']
  };

  textInput.addEventListener('input', () => {
    const len = textInput.value.length;
    charCounter.textContent = `${len}/120`;
    if (len > 0) btnSearch.disabled = false;
  });

  textInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch();
  });

  function handleSearch() {
    const query = textInput.value.trim();
    if (!query) {
      textInput.focus();
      showToast("PLEASE ENTER SOME TEXT FIRST");
      return;
    }

    currentResults = FONTX_ENGINE.generate(query);
    renderedCount = 0;
    resultsGrid.innerHTML = '';

    if (currentResults.length > 0) {
      resultsCount.textContent = `${currentResults.length} RESULTS`;
      btnRandom.disabled = false;
      renderNextBatch();
    } else {
      resultsCount.textContent = '0 RESULTS';
      loadMoreWrap.style.display = 'none';
      btnRandom.disabled = true;
    }
  }

  btnSearch.addEventListener('click', handleSearch);

  function renderNextBatch() {
    const nextBatch = currentResults.slice(renderedCount, renderedCount + BATCH_SIZE);
    const fragment = document.createDocumentFragment();

    nextBatch.forEach(item => {
      const card = document.createElement('div');
      card.className = 'style-card';
      const isFav = favorites.some(f => f.text === item.text);

      card.innerHTML = `
        <div class="card-left">
          <div class="card-meta">
            <span>STYLE ${String(item.id).padStart(3, '0')}</span>
            <span>/</span>
            <span>${item.tag}</span>
          </div>
          <div class="card-text selectable-text">${escapeHtml(item.text)}</div>
        </div>
        <div class="card-actions">
          <button class="btn-fav ${isFav ? 'active' : ''}" data-text="${escapeHtml(item.text)}" title="Favorite">★</button>
          <button class="btn-copy" data-text="${escapeHtml(item.text)}">COPY</button>
        </div>
      `;
      fragment.appendChild(card);
    });

    resultsGrid.appendChild(fragment);
    renderedCount += nextBatch.length;

    if (renderedCount < currentResults.length) {
      loadMoreWrap.style.display = 'block';
    } else {
      loadMoreWrap.style.display = 'none';
    }
  }

  btnLoadMore.addEventListener('click', renderNextBatch);

  btnReset.addEventListener('click', () => {
    textInput.value = '';
    charCounter.textContent = '0/120';
    resultsGrid.innerHTML = '';
    resultsCount.textContent = '0 RESULTS';
    loadMoreWrap.style.display = 'none';
    btnRandom.disabled = true;
    currentResults = [];
    renderedCount = 0;
    textInput.focus();
  });

  btnRandom.addEventListener('click', () => {
    if (currentResults.length === 0) return;
    for (let i = currentResults.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [currentResults[i], currentResults[j]] = [currentResults[j], currentResults[i]];
    }
    renderedCount = 0;
    resultsGrid.innerHTML = '';
    renderNextBatch();
    showToast("STYLES SHUFFLED");
  });

  resultsGrid.addEventListener('click', (e) => {
    const copyBtn = e.target.closest('.btn-copy');
    if (copyBtn) {
      copyToClipboard(copyBtn.getAttribute('data-text'), copyBtn);
      return;
    }
    const favBtn = e.target.closest('.btn-fav');
    if (favBtn) {
      toggleFavorite(favBtn.getAttribute('data-text'), favBtn);
    }
  });

  function copyToClipboard(text, buttonEl) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => triggerCopyFeedback(buttonEl)).catch(() => fallbackCopy(text, buttonEl));
    } else {
      fallbackCopy(text, buttonEl);
    }
  }

  function fallbackCopy(text, buttonEl) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    try {
      document.execCommand('copy');
      triggerCopyFeedback(buttonEl);
    } catch (err) {
      showToast("FAILED TO COPY");
    }
    document.body.removeChild(textarea);
  }

  function triggerCopyFeedback(buttonEl) {
    if (buttonEl) {
      const originalText = buttonEl.textContent;
      buttonEl.textContent = '✓ COPIED';
      buttonEl.classList.add('copied');
      setTimeout(() => {
        buttonEl.textContent = originalText;
        buttonEl.classList.remove('copied');
      }, 1200);
    }
    showToast("COPIED TO CLIPBOARD");
  }

  function toggleFavorite(text, buttonEl) {
    const index = favorites.findIndex(f => f.text === text);
    if (index > -1) {
      favorites.splice(index, 1);
      buttonEl.classList.remove('active');
      showToast("REMOVED FROM FAVOURITES");
    } else {
      favorites.push({ text: text, date: Date.now() });
      buttonEl.classList.add('active');
      showToast("ADDED TO FAVOURITES");
    }
    localStorage.setItem('FONTX_FAVS', JSON.stringify(favorites));
  }

  function renderSymbols(category = 'ALL') {
    symbolGrid.innerHTML = '';
    const symbols = SYMBOL_CATEGORIES[category] || SYMBOL_CATEGORIES['ALL'];

    const fragment = document.createDocumentFragment();
    symbols.forEach(sym => {
      const card = document.createElement('div');
      card.className = 'symbol-card';
      card.textContent = sym;
      card.addEventListener('click', () => copyToClipboard(sym, null));
      fragment.appendChild(card);
    });

    symbolGrid.appendChild(fragment);
  }

  const tabButtons = document.querySelectorAll('.tab-btn');
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderSymbols(btn.getAttribute('data-cat'));
    });
  });

  renderSymbols('ALL');

  let toastTimer;
  function showToast(message) {
    toastNotice.textContent = message;
    toastNotice.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastNotice.classList.remove('show'), 2000);
  }

  function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }

});
    
