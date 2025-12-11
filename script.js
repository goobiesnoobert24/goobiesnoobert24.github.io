const centerPhoto = document.getElementById('centerPhoto');
const followerPhoto = document.getElementById('followerPhoto');
const backgroundSound = document.getElementById('backgroundSound');
const clickSound = document.getElementById('clickSound');
const body = document.body;
const followerPosition = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
};
const followerTarget = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
};

function tryStartBackgroundSound() {
    backgroundSound.play().catch(() => {
        const kickstart = () => {
            backgroundSound.play().catch(() => {});
        };
        document.addEventListener('click', function handler() {
            document.removeEventListener('click', handler);
            kickstart();
        });
    });
}

tryStartBackgroundSound();

centerPhoto.addEventListener('click', () => {
    centerPhoto.classList.add('spin');
    backgroundSound.currentTime = 0;
    backgroundSound.play().catch(() => {});
    clickSound.currentTime = 0;
    clickSound.play();
    setTimeout(() => {
        centerPhoto.classList.remove('spin');
    }, 1000);
});

window.addEventListener('mousemove', (event) => {
    followerTarget.x = event.clientX;
    followerTarget.y = event.clientY;
});

function createFallingPhoto() {
    const batchCount = 2 + Math.floor(Math.random() * 3);
    for (let i = 0; i < batchCount; i += 1) {
        const photo = document.createElement('img');
        photo.className = 'falling-photo';
        photo.src = 'images/eyes-removebg-preview.png';
        photo.style.left = Math.random() * 100 + '%';

        const duration = 2 + Math.random() * 2.5;
        photo.style.animationDuration = duration + 's';

        body.appendChild(photo);

        setTimeout(() => {
            photo.remove();
        }, duration * 1000);
    }
}

setInterval(createFallingPhoto, 200);

function animateFollower(timestamp = 0) {
    const dxToCursor = followerTarget.x - followerPosition.x;
    const dyToCursor = followerTarget.y - followerPosition.y;
    const distanceToCursor = Math.hypot(dxToCursor, dyToCursor);
    const hoverOffset = 70;
    let targetX = followerTarget.x;
    let targetY = followerTarget.y;

    if (distanceToCursor > 1) {
        const ux = dxToCursor / distanceToCursor;
        const uy = dyToCursor / distanceToCursor;
        const offsetAmount = distanceToCursor > hoverOffset
            ? hoverOffset
            : Math.max(distanceToCursor * 0.35, 10);
        targetX -= ux * offsetAmount;
        targetY -= uy * offsetAmount;
    }

    followerPosition.x += (targetX - followerPosition.x) * 0.02;
    followerPosition.y += (targetY - followerPosition.y) * 0.02;

    const dx = followerTarget.x - followerPosition.x;
    const dy = followerTarget.y - followerPosition.y;
    const distance = Math.hypot(dx, dy);
    let nextSrc = 'images/front-facing.png';
    let scaleX = 1;

    if (distance < 130) {
        nextSrc = 'images/laying.png';
    } else if (Math.abs(dx) > Math.abs(dy)) {
        nextSrc = 'images/sideways.png';
        if (dx > 0) {
            scaleX = -1;
        }
    } else if (dy > 0) {
        nextSrc = 'images/front-facing.png';
    } else {
        nextSrc = 'images/away-facing.png';
    }

    if (followerPhoto.getAttribute('src') !== nextSrc) {
        followerPhoto.src = nextSrc;
    }

    const wobble = Math.sin(timestamp / 240) * 10;
    const bounceOffset = Math.sin(timestamp / 320) * 8;
    followerPhoto.style.transform = `translate(${followerPosition.x}px, ${followerPosition.y + bounceOffset}px) translate(-50%, -50%) scaleX(${scaleX}) rotate(${wobble}deg)`;

    requestAnimationFrame(animateFollower);
}

requestAnimationFrame(animateFollower);
