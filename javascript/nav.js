document.addEventListener('DOMContentLoaded', function() {
    const openPanelBtn = document.querySelector('.open-panel-btn');
    const sidePanel = document.querySelector('.side-panel');

    openPanelBtn.addEventListener('mouseenter', function() {
        sidePanel.style.left = '0';
    });

    sidePanel.addEventListener('mouseleave', function() {
        sidePanel.style.left = '-250px';
    });
});
