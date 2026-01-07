// =====================
// MEMORY ROOM (Photo Gallery) - Gamer Neon Theme
// =====================

function createMemoryRoom(scene) {

    // FLOOR - dark with subtle neon reflection
    const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(20, 24),
        new THREE.MeshStandardMaterial({ 
            color: 0x111111, 
            roughness: 0.6, 
            metalness: 0.2 
        })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // WALLS - dark gray with subtle cyan accents
    const wallMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a1a1a, 
        roughness: 0.7,
        metalness: 0.1,
        emissive: 0x002f4f, // soft neon glow
        emissiveIntensity: 0.1
    });

    // Front wall (exit to hallway)
    const frontWall = new THREE.Mesh(
        new THREE.PlaneGeometry(20, 12),
        wallMaterial.clone()
    );
    frontWall.position.z = -12;
    frontWall.receiveShadow = true;
    scene.add(frontWall);

    // Back wall (photo wall)
    const backWall = new THREE.Mesh(
        new THREE.PlaneGeometry(20, 12),
        wallMaterial.clone()
    );
    backWall.position.z = 12;
    backWall.rotation.y = Math.PI;
    backWall.receiveShadow = true;
    scene.add(backWall);

    // Left wall
    const leftWall = new THREE.Mesh(
        new THREE.PlaneGeometry(24, 12),
        wallMaterial.clone()
    );
    leftWall.position.x = -10;
    leftWall.rotation.y = Math.PI / 2;
    leftWall.receiveShadow = true;
    scene.add(leftWall);

    // Right wall
    const rightWall = new THREE.Mesh(
        new THREE.PlaneGeometry(24, 12),
        wallMaterial.clone()
    );
    rightWall.position.x = 10;
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.receiveShadow = true;
    scene.add(rightWall);

    // Ceiling - darker with neon hints
    const ceilingMaterial = new THREE.MeshStandardMaterial({
        color: 0x111111,
        roughness: 0.5,
        metalness: 0.2,
        emissive: 0x003366,
        emissiveIntensity: 0.05
    });
    const ceiling = new THREE.Mesh(
        new THREE.PlaneGeometry(20, 24),
        ceilingMaterial
    );
    ceiling.position.y = 12;
    ceiling.rotation.x = Math.PI / 2;
    ceiling.receiveShadow = true;
    scene.add(ceiling);

    // NEON accent lighting
    const pointLight = new THREE.PointLight(0x00f0ff, 1.2, 30); // cyan neon
    pointLight.position.set(0, 10, 0);
    pointLight.castShadow = true;
    scene.add(pointLight);

    const ambientLight = new THREE.AmbientLight(0x003344, 0.5); // subtle neon fill
    scene.add(ambientLight);

    // Add framed photos
    addFramedPhotos(scene);
}

function addFramedPhotos(scene) {
    const imagePaths = [];
    for (let i = 1; i <= 14; i++) imagePaths.push(`a${i}.jpg`);

    const loader = new THREE.TextureLoader();
    const frameDepth = 0.12;

    // Frames: dark metallic with neon edge
    const frameMaterialBase = new THREE.MeshStandardMaterial({
        color: 0x222222,
        roughness: 0.4,
        metalness: 0.5,
        emissive: 0x00f0ff,
        emissiveIntensity: 0.2
    });

    let idx = 0;

    const frontPositions = [
        { x: -7.5, y: 9.5, z: -11.8, rot: Math.PI },
        { x: -2.5, y: 3, z: -11.8, rot: Math.PI },
        { x: 2.5, y: 9.5, z: -11.8, rot: Math.PI },
        { x: 7.5, y: 3, z: -11.8, rot: Math.PI },
    ];

    const backPositions = [
        { x: -7.5, y: 3, z: 11.8, rot: 0 },
        { x: -2.5, y: 9.5, z: 11.8, rot: 0 },
        { x: 2.5, y: 3, z: 11.8, rot: 0 },
        { x: 7.5, y: 9.5, z: 11.8, rot: 0 },
    ];

    const leftPositions = [
        { x: -10, y: 9.5, z: 9, rot: Math.PI / 2 },
        { x: -10, y: 3, z: 0, rot: Math.PI / 2 },
        { x: -10, y: 9.5, z: -9, rot: Math.PI / 2 },
    ];

    const rightPositions = [
        { x: 10, y: 3, z: 9, rot: -Math.PI / 2 },
        { x: 10, y: 9.5, z: 0, rot: -Math.PI / 2 },
        { x: 10, y: 3, z: -9, rot: -Math.PI / 2 },
    ];

    const allPositions = [...frontPositions, ...backPositions, ...leftPositions, ...rightPositions];
    for (let pos of allPositions) {
        if (idx >= imagePaths.length) break;
        createFrameAndPhoto(pos.x, pos.y, pos.z, pos.rot, imagePaths[idx++]);
    }

    function createFrameAndPhoto(x, y, z, rotY, imgPath) {
        const w = 5.0;
        const h = 6.0;

        // Frame
        const frameGeometry = new THREE.BoxGeometry(w, h, frameDepth);
        const frame = new THREE.Mesh(frameGeometry, frameMaterialBase.clone());
        frame.position.set(x, y, z);
        frame.rotation.y = rotY || 0;
        frame.castShadow = true;
        frame.receiveShadow = true;
        scene.add(frame);

        // Photo plane
        const photoGeometry = new THREE.PlaneGeometry(w - 0.2, h - 0.2);
        const photoMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            side: THREE.DoubleSide
        });
        const photo = new THREE.Mesh(photoGeometry, photoMaterial);
        const offset = 0.08;
        photo.position.set(x + Math.sin(rotY || 0) * offset, y, z - Math.cos(rotY || 0) * offset);
        photo.rotation.y = rotY || 0;
        photo.castShadow = true;
        photo.receiveShadow = true;
        scene.add(photo);

        // Load texture
        loader.load(imgPath, (texture) => {
            texture.encoding = THREE.sRGBEncoding;
            photo.material.map = texture;
            photo.material.needsUpdate = true;
            console.log('✓ Loaded:', imgPath);
        }, undefined, (err) => {
            console.error('✗ Failed to load', imgPath, err);
        });
    }
}

window.createMemoryRoom = createMemoryRoom;
