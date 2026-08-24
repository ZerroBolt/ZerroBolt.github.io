/* ------------------------- General -------------------------------------------------- */
function documentReady(projectPage = false) {
    //TODO: remove console.log
    console.log('document loaded!')

    // based on the page load the correct project view
    if (projectPage) loadProjectPage();
    else loadProjectCards();

    updateNavigationColor();
    updateCopyrightColor();
}

// Function to get the root path of the website
function getBasePath() {
    const path = window.location.pathname;
    const directories = path.split('/').filter(Boolean);

    // Remove the filename
    if (directories.length > 0 && directories[directories.length - 1].includes('.')) {
        directories.pop();
    }

    return '../'.repeat(directories.length);
}

function getDateTime() {
    const now = new Date();

    const time = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Europe/Amsterdam',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    }).format(now);

    const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Europe/Amsterdam',
        timeZoneName: 'longOffset'
    }).formatToParts(now);

    let offset = parts.find(part => part.type === 'timeZoneName').value;

    offset = offset.replace(':00', '');

    return `${time} ${offset}`;
}

setInterval(function() {
    document.getElementById('localTime').textContent = getDateTime();
}, 1000);

/* ------------------------- Menu -------------------------------------------------- */

function openMainMenu() {
    document.getElementById('main-menu').hidden = false;
    $("body").addClass("menu-open");

    updateCopyrightColor();
}

function closeMainMenu() {
    document.getElementById('main-menu').hidden = true;
    $("body").removeClass("menu-open");

    updateCopyrightColor();
}

/* ------------------------- Load Project Cards -------------------------------------------------- */

function loadProjectCards() {
    const projectList = $('.project-list');

    if (!projectList.length) return;

    // Check if project list is set to featured only
    const featuredOnly = projectList.data('featured') === true;
    const basePath = getBasePath();

    // Set amount of projects per pagination
    const projectsPerPage = getProjectsPerPage();
    let currentPage = 1;

    $.getJSON(`${basePath}json/projects.json`, function (data) {
        let projects = data.projects;

        if (featuredOnly) {
            projects = projects.filter(function (project) {
                return project.featured;
            });
        }

        function displayProjects() {
            projectList.empty();

            const start = (currentPage - 1) * projectsPerPage;
            const end = start + projectsPerPage;

            const projectsToDisplay = projects.slice(start, end);

            projectsToDisplay.forEach(function (project) {
                projectList.append(createProjectCard(project, basePath));
            });
        }

        function createPagination() {
            const pagination = $('#project-pagination');

            if (!pagination.length) return;

            pagination.empty();

            const totalPages = Math.ceil(
                projects.length / projectsPerPage
            );

            if (totalPages < 2) return;

            for (let page = 1; page <= totalPages; page++) {
                const button = $(`
                    <button type="button">
                        ${page}
                    </button>
                `);

                if (page === currentPage) {
                    button.addClass('selected');
                }

                button.on('click', function () {
                    currentPage = page;

                    displayProjects();
                    createPagination();

                    // TODO: On the main page this scrolls all the way up to the top (hero)
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                });

                pagination.append(button);
            }
        }

        displayProjects();
        createPagination();
    });
} 

function createProjectCard(project, basePath) {
    const imagePath = `${basePath}${project.thumbnail}`;

    return `
        <article class="project-card">
            <a href="${project.link}" class="project-card-link">
                <img src="${imagePath}" alt="${project.title}">

                <div class="project-card-content">
                    <header class="project-card-header">
                        <h3>${project.title}</h3>

                        <div class="project-card-tags">
                            ${createProjectTags(project.tags)}
                        </div>
                    </header>

                    <p>${project.shortDescription}</p>
                </div>
            </a>
        </article>
    `;
}

function createProjectTags(tags) {
    return tags.map(function (tag) {
        return `<mark class='tag-mark'>${tag}</mark>`;
    }).join('');
}

const BREAKPOINTS = {
    mobile: 768,
    desktop: 1024
}

function getProjectsPerPage() {
    switch (getScreenSize()) {
        case 'mobile':
            return 5;

        case 'tablet':
            return 8;

        case 'desktop':
            return 12;
    }
}

function getScreenSize() {
    const width = window.innerWidth;

    if (width < BREAKPOINTS.mobile) {
        return 'mobile';
    }

    if (width < BREAKPOINTS.desktop) {
        return 'tablet';
    }

    return 'desktop';
}

let currentScreenSize = getScreenSize();

$(window).on('resize', function () {
    const newScreenSize = getScreenSize();

    if (newScreenSize !== currentScreenSize) {
        currentScreenSize = newScreenSize;

        currentPage = 1;

        //TODO: right now this gives errors
        // THis code is necessary when the window gets resized
        // displayProjects(currentPage);
        // createPagination();
    }
});

/* ------------------------- Load Project Page -------------------------------------------------- */

function loadProjectPage() {
    const projectId = $('main').data('project-id');
    const basePath = getBasePath();

    if (!projectId) return;

    $.getJSON(`${basePath}json/projects.json`, function (data) {
        const project = data.projects.find(function (project) {
            return project.id === projectId;
        });

        if (!project) return;

        fillProjectInfo(project);
    });
}

// Fill the project page
function fillProjectInfo(project){
    const basePath = getBasePath();
     
    //TODO: check if this can be simplified (like the projectCards)
    $('#project-title').text(project.title);
    $('#project-year').text(project.year);

    $('#project-thumbnail').attr('src', basePath + project.thumbnail);

    $('.project-tags').html(
        createProjectTags(project.tags)
    );
}