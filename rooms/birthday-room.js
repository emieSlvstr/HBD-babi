// =====================
// BIRTHDAY ROOM - Lively Version with Confetti
// =====================

function createBirthdayRoom(scene) {
    const roomSize = 10;
    const roomHeight = 8;

    // Pink floor
    const floorGeometry = new THREE.PlaneGeometry(roomSize, roomSize);
    const floorMaterial = new THREE.MeshStandardMaterial({
        color: 0xff9ff3,
        roughness: 0.8,
        metalness: 0
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Pastel walls
    const wallMaterial = new THREE.MeshStandardMaterial({
        color: 0xfef5ef,
        roughness: 0.7,
        metalness: 0,
        side: THREE.DoubleSide
    });
    const wallHeight = roomHeight;
    const halfSize = roomSize / 2;

    const createWall = (x, z, ry) => {
        const wall = new THREE.Mesh(
            new THREE.PlaneGeometry(roomSize, wallHeight),
            wallMaterial.clone()
        );
        wall.position.set(x, wallHeight / 2, z);
        wall.rotation.y = ry;
        wall.receiveShadow = true;
        scene.add(wall);
    };
    createWall(0, -halfSize, 0);
    createWall(0, halfSize, Math.PI);
    createWall(-halfSize, 0, Math.PI / 2);
    createWall(halfSize, 0, -Math.PI / 2);

    // Ceiling
    const ceilingMaterial = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        roughness: 0.5,
        metalness: 0.3,
        side: THREE.DoubleSide
    });
    const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(roomSize, roomSize), ceilingMaterial);
    ceiling.position.y = wallHeight;
    ceiling.rotation.x = Math.PI / 2;
    scene.add(ceiling);

    // Warm point light
    const pointLight = new THREE.PointLight(0xffb84d, 1.3, 25);
    pointLight.position.set(0, wallHeight - 2, 0);
    pointLight.castShadow = true;
    scene.add(pointLight);

    // Add lively decorations
    addBirthdayDecor(scene, roomSize, wallHeight);

    // Start animation loop
    animateBirthdayRoom(scene);
}

function addBirthdayDecor(scene, roomSize, wallHeight) {
    const halfSize = roomSize / 2;

    // Banner area: no balloons in this zone (back wall)
    const bannerZMin = halfSize - 1.5;

    // Balloons
    const balloonColors = [0xff6b6b, 0xffd700, 0xff69b4, 0x00d4ff, 0x4ecdc4, 0xff9ff3, 0xff6b9d, 0xffb347];
    const numBalloons = 100;
    window.balloons = [];

    for (let i = 0; i < numBalloons; i++) {
        const balloonGeometry = new THREE.SphereGeometry(0.25, 16, 16);
        const colorIndex = Math.floor(Math.random() * balloonColors.length);
        const balloonMaterial = new THREE.MeshStandardMaterial({
            color: balloonColors[colorIndex],
            roughness: 0.4,
            metalness: 0.2,
            emissive: balloonColors[colorIndex],
            emissiveIntensity: 0.3
        });
        const balloon = new THREE.Mesh(balloonGeometry, balloonMaterial);

        // Position outside banner zone
        let zPos, attempts = 0;
        do {
            zPos = (Math.random() - 0.5) * (roomSize - 1);
            attempts++;
        } while (zPos > bannerZMin && attempts < 10);

        balloon.position.set(
            (Math.random() - 0.5) * (roomSize - 1),
            Math.random() * (wallHeight - 1) + 1,
            zPos
        );

        balloon.castShadow = true;
        scene.add(balloon);

        balloon.userData = { speed: 0.003 + Math.random() * 0.004, direction: Math.random() > 0.5 ? 1 : -1 };
        window.balloons.push(balloon);
    }

    // Big cake
    const cakeSize = 2.2, cakeHeight = 1.2;
    const cakeGeometry = new THREE.BoxGeometry(cakeSize, cakeHeight, cakeSize);
    const cakeMaterial = new THREE.MeshStandardMaterial({ color: 0x4052D6, roughness: 0.6 });
    const cake = new THREE.Mesh(cakeGeometry, cakeMaterial);
    cake.position.set(0, cakeHeight / 2, halfSize - 1);
    scene.add(cake);

    const frostingGeometry = new THREE.BoxGeometry(cakeSize + 0.1, 0.15, cakeSize + 0.1);
    const frostingMaterial = new THREE.MeshStandardMaterial({ color: 0x98fbcb, roughness: 0.4 });
    const frosting = new THREE.Mesh(frostingGeometry, frostingMaterial);
    frosting.position.set(0, cakeHeight, halfSize - 1);
    scene.add(frosting);

    // Candles with lights
    window.candleLights = [];
    for (let i = 0; i < 5; i++) {
        const candleGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.6, 8);
        const candleMaterial = new THREE.MeshStandardMaterial({
            color: 0xffd700, roughness: 0.3, metalness: 0.5, emissive: 0xffaa00, emissiveIntensity: 0.5
        });
        const candle = new THREE.Mesh(candleGeometry, candleMaterial);
        candle.position.set((i - 2) * 0.5, cakeHeight + 0.4, halfSize - 1);
        scene.add(candle);

        const flame = new THREE.PointLight(0xffaa00, 0.6, 3);
        flame.position.set(candle.position.x, candle.position.y + 0.3, candle.position.z);
        flame.userData = { baseIntensity: 0.6 };
        scene.add(flame);
        window.candleLights.push(flame);
    }

    // Banner
    const bannerWidth = 5, bannerHeight = 2;
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 256;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#ffd700');
    gradient.addColorStop(0.5, '#ff69b4');
    gradient.addColorStop(1, '#ffd700');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#ff1493';
    ctx.lineWidth = 4;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 48px Arial';
    ctx.strokeText('Happy Birthday', canvas.width / 2, canvas.height / 2 - 30);
    ctx.fillText('Happy Birthday', canvas.width / 2, canvas.height / 2 - 30);
    ctx.font = 'bold 56px Arial';
    ctx.strokeText('Angelo!', canvas.width / 2, canvas.height / 2 + 40);
    ctx.fillText('Angelo!', canvas.width / 2, canvas.height / 2 + 40);

    const texture = new THREE.CanvasTexture(canvas);
    const bannerMaterial = new THREE.MeshStandardMaterial({ map: texture, side: THREE.DoubleSide });
    const banner = new THREE.Mesh(new THREE.PlaneGeometry(bannerWidth, bannerHeight), bannerMaterial);
    banner.position.set(0, 3.5, halfSize - 0.1);
    banner.rotation.y = Math.PI;
    scene.add(banner);

    // Confetti container
    window.confettiParticles = [];
}

