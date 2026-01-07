// ===========================
// BIRTHDAY EXPERIENCE 3D - Boy Gamer Anime Neon Theme
// ===========================

// Global Variables
let scene, camera, renderer;
let experience = {
    inGame: false,
    currentRoom: null,
    soundEnabled: true,
    keys: {},
    mouseDown: false,
    mouseX: 0,
    mouseY: 0,
};

let cameraControl = {
    yaw: 0,
    pitch: 0,
    speed: 0.15,
    sensitivity: 0.005,
    targetPos: new THREE.Vector3(),
    currentPos: new THREE.Vector3(),
    targetLookAt: new THREE.Vector3(),
    currentLookAt: new THREE.Vector3(0, 1.5, -1),
};

let doors = [];
let gameState = {
    gamesWon: [false, false, false],
    currentGame: null,
};

// ===========================
// INITIALIZATION
// ===========================

function startExperience() {
    document.getElementById('landingPage').classList.add('hidden');
    document.getElementById('experienceContainer').classList.remove('experience-hidden');
    init3D();
}

function exitExperience() {
    // If currently in a room, go back to hallway instead of landing page
    if (experience.currentRoom) {
        exitRoom();
        return;
    }
    
    if (confirm('Exit experience and return to landing page?')) {
        document.getElementById('experienceContainer').classList.add('experience-hidden');
        document.getElementById('landingPage').classList.remove('hidden');
        if (renderer) {
            renderer.dispose();
            if (renderer.domElement && renderer.domElement.parentNode) {
                renderer.domElement.parentNode.removeChild(renderer.domElement);
            }
            renderer = null;
        }
        experience.inGame = false;
    }
}

function init3D() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0b0f3f); // deep blue soft-dark
    scene.fog = new THREE.Fog(0x0b0f3f, 50, 400);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 1.6, 0);
    cameraControl.currentPos = camera.position.clone();
    cameraControl.targetPos = camera.position.clone();

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const canvas = document.getElementById('canvas');
    if (canvas.parentNode) {
        canvas.parentNode.replaceChild(renderer.domElement, canvas);
    }
    renderer.domElement.id = 'canvas';

    const ambientLight = new THREE.AmbientLight(0x00ffff, 0.5); // neon cyan ambient
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xff00ff, 0.6); // neon magenta directional
    directionalLight.position.set(20, 20, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.far = 100;
    directionalLight.shadow.camera.left = -50;
    directionalLight.shadow.camera.right = 50;
    directionalLight.shadow.camera.top = 50;
    directionalLight.shadow.camera.bottom = -50;
    scene.add(directionalLight);

    createHouse();
    createDoors();
    setupInput();

    experience.inGame = true;
    animate();
}

// ===========================
// CREATE HOUSE / ROOMS
// ===========================
function createHouse() {
    if (experience.currentRoom === 'memory') {
        createMemoryRoom(scene);
    } else if (experience.currentRoom === 'game') {
        createGameRoom(scene);
    } else if (experience.currentRoom === 'birthday') {
        createBirthdayRoom(scene);
    } else {
        createMainHallway();
    }
}

