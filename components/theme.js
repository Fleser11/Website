(function () {
    var STORAGE_KEY = 'theme';

    function applyStoredTheme() {
        try {
            var stored = localStorage.getItem(STORAGE_KEY);
            if (stored === 'dark' || stored === 'light') {
                document.documentElement.setAttribute('data-theme', stored);
            }
        } catch (e) {
            // localStorage unavailable (private mode, etc.) — fall back to prefers-color-scheme.
        }
    }

    // Apply immediately so there's no flash of the wrong theme before other scripts run.
    applyStoredTheme();

    function currentIsDark() {
        var explicit = document.documentElement.getAttribute('data-theme');
        if (explicit === 'dark') return true;
        if (explicit === 'light') return false;
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        try {
            localStorage.setItem(STORAGE_KEY, theme);
        } catch (e) {
            // ignore
        }
        document.dispatchEvent(new CustomEvent('theme-changed', { detail: { theme: theme } }));
    }

    function toggleTheme() {
        setTheme(currentIsDark() ? 'light' : 'dark');
    }

    document.addEventListener('theme-toggle-request', toggleTheme);

    document.addEventListener('DOMContentLoaded', function () {
        document.dispatchEvent(new CustomEvent('theme-changed', {
            detail: { theme: currentIsDark() ? 'dark' : 'light' }
        }));
    });

    window.toggleTheme = toggleTheme;
})();
