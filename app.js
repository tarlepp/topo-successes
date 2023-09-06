const dateStart = luxon.DateTime.fromISO('2023-08-09', { zone: 'utc' });
const dateEnd = luxon.DateTime.fromISO('2024-06-01', { zone: 'utc' });
const ticks = dateEnd.diff(dateStart, 'days').toObject().days;
const goalPoints = 100;

async function init() {
    const data = await (await fetch('releases.json')).json();
    const points = data.reduce((accumulator, current) => accumulator + parseInt(current.body, 10), 0);

    updateDates();
    updateProgress(points);
}

function updateDates() {
    const x = luxon.DateTime.now().diff(dateStart, 'days').toObject().days;

    setElementInnerHtml('date-start', dateStart.toFormat('yyyy-MM-dd'));
    setElementInnerHtml('date-end', dateEnd.toFormat('yyyy-MM-dd'));

    getElementByClass('date-marker').style.left = `calc(100% * ${x / ticks})`;
}

function updateProgress(points) {
    setElementInnerHtml('points-status-current', points);
    setElementInnerHtml('points-status-goal', goalPoints.toString());

    getElementByClass('progress-status').style.width = `${(points > goalPoints ? goalPoints : points) / goalPoints * 100}%`;

    setElementInnerHtml('progress-status-percentage', `${Math.floor(points / goalPoints * 100)}%`);
}

function getElementByClass(className) {
    return document.getElementsByClassName(className)[0];
}

function setElementInnerHtml(className, value) {
    getElementByClass(className).innerHTML = value;
}

init().finally();

setInterval(() => init(), 900 * 1000);
