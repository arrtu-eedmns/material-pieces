// piece-interactive — toggle piece-actived + anchor fixed menus

function positionMenu(el) {
    const menu = el.querySelector('.piece-menu')
    if (!menu) return
    const r          = el.getBoundingClientRect()
    menu.style.top      = (r.bottom + 4) + 'px'
    menu.style.left     = r.left + 'px'
    menu.style.minWidth = r.width + 'px'
}

document.addEventListener('click', e => {
    document.querySelectorAll('.piece-interactive').forEach(el => {
        const clickedInside      = el.contains(e.target)
        const clickedNotInteract = e.target.closest('.piece-not-interactive')
        const shouldDeactivate   = !clickedInside || clickedNotInteract

        el.classList.toggle('piece-actived', !shouldDeactivate)

        if (!shouldDeactivate) positionMenu(el)
    })
})

// Fecha ao rolar — mesmo padrão do tooltip.js
window.addEventListener('scroll', () => {
    document.querySelectorAll('.piece-interactive.piece-actived').forEach(el => {
        el.classList.remove('piece-actived')
    })
}, true)

// Reposiciona ao redimensionar
window.addEventListener('resize', () => {
    document.querySelectorAll('.piece-interactive.piece-actived').forEach(positionMenu)
})
