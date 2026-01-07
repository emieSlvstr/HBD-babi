// =====================
// GAME ROOM
// =====================

// Global array to store gift boxes for interaction
window.gameRoomGiftBoxes = [];

function createGameRoom(scene) {
    // Game room: colorful and fun - small (14x14)
    const floorGeometry = new THREE.PlaneGeometry(14, 14);
    const floorMaterial = new THREE.MeshStandardMaterial({
        color: 0x6bcfff, // neon cyan floor
        roughness: 0.7,
        metalness: 0
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Vibrant neon walls
    const wallMaterial = new THREE.MeshStandardMaterial({
        color: 0xfff9e6, // soft cream
        roughness: 0.6,
        metalness: 0,
        side: THREE.DoubleSide
    });

    const walls = [
        { x: 0, y: 5, z: -7, rotY: 0 },     // Front wall
        { x: 0, y: 5, z: 7, rotY: Math.PI }, // Back wall
        { x: -7, y: 5, z: 0, rotY: Math.PI / 2 }, // Left
        { x: 7, y: 5, z: 0, rotY: -Math.PI / 2 }  // Right
    ];

    walls.forEach(w => {
        const wall = new THREE.Mesh(new THREE.PlaneGeometry(14, 10), wallMaterial.clone());
        wall.position.set(w.x, w.y, w.z);
        wall.rotation.y = w.rotY;
        wall.receiveShadow = true;
        scene.add(wall);
    });

    // Ceiling
    const ceilingMaterial = new THREE.MeshStandardMaterial({
        color: 0xffe4e1, // soft pink
        roughness: 0.6,
        metalness: 0,
        side: THREE.DoubleSide
    });
    const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(14, 14), ceilingMaterial);
    ceiling.position.y = 10;
    ceiling.rotation.x = Math.PI / 2;
    ceiling.receiveShadow = true;
    scene.add(ceiling);

    // Bright point light
    const pointLight = new THREE.PointLight(0xffdd99, 1.2);
    pointLight.position.set(0, 8, 0);
    pointLight.castShadow = true;
    scene.add(pointLight);

    // Add gift boxes
    addGiftBoxes(scene);
}

function addGiftBoxes(scene) {
    // Clear previous
    window.gameRoomGiftBoxes = [];

    const giftBoxColors = [
        { main: 0x1de9b6, ribbon: 0x00ffe0 }, // neon cyber teal
        { main: 0xff6b9d, ribbon: 0xff1493 }, // hot pink
        { main: 0xffe66d, ribbon: 0xffb347 }  // yellow
    ];

    const positions = [
        { x: -4, z: 2 },
        { x: 0, z: 3 },
        { x: 4, z: 2 }
    ];

    positions.forEach((pos, index) => {
        const giftBox = createGiftBox(
            pos.x,
            pos.z,
            giftBoxColors[index].main,
            giftBoxColors[index].ribbon,
            index
        );
        scene.add(giftBox.container);

        window.gameRoomGiftBoxes.push({
            index: index,
            position: new THREE.Vector3(pos.x, 1.2, pos.z),
            mesh: giftBox.container,
            gameIndex: index,
            isOpened: false
        });
    });
}

function createGiftBox(x, z, boxColor, ribbonColor, gameIndex) {
    const container = new THREE.Group();

    // Main box
    const box = new THREE.Mesh(
        new THREE.BoxGeometry(1.7, 1.7, 1.7), // slightly bigger
        new THREE.MeshStandardMaterial({ color: boxColor, roughness: 0.5, metalness: 0.3 })
    );
    box.position.y = 0.85;
    box.castShadow = true;
    box.receiveShadow = true;
    container.add(box);

    // Ribbons
    const ribbonH = new THREE.Mesh(
        new THREE.BoxGeometry(1.8, 0.15, 0.2),
        new THREE.MeshStandardMaterial({ color: ribbonColor, roughness: 0.3, metalness: 0.4 })
    );
    ribbonH.position.y = 0.85;
    container.add(ribbonH);

    const ribbonV = new THREE.Mesh(
        new THREE.BoxGeometry(0.2, 0.15, 1.8),
        new THREE.MeshStandardMaterial({ color: ribbonColor, roughness: 0.3, metalness: 0.4 })
    );
    ribbonV.position.y = 0.85;
    container.add(ribbonV);

    // Bow
    const bow = new THREE.Mesh(
        new THREE.BoxGeometry(0.45, 0.35, 0.45),
        new THREE.MeshStandardMaterial({ color: ribbonColor, roughness: 0.2, metalness: 0.5 })
    );
    bow.position.y = 1.75;
    container.add(bow);

    // Sparkles
    for (let i = 0; i < 5; i++) {
        const sparkle = new THREE.Mesh(
            new THREE.SphereGeometry(0.06, 8, 8),
            new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 1 })
        );
        const angle = (i / 5) * Math.PI * 2;
        sparkle.position.set(Math.cos(angle) * 0.9, 1.9, Math.sin(angle) * 0.9);
        container.add(sparkle);
    }

    container.position.set(x, 0, z);

    return { container, box, ribbonH, ribbonV, bow };
}