// ===========================
// ANIMATION LOOP
// ===========================
function animateBirthdayRoom(scene) {
    requestAnimationFrame(() => animateBirthdayRoom(scene));

    // Float balloons
    if (window.balloons) {
        window.balloons.forEach(b => {
            b.position.y += b.userData.speed;
            b.position.x += b.userData.speed * b.userData.direction;
            if (b.position.y > 8) b.position.y = 1 + Math.random();
        });
    }

    // Flicker candle lights
    if (window.candleLights) {
        window.candleLights.forEach(f => {
            f.intensity = f.userData.baseIntensity + Math.random() * 0.3;
        });
    }

    // Occasionally spawn confetti over cake
    if (Math.random() < 0.03) spawnConfetti(scene);
}

// ===========================
// CONFETTI SYSTEM
// ===========================
function spawnConfetti(scene) {
    const colors = [0xff2a66, 0xffb86b, 0x3fb8ff, 0x7c3aed, 0xffd700, 0xff69b4];
    for (let i = 0; i < 20; i++) {
        const geom = new THREE.BoxGeometry(0.1, 0.1, 0.02);
        const mat = new THREE.MeshStandardMaterial({ color: colors[Math.floor(Math.random()*colors.length)] });
        const confetti = new THREE.Mesh(geom, mat);
        confetti.position.set(
            (Math.random() - 0.5) * 1.5,
            5 + Math.random() * 2,
            4.5 + Math.random() * 0.5
        );
        confetti.userData = { speedY: 0.02 + Math.random()*0.02, rotationSpeed: 0.1 + Math.random()*0.1 };
        scene.add(confetti);
        window.confettiParticles.push(confetti);
    }

    // Update confetti
    window.confettiParticles.forEach((c, idx) => {
        c.position.y -= c.userData.speedY;
        c.rotation.x += c.userData.rotationSpeed;
        c.rotation.y += c.userData.rotationSpeed;
        if (c.position.y < 0) {
            scene.remove(c);
            window.confettiParticles.splice(idx, 1);
        }
    });
}

// ===========================
// EXPOSE FUNCTIONS
// ===========================
window.createBirthdayRoom = createBirthdayRoom;
window.addBirthdayDecor = addBirthdayDecor;
window.animateBirthdayRoom = animateBirthdayRoom;