// ===========================
// MAIN HALLWAY - Neon Anime
// ===========================
function createMainHallway() {
    const hallwayWidth = 12;
    const hallwayDepth = 10;
    const hallwayHeight = 10;

    // Floor
    const floorGeometry = new THREE.PlaneGeometry(hallwayWidth, hallwayDepth);
    const floorMaterial = new THREE.MeshStandardMaterial({
        color: 0x101020,  // soft dark floor
        roughness: 0.4,
        metalness: 0.3
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Walls
    const wallMaterial = new THREE.MeshStandardMaterial({
        color: 0xfaf9f6,  // deep navy background
        roughness: 0.4,
        side: THREE.DoubleSide
    });

    const halfWidth = hallwayWidth / 2;
    const halfDepth = hallwayDepth / 2;

    const frontWall = new THREE.Mesh(new THREE.PlaneGeometry(hallwayWidth, hallwayHeight), wallMaterial.clone());
    frontWall.position.z = -halfDepth;
    scene.add(frontWall);

    const backWall = new THREE.Mesh(new THREE.PlaneGeometry(hallwayWidth, hallwayHeight), wallMaterial.clone());
    backWall.position.z = halfDepth;
    backWall.rotation.y = Math.PI;
    scene.add(backWall);

    const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(hallwayDepth, hallwayHeight), wallMaterial.clone());
    leftWall.position.x = -halfWidth;
    leftWall.rotation.y = Math.PI / 2;
    scene.add(leftWall);

    const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(hallwayDepth, hallwayHeight), wallMaterial.clone());
    rightWall.position.x = halfWidth;
    rightWall.rotation.y = -Math.PI / 2;
    scene.add(rightWall);

    // Ceiling
    const ceilingMaterial = new THREE.MeshStandardMaterial({
        color: 0x0b0f3f, // same deep background
        roughness: 0.4,
        metalness: 0.3,
        side: THREE.DoubleSide
    });
    const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(hallwayWidth, hallwayDepth), ceilingMaterial);
    ceiling.position.y = hallwayHeight;
    ceiling.rotation.x = Math.PI / 2;
    scene.add(ceiling);

    // Floating spheres - neon cyan & magenta
    for (let i = 0; i < 8; i++) {
        const sphereGeom = new THREE.SphereGeometry(0.25, 16, 16);
        const sphereMat = new THREE.MeshStandardMaterial({
            color: i % 2 === 0 ? 0x00ffff : 0xff00ff,
            roughness: 0.2,
            metalness: 0.7,
            emissive: i % 2 === 0 ? 0x00ffff : 0xff00ff,
            emissiveIntensity: 0.6
        });
        const sphere = new THREE.Mesh(sphereGeom, sphereMat);
        sphere.position.set((i - 3.5) * 3, 7 + Math.random() * 1.5, -1 + Math.random() * 2);
        scene.add(sphere);
    }
}

// ===========================
// DOORS - Neon Colors
// ===========================
function createDoors() {
    if (experience.currentRoom) return;

    const doorConfig = [
        { x: -4, name: 'Photo Room',    color: 0x00ffff, roomId: 'memory' },
        { x:  0, name: 'Game Room',     color: 0x9b59ff, roomId: 'game' },
        { x:  4, name: 'Birthday Room', color: 0xff00ff, roomId: 'birthday' }
    ];

    const doorZ = -4.85;

    doorConfig.forEach((config, index) => {
        const frameGeometry = new THREE.BoxGeometry(2.2, 4.5, 0.15);
        const frameMaterial = new THREE.MeshStandardMaterial({
            color: 0xFFFFFF,
            roughness: 0.5,
            metalness: 0.3
        });

        const frame = new THREE.Mesh(frameGeometry, frameMaterial);
        frame.position.set(config.x, 2.25, doorZ);
        scene.add(frame);

        const doorGeometry = new THREE.PlaneGeometry(2, 4);
        const doorMaterial = new THREE.MeshStandardMaterial({
            color: config.color,
            roughness: 0.2,
            metalness: 0.7,
            emissive: config.color,
            emissiveIntensity: 0.6,
            side: THREE.DoubleSide
        });

        const door = new THREE.Mesh(doorGeometry, doorMaterial);
        door.position.set(config.x, 2.25, doorZ + 0.1);
        door.rotation.y = Math.PI;
        door.userData.roomId = config.roomId;
        door.userData.name = config.name;
        scene.add(door);

        const handleGeometry = new THREE.SphereGeometry(0.1, 16, 16);
        const handleMaterial = new THREE.MeshStandardMaterial({
            color: 0xf1c40f, // golden neon accent
            roughness: 0.2,
            metalness: 0.9
        });

        const handle = new THREE.Mesh(handleGeometry, handleMaterial);
        handle.position.set(0.8, 0, 0.05);
        door.add(handle);

        doors.push({
            index: index,
            mesh: door,
            frame: frame,
            position: new THREE.Vector3(config.x, 2.25, doorZ),
            name: config.name,
            roomId: config.roomId,
            isOpen: false,
            animationProgress: 0
        });
    });
}

// ===========================
// Remaining code (camera, input, mobile, interactions, animations) unchanged
// just make sure to use neon colors for HUD and confetti where needed
// ===========================

// ... all other functions remain exactly the same
// (setupInput, setupMobileControls, updateCamera, updateInteractionPrompt, checkDoorInteraction,
// animateDoorOpen, enterRoom, exitRoom, toggleAudio, playSound, animate, login interactions)


// Animate loop and penguin wave remain the same as your original code





