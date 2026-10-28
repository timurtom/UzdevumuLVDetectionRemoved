// 1. Рубим саму логику гаарда на странице
if (window.Yk && Yk.tabSwitchGuard) {
    Yk.tabSwitchGuard.disabledForCurrentPage = true;
    // Подменяем функции репорта на пустые пустышки, чтобы они ничего не отправляли на сервер
    if (Yk.tabSwitchGuard.init) {
        let originalInit = Yk.tabSwitchGuard.init;
        Yk.tabSwitchGuard.init = function(config) {
            if (config && config.urls) {
                config.urls.reportAway = null;
                config.urls.reportReturn = null;
                config.urls.discardAwayWithinGrace = null;
            }
            config.trackingEnabled = false;
            return originalInit.apply(this, arguments);
        };
    }
}

// 2. Убиваем события видимости на уровне документов, чтобы браузер «не знал», что вкладка неактивна
Object.defineProperty(document, 'hidden', { value: false, configurable: true });
Object.defineProperty(document, 'visibilityState', { value: 'visible', configurable: true });
['visibilitychange', 'webkitvisibilitychange', 'blur', 'focus'].forEach(eventType => {
    window.addEventListener(eventType, function(e) {
        e.stopImmediatePropagation();
    }, true);
});

// 3. Функция-чистильщик: если блокировка или оверлей всё-таки появляются, сносит их моментально
const killOverlay = () => {
    const blockers = document.querySelectorAll('#antiCheatTabSwitchWarning, #antiCheatTabSwitchLock, .anti-cheat-lock, [id*="antiCheat"], [class*="antiCheat"]');
    blockers.forEach(el => el.remove());
};

// Запускаем чистку сразу и вешаем наблюдатель на случай динамического появления
killOverlay();
const observer = new MutationObserver(killOverlay);
observer.observe(document.body, { childList: true, subtree: true });

console.log("античит заблокан");
