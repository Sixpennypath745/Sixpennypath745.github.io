var DLog = false;
console.log('lanyard.js: Dexrn: I put logging in here but you\'ll have to set \"DLog\" to true.')
function DexrnsFunnyLogger(message) {
	if (DLog) {
		console.log('lanyard.js: ' + message);
	}
}

const API_URL = 'https://api.lanyard.rest/v1';
const USERID = '485504221781950465';
const pfp = document.getElementById('pfp');
// const pfp2 = document.getElementById('pfp2');
const status = document.getElementById('status');
const statusDot = document.getElementById('status-dot');
const status2 = document.getElementById('status2');
const status3 = document.getElementById('status3');
// const status4 = document.getElementById('status4');
const username = document.getElementById('username');
const bigImage = document.getElementById('activity-big-image');
const smallImage = document.getElementById('activity-small-image');
const name = document.getElementById('activity-name');
const smallImageAlt = document.getElementById('activity-small-image-alt');
const state = document.getElementById('activity-state');
const details = document.getElementById('activity-detail');
const elapsed = document.getElementById('activity-elapsed');
// Dexrn -----
// It is currently 10:09 PM as I am writing this.
// Wanted to have more info about my Discord status on the website.
var disc_status;
var disc_platform;
var disc_isOffline;
DexrnsFunnyLogger('Dexrn: I hate this so I am adding debug logging here...');
DexrnsFunnyLogger('variables set');
async function fetchResponse(userId) {
    try {
        const res = await fetch(`${API_URL}/users/${userId}`);
        return await res.json();
    } catch (err) {
        console.error(err);
    }
}
async function setAvatar() {
    const {
        data: {
            discord_user: {
                avatar
            }
        }
    } = await fetchResponse(USERID);
    const fullUrl = `https://cdn.discordapp.com/avatars/${USERID}/${avatar}.webp?size=512`;
    pfp.src = fullUrl;
    DexrnsFunnyLogger('setAvatar');
    // pfp2.src = fullUrl;
}
async function setAvatarFrame() {
    const {
        data: {
            discord_status,
            active_on_discord_mobile,
            active_on_discord_web,
            active_on_discord_desktop
            // custom
        }
    } = await fetchResponse(USERID);
    // Dexrn: Jank incoming!
    switch (discord_status) {
    case 'online':
	 DexrnsFunnyLogger('Online');
        statusDot.style.background =
            '#3ba45d';
        status2.innerHTML = 'Online';
	 pfp.style.border = '2px solid #3ba45d';
        pfp.style.boxShadow = '0 0 20px #3ba45d';
        status2.style.cssText = 'color: #3ba45d; opacity: 1;';
        status3.style.cssText = 'color: #3ba45d; opacity: 1;';
        break;
    case 'dnd':
	 DexrnsFunnyLogger('DND (Do not disturb)');
        statusDot.style.background =
            '#ed4245';
	 pfp.style.border = '2px solid #ed4245';
        pfp.style.boxShadow = '0 0 20px #ed4245';
        status2.innerHTML = 'Do not disturb';
        status2.style.cssText = 'color: #ed4245; opacity: 1;';
        status3.style.cssText = 'color: #ed4245; opacity: 1;';
        break;
    case 'idle':
	 DexrnsFunnyLogger('Idle');
        statusDot.style.background =
            '#faa81a';
        status2.innerHTML = 'Idle';
	 pfp.style.border = '2px solid #faa81a';
        pfp.style.boxShadow = '0 0 20px #faa81a';
        status2.style.cssText = 'color: #faa81a; opacity: 1;';
        status3.style.cssText = 'color: #faa81a; opacity: 1;';
        break;
    case 'offline':
	 DexrnsFunnyLogger('Offline');
        statusDot.style.background =
            '#747e8c';
        statusDot.title = 'Offline';
        status2.innerHTML = "Offline";
	 pfp.style.border = '2px solid #747e8c';
        pfp.style.boxShadow = '0 0 20px #747e8c';
        status2.style.cssText = 'color: unset; opacity: 0.5;';
        disc_isOffline = true;
        break;
    default:
        DexrnsFunnyLogger('Unknown (default)');
	 statusDot.style.background =
            '#747e8c';
        statusDot.title = 'Unknown';
        status2.innerHTML = "Unknown";
	 pfp.style.border = '2px solid #747e8c';
        pfp.style.boxShadow = '0 0 20px #747e8c';
        status2.style.cssText = 'color: unset; opacity: 0.5;';
        disc_isOffline = true;
    }

const platformarray = [];

// Dexrn: I should make it show pictures instead.
if (active_on_discord_desktop == true) {
	DexrnsFunnyLogger('Platform(s): Desktop');
       platformarray.push(" Desktop");
}

if (active_on_discord_mobile == true) {
    DexrnsFunnyLogger('Platform(s): Mobile');
    platformarray.push(" Mobile");
}

if (active_on_discord_web == true) {
    DexrnsFunnyLogger('Platform(s): Web');
    platformarray.push(" Web");
}

disc_platform = platformarray;

if (disc_isOffline != true)
    // Dexrn: Best way I could think of doing it.
    status3.innerHTML = `Platforms in use: ${disc_platform}`
}

