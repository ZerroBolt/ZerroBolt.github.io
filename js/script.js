let form;

function documentReady() {
    form = document.getElementById('my-contact-form');
    form.addEventListener('submit', formHandler);
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

// function projectCardClicked(event) {
//     event.preventDefault();

//     let card = $(event.currentTarget).parent();
//     let cardContent = card.find('.project-info');
//     let cardTitle = card.find('.project-thumbnail');
//     console.log(card);

//     cardContent.toggleClass('hidden');
//     cardTitle.toggleClass('card-active');

//     // cardContent.fadeToggle('fast', function() {
//     //     cardContent.toggleClass('hidden');
//     //     cardTitle.toggleClass('card-active');
//     // });
// }

let currentlyActiveCard = null;

//TODO: Selected portfolio card should change color
function projectCardClicked(event) {
    event.preventDefault();

    const clickedCard = event.currentTarget;
    const templateId = clickedCard.getAttribute('data-template');
    const template = document.getElementById(templateId);
    const currentInfo = clickedCard.closest('.project-row').querySelector('.project-info');

    if (!template || !currentInfo) return;

    const isVisible = !currentInfo.classList.contains('hidden');

    // Close all other open cards
    document.querySelectorAll('.project-info:not(.hidden)').forEach(info => {
        if (info !== currentInfo) {
            $(info).fadeOut('fast', function () {
                info.innerHTML = '';
                info.classList.add('hidden');
            });
        }
    });

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