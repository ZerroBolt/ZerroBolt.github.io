function documentReady(projectPage = false) {
    //TODO: remove console.log
    console.log('document loaded!')

    // based on the page load the correct project view
    if (projectPage) loadProject();
    else loadProjectCards();
}

// function to get the root path of the website
function getBasePath() {
    const path = window.location.pathname;
    const directories = path.split('/').filter(Boolean);

    //remove the filename
    if (directories.length > 0 && directories[directories.length - 1].includes('.')) {
        directories.pop();
    }

    return '../'.repeat(directories.length);
}

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

/* ------------------------- Load Projects -------------------------------------------------- */

function loadProjectCards() {
    const projectList = $('.project-list');

    if (!projectList.length) return;

    const featuredOnly = projectList.data('featured') === true;
    const basePath = getBasePath();

    $.getJSON(`${basePath}json/projects.json`, function (data) {
        let projects = data.projects;

        if (featuredOnly) {
            projects = projects.filter(function (project) {
                return project.featured;
            });
        }

        projects.forEach(function (project) {
            projectList.append(createProjectCard(project, basePath));
        });
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
        return `<mark>${tag}</mark>`;
    }).join('');
}

function loadProject() {
    const projectId = $('main').data('project-id');
    const basePath = getBasePath();

    if (!projectId) return;

    $.getJSON(`${basePath}json/projects.json`, function (data) {
        const project = data.projects.find(function (project) {
            return project.id === projectId;
        });

        if (!project) return;

        // Fill the project page
        //TODO: check if this can be simplified (like the projectCards)
        $('#project-title').text(project.title);
        $('#project-year').text(project.year);
        $('#project-description').text(project.shortDescription);

        $('.project-tags').html(
            createProjectTags(project.tags)
        );
    });
}