function setupInput() {
    window.addEventListener('keydown', (e) => {
        experience.keys[e.key.toLowerCase()] = true;

        if (e.key === ' ') {
            e.preventDefault();
            checkDoorInteraction();
        }
        if (e.key === 'Escape') {
            exitRoom();
        }
    });

    window.addEventListener('keyup', (e) => {
        experience.keys[e.key.toLowerCase()] = false;
    });

    window.addEventListener('mousemove', (e) => {
        // Allow looking around with or without pointer lock
        const movementX = e.movementX || 0;
        const movementY = e.movementY || 0;
        
        if (movementX !== 0 || movementY !== 0) {
            cameraControl.yaw -= movementX * cameraControl.sensitivity;
            cameraControl.pitch -= movementY * cameraControl.sensitivity;
            cameraControl.pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, cameraControl.pitch));
        }
    });

    // Request pointer lock on click
    const canvas = renderer.domElement;
    canvas.addEventListener('click', () => {
        if (canvas.requestPointerLock) {
            canvas.requestPointerLock();
        } else if (canvas.mozRequestPointerLock) {
            canvas.mozRequestPointerLock();
        } else if (canvas.webkitRequestPointerLock) {
            canvas.webkitRequestPointerLock();
        }
    });

    // Exit pointer lock on ESC (handled by browser)
    document.addEventListener('pointerlockchange', () => {
        console.log('Pointer lock:', document.pointerLockElement === canvas ? 'locked' : 'unlocked');
    });

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

function setupMobileControls() {
    const experienceContainer = document.getElementById('experienceContainer');
    if (!experienceContainer) {
        console.error('❌ Experience container not found');
        return;
    }
    
    console.log('✅ Mobile touch controls initialized');
    
    let touchActive = false;

    function handleTouchMovement(touchX, touchY) {
        // Use screen center as reference point
        const screenCenterX = window.innerWidth / 2;
        const screenCenterY = window.innerHeight / 2;
        
        const deltaX = touchX - screenCenterX;
        const deltaY = touchY - screenCenterY;
        
        // Threshold: 20% of screen width/height
        const thresholdX = window.innerWidth * 0.2;
        const thresholdY = window.innerHeight * 0.2;
        
        // Set movement keys based on touch position
        experience.keys['a'] = deltaX > thresholdX;  // right side = move left (A)
        experience.keys['d'] = deltaX < -thresholdX; // left side = move right (D)
        experience.keys['w'] = deltaY > thresholdY;  // bottom side = move forward (W)
        experience.keys['s'] = deltaY < -thresholdY; // top side = move backward (S)
    }

    experienceContainer.addEventListener('touchstart', (e) => {
        if (e.touches.length > 0) {
            touchActive = true;
            handleTouchMovement(e.touches[0].clientX, e.touches[0].clientY);
        }
    }, { passive: true });

    experienceContainer.addEventListener('touchmove', (e) => {
        if (touchActive && e.touches.length > 0) {
            handleTouchMovement(e.touches[0].clientX, e.touches[0].clientY);
        }
    }, { passive: true });

    experienceContainer.addEventListener('touchend', (e) => {
        touchActive = false;
        experience.keys['w'] = false;
        experience.keys['a'] = false;
        experience.keys['s'] = false;
        experience.keys['d'] = false;
    }, { passive: true });
    
    // Setup OK button for interaction
    const okButton = document.getElementById('mobile-ok-btn');
    if (okButton) {
        okButton.addEventListener('pointerdown', (e) => {
            e.preventDefault();
            checkDoorInteraction();
            okButton.classList.add('active');
        }, true);
        
        okButton.addEventListener('pointerup', (e) => {
            okButton.classList.remove('active');
        }, true);
        
        okButton.addEventListener('pointercancel', (e) => {
            okButton.classList.remove('active');
        }, true);
    }
}
const mobileTapArea = document.getElementById("mobileTapArea");

// Call after game starts
function initMobileFeatures() {
    // Mobile features disabled
}



function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// ===========================
// GAME LOOP & UPDATES
// ===========================

