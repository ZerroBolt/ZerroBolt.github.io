let form;

function documentReady() {
    const hamburger = $('.hamburger');
    const navLinks = $('.nav-links');

    form = document.getElementById('my-contact-form');
    form.addEventListener('submit', formHandler);

    // Toggle menu when hamburger clicked
    hamburger.on('click', function (e) {
        e.stopPropagation(); // prevent event bubbling up to document
        navLinks.toggleClass('active');
    });

    // Close menu when clicking on a nav link
    navLinks.find('a').on('click', function () {
        navLinks.removeClass('active');
    });

    $(document).on('click', function (e) {
        // Check if the click target is NOT inside hamburger or nav-links
        if (
            !hamburger.is(e.target) &&
            hamburger.has(e.target).length === 0 &&
            !navLinks.is(e.target) &&
            navLinks.has(e.target).length === 0
        ) {
            navLinks.removeClass('active');
        }
    });
}

window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

function experienceCardClicked(event) {
    event.preventDefault();

    let card = $(event.currentTarget).parent();
    let cardContent = card.find('.card-content');
    let cardTitle = card.find('.card-title');

    // cardContent.stop(true, true).fadeToggle('fast', function() {
    //     if (cardContent.hasClass('hidden')) {
    //         cardContent.removeClass('hidden');
    //     }
    // });

    cardContent.toggleClass('hidden');
    cardTitle.toggleClass('card-active');
}

let currentlyActiveCard = null;

//TODO: Selected portfolio card should change color
function projectCardClicked(event) {
    event.preventDefault();

    const isMobile = window.innerWidth <= 1200; // mobile breakpoint

    const clickedCard = event.currentTarget;
    const templateId = clickedCard.getAttribute('data-template');
    const template = document.getElementById(templateId);

    let currentInfo;
    if (isMobile) {
        // Mobile: get the project-info inside the same wrapper
        const wrapper = clickedCard.closest('.project-wrapper');
        currentInfo = wrapper.querySelector('.project-info-mobile');
    }
    else {
        // Desktop: get the shared project-info container inside the row
        const currentRow = clickedCard.closest('.project-row');
        currentInfo = currentRow.querySelector('.project-info-desktop');
    }

    if (!template || !currentInfo) return;

    const isVisible = !currentInfo.classList.contains('hidden');

    // Close all other open cards
    if (isMobile) {
        document.querySelectorAll('.project-info-mobile:not(.hidden)').forEach(info => {
            if (info !== currentInfo) {
                $(info).fadeOut('fast', function () {
                    info.innerHTML = '';
                    info.classList.add('hidden');
                });
            }
        });
    }
    else {
        document.querySelectorAll('.project-info-desktop:not(.hidden)').forEach(info => {
            if (info !== currentInfo) {
                $(info).fadeOut('fast', function () {
                    info.innerHTML = '';
                    info.classList.add('hidden');
                });
            }
        });
    }

    // Toggle off if same card clicked again
    if (isVisible && clickedCard === currentlyActiveCard) {
        $(currentInfo).fadeOut('fast', function () {
            currentInfo.innerHTML = '';
            currentInfo.classList.add('hidden');
            currentlyActiveCard = null;
        });
        return;
    }

    // Show new card content
    currentInfo.innerHTML = '';
    currentInfo.appendChild(template.content.cloneNode(true));
    $(currentInfo).hide().removeClass('hidden').fadeIn('fast');
    currentlyActiveCard = clickedCard;
}

function formHandler(event) {
    event.preventDefault();

    // const name = form.elements.name.value;
    // const email = form.elements.email.value;
    // const subject = form.elements.subject.value;
    // const message = form.elements.message.value;

    // console.log(name + ": " + message);

    $('.send-button').text("Message Sent!");

    setTimeout(() => {
        form.reset();
        $('.send-button').text("Send");
    }, 2000);
}