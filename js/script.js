function documentReady() {
   console.log('document loaded!')
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

