function documentReady(projectPage = false) {
    //TODO: remove console.log
    console.log('document loaded!')

    if (projectPage) loadProject();
    else loadProjectCards();
}

//TODO: In the projects folder the navigation doesn't work
//      Also if I get any more subfolders this als doesn't work anymore.
//      Check if there is a better solution so everything goes from the root path
function getBasePath() {
    return window.location.pathname.includes('/projects/')
        ? '../'
        : './';
}

function openMainMenu() {
    document.getElementById('main-menu').hidden = false;
}

function closeMainMenu() {
    document.getElementById('main-menu').hidden = true;
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