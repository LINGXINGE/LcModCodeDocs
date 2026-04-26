function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    const sidebarIcon = document.getElementById('sidebar-icon');

    if (sidebar.classList.contains('sidebar-hidden')) {
        sidebar.classList.remove('sidebar-hidden');
        mainContent.classList.remove('main-content-expanded');
        sidebarIcon.textContent = '☰';
        localStorage.setItem('sidebar', 'visible');
    } else {
        sidebar.classList.add('sidebar-hidden');
        mainContent.classList.add('main-content-expanded');
        sidebarIcon.textContent = '☰';
        localStorage.setItem('sidebar', 'hidden');
    }
}

function toggleTheme() {
    const html = document.documentElement;
    const themeIcon = document.getElementById('theme-icon');
    const currentTheme = html.getAttribute('data-theme');

    if (currentTheme === 'dark') {
        html.removeAttribute('data-theme');
        themeIcon.textContent = '深色';
        localStorage.setItem('theme', 'light');
    } else {
        html.setAttribute('data-theme', 'dark');
        themeIcon.textContent = '浅色';
        localStorage.setItem('theme', 'dark');
    }
}

function updateThemeIcon() {
    const themeIcon = document.getElementById('theme-icon');
    if (themeIcon) {
        if (document.documentElement.getAttribute('data-theme') === 'dark') {
            themeIcon.textContent = '浅色';
        } else {
            themeIcon.textContent = '深色';
        }
    }
}

function toggleSidebarSection(header) {
    const nav = header.nextElementSibling;
    if (nav && nav.classList.contains('sidebar-nav')) {
        nav.classList.toggle('collapsed');
        const toggleBtn = header.querySelector('.sidebar-toggle-btn');
        if (toggleBtn) {
            toggleBtn.textContent = nav.classList.contains('collapsed') ? '▶' : '▼';
        }

        const sectionName = header.getAttribute('data-section-name') || header.textContent.replace('▶', '').replace('▼', '').trim();
        if (nav.classList.contains('collapsed')) {
            localStorage.setItem('sidebar-section-' + sectionName, 'collapsed');
        } else {
            localStorage.removeItem('sidebar-section-' + sectionName);
        }
    }
}

function searchSidebar() {
    const searchInput = document.getElementById('sidebar-search-input');
    const searchTerm = searchInput.value.toLowerCase();
    const links = document.querySelectorAll('.sidebar-nav a');

    if (searchTerm) {
        document.querySelectorAll('.sidebar-nav').forEach(nav => {
            nav.classList.remove('collapsed');
        });
        document.querySelectorAll('.sidebar-toggle-btn').forEach(btn => {
            btn.textContent = '▼';
        });
    }

    links.forEach(link => {
        const text = link.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            link.style.display = 'block';
            link.parentElement.style.display = 'block';
        } else {
            link.style.display = 'none';
        }
    });
}

function goToSearch() {
    const currentPath = window.location.pathname;
    if (currentPath.includes('/base/') || currentPath.includes('/model/') || currentPath.includes('/manager/') || currentPath.includes('/animscript/')) {
        window.location.href = '../search.html';
    } else {
        window.location.href = 'search.html';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
    updateThemeIcon();

    const savedSidebar = localStorage.getItem('sidebar');
    if (savedSidebar === 'hidden') {
        const sidebar = document.querySelector('.sidebar');
        const mainContent = document.querySelector('.main-content');
        const sidebarIcon = document.getElementById('sidebar-icon');
        if (sidebar && mainContent) {
            sidebar.classList.add('sidebar-hidden');
            mainContent.classList.add('main-content-expanded');
            if (sidebarIcon) sidebarIcon.textContent = '☰';
        }
    }

    const sidebarHeaders = document.querySelectorAll('.sidebar-header');
    sidebarHeaders.forEach(header => {
        const sectionName = header.textContent.trim();
        header.setAttribute('data-section-name', sectionName);
        
        if (!header.querySelector('.sidebar-toggle-btn')) {
            const toggleBtn = document.createElement('button');
            toggleBtn.className = 'sidebar-toggle-btn';
            toggleBtn.textContent = '▼';
            toggleBtn.onclick = (e) => {
                e.stopPropagation();
                toggleSidebarSection(header);
            };
            header.appendChild(toggleBtn);
        }

        header.style.cursor = 'pointer';
        header.addEventListener('click', () => {
            toggleSidebarSection(header);
        });

        const nav = header.nextElementSibling;
        if (nav && nav.classList.contains('sidebar-nav')) {
            const savedState = localStorage.getItem('sidebar-section-' + sectionName);
            if (savedState === 'collapsed') {
                nav.classList.add('collapsed');
                const toggleBtn = header.querySelector('.sidebar-toggle-btn');
                if (toggleBtn) toggleBtn.textContent = '▶';
            } else if (savedState === 'expanded') {
                nav.classList.remove('collapsed');
                const toggleBtn = header.querySelector('.sidebar-toggle-btn');
                if (toggleBtn) toggleBtn.textContent = '▼';
            } else {
                if (sectionName === 'API 参考') {
                    nav.classList.remove('collapsed');
                    const toggleBtn = header.querySelector('.sidebar-toggle-btn');
                    if (toggleBtn) toggleBtn.textContent = '▼';
                } else {
                    nav.classList.add('collapsed');
                    const toggleBtn = header.querySelector('.sidebar-toggle-btn');
                    if (toggleBtn) toggleBtn.textContent = '▶';
                }
            }
        }
    });

    const sidebar = document.querySelector('.sidebar');
    if (sidebar && !sidebar.querySelector('.sidebar-search')) {
        const searchDiv = document.createElement('div');
        searchDiv.className = 'sidebar-search';
        searchDiv.innerHTML = `
            <button class="search-button" onclick="goToSearch()">搜索</button>
        `;
        sidebar.insertBefore(searchDiv, sidebar.firstChild);
    }
});