function updateCamera() {
    // Calculate direction from pitch and yaw
    const direction = new THREE.Vector3(
        Math.sin(cameraControl.yaw) * Math.cos(cameraControl.pitch),
        Math.sin(cameraControl.pitch),
        -Math.cos(cameraControl.yaw) * Math.cos(cameraControl.pitch)
    );

    // Update target position based on movement
    const moveDir = new THREE.Vector3();
    if (experience.keys['w'] || experience.keys['arrowup']) moveDir.z -= cameraControl.speed;
    if (experience.keys['s'] || experience.keys['arrowdown']) moveDir.z += cameraControl.speed;
    if (experience.keys['a'] || experience.keys['arrowleft']) moveDir.x -= cameraControl.speed;
    if (experience.keys['d'] || experience.keys['arrowright']) moveDir.x += cameraControl.speed;

    // Rotate movement by camera yaw
    const rotated = new THREE.Vector3(
        moveDir.x * Math.cos(cameraControl.yaw) - moveDir.z * Math.sin(cameraControl.yaw),
        0,
        moveDir.x * Math.sin(cameraControl.yaw) + moveDir.z * Math.cos(cameraControl.yaw)
    );

    cameraControl.targetPos.add(rotated);

    // Clamp position based on current room
    if (experience.currentRoom === 'memory') {
        // Photo room boundaries - small room (14x14)
        cameraControl.targetPos.x = Math.max(-6.5, Math.min(6.5, cameraControl.targetPos.x));
        cameraControl.targetPos.z = Math.max(-6.5, Math.min(6.5, cameraControl.targetPos.z));
    } else if (experience.currentRoom === 'game') {
        // Game room boundaries - small room (14x14)
        cameraControl.targetPos.x = Math.max(-6.5, Math.min(6.5, cameraControl.targetPos.x));
        cameraControl.targetPos.z = Math.max(-6.5, Math.min(6.5, cameraControl.targetPos.z));
    } else if (experience.currentRoom === 'birthday') {
        // Birthday room boundaries - small room (14x14)
        cameraControl.targetPos.x = Math.max(-6.5, Math.min(6.5, cameraControl.targetPos.x));
        cameraControl.targetPos.z = Math.max(-6.5, Math.min(6.5, cameraControl.targetPos.z));
    } else {
        // Hallway boundaries - smaller hallway
        cameraControl.targetPos.x = Math.max(-5, Math.min(5, cameraControl.targetPos.x));
        cameraControl.targetPos.z = Math.max(-4, Math.min(4, cameraControl.targetPos.z));
    }

    // Smooth camera movement
    cameraControl.currentPos.lerp(cameraControl.targetPos, 0.1);
    camera.position.copy(cameraControl.currentPos);

    // Look at target
    cameraControl.targetLookAt.copy(cameraControl.currentPos).add(direction);
    cameraControl.currentLookAt.lerp(cameraControl.targetLookAt, 0.1);
    camera.lookAt(cameraControl.currentLookAt);

    // Update interaction prompt
    updateInteractionPrompt();
}

function updateInteractionPrompt() {
    const prompt = document.getElementById('interactionPrompt');
    let closestDoor = null;
    let closestDistance = Infinity;
    let closestGiftBox = null;
    let closestGiftDistance = Infinity;

    if (experience.currentRoom) {
        // In game room - check for gift boxes first
        if (experience.currentRoom === 'game' && window.gameRoomGiftBoxes) {
            window.gameRoomGiftBoxes.forEach(giftBox => {
                if (!giftBox.isOpened) {
                    const dist = cameraControl.currentPos.distanceTo(giftBox.position);
                    if (dist < closestGiftDistance) {
                        closestGiftDistance = dist;
                        closestGiftBox = giftBox;
                    }
                }
            });

            if (closestGiftDistance < 3 && closestGiftBox) {
                prompt.classList.remove('hidden');
                document.getElementById('promptText').textContent = `Open Gift Box ${closestGiftBox.index + 1}`;
                return;
            }
        }

        // In a room - show exit prompt (varies by room)
        let exitZ = -11.5; // Default for photo room
        if (experience.currentRoom === 'game') {
            exitZ = -7;
        } else if (experience.currentRoom === 'birthday') {
            exitZ = -12;
        }
        
        const exitPos = new THREE.Vector3(0, 1.6, exitZ);
        const dist = cameraControl.currentPos.distanceTo(exitPos);
        if (dist < 3) {
            prompt.classList.remove('hidden');
            document.getElementById('promptText').textContent = 'Return to Hallway';
            return;
        }
    } else {
        // In hallway - show door prompts
        doors.forEach(door => {
            if (!door.isOpen) {
                const dist = cameraControl.currentPos.distanceTo(door.position);
                if (dist < closestDistance) {
                    closestDistance = dist;
                    closestDoor = door;
                }
            }
        });

        if (closestDistance < 4.5 && closestDoor) {
            prompt.classList.remove('hidden');
            document.getElementById('promptText').textContent = `Enter ${closestDoor.name}`;
            return;
        }
    }

    prompt.classList.add('hidden');
}