// ===========================
function startGame(gameIndex) {
    experience.gameStarted = true;
    experience.currentGameIndex = gameIndex;
    const gameContent = document.getElementById('gameContent');
    const gameContentInner = document.getElementById('gameContentInner');
    gameContent.classList.remove('hidden');

    if (gameIndex === 0) {
        playEasyClickGame();
    } else if (gameIndex === 1) {
        playMemoryGame();
    } else if (gameIndex === 2) {
        playReactionGame();
    }
}

function playEasyClickGame() {
    let balloonsPopped = 0;
    let balloonsNeeded = 12;
    let balloonsMissed = 0;
    let maxMisses = 5;

    let html = `
        <div style="text-align: center;">
            <h3 style="color: #00ffff; margin-bottom: 20px; text-shadow: 1px 1px 3px #ff69b4;">Balloon Pop! 🎈</h3>
            <p style="color: #ffff00; font-size: 1.2em; margin-bottom: 20px; text-shadow: 1px 1px 2px #ff00ff;">
                Click balloons before they float away!
            </p>
            <div class="game-message" style="font-size: 1.2em; margin-bottom: 20px; color: #ff6b6b;">
                Popped: <strong id="popCount">0</strong> / ${balloonsNeeded} | Missed: <strong id="missCount">0</strong> / ${maxMisses}
            </div>
            <div id="balloonGameArea" style="
                position: relative;
                width: 100%;
                height: 450px;
                background: linear-gradient(180deg, #87ceeb 0%, #ffe4e1 100%);
                border-radius: 15px;
                overflow: hidden;
                margin: 20px 0;
                border: 4px solid #ff69b4;
                box-shadow: 0 0 25px rgba(255,105,180,0.5);
            "></div>
            <div style="margin-top: 20px;">
                <p style="color: #333; font-size: 1em;">Click the balloons quickly before they reach the top!</p>
            </div>
        </div>
    `;
    
    document.getElementById('gameContentInner').innerHTML = html;
    
    window.balloonGameActive = true;
    window.balloonsNeeded = balloonsNeeded;
    window.balloonsPopped = balloonsPopped;
    window.balloonsMissed = balloonsMissed;
    window.maxMisses = maxMisses;
    
    startSpawningBalloons();
}

function startSpawningBalloons() {
    if (!window.balloonGameActive) return;
    
    const gameArea = document.getElementById('balloonGameArea');
    if (!gameArea) return;
    
    const balloon = document.createElement('div');
    balloon.className = 'balloon';
    balloon.style.position = 'absolute';
    balloon.style.bottom = '-60px';
    balloon.style.left = Math.random() * (gameArea.offsetWidth - 60) + 'px';
    balloon.style.width = '60px';
    balloon.style.height = '60px';
    balloon.style.fontSize = '3em';
    balloon.style.textAlign = 'center';
    balloon.style.lineHeight = '60px';
    balloon.style.cursor = 'pointer';
    balloon.style.userSelect = 'none';
    balloon.style.transition = 'transform 0.1s';
    balloon.style.zIndex = '10';
    
    const balloonColors = ['🎈','🎉','🎂','💝']; // colorful festive balloons
    balloon.textContent = balloonColors[Math.floor(Math.random() * balloonColors.length)];
    
    const driftSpeed = (Math.random() - 0.5) * 0.5;
    balloon.dataset.drift = driftSpeed;
    
    gameArea.appendChild(balloon);
    
    let position = -60;
    const floatSpeed = 1.5 + Math.random() * 1.5;
    const floatInterval = setInterval(() => {
        if (!window.balloonGameActive) {
            clearInterval(floatInterval);
            balloon.remove();
            return;
        }
        
        position += floatSpeed;
        balloon.style.bottom = position + 'px';
        
        const currentLeft = parseFloat(balloon.style.left) || 0;
        const newLeft = currentLeft + parseFloat(balloon.dataset.drift);
        balloon.style.left = Math.max(0, Math.min(gameArea.offsetWidth - 60, newLeft)) + 'px';
        
        if (position > gameArea.offsetHeight) {
            clearInterval(floatInterval);
            balloon.remove();
            missBalloon();
        }
    }, 16);
    
    balloon.addEventListener('click', () => {
        clearInterval(floatInterval);
        popBalloon(balloon);
    });
    
    balloon.addEventListener('mouseenter', () => balloon.style.transform = 'scale(1.3)');
    balloon.addEventListener('mouseleave', () => balloon.style.transform = 'scale(1)');
    
    if (window.balloonGameActive) {
        const nextDelay = 600 + Math.random() * 800;
        setTimeout(() => { if(window.balloonGameActive) startSpawningBalloons(); }, nextDelay);
    }
}

