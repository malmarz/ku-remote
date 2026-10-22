(function () {
  var root = document.documentElement;
  var topics = Array.prototype.slice.call(document.querySelectorAll('details.topic'));
  var roleEls = Array.prototype.slice.call(document.querySelectorAll('[data-roles]'));
  var roleBtns = Array.prototype.slice.call(document.querySelectorAll('.role-btn'));
  var boxes = Array.prototype.slice.call(document.querySelectorAll('#checklist input[type="checkbox"]'));
  var ROLES = ['student', 'faculty', 'staff'];
  var LABELS = { student: ['طالب', 'Student'], faculty: ['عضو هيئة تدريس', 'Faculty'], staff: ['موظف', 'Staff'] };
  var role = 'student';

  // ---- Storage: every access wrapped, the page works without it -------------
  function store(key, value) {
    try {
      if (value === undefined) return localStorage.getItem(key);
      localStorage.setItem(key, value);
    } catch (e) { return null; }
    return null;
  }

  // ---- Address bar: keep ?lang and ?role, leave the #hash alone ------------
  function setParam(name, value) {
    try {
      var params = new URLSearchParams(location.search);
      if (value) params.set(name, value); else params.delete(name);
      var q = params.toString();
      history.replaceState(null, '', location.pathname + (q ? '?' + q : '') + location.hash);
    } catch (e) { /* file:// in some browsers */ }
  }

  // ---- Language -----------------------------------------------------------
  function setLang(lang) {
    lang = lang === 'en' ? 'en' : 'ar';
    root.lang = lang;
    root.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.title = lang === 'ar'
      ? 'دليل العمل والتعلم عن بُعد — جامعة الكويت'
      : 'Remote Work & Learning Hub — Kuwait University';
    var search = document.getElementById('search');
    search.placeholder = search.getAttribute('data-' + lang);
    store('ku-remote-lang', lang);
    filter();
  }

  document.getElementById('lang').addEventListener('click', function () {
    setLang(root.lang === 'ar' ? 'en' : 'ar');
  });

  // ---- Role ---------------------------------------------------------------
  function inRole(el) {
    return (el.getAttribute('data-roles') || '').split(/\s+/).indexOf(role) !== -1;
  }

  function hasRole(el, r) {
    return (el.getAttribute('data-roles') || '').split(/\s+/).indexOf(r) !== -1;
  }

  function setRole(next) {
    role = ROLES.indexOf(next) !== -1 ? next : 'student';
    roleBtns.forEach(function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-role') === role ? 'true' : 'false');
    });
    roleEls.forEach(function (el) {
      if (el.classList.contains('topic')) return; // tiles are handled by filter()
      el.classList.toggle('role-off', !inRole(el));
    });
    store('ku-remote-role', role);
    setParam('role', role);
    filter();
    progress();
  }

  roleBtns.forEach(function (b) {
    b.addEventListener('click', function () { setRole(b.getAttribute('data-role')); });
  });

  // ---- Readiness checklist ------------------------------------------------
  function loadChecks() {
    try { return JSON.parse(store('ku-remote-checks') || '{}') || {}; } catch (e) { return {}; }
  }
  var checks = loadChecks();
  boxes.forEach(function (box) {
    box.checked = !!checks[box.id];
    box.addEventListener('change', function () {
      checks[box.id] = box.checked;
      store('ku-remote-checks', JSON.stringify(checks));
      progress();
    });
  });

  function progress() {
    var total = 0, done = 0;
    boxes.forEach(function (box) {
      var li = box.closest('li');
      if (li.classList.contains('role-off')) return;
      total++;
      if (box.checked) done++;
    });
    document.getElementById('count').textContent = done + '/' + total;
    document.getElementById('bar').style.width = (total ? Math.round(done / total * 100) : 0) + '%';
    var all = total > 0 && done === total;
    document.getElementById('all-ready').hidden = !all;
  }

  // ---- One topic open at a time, address follows the open topic -----------
  topics.forEach(function (topic) {
    topic.addEventListener('toggle', function () {
      if (!topic.open) {
        if (location.hash === '#' + topic.id) history.replaceState(null, '', location.pathname + location.search);
        return;
      }
      topics.forEach(function (other) { if (other !== topic) other.open = false; });
      history.replaceState(null, '', location.pathname + location.search + '#' + topic.id);
    });
  });

  // ---- Direct links: page.html#vpn opens that answer ----------------------
  function openFromHash() {
    var id = decodeURIComponent(location.hash.slice(1));
    if (!id) return;
    var target = document.getElementById(id);
    if (!target) return;
    var topic = target.closest('details.topic');
    if (topic && topic.hidden) {
      // A checklist or help link must never land on a filtered-out tile.
      document.getElementById('search').value = '';
      if (!inRole(topic)) {
        var first = ROLES.filter(function (r) { return hasRole(topic, r); })[0];
        if (first) setRole(first);
      }
      filter();
    }
    var node = target;
    while (node) {
      if (node.tagName === 'DETAILS') node.open = true;
      node = node.parentElement;
    }
    setTimeout(function () { target.scrollIntoView({ block: 'start' }); }, 60);
  }
  window.addEventListener('hashchange', openFromHash);

  // ---- Copy a direct link to one answer -----------------------------------
  document.querySelectorAll('.share').forEach(function (button) {
    button.addEventListener('click', function () {
      var topic = button.closest('details.topic');
      var url = location.origin + location.pathname + '?lang=' + root.lang + '#' + topic.id;
      var done = function () {
        var label = button.querySelector(root.lang === 'ar' ? '.ar' : '.en');
        var old = label.textContent;
        label.textContent = root.lang === 'ar' ? 'نُسخ الرابط' : 'Link copied';
        setTimeout(function () { label.textContent = old; }, 1800);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(done, function () { window.prompt('', url); });
      } else {
        window.prompt('', url);
      }
    });
  });

  // ---- Search -------------------------------------------------------------
  function normalise(text) {
    return (text || '').toLowerCase()
      .replace(/[ً-ْـ]/g, '')
      .replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي');
  }

  function filter() {
    var search = document.getElementById('search');
    var query = normalise(search.value.trim());
    var shown = 0;
    topics.forEach(function (topic) {
      var text = '';
      topic.querySelectorAll('.' + root.lang).forEach(function (el) { text += ' ' + el.textContent; });
      text += ' ' + (topic.getAttribute('data-keys') || '');
      var match = (!query || normalise(text).indexOf(query) !== -1) && inRole(topic);
      topic.hidden = !match;
      if (match) shown++;
    });
    document.getElementById('no-match').hidden = shown !== 0;
    var other = document.getElementById('other-role');
    var box = document.getElementById('other-role-btns');
    box.textContent = '';
    if (shown === 0 && query) {
      var found = {};
      topics.forEach(function (topic) {
        var text = '';
        topic.querySelectorAll('.' + root.lang).forEach(function (el) { text += ' ' + el.textContent; });
        text += ' ' + (topic.getAttribute('data-keys') || '');
        if (normalise(text).indexOf(query) === -1) return;
        ROLES.forEach(function (r) { if (r !== role && hasRole(topic, r)) found[r] = true; });
      });
      ROLES.forEach(function (r) {
        if (!found[r]) return;
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'role-btn';
        b.textContent = LABELS[r][root.lang === 'ar' ? 0 : 1];
        b.addEventListener('click', function () { setRole(r); });
        box.appendChild(b);
      });
      other.hidden = !box.firstChild;
    } else {
      other.hidden = true;
    }
  }
  document.getElementById('search').addEventListener('input', filter);

  // ---- Start --------------------------------------------------------------
  var params = new URLSearchParams(location.search);
  setLang(params.get('lang') || store('ku-remote-lang') || 'ar');
  setRole(params.get('role') || store('ku-remote-role') || 'student');
  openFromHash();
})();
