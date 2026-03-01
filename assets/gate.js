(function() {
    var STORAGE_KEY = 'ccg_authenticated';
    var SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

    function isAuthenticated() {
        try {
            var stored = localStorage.getItem(STORAGE_KEY);
            if (!stored) return false;
            var data = JSON.parse(stored);
            if (Date.now() - data.time > SESSION_DURATION) {
                localStorage.removeItem(STORAGE_KEY);
                return false;
            }
            return data.valid === true;
        } catch(e) {
            return false;
        }
    }

    function setAuthenticated() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ valid: true, time: Date.now() }));
    }

    // If already authenticated, just remove the hide style and stop
    if (isAuthenticated()) {
        document.addEventListener('DOMContentLoaded', function() {
            var s = document.getElementById('ccg-gate-hide');
            if (s) s.remove();
        });
        return;
    }

    // Not authenticated — build and show the gate
    document.addEventListener('DOMContentLoaded', function() {
        // Keep body hidden behind the gate
        document.documentElement.style.overflow = 'hidden';

        var overlay = document.createElement('div');
        overlay.id = 'ccg-gate';
        overlay.style.cssText = 'position:fixed;inset:0;z-index:99999;background:#0a0a0a;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:1.5rem;font-family:Inter,-apple-system,sans-serif;visibility:visible;';

        overlay.innerHTML = [
            '<style>',
            '#ccg-gate .g-logo{height:48px;opacity:.7}',
            '#ccg-gate .g-title{font-family:"Space Grotesk",sans-serif;font-weight:600;font-size:1.2rem;color:#f5f5f5}',
            '#ccg-gate .g-sub{font-size:.8rem;color:#737373;margin-top:-.5rem}',
            '#ccg-gate .g-form{display:flex;gap:.5rem}',
            '#ccg-gate .g-input{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);border-radius:8px;padding:.6rem 1rem;color:#f5f5f5;font-family:Inter,sans-serif;font-size:.9rem;outline:none;width:220px}',
            '#ccg-gate .g-input:focus{border-color:rgba(139,92,246,.5)}',
            '#ccg-gate .g-input::placeholder{color:rgba(255,255,255,.25)}',
            '#ccg-gate .g-btn{background:#8b5cf6;color:#fff;border:none;border-radius:8px;padding:.6rem 1.4rem;font-family:Inter,sans-serif;font-size:.85rem;font-weight:600;cursor:pointer;transition:background .2s}',
            '#ccg-gate .g-btn:hover{background:#7c3aed}',
            '#ccg-gate .g-err{color:#dc2626;font-size:.8rem;min-height:1.2em}',
            '</style>',
            '<img src="/assets/logos/ccg-icon-white.png" class="g-logo" alt="CCG">',
            '<div class="g-title">Core Creative Group</div>',
            '<div class="g-sub">This site is password protected</div>',
            '<form class="g-form" id="ccg-gate-form">',
            '  <input type="password" class="g-input" id="ccg-gate-pw" placeholder="Enter password" autocomplete="off">',
            '  <button type="submit" class="g-btn">Enter</button>',
            '</form>',
            '<div class="g-err" id="ccg-gate-err"></div>'
        ].join('\n');

        document.body.appendChild(overlay);
        document.getElementById('ccg-gate-pw').focus();

        document.getElementById('ccg-gate-form').addEventListener('submit', function(e) {
            e.preventDefault();
            var pw = document.getElementById('ccg-gate-pw').value;
            if (pw === 'ccg2026') {
                setAuthenticated();
                overlay.remove();
                var s = document.getElementById('ccg-gate-hide');
                if (s) s.remove();
                document.documentElement.style.overflow = '';
            } else {
                document.getElementById('ccg-gate-err').textContent = 'Incorrect password';
                document.getElementById('ccg-gate-pw').value = '';
                document.getElementById('ccg-gate-pw').focus();
            }
        });
    });
})();