function popBalloon(balloon) {
    balloon.style.transform = 'scale(1.5)';
    balloon.style.opacity = '0';
    balloon.style.transition = 'all 0.2s';
    
    const pop = document.createElement('div');
    pop.textContent = '💥';
    pop.style.position = 'absolute';
    pop.style.left = balloon.style.left;
    pop.style.bottom = balloon.style.bottom;
    pop.style.fontSize = '2em';
    pop.style.pointerEvents = 'none';
    pop.style.zIndex = '20';
    balloon.parentElement.appendChild(pop);
    
    setTimeout(() => { balloon.remove(); pop.remove(); }, 200);
    
    window.balloonsPopped = (window.balloonsPopped || 0) + 1;
    const popCountEl = document.getElementById('popCount');
    if (popCountEl) popCountEl.textContent = window.balloonsPopped;
    
    if (window.balloonsPopped >= window.balloonsNeeded) {
        window.balloonGameActive = false;
        setTimeout(() => completeGame(), 500);
    }
}

function missBalloon() {
    window.balloonsMissed = (window.balloonsMissed || 0) + 1;
    const missCountEl = document.getElementById('missCount');
    if (missCountEl) missCountEl.textContent = window.balloonsMissed;
    
    if (window.balloonsMissed >= window.maxMisses) {
        window.balloonGameActive = false;
        const gameArea = document.getElementById('balloonGameArea');
        if (gameArea) {
            gameArea.innerHTML = `
                <div style="
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    text-align: center;
                    color: #ff6b6b;
                    font-size: 1.5em;
                    text-shadow: 1px 1px 3px #ff0000;
                ">
                    <p>Too many missed! 😢</p>
                    <p style="font-size: 0.9em; margin-top: 10px;">Click close and try again!</p>
                </div>
            `;
        }
    }
}


function playMemoryGame() {
    const pairs = [
        { emoji: '🎂', id: 0 },
        { emoji: '🎉', id: 1 },
        { emoji: '🎁', id: 2 },
        { emoji: '💝', id: 3 },
        { emoji: '🎂', id: 4 },
        { emoji: '🎉', id: 5 },
        { emoji: '🎁', id: 6 },
        { emoji: '💝', id: 7 }
    ];

    let shuffled = [...pairs].sort(() => Math.random() - 0.5);
    let html = `
        <div style="text-align: center;">
            <h3 style="color: #00ffff; margin-bottom: 20px;">Memory Match Game! 🧠</h3>
            <p style="color: #ffff00; font-size: 1.2em; margin-bottom: 20px;">Find all matching pairs!</p>
            <div class="game-board">
    `;

    shuffled.forEach((pair, idx) => {
        html += `<div class="game-tile" style="cursor: pointer;" onclick="revealMemoryTile(${idx})" id="tile-${idx}">?</div>`;
    });

    html += '</div><div class="game-message">Click tiles to reveal and find matches!</div></div>';
    document.getElementById('gameContentInner').innerHTML = html;
    window.memoryPairs = shuffled;
    window.memoryMatched = 0;
    window.memoryFirstTile = null;
}

