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
    // Keep links to the site (icon, back link, shared files) working from the saved copy.
    const base = url.replace(/[^/]*$/, '');
    if (!/<base\s/i.test(html)) html = html.replace(/<head[^>]*>/i, m => m + `\n<base href="${base}">`);
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
