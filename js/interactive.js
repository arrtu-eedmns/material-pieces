// piece-interactive — toggle piece-actived + anchor fixed menus
// Portal pattern: menu é movido para <html> ao abrir, escapando qualquer
// stacking context no body (position:fixed sempre resolve para o viewport).

;(function () {
    const TRANSITION = [
        'opacity .25s cubic-bezier(0.2,0,0,1)',
        'clip-path .3s cubic-bezier(0.2,0,0,1)',
        'transform .25s cubic-bezier(0.2,0,0,1)'
    ].join(', ')

    let activeEl   = null   // .piece-interactive com menu aberto
    let activeMenu = null   // .piece-menu portaled para <html>
    let origParent = null   // parent original do menu
    let closeTimer = null

    /* ── Posiciona o menu aberto em relação ao trigger ── */
    function positionMenu() {
        if (!activeMenu || !activeEl) return
        const r = activeEl.getBoundingClientRect()
        activeMenu.style.top      = (r.bottom + 4) + 'px'
        activeMenu.style.left     = r.left + 'px'
        activeMenu.style.minWidth = r.width + 'px'
    }

    /* ── Abre ── */
    function openMenu(el) {
        clearTimeout(closeTimer)

        const menu = el.querySelector('.piece-menu')
        if (!menu) return

        // Se havia outro menu aberto, restaura imediatamente
        if (activeMenu && activeMenu !== menu) {
            if (origParent) origParent.appendChild(activeMenu)
            activeMenu.removeAttribute('style')
        }

        activeEl   = el
        activeMenu = menu
        origParent = menu.parentElement

        // Estado inicial oculto
        Object.assign(menu.style, {
            position:     'fixed',
            zIndex:       '100',
            opacity:      '0',
            clipPath:     'inset(0 0 100% 0 round 16px)',
            transform:    'translateY(-4px)',
            pointerEvents:'none',
            transition:   TRANSITION
        })

        // Move para <html> — escapa stacking context do body
        document.documentElement.appendChild(menu)
        positionMenu()

        // Anima abertura no próximo frame
        requestAnimationFrame(() => {
            if (activeMenu !== menu) return
            Object.assign(menu.style, {
                opacity:      '1',
                clipPath:     'inset(0 0 0% 0 round 16px)',
                transform:    'translateY(0)',
                pointerEvents:'all'
            })
        })
    }

    /* ── Fecha ── */
    function closeMenu(el) {
        if (!activeMenu || activeEl !== el) return

        const menu   = activeMenu
        const parent = origParent

        activeEl   = null
        activeMenu = null
        origParent = null

        // Anima fechamento
        Object.assign(menu.style, {
            opacity:      '0',
            clipPath:     'inset(0 0 100% 0 round 16px)',
            transform:    'translateY(-4px)',
            pointerEvents:'none'
        })

        // Restaura ao parent original após a animação
        closeTimer = setTimeout(() => {
            if (parent && menu.parentElement !== parent) parent.appendChild(menu)
            menu.removeAttribute('style')
        }, 310)
    }

    /* ── Click handler ── */
    document.addEventListener('click', e => {
        document.querySelectorAll('.piece-interactive').forEach(el => {
            // Clique dentro do menu portaled conta como "dentro" do interactive
            const inPortaledMenu     = activeMenu && activeEl === el && activeMenu.contains(e.target)
            const clickedInside      = el.contains(e.target) || inPortaledMenu
            const clickedNotInteract = e.target.closest('.piece-not-interactive')
            const shouldDeactivate   = !clickedInside || clickedNotInteract

            el.classList.toggle('piece-actived', !shouldDeactivate)

            if (!shouldDeactivate) openMenu(el)
            else                   closeMenu(el)
        })
    })

    /* ── Scroll: reposiciona sem fechar ── */
    window.addEventListener('scroll', positionMenu, true)

    /* ── Resize: reposiciona ── */
    window.addEventListener('resize', positionMenu)
})()