function checkDoorInteraction() {
    if (experience.currentRoom) {
        // In game room - check for gift boxes first
        if (experience.currentRoom === 'game' && window.gameRoomGiftBoxes) {
            window.gameRoomGiftBoxes.forEach(giftBox => {
                if (!giftBox.isOpened) {
                    const dist = cameraControl.currentPos.distanceTo(giftBox.position);
                    if (dist < 3) {
                        openGiftBox(giftBox.gameIndex);
                        playSound(800, 0.2);
                        return;
                    }
                }
            });
        }

        // In a room - check for exit door (front wall, varies by room)
        let exitZ = -11.5; // Default for photo room
        if (experience.currentRoom === 'game') {
            exitZ = -7;
        } else if (experience.currentRoom === 'birthday') {
            exitZ = -12;
        }
        
        const exitDist = cameraControl.currentPos.distanceTo(new THREE.Vector3(0, 1.6, exitZ));
        if (exitDist < 3) {
            exitRoom();
            playSound(600, 0.1);
        }
    } else {
        // In hallway - check for entry doors
        doors.forEach(door => {
            const dist = cameraControl.currentPos.distanceTo(door.position);
            if (dist < 4.5 && !door.isOpen) {
                enterRoom(door.roomId);
                animateDoorOpen(door);
                playSound(600, 0.1);
            }
        });
    }
}

function animateDoorOpen(door) {
    door.isOpen = true;
    let progress = 0;
    const interval = setInterval(() => {
        progress += 0.05;
        door.mesh.rotation.y = (Math.PI / 2) * progress;
        if (progress >= 1) {
            clearInterval(interval);
        }
    }, 16);
}

function enterRoom(roomId) {
    // Clear everything first
    scene.clear();
    doors = [];

    // Re-add main lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(20, 20, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.far = 100;
    directionalLight.shadow.camera.left = -50;
    directionalLight.shadow.camera.right = 50;
    directionalLight.shadow.camera.top = 50;
    directionalLight.shadow.camera.bottom = -50;
    scene.add(directionalLight);

    experience.currentRoom = roomId;
    document.getElementById('roomName').textContent = 
        roomId === 'memory' ? '📸 Photo Gallery' : 
        roomId === 'game' ? '🎮 Game Room' : 
        '🎂 Birthday Room';

    // Recreate scene for room
    createHouse();

    // Position camera inside the room
    if (roomId === 'memory') {
        cameraControl.currentPos.set(0, 1.6, 0);
        cameraControl.targetPos.set(0, 1.6, 0);
    } else if (roomId === 'game') {
        cameraControl.currentPos.set(0, 1.6, 0);
        cameraControl.targetPos.set(0, 1.6, 0);
    } else if (roomId === 'birthday') {
        cameraControl.currentPos.set(0, 1.6, 0);
        cameraControl.targetPos.set(0, 1.6, 0);
    }
}

function exitRoom() {
    if (!experience.currentRoom) return;

    // Clear room
    scene.clear();
    doors = [];

    // Re-add main lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(20, 20, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.far = 100;
    directionalLight.shadow.camera.left = -50;
    directionalLight.shadow.camera.right = 50;
    directionalLight.shadow.camera.top = 50;
    directionalLight.shadow.camera.bottom = -50;
    scene.add(directionalLight);

    experience.currentRoom = null;
    document.getElementById('roomName').textContent = 'Main Hallway';

    // Reset and recreate hallway
    createHouse();
    createDoors();

    // Position back at hallway entrance
    cameraControl.currentPos.set(0, 1.6, 0);
    cameraControl.targetPos.set(0, 1.6, 0);
}

// ===========================
// MINI-GAMES
// ===========================
// All game functions have been moved to rooms/game-room.js
// They are exposed globally via window object

// ===========================
// BIRTHDAY ANIMATIONS
// ===========================
// playBirthdayAnimation() and playBirthdayMusic() have been moved to rooms/birthday-room.js

// ===========================
// UTILITIES
// ===========================

function toggleAudio() {
    experience.soundEnabled = !experience.soundEnabled;
    document.getElementById('audioToggle').textContent = experience.soundEnabled ? '🔊 Sound On' : '🔇 Sound Off';
}