function playReactionGame() {
    // Hard game - reaction time and pattern matching
    let html = `
        <div style="text-align: center;">
            <h3 style="color: #00ffff; margin-bottom: 20px;">Reaction Challenge! ⚡</h3>
            <p style="color: #ffff00; font-size: 1.2em; margin-bottom: 20px;">Watch the pattern and repeat it!</p>
            <div id="reactionDisplay" style="
                width: 200px;
                height: 200px;
                margin: 30px auto;
                border-radius: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 4em;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                box-shadow: 0 8px 25px rgba(0,0,0,0.3);
            ">🎯</div>
            <div class="game-message" style="font-size: 1.2em; margin: 20px 0;">
                <p id="reactionInstruction">Get ready! Pattern will appear soon...</p>
            </div>
            <div id="reactionButtons" style="display: none; margin-top: 30px;">
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; max-width: 300px; margin: 0 auto;">
                    <button class="reaction-btn" onclick="handleReactionClick('🔴')" style="
                        background: #ff6b6b;
                        border: none;
                        padding: 30px;
                        font-size: 2em;
                        border-radius: 15px;
                        cursor: pointer;
                        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                    ">🔴</button>
                    <button class="reaction-btn" onclick="handleReactionClick('🟢')" style="
                        background: #51cf66;
                        border: none;
                        padding: 30px;
                        font-size: 2em;
                        border-radius: 15px;
                        cursor: pointer;
                        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                    ">🟢</button>
                    <button class="reaction-btn" onclick="handleReactionClick('🔵')" style="
                        background: #4dabf7;
                        border: none;
                        padding: 30px;
                        font-size: 2em;
                        border-radius: 15px;
                        cursor: pointer;
                        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                    ">🔵</button>
                    <button class="reaction-btn" onclick="handleReactionClick('🟡')" style="
                        background: #ffd43b;
                        border: none;
                        padding: 30px;
                        font-size: 2em;
                        border-radius: 15px;
                        cursor: pointer;
                        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                    ">🟡</button>
                    <button class="reaction-btn" onclick="handleReactionClick('🟣')" style="
                        background: #ae3ec9;
                        border: none;
                        padding: 30px;
                        font-size: 2em;
                        border-radius: 15px;
                        cursor: pointer;
                        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                    ">🟣</button>
                    <button class="reaction-btn" onclick="handleReactionClick('⚪')" style="
                        background: #ffffff;
                        border: none;
                        padding: 30px;
                        font-size: 2em;
                        border-radius: 15px;
                        cursor: pointer;
                        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                    ">⚪</button>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('gameContentInner').innerHTML = html;
    
    // Generate pattern sequence
    const colors = ['🔴', '🟢', '🔵', '🟡', '🟣', '⚪'];
    const patternLength = 5;
    const pattern = [];
    for (let i = 0; i < patternLength; i++) {
        pattern.push(colors[Math.floor(Math.random() * colors.length)]);
    }
    
    window.reactionPattern = pattern;
    window.reactionUserInput = [];
    window.reactionStep = 0;
    
    // Show pattern sequence
    showReactionPattern();
}

function showReactionPattern() {
    const display = document.getElementById('reactionDisplay');
    const instruction = document.getElementById('reactionInstruction');
    const buttons = document.getElementById('reactionButtons');
    
    if (window.reactionStep < window.reactionPattern.length) {
        // Show current color in pattern
        display.textContent = window.reactionPattern[window.reactionStep];
        display.style.background = getColorForEmoji(window.reactionPattern[window.reactionStep]);
        
        instruction.textContent = `Watch! Step ${window.reactionStep + 1} of ${window.reactionPattern.length}`;
        
        setTimeout(() => {
            display.textContent = '👁️';
            display.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            
            window.reactionStep++;
            if (window.reactionStep < window.reactionPattern.length) {
                setTimeout(() => showReactionPattern(), 500);
            } else {
                // Pattern complete, show buttons
                instruction.textContent = 'Now repeat the pattern! Click the colors in order.';
                if (buttons) buttons.style.display = 'block';
                window.reactionStep = 0;
                window.reactionUserInput = [];
            }
        }, 1000);
    }
}

function getColorForEmoji(emoji) {
    const colors = {
        '🔴': 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)',
        '🟢': 'linear-gradient(135deg, #51cf66 0%, #40c057 100%)',
        '🔵': 'linear-gradient(135deg, #4dabf7 0%, #339af0 100%)',
        '🟡': 'linear-gradient(135deg, #ffd43b 0%, #fcc419 100%)',
        '🟣': 'linear-gradient(135deg, #ae3ec9 0%, #9c36b5 100%)',
        '⚪': 'linear-gradient(135deg, #ffffff 0%, #f1f3f5 100%)'
    };
    return colors[emoji] || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
}

function handleReactionClick(color) {
    window.reactionUserInput.push(color);
    
    // Check if correct
    if (window.reactionUserInput[window.reactionStep] === window.reactionPattern[window.reactionStep]) {
        window.reactionStep++;
        
        const instruction = document.getElementById('reactionInstruction');
        if (instruction) {
            instruction.textContent = `Good! ${window.reactionStep} / ${window.reactionPattern.length} correct`;
        }
        
        // Animate button
        const buttons = document.querySelectorAll('.reaction-btn');
        buttons.forEach(btn => {
            if (btn.textContent.trim() === color) {
                btn.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    btn.style.transform = 'scale(1)';
                }, 100);
            }
        });
        
        // Check if pattern complete
        if (window.reactionStep >= window.reactionPattern.length) {
            setTimeout(() => {
                completeGame();
            }, 500);
        }
    } else {
        // Wrong! Reset
        const instruction = document.getElementById('reactionInstruction');
        if (instruction) {
            instruction.textContent = 'Wrong! Try again. Watch the pattern carefully.';
        }
        
        window.reactionStep = 0;
        window.reactionUserInput = [];
        
        // Hide buttons and replay pattern
        const buttons = document.getElementById('reactionButtons');
        if (buttons) buttons.style.display = 'none';
        
        setTimeout(() => {
            showReactionPattern();
        }, 1500);
    }
}

// handleColorMatch removed - replaced with handleEasyClick

function revealMemoryTile(index) {
    const tile = document.getElementById(`tile-${index}`);
    if (!tile || tile.classList.contains('matched') || tile.classList.contains('revealed')) {
        return;
    }

    tile.textContent = window.memoryPairs[index].emoji;
    tile.classList.add('revealed');
    tile.style.background = 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';

    if (window.memoryFirstTile === null) {
        window.memoryFirstTile = index;
    } else {
        const firstIndex = window.memoryFirstTile;
        const firstEmoji = window.memoryPairs[firstIndex].emoji;
        const secondEmoji = window.memoryPairs[index].emoji;

        if (firstEmoji === secondEmoji) {
            // Match found!
            document.getElementById(`tile-${firstIndex}`).classList.add('matched');
            document.getElementById(`tile-${firstIndex}`).classList.remove('revealed');
            tile.classList.add('matched');
            tile.classList.remove('revealed');
            window.memoryMatched += 2;
            
            if (window.memoryMatched >= window.memoryPairs.length) {
                setTimeout(() => {
                    completeGame();
                }, 500);
            } else {
                const msgEl = document.querySelector('.game-message');
                if (msgEl) msgEl.textContent = `Great match! Find the rest! (${window.memoryMatched}/${window.memoryPairs.length})`;
            }
            window.memoryFirstTile = null;
        } else {
            // No match, flip back
            setTimeout(() => {
                document.getElementById(`tile-${firstIndex}`).textContent = '?';
                document.getElementById(`tile-${firstIndex}`).classList.remove('revealed');
                document.getElementById(`tile-${firstIndex}`).style.background = '';
                tile.textContent = '?';
                tile.classList.remove('revealed');
                tile.style.background = '';
                window.memoryFirstTile = null;
                const msgEl = document.querySelector('.game-message');
                if (msgEl) msgEl.textContent = 'No match! Try again!';
            }, 1000);
        }
    }
}

// handleNumberClick removed - replaced with handleReactionClick

function completeGame() {
    const gameIndex = experience.currentGameIndex;
    gameState.gamesWon[gameIndex] = true;

    // Mark gift box as opened
    if (window.gameRoomGiftBoxes && window.gameRoomGiftBoxes[gameIndex]) {
        window.gameRoomGiftBoxes[gameIndex].isOpened = true;
        // Animate gift box opening (make it slightly transparent or change color)
        if (window.gameRoomGiftBoxes[gameIndex].mesh) {
            window.gameRoomGiftBoxes[gameIndex].mesh.traverse((child) => {
                if (child.isMesh) {
                    child.material.opacity = 0.6;
                    child.material.transparent = true;
                }
            });
        }
    }

    setTimeout(() => {
        document.getElementById('gameContentInner').innerHTML = `
            <div style="text-align: center; color: #00ffff;">
                <h2>🎉 Congratulations! 🎉</h2>
                <p style="font-size: 1.2em; color: #ffff00;">You've won the game!</p>
                <p style="margin-top: 20px; font-size: 1.1em;">Your magic envelope is ready! Close this window to see your reward!</p>
            </div>
        `;
        
        // Show envelope after a short delay
        setTimeout(() => {
            closeGame();
            showEnvelope(gameIndex);
        }, 2800);
        }, 1000);        
}

function openGiftBox(gameIndex) {
    if (window.gameRoomGiftBoxes && window.gameRoomGiftBoxes[gameIndex]) {
        if (window.gameRoomGiftBoxes[gameIndex].isOpened) {
            // Already opened, show envelope directly
            showEnvelope(gameIndex);
            return;
        }
    }
    
    startGame(gameIndex);
}

function closeGame() {
    const gameContent = document.getElementById('gameContent');
    gameContent.classList.add('hidden');
    experience.gameStarted = false;
}

function showEnvelope(gameIndex) {
    // Messages for each envelope - magic letters for Babi
    const messages = [
        "My dearest Babi, 🎁\n\nGaling naman yehey. Because you won the first game! here is a kiss for you, mwaaaa. As always you make me proud with your little actions and big achievements. Congrats babi for being a big boy. You are 20 now, but you are still and always will be everyone's baby. I am proud of the man you are becoming. I know you have a lot of things to look forward to in this lifetime. You are the best person to ever exist love, that's why I know that you can achieve every dream and goal you have. I am always here as your fan, your number 1 supporter, your babi thru thick and thin. \n\nI love you so much ❤️",
        "My wonderful Babi, 🎁\n\nYou did it again! This letter is a thank you letter. Thank you for existing love. Alam ko palagi ko naman 'to sinasabi, but you are really a blessing. We are lucky to be love by you. Nasabi ko na ba? Nasabi ko ba na mahal kita? AHAHAH I am so blessed to have you, and I will forever thank God for giving me a babi like you. You are the best always. Thank you for always giving everything you can to make me happy and to make me feel love. I am sure that everyone around you loves having you in there life, ikaw  na yan eh. Thank you babi for everything, I can't wait to spend this lifetime and the next one with you.🌟\n\nIkAw LaNg SaPHat NhAAA xd >< ❤️",
        "My amazing Babi, 🎁\n\n I hope you like this simple gift babi. Always remember to stay motivated always and keep that burning passion. I will be here to support and help you whenever you need me. Keep dreaming and achieving your goal. You  deserve all the good things on earth because you are a good person. Proud ako palagi sayo. Madami kaming nagmamahal sayo babi, and we are all rooting for your success. Happy 20th Birthday, my love! 🎉💝 I hope to celebrate more birthdays with you.\n\nEnjoy your life, babi ❤️"
    ];

    const envelopeMessage = document.getElementById('envelopeMessage');
    envelopeMessage.textContent = messages[gameIndex] || messages[0];
    
    const envelopeModal = document.getElementById('envelopeModal');
    envelopeModal.classList.remove('hidden');
    
    // Play sound if available
    if (typeof playSound === 'function') {
        playSound(600, 0.3);
    }
}

function closeEnvelope() {
    const envelopeModal = document.getElementById('envelopeModal');
    envelopeModal.classList.add('hidden');
}

// Expose all functions globally
window.createGameRoom = createGameRoom;
window.startGame = startGame;
window.playEasyClickGame = playEasyClickGame;
window.playMemoryGame = playMemoryGame;
window.playReactionGame = playReactionGame;
window.startSpawningBalloons = startSpawningBalloons;
window.popBalloon = popBalloon;
window.missBalloon = missBalloon;
window.revealMemoryTile = revealMemoryTile;
window.handleReactionClick = handleReactionClick;
window.showReactionPattern = showReactionPattern;
window.completeGame = completeGame;
window.openGiftBox = openGiftBox;
window.closeGame = closeGame;
window.showEnvelope = showEnvelope;
window.closeEnvelope = closeEnvelope;
