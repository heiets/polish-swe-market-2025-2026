(function () {
  var RATE = 3.55;

  function fmtUsd(n) {
    return Math.round(n).toLocaleString('en-US');
  }

  function labelFor(el) {
    var range = el.getAttribute('data-pln-range');
    if (range) {
      var parts = range.split('-').map(function (x) {
        return parseFloat(x.trim());
      });
      if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        return (
          '≈ $' +
          fmtUsd(parts[0] / RATE) +
          '–$' +
          fmtUsd(parts[1] / RATE) +
          ' USD'
        );
      }
    }
    var v = parseFloat(el.getAttribute('data-pln'));
    if (!isNaN(v)) {
      return '≈ $' + fmtUsd(v / RATE) + ' USD';
    }
    return '';
  }

  var tip = document.createElement('div');
  tip.className = 'pln-tip-float';
  tip.setAttribute('role', 'tooltip');
  tip.setAttribute('aria-hidden', 'true');
  document.body.appendChild(tip);

  function positionTip(target) {
    var rect = target.getBoundingClientRect();
    var tw = tip.offsetWidth;
    var th = tip.offsetHeight;
    var left = rect.left + rect.width / 2 - tw / 2;
    left = Math.max(8, Math.min(left, window.innerWidth - tw - 8));
    var top = rect.top - th - 8;
    if (top < 8) {
      top = rect.bottom + 8;
    }
    tip.style.left = left + 'px';
    tip.style.top = top + 'px';
  }

  function showAt(el) {
    var text = labelFor(el);
    if (!text) return;
    tip.textContent = text;
    tip.classList.add('is-visible');
    tip.setAttribute('aria-hidden', 'false');
    requestAnimationFrame(function () {
      positionTip(el);
    });
  }

  function hideTip() {
    tip.classList.remove('is-visible');
    tip.setAttribute('aria-hidden', 'true');
  }

  document.querySelectorAll('.pln-tip').forEach(function (el) {
    el.addEventListener('mouseenter', function () {
      showAt(el);
    });
    el.addEventListener('mouseleave', function (e) {
      if (!e.relatedTarget || !el.contains(e.relatedTarget)) {
        hideTip();
      }
    });
    if (!el.closest('a[href]')) {
      el.setAttribute('tabindex', '0');
      el.addEventListener('focus', function () {
        showAt(el);
      });
      el.addEventListener('blur', hideTip);
    }
  });

  function repositionIfVisible() {
    if (!tip.classList.contains('is-visible')) return;
    var hovered = document.querySelector('.pln-tip:hover');
    if (hovered) positionTip(hovered);
  }

  window.addEventListener('scroll', repositionIfVisible, true);
  window.addEventListener('resize', repositionIfVisible);
})();
