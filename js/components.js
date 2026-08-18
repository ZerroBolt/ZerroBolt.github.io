/* ------------------------- Load Components -------------------------------------------------- */
function loadComponents() {
    const basePath = getBasePath();

    $('#navigation-header').load(`${basePath}components/navigation.html`, setActiveNavigation);
    $('#main-footer').load(`${basePath}components/footer.html`);
}

loadComponents();

function setActiveNavigation() {
    const currentPage = window.location.pathname.split("/").pop() || "index.html";

    $('#main-nav a').each(function() {
        if ($(this).attr('href') === currentPage) {
            $(this).addClass('selected');
        }
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
    const copyright = $('#copyright');

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