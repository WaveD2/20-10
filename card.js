(() => {
  'use strict';

  const STORAGE_KEY = 'flower.greeting.20-10.v1';
  const defaultGreeting = {
    recipient: 'bạn',
    message: 'Nhân ngày Phụ nữ Việt Nam 20/10, chúc bạn luôn khỏe mạnh, bình an và có thật nhiều niềm vui.\n\nMong bạn được yêu thương từ những điều nhỏ nhất, có thời gian cho bản thân và tự tin theo đuổi những điều mình mong muốn.\n\nHôm nay và cả những ngày sau, hãy luôn mỉm cười theo cách của riêng bạn nhé.',
    sender: 'Một người quý mến bạn'
  };
  const dialog = document.getElementById('greetingCard');
  const openButton = document.getElementById('openCard');
  const reading = document.getElementById('cardReading');
  const closeButton = document.getElementById('closeCard');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const desktopLayout = window.matchMedia('(min-width: 1100px)');
  const sceneElements = [...document.querySelectorAll('.bouquet-composition, .scene-footer')];
  const layoutAnimations = new Set();

  function reflowScene(changeLayout) {
    layoutAnimations.forEach(animation => animation.cancel());
    layoutAnimations.clear();
    const before = sceneElements.map(element => {
      const rect = element.getBoundingClientRect();
      return { left: rect.left + window.scrollX, top: rect.top + window.scrollY, width: rect.width, height: rect.height };
    });
    changeLayout();
    if (motion.matches) return;
    sceneElements.forEach((element, index) => {
      const after = element.getBoundingClientRect();
      if (!after.width || !after.height) return;
      const dx = before[index].left - after.left - window.scrollX;
      const dy = before[index].top - after.top - window.scrollY;
      const scale = element.matches('.bouquet-composition')
        ? ` scale(${before[index].width / after.width}, ${before[index].height / after.height})` : '';
      const animation = element.animate([
        { transform: `translate(${dx}px, ${dy}px)${scale}` },
        { transform: 'none' }
      ], { duration: 600, easing: 'cubic-bezier(.2,.8,.2,1)' });
      layoutAnimations.add(animation);
      animation.onfinish = () => layoutAnimations.delete(animation);
    });
  }

  function revealCard() {
    if (!dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (!desktopLayout.matches || rect.top < 16 || rect.top > window.innerHeight * 0.35 || rect.bottom > window.innerHeight - 16) {
      dialog.scrollIntoView({ behavior: motion.matches ? 'instant' : 'smooth', block: 'start' });
    }
  }

  function setCardOpen(open) {
    if (!dialog || dialog.open === open) return;
    reflowScene(() => {
      if (open) {
        showReading();
        document.body.classList.add('card-open');
        dialog.show();
      } else {
        dialog.close();
        document.body.classList.remove('card-open');
        showReading();
      }
      if (openButton) {
        openButton.setAttribute('aria-expanded', String(open));
        const action = openButton.querySelector('.envelope-action');
        if (action) action.textContent = open ? 'Gấp thiệp' : 'Mở thiệp';
      }
    });
    if (open) {
      if (closeButton) closeButton.focus({ preventScroll: true });
      revealCard();
      document.dispatchEvent(new Event('bouquet:celebrate'));
    } else {
      if (openButton) {
        openButton.focus({ preventScroll: true });
        const rect = openButton.getBoundingClientRect();
        if (rect.top < 0 || rect.bottom > window.innerHeight) {
          openButton.scrollIntoView({ behavior: motion.matches ? 'instant' : 'smooth', block: 'center' });
        }
      }
    }
  }

  motion.addEventListener('change', () => {
    if (motion.matches) {
      layoutAnimations.forEach(animation => animation.cancel());
      layoutAnimations.clear();
    }
  });

  let greeting = { ...defaultGreeting };
  let activeRecipient = null;

  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && typeof saved.recipient === 'string' && typeof saved.message === 'string' && typeof saved.sender === 'string') {
      greeting = {
        recipient: saved.recipient.trim() || defaultGreeting.recipient,
        message: saved.message.trim() || defaultGreeting.message,
        sender: saved.sender.trim() || defaultGreeting.sender
      };
    }
  } catch {
    // The default letter stays usable when storage is unavailable or malformed.
  }

  // ── Tải cấu hình người nhận (hỗ trợ cả JSON và fallback JS khi chạy file:///) ──
  async function loadRecipientsConfig() {
    if (window.RECIPIENTS_DATA) return window.RECIPIENTS_DATA;
    try {
      const response = await fetch('./recipients.json');
      if (response.ok) {
        return await response.json();
      }
    } catch {
      // Bỏ qua lỗi fetch khi chạy local file:///
    }
    return null;
  }

  function findRecipientInConfig(code, config) {
    if (!code || !config) return null;
    const q = String(code).trim().toLowerCase();
    
    const list = Array.isArray(config.recipients)
      ? config.recipients
      : (Array.isArray(config) ? config : Object.values(config));
    
    for (const item of list) {
      if (!item || typeof item !== 'object') continue;
      // CHỈ khớp đúng mã bí mật (code) hoặc alias bí mật được cấu hình
      // TUYỆT ĐỐI không khớp theo tên thật hay id để tránh người khác đoán mò
      if (item.code && String(item.code).trim().toLowerCase() === q) return item;
      if (Array.isArray(item.aliases)) {
        if (item.aliases.some(a => String(a).trim().toLowerCase() === q)) return item;
      }
    }

    if (config[q] && typeof config[q] === 'object') return config[q];
    if (config.recipients && config.recipients[q] && typeof config.recipients[q] === 'object') return config.recipients[q];

    return null;
  }

  function updateMetaTags(recipient) {
    const isDefault = !recipient || recipient.name === 'bạn';
    const name = isDefault ? 'bạn' : recipient.name;
    const pageTitle = isDefault ? 'Một bó hoa dành tặng bạn · 20/10' : `Một bó hoa dành tặng ${name} · 20/10`;
    document.title = pageTitle;

    const firstLine = (recipient && recipient.message)
      ? recipient.message.split('\n')[0]
      : 'Một bó hoa và tấm thiệp nhỏ, gửi những lời chúc dịu dàng nhân ngày Phụ nữ Việt Nam 20/10.';
    const imgPath = (recipient && recipient.image) ? recipient.image : './assets/imgs/cancan.png';
    const imgUrl = new URL(imgPath, window.location.href).href;

    const setMeta = (selector, attr, val) => {
      let tag = document.querySelector(selector);
      if (tag) tag.setAttribute(attr, val);
    };

    setMeta('meta[property="og:title"]', 'content', pageTitle);
    setMeta('meta[property="og:description"]', 'content', firstLine);
    setMeta('meta[property="og:image"]', 'content', imgUrl);
    setMeta('meta[name="twitter:title"]', 'content', pageTitle);
    setMeta('meta[name="twitter:description"]', 'content', firstLine);
    setMeta('meta[name="twitter:image"]', 'content', imgUrl);
  }

  function renderGreeting() {
    const recipientEl = document.getElementById('cardRecipient');
    const titleEl = document.getElementById('cardTitle');
    const messageEl = document.getElementById('cardMessage');
    const senderEl = document.getElementById('cardSender');
    const envelopeLetterEl = document.querySelector('.envelope-letter');
    const greetingCaptionEl = document.querySelector('.greeting-caption');

    if (activeRecipient) {
      if (recipientEl) recipientEl.textContent = activeRecipient.name;
      if (titleEl) {
        titleEl.innerHTML = activeRecipient.title || `Chúc ${activeRecipient.name} một ngày<br>thật nhiều yêu thương.`;
      }
      if (envelopeLetterEl) {
        envelopeLetterEl.textContent = `Gửi ${activeRecipient.name}`;
      }
      if (greetingCaptionEl) {
        greetingCaptionEl.textContent = `Mong hôm nay của ${activeRecipient.name} thật dịu dàng.`;
      }
    } else {
      if (recipientEl) recipientEl.textContent = greeting.recipient;
      if (titleEl) {
        titleEl.innerHTML = greeting.recipient && greeting.recipient !== 'bạn'
          ? `Chúc ${greeting.recipient} một ngày<br>thật nhiều yêu thương.`
          : 'Chúc bạn một ngày<br>thật nhiều yêu thương.';
      }
    }

    const messageText = (activeRecipient && activeRecipient.message) || greeting.message;
    if (messageEl) {
      const paragraphs = messageText.split(/\n\s*\n/).map(text => {
        const paragraph = document.createElement('span');
        paragraph.className = 'message-paragraph';
        paragraph.textContent = text;
        return paragraph;
      });
      messageEl.replaceChildren(...paragraphs);
    }

    const senderText = (activeRecipient && activeRecipient.sender) || greeting.sender;
    if (senderEl) senderEl.textContent = senderText;
  }

  function showReading() {
    if (reading) reading.hidden = false;
    if (dialog) {
      dialog.setAttribute('aria-labelledby', 'cardTitle');
      dialog.scrollTop = 0;
    }
  }

  document.addEventListener('bouquet:ready', () => {
    if (openButton) openButton.hidden = false;
  });
  document.addEventListener('bouquet:rose', event => {
    const wish = document.getElementById('roseWish');
    if (!wish) return;
    wish.classList.remove('is-new');
    wish.textContent = event.detail.message;
    // Restart the brief reveal even when two flowers share the same wish.
    void wish.offsetWidth;
    wish.classList.add('is-new');
  });
  const replayBloom = document.getElementById('replayBloom');
  if (replayBloom) {
    replayBloom.addEventListener('click', () => {
      document.dispatchEvent(new Event('bouquet:replay'));
      const wish = document.getElementById('roseWish');
      if (wish) wish.textContent = '';
    });
  }

  if (openButton) openButton.addEventListener('click', () => setCardOpen(!dialog.open));
  if (closeButton) closeButton.addEventListener('click', () => setCardOpen(false));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && dialog && dialog.open && !event.defaultPrevented) {
      event.preventDefault();
      setCardOpen(false);
    }
  });
  if (dialog) {
    dialog.addEventListener('close', () => {
      if (dialog.open || !document.body.classList.contains('card-open')) return;
      document.body.classList.remove('card-open');
      if (openButton) {
        openButton.setAttribute('aria-expanded', 'false');
        const action = openButton.querySelector('.envelope-action');
        if (action) action.textContent = 'Mở thiệp';
      }
      showReading();
    });
  }

  // ── Ảnh chân dung trong thiệp ──
  const PORTRAIT_KEY = 'flower.greeting.20-10.portrait.v1';
  const portraitBtn = document.getElementById('cardPortraitBtn');
  const portraitImg = document.getElementById('cardPortraitImg');
  const portraitInput = document.getElementById('cardPortraitInput');

  function updatePortrait() {
    if (!portraitImg) return;
    if (activeRecipient && activeRecipient.image) {
      portraitImg.src = activeRecipient.image;
      portraitImg.alt = `Ảnh dành tặng ${activeRecipient.name}`;
      if (activeRecipient.objectPosition) {
        portraitImg.style.objectPosition = activeRecipient.objectPosition;
      }
    } else {
      // Mặc định luôn hiển thị cancan.png khi không khớp mã hoặc bị người khác sửa đổi URL
      portraitImg.src = './assets/imgs/cancan.png';
      portraitImg.alt = 'Ảnh mặc định';
      portraitImg.style.objectPosition = 'center';
    }
  }

  function loadSavedPortrait() {
    try {
      const saved = localStorage.getItem(PORTRAIT_KEY);
      if (saved && portraitImg) portraitImg.src = saved;
    } catch { /* localStorage không khả dụng */ }
  }

  if (portraitBtn && portraitInput && portraitImg) {
    portraitBtn.addEventListener('click', () => portraitInput.click());
    portraitInput.addEventListener('change', () => {
      const file = portraitInput.files && portraitInput.files[0];
      if (!file) return;
      if (file.size > 8 * 1024 * 1024) {
        alert('Ảnh quá lớn. Vui lòng chọn ảnh dưới 8 MB nhé.');
        return;
      }
      const reader = new FileReader();
      reader.onload = e => {
        const dataUrl = e.target.result;
        portraitImg.src = dataUrl;
        portraitImg.style.objectPosition = 'center';
        try { localStorage.setItem(PORTRAIT_KEY, dataUrl); } catch { /* bỏ qua nếu quota đầy */ }
      };
      reader.readAsDataURL(file);
      portraitInput.value = '';
    });
  }

  // Khởi tạo thông tin người nhận theo URL parameter
  async function initRecipient() {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('u') || params.get('code') || params.get('id') || params.get('to') || (window.location.hash ? window.location.hash.replace(/^#/, '') : null);

    const config = await loadRecipientsConfig();
    if (code && config) {
      activeRecipient = findRecipientInConfig(code, config);
    }

    updateMetaTags(activeRecipient);
    renderGreeting();
    updatePortrait();
  }

  initRecipient();
})();