// Dexrn: Maybe I'll get this working one day.
/* if (custom) {
    status4.innerHTML = `Custom Status: ${custom}`
} */

async function setStatus() {
    const {
        data: {
            discord_status,
            activities
        }
    } = await fetchResponse(USERID);

    if (discord_status == 'offline') {
        return;
    }

    if (activities) {
	 DexrnsFunnyLogger('activities is true');
        const activityOfType4 = activities.find(m => m.type == 4);
        if (activityOfType4) {
            const { state } = activityOfType4;
            if (state) {
                status.innerHTML = `${state}`;
            }
        }
    }
}

async function setActivityBigImage() {
    const {
        data: {
            activities,
            spotify
        }
    } = await fetchResponse(USERID);
    const mostRecent = activities.filter(m => m.type !== 4).shift();
    if (!mostRecent?.assets?.large_image) {
	DexrnsFunnyLogger('No large_image');
        bigImage.style.display = 'none';
        return;
    } else {
        const imageLink = mostRecent.assets.large_image.includes("external") ? `https://media.discordapp.net/external/${mostRecent.assets.large_image.split("mp:external/")[1]}` :  `https://cdn.discordapp.com/app-assets/${mostRecent.application_id}/${mostRecent.assets.large_image}.png?size=256`;
        if (mostRecent.assets.large_image.includes("spotify")) {
            DexrnsFunnyLogger('spotify');
            bigImage.style.display = 'block';
            bigImage.src = spotify.album_art_url;
            bigImage.title =  spotify.album;
            return;
        }
    	bigImage.style.display = 'block';
    	DexrnsFunnyLogger('large_image set');
    	bigImage.src = imageLink;
    	bigImage.title = mostRecent.assets.large_text;
    }
}
async function setActivitySmallImage() {
    const {
        data: {
            activities
        }
    } = await fetchResponse(USERID);

    const mostRecent = activities.filter(m => m.type !== 4).shift();

    if (!mostRecent || !mostRecent?.assets?.small_image || mostRecent.assets.small_image.includes("spotify")) {
        smallImage.style.display = 'none';
        DexrnsFunnyLogger('small_image false or large_image includes "spotify"');
        // Dexrn: I was a dumbass and forgot to also not display if smallImage is false.
        smallImageAlt.style.display = 'none';
        return;
    }

    DexrnsFunnyLogger('small_image true');
    const imageLink = mostRecent.assets.small_image.includes("external") ? `https://media.discordapp.net/external/${mostRecent.assets.small_image.split("mp:external/")[1]}` : `https://cdn.discordapp.com/app-assets/${mostRecent.application_id}/${mostRecent.assets.small_image}.png?size=256`;

    if (!mostRecent.assets.large_image && mostRecent.assets.small_image) {
        smallImageAlt.style.display = 'block';
        smallImageAlt.src = imageLink;
        smallImageAlt.title = mostRecent.assets.small_text;
        smallImage.style.display = 'none';
        DexrnsFunnyLogger('show small image as large.');
    } else {
        smallImageAlt.style.display = 'none';
        smallImage.style.display = 'block';
        smallImage.src = imageLink;
        smallImage.title = mostRecent.assets.small_text;
        DexrnsFunnyLogger('show small image on top of large image.');
    }
}

async function setActivityName() {
    const {
        data: {
            activities
        }
    } = await fetchResponse(USERID);
    const mostRecent = activities.filter(m => m.type !== 4).shift();
    if (!mostRecent?.name) {
	 DexrnsFunnyLogger('No activity name');
        name.innerHTML = 'No activity';
        return;
    }
    DexrnsFunnyLogger('activity name set');
    name.style.display = 'block';
    name.innerHTML = mostRecent.name;
}
async function setActivityState() {
    const response = await fetchResponse(USERID);
    const activities = response.data.activities.filter(m => m.type !== 4);
    if (!activities.length) {
        state.style.display = 'none';
        return;
    }
    const mostRecent = activities.shift();
    if (!mostRecent.state) {
        state.style.display = 'none';
        return;
    }

    state.style.display = 'block';
    state.innerHTML = mostRecent.state;

    const created = mostRecent.timestamps.start;

    const current = new Date().getTime();
    const diff = current - created;
    
    const seconds = Math.floor(diff / 1000) % 60;
    const minutes = Math.floor(diff / (1000 * 60)) % 60;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    const formattime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    elapsed.innerHTML = 'Time Elapsed: ' + formattime;
}
async function setActivityDetails() {
    const response = await fetchResponse(USERID);

    const activities = response.data.activities.filter(m => m.type !== 4);
    if (!activities.length) {
        details.style.display = 'none';
        return;
    }
    const mostRecent = activities.shift();
    if (!mostRecent.details) {
        details.style.display = 'none';
        return;
    }
    details.style.display = 'block';
    details.innerHTML = mostRecent.details;
}

function presenceInvoke() {
    setActivityBigImage();
    setActivitySmallImage();
    setActivityName();
    setActivityState();
    setActivityDetails();
}

function statusInvoke() {
    setStatus();
    setAvatarFrame();
}

function invoke() {
    setInterval(() => {
        presenceInvoke();
        statusInvoke();
    }, 1000);
    setAvatar();
}

invoke();