function playSound(frequency, duration) {
    if (!experience.soundEnabled) return;

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();

    osc.connect(gain);
    gain.connect(audioContext.destination);

    osc.frequency.value = frequency;
    gain.gain.setValueAtTime(0.3, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

    osc.start(audioContext.currentTime);
    osc.stop(audioContext.currentTime + duration);
}

// ===========================
// ANIMATION LOOP
// ===========================

function animate() {
    requestAnimationFrame(animate);

    if (experience.inGame) {
        updateCamera();
    }

    // Only render if renderer exists (it may have been disposed)
    if (renderer && scene && camera) {
        renderer.render(scene, camera);
    }
}

// Start on page load
window.addEventListener('load', () => {
    console.log('Birthday Experience Ready! Click ENTER to begin.');
});

// ===========================
// LANDING + LOGIN INTERACTIONS
// ===========================

function showLogin() {
    const landing = document.getElementById('landingPage');
    const login = document.getElementById('loginScreen');
    if (landing) landing.classList.add('hidden');
    if (login) {
        login.classList.remove('hidden');
        login.setAttribute('aria-hidden', 'false');
        const input = document.getElementById('answerInput');
        if (input) input.focus();
        // start subtle animations
        document.getElementById('penguinSVG')?.classList.add('wave');
        const t = document.querySelector('.tulip-group');
        if (t) t.classList.add('sway');
        // gentle penguin wave loop
        startPenguinWave();
    }
}

function backToLanding() {
    const landing = document.getElementById('landingPage');
    const login = document.getElementById('loginScreen');
    if (login) {
        login.classList.add('hidden');
        login.setAttribute('aria-hidden', 'true');
    }
    if (landing) landing.classList.remove('hidden');
    stopPenguinWave();
}

function checkAnswer() {
    const input = document.getElementById('answerInput');
    const feedback = document.getElementById('loginFeedback');
    if (!input || !feedback) return;

    const value = (input.value || '').trim();
    const expected = 'penwin';

    if (value.toLowerCase() === expected.toLowerCase()) {
        feedback.textContent = 'Correct! Welcome 🎉';
        feedback.classList.remove('error');
        feedback.classList.add('success');
        spawnLoginConfetti(24);
        // short delay so user sees confetti before entering full experience
        setTimeout(() => {
            const login = document.getElementById('loginScreen');
            if (login) login.classList.add('hidden');
            startExperience();
        }, 900);
    } else {
        feedback.textContent = 'Not quite — try your name';
        feedback.classList.remove('success');
        feedback.classList.add('error');
        // small shake animation
        input.animate([
            { transform: 'translateX(0)' },
            { transform: 'translateX(-8px)' },
            { transform: 'translateX(6px)' },
            { transform: 'translateX(0)' }
        ], { duration: 300, easing: 'ease' });
    }
}
// Confetti neon colors
function spawnLoginConfetti(count = 20) {
    const login = document.getElementById('loginScreen');
    if (!login) return;
    let confettiContainer = login.querySelector('.login-confetti');
    if (!confettiContainer) {
        confettiContainer = document.createElement('div');
        confettiContainer.className = 'login-confetti';
        login.appendChild(confettiContainer);
    }

    for (let i = 0; i < count; i++) {
        const piece = document.createElement('div');
        piece.className = 'piece';
        piece.style.left = Math.random() * 100 + '%';
        piece.style.top = -10 + 'vh';
        piece.style.background = ['#00ffff','#ff00ff','#9b59ff','#f1c40f'][Math.floor(Math.random()*4)];
        piece.style.width = (6 + Math.random() * 8) + 'px';
        piece.style.height = (8 + Math.random() * 10) + 'px';
        piece.style.transform = `rotate(${Math.random() * 360}deg)`;
        piece.style.animationDelay = (Math.random() * 0.2) + 's';
        confettiContainer.appendChild(piece);
        setTimeout(() => piece.remove(), 2000 + Math.random() * 800);
    }
}

let _penguinWaveInterval = null;
function startPenguinWave() {
    const peng = document.getElementById('penguinSVG');
    if (!peng) return;
    _penguinWaveInterval = setInterval(() => {
        peng.classList.add('wave');
        setTimeout(() => peng.classList.remove('wave'), 700);
    }, 1400 + Math.random() * 800);
}

function stopPenguinWave() {
    const peng = document.getElementById('penguinSVG');
    if (peng) peng.classList.remove('wave');
    if (_penguinWaveInterval) {
        clearInterval(_penguinWaveInterval);
        _penguinWaveInterval = null;
    }
}
