// Adds a floating "download this tool" button to every page.
(() => {
  if (window.top !== window.self) return;
  const b = document.createElement('button');
  b.type = 'button';
  b.textContent = '⬇';
  b.title = 'הורדת הכלי למחשב, לשימוש גם בלי אינטרנט';
  b.setAttribute('aria-label', 'הורדת הכלי');
  Object.assign(b.style, {
    position: 'fixed', left: '14px', bottom: document.querySelector('.task') ? '46px' : '14px', zIndex: 99999,
    width: '44px', height: '44px', borderRadius: '50%', border: '1px solid rgba(255,255,255,.3)',
    background: 'rgba(20,15,43,.85)', color: '#fff', fontSize: '20px', lineHeight: '1', cursor: 'pointer',
    boxShadow: '0 4px 14px rgba(0,0,0,.35)', backdropFilter: 'blur(4px)', transition: 'transform .15s'
  });
  b.onmouseenter = () => (b.style.transform = 'scale(1.1)');
  b.onmouseleave = () => (b.style.transform = '');
  b.onclick = async () => {
    const url = location.href.split('#')[0];
    let html;
    try {
      const r = await fetch(url, { cache: 'no-store' });
      if (!r.ok) throw 0;
      html = await r.text();
    } catch {
      alert('ההורדה עובדת מהאתר עצמו: https://ayal408.github.io/surprise-box/');
      return;
    }
    // Strip navigation and download controls from the saved copy.
    const base = url.replace(/[^/]*$/, '');
    const page = new DOMParser().parseFromString(html, 'text/html');
    page.querySelectorAll('a[href]').forEach(link => {
      try {
        const target = new URL(link.getAttribute('href'), base);
        if (decodeURIComponent(target.pathname.split('/').pop()) === 'התחל כאן.html') link.remove();
      } catch { /* Leave unrelated or malformed links as they are. */ }
    });
    page.querySelectorAll('script[src]').forEach(script => {
      try {
        if (new URL(script.getAttribute('src'), base).pathname.split('/').pop() === 'dl.js') script.remove();
      } catch { /* Preserve unrelated scripts. */ }
    });
    page.querySelectorAll('button[aria-label="הורדת הכלי"]').forEach(button => button.remove());
    page.querySelectorAll('a[download], button, input[type="button"], input[type="submit"]').forEach(control => {
      const label = [control.textContent, control.getAttribute('aria-label'), control.getAttribute('title'), control.getAttribute('value')].filter(Boolean).join(' ').trim();
      const id = control.id.toLowerCase();
      if (control.hasAttribute('download') || /(?:הורד(?:ה|ת)?|ייצוא|לייצא|export|download|save as)/i.test(label) && !/הורדת מחיר|הורדת עלות/.test(label) || /^(?:dl|download|export|csv|png|pdf|savefile)$/.test(id)) control.remove();
    });
    if (!page.querySelector('base')) {
      const baseTag = page.createElement('base');
      baseTag.href = base;
      page.head.prepend(baseTag);
    }
    html = '<!DOCTYPE html>\n' + page.documentElement.outerHTML;
    const name = (document.title || 'כלי').replace(/[\\/:*?"<>|]/g, '') + '.html';
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([html], { type: 'text/html;charset=utf-8' }));
    a.download = name;
    a.click();
    b.textContent = '✓';
    setTimeout(() => (b.textContent = '⬇'), 1500);
  };
  const add = () => document.body.appendChild(b);
  document.body ? add() : addEventListener('DOMContentLoaded', add);
})();
