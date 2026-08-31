/* ------------------------- Load Components -------------------------------------------------- */
function loadComponents() {
    const basePath = getBasePath();

    $('#navigation-header').load(`${basePath}components/navigation.html`, function(response, status, xhr) {
        // console.log("Navigation status:", status);
        // console.log("Navigation URL:", `${basePath}components/navigation.html`);
        // console.log("Navigation response:", response);

        // if (status === "error") {
        //     console.error("Navigation error:", xhr.status, xhr.statusText);
        //     return;
        // }
        
        setNavigationLinks();
        setActiveNavigation();
    });
    $('#main-footer').load(`${basePath}components/footer.html`);
}

loadComponents();

// Add the 'selected' class to the current active page
function setActiveNavigation() {
    const currentPage = window.location.pathname.split("/").pop() || "index.html";

    $('#main-nav a').each(function() {
        const link = $(this);

        if (link.attr('href') === currentPage) {
            link.addClass('selected');
        }

        // submap projects included
        if ($('main[data-project-id]').length && link.is('[data-projects-nav]')) {
            link.addClass('selected');
        }
    });
}

// (re)direct the main navigation links to the correct pages
function setNavigationLinks() {
    const basePath = getBasePath();

    $('#main-nav a[data-root-link]').each(function() {
        const page = $(this).attr('href');

        $(this).attr('href', `${basePath}${page}`);
    });
}


/* ------------------------- Update Menu Color -------------------------------------------------- */

function updateNavigationColor() {
    const navigation = $('#open-menu-section');

    if (!navigation.length) return;

    const navRect = navigation[0].getBoundingClientRect();
    const navHeight = navRect.height;

    const darkSections = $('.dark-section');

    let isDark = false;

    darkSections.each(function () {
        const sectionRect = this.getBoundingClientRect();

        // Calculate how much the dark section overlaps the navigation
        const overlap = Math.min(navRect.bottom, sectionRect.bottom) -
                        Math.max(navRect.top, sectionRect.top);

        // Calculate what percentage of the navigation is overlapped
        const overlapPercentage = overlap / navHeight;

        // Change the navigation color when 50% or more is covered
        if (overlapPercentage >= 0.5) {
            isDark = true;
            return false; // stop .each()
        }
    });

    $(navigation).find('p').toggleClass('light', isDark);
    $(navigation).find('button').toggleClass('light', isDark);
}

$(window).on('scroll resize', updateNavigationColor);

function updateCopyrightColor() {
    const copyright = $('.copyright');

    if (!copyright.length) return;

    const navRect = copyright[0].getBoundingClientRect();
    const navHeight = navRect.height;

    const darkSections = $('.dark-section');

    let isDark = false;

    darkSections.each(function () {
        const sectionRect = this.getBoundingClientRect();

        // Calculate how much the dark section overlaps the copyright
        const overlap = Math.min(navRect.bottom, sectionRect.bottom) -
                        Math.max(navRect.top, sectionRect.top);

        // Calculate what percentage of the copyright is overlapped
        const overlapPercentage = overlap / navHeight;

        // Change the copyright color when 50% or more is covered
        if (overlapPercentage >= 0.5) {
            isDark = true;
            return false; // stop .each()
        }
    });

    $(copyright).toggleClass('light', isDark);
}

$(window).on('scroll resize', updateCopyrightColor);