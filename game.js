// game.js - QUBES v2.5 - AURA IMAGES FIXED

const CONFIG = {
    player: { width: 40, height: 40, speed: 6, jumpPower: 16, gravity: 0.8, friction: 0.85, dashSpeed: 20, dashDuration: 12, dashCooldown: 45, maxDashes: 2, doubleJump: true },
    melee: { radius: 95, cooldownMax: 18, damage: 1 },
    elo: { coinsMultiplier: 2, damageDivider: 5 },
    enemies: { baseHealth: { normal: 1, shooter: 2, patrol: 3, jumper: 1, flying: 2, vortex: 6 }, baseScore: { normal: 100, shooter: 120, patrol: 150, jumper: 110, flying: 200, vortex: 400 } },
    boss: { health: 20, damage: 30, attackCooldown: 120, moveSpeed: 2 },
    particles: { maxCount: 600, enabled: true },
    audio: { enabled: true, volume: 0.4 },
    camera: { followSpeed: 0.1, playerOffset: 0.35 },
    level: { basePlatforms: 20, platformGrowth: 2, baseEnemies: 3, enemyGrowth: 1.2, baseWidth: 2500, widthGrowth: 400 },
    combat: { comboDecay: 180 }
};

const JULY_26_2026 = new Date('2026-07-27T00:00:00');
const AUG_31_2026 = new Date('2026-09-01T00:00:00');

function isBefore(date) { return new Date() < date; }

const CHEST_SKINS = [
    { id: 'copper', name: 'Колхозный Козёл', color: '#B87333', chance: 40 },
    { id: 'sapphire', name: 'Сапфировый страж', color: '#0f52ba', chance: 25 },
    { id: 'magma', name: 'Магмовый голем', color: '#FF4500', chance: 15 },
    { id: 'royal', name: 'Королевский легион', color: '#FFD700', chance: 10 },
    { id: 'blackghost', name: 'Чёрный призрак', color: '#111111', chance: 5, darkEdges: true },
    { id: 'halfyear', name: 'Полгода Колблоксу', color: '#ffaa44', chance: 3, particleNumber: '05', festive: true },
    { id: 'kaleidoscope', name: 'Калейдоскоп', color: '#ff00ff', chance: 1, kaleidoscope: true },
    { id: 'sixseven', name: 'Сикс Севен', color: '#4488ff', chance: 1, text: '67' },
    { id: 'cone', name: 'Конус', color: '#00aa44', chance: 1, shape: 'cone' }
];

const PAID_SKINS = [
    { id: 'cupcake', name: 'Кекс', color: '#ff69b4', price: 70, shape: 'cupcake', description: 'Расширяется к верху как кекс' },
    { id: 'pillow', name: 'Подушка', color: '#ffffff', price: 120, shape: 'pillow', description: 'Мягкая форма подушки' }
];

const AURA_SKINS = [
    { id: 'fire_aura', name: 'Огненная аура', color: '#ff4400', effectColor: 'rgba(255, 68, 0, 0.6)', chance: 41 },
    { id: 'ice_aura', name: 'Ледяная аура', color: '#00ccff', effectColor: 'rgba(0, 204, 255, 0.6)', chance: 20 },
    { id: 'lightning_aura', name: 'Электрическая аура', color: '#ffff00', effectColor: 'rgba(255, 255, 0, 0.6)', chance: 12 },
    { id: 'cosmic_aura', name: 'Космическая аура', color: '#9b59b6', effectColor: 'rgba(155, 89, 182, 0.6)', chance: 8 },
    { id: 'cucumber_aura', name: 'Огуречная аура', color: '#7CFC00', effectColor: 'rgba(124, 252, 0, 0.7)', chance: 5, image: 'ogurec.webp' },
    { id: 'batidao_aura', name: 'Но батидао', color: '#ff0000', effectColor: 'rgba(255, 0, 0, 0.8)', chance: 5, image: 'batidao.png' },
    { id: 'sunflower_aura', name: 'Подсолнечная аура', color: '#FFD700', effectColor: 'rgba(255, 215, 0, 0.6)', chance: 3 },
    { id: 'cherry_aura', name: 'Вишнёвая аура', color: '#DC143C', effectColor: 'rgba(220, 20, 60, 0.6)', chance: 2 },
    { id: 'lavender_aura', name: 'Лавандовая аура', color: '#E6E6FA', effectColor: 'rgba(230, 230, 250, 0.5)', chance: 2 },
    { id: 'rose_aura', name: 'Розовая аура', color: '#FF69B4', effectColor: 'rgba(255, 105, 180, 0.6)', chance: 1 },
    { id: 'spring_aura', name: 'Весенняя аура', color: '#00FA9A', effectColor: 'rgba(0, 250, 154, 0.6)', chance: 1 },
    { id: 'explosion_aura', name: 'Взрыв Animated', color: '#FF4500', effectColor: 'rgba(255, 69, 0, 0.8)', chance: 1, isGif: true, image: 'vzryv.gif' }
];

const SPRING_SKINS = [
    { id: 'cucumber_aura', name: 'Огуречная аура', chance: 20, isAura: true },
    { id: 'sunflower_aura', name: 'Подсолнечная аура', chance: 15, isAura: true },
    { id: 'cherry_aura', name: 'Вишнёвая аура', chance: 15, isAura: true },
    { id: 'lavender_aura', name: 'Лавандовая аура', chance: 15, isAura: true },
    { id: 'rose_aura', name: 'Розовая аура', chance: 15, isAura: true },
    { id: 'spring_aura', name: 'Весенняя аура', chance: 10, isAura: true },
    { id: 'sapphire', name: 'Сапфировый страж', chance: 5, isAura: false, skinId: 'sapphire' },
    { id: 'copper', name: 'Колхозный Козёл', chance: 5, isAura: false, skinId: 'copper' }
];

const ELITE_SKINS = [
    { id: 'blackghost', name: 'Чёрный призрак', chance: 25, isAura: false, skinId: 'blackghost' },
    { id: 'halfyear', name: 'Полгода Колблоксу', chance: 20, isAura: false, skinId: 'halfyear' },
    { id: 'kaleidoscope', name: 'Калейдоскоп', chance: 15, isAura: false, skinId: 'kaleidoscope' },
    { id: 'sixseven', name: 'Сикс Севен', chance: 15, isAura: false, skinId: 'sixseven' },
    { id: 'cone', name: 'Конус', chance: 10, isAura: false, skinId: 'cone' },
    { id: 'royal', name: 'Королевский легион', chance: 10, isAura: false, skinId: 'royal' },
    { id: 'magma', name: 'Магмовый голем', chance: 5, isAura: false, skinId: 'magma' }
];

const CASE_TRAILS = [
    { id: 'rainbow_trail', name: 'Радужный', color: '#ff0000', chance: 25, type: 'rainbow' },
    { id: 'fire_trail', name: 'Огненный', color: '#ff4400', chance: 18, type: 'fire' },
    { id: 'ice_trail', name: 'Ледяной', color: '#00ccff', chance: 15, type: 'ice' },
    { id: 'stars_trail', name: 'Звёздный', color: '#ffff00', chance: 10, type: 'stars' },
    { id: 'hearts_trail', name: 'Сердечки', color: '#ff69b4', chance: 8, type: 'hearts' },
    { id: 'music_trail', name: 'Ноты', color: '#ffffff', chance: 6, type: 'music' },
    { id: 'neon_trail', name: 'Неон', color: '#00ff88', chance: 6, type: 'neon' },
    { id: 'shadow_trail', name: 'Тень', color: '#333333', chance: 5, type: 'shadow' },
    { id: 'galaxy_trail', name: 'Галактика', color: '#9b59b6', chance: 4, type: 'galaxy' },
    { id: 'golden_trail', name: 'Золотой', color: '#FFD700', chance: 3, type: 'golden' }
];

const SPECIAL_TRAILS = [
    { id: 'birthday_trail', name: '🎂 День Рождения', color: '#ff00ff', type: 'birthday', description: 'Эпичный праздничный трейл' },
    { id: 'cat_trail', name: '😸 Котик', color: '#ffaa00', type: 'cat', description: 'Улыбающийся кот' }
];

const PAID_TRAILS = [
    { id: 'sparks_trail', name: 'Искры', color: '#ff6600', price: 150, type: 'sparks', description: 'Яркие оранжевые искры из-под ног' }
];

const ACCESSORIES = [
    { id: 'vortex_eyes', name: 'Глаза Вихря', description: 'Заменяет глаза на глаза врага Вихря' }
];

const CLASSES = {
    default: { name: 'Стандарт', maxHealth: 100, damage: 1, speed: 6, jumpCount: 2, gravity: 0.8, meleeRadius: 95, color: '#4af626', price: 0 },
    warrior: { name: 'Воин', maxHealth: 150, damage: 1.5, speed: 5.5, jumpCount: 2, gravity: 0.85, meleeRadius: 95, color: '#ff4444', price: 200 },
    archer: { name: 'Лучник', maxHealth: 100, damage: 1, speed: 6, jumpCount: 2, gravity: 0.8, meleeRadius: 95, color: '#44ff44', price: 55, description: 'Идеален для новичков!', hasArrows: true, arrowCooldown: 6, arrowDamage: 1.5 },
    mage: { name: 'Маг', maxHealth: 100, damage: 1, speed: 5, jumpCount: 2, gravity: 0.75, meleeRadius: 117, color: '#4444ff', price: 150 },
    rogue: { name: 'Разбойник', maxHealth: 70, damage: 1, speed: 8, jumpCount: 3, gravity: 0.8, meleeRadius: 95, color: '#aa44ff', price: 100 }
};

const PROMO_CODES = {
    'СТАРТ15': { type: 'keys', value: 15, oneTime: true, description: 'Стартовый бонус: +15 ключей' },
    'УТЫТЁФ2507': { type: 'trail', value: 'birthday_trail', expiresAt: JULY_26_2026, description: 'Спецтрейл к ДР автора (25 июля)' },
    'ВИХРЬ22': { type: 'accessory', value: 'vortex_eyes', expiresAt: JULY_26_2026, description: 'Аксессуар: Глаза Вихря' },
    'КОТОТРЕЙЛ1': { type: 'trail', value: 'cat_trail', description: 'Трейл с улыбающимся котом 😸' }
};

let currentClass = 'default';
let unlockedClasses = JSON.parse(localStorage.getItem('kolblocks_classes')) || ['default'];
let arrowCooldownTimer = 0;
let arrowsList = [];
let cardCount = parseInt(localStorage.getItem('kolblocks_cards')) || 0;

let unlockedTrails = JSON.parse(localStorage.getItem('kolblocks_trails')) || [];
let equippedTrail = localStorage.getItem('kolblocks_equipped_trail') || null;

let unlockedAccessories = JSON.parse(localStorage.getItem('kolblocks_accessories')) || [];
let equippedAccessory = localStorage.getItem('kolblocks_equipped_accessory') || null;

let usedPromoCodes = JSON.parse(localStorage.getItem('kolblocks_used_promos')) || [];

let playerNickname = localStorage.getItem('kolblocks_nickname') || '';

let playerELO = parseInt(localStorage.getItem('kolblocks_elo')) || 0;
let totalKeys = parseInt(localStorage.getItem('kolblocks_keys')) || 0;
let unlockedSkins = JSON.parse(localStorage.getItem('kolblocks_skins')) || ['default'];
let unlockedAuras = JSON.parse(localStorage.getItem('kolblocks_auras')) || [];
let equippedSkin = localStorage.getItem('kolblocks_equipped') || 'default';
let equippedAura = localStorage.getItem('kolblocks_equipped_aura') || null;
let roundCoins = 0, roundDamage = 0;
let lastKaleidoscopeColor = null;
let lastKaleidoscopeDate = null;

// ==================== КАРТИНКИ ДЛЯ АУР (v2.5) ====================
let batidaoImage = null;
let cucumberImage = null;
let explosionGif = null;
let auraImagesLoaded = false;

let activeAuraEffect = null;
let gameLoopId = null;
let activeTimeouts = [];

let inputBlocked = false;

let currentBiom = null;
let biomImages = [];
let biomLoaded = false;
let biomFileNames = [];
let biomLoadingStarted = false;

const BUILTIN_BIOMS = [
    { type: 'gradient', colors: ['#0a0a1a', '#1a1a2e'], name: 'Тёмный лес' },
    { type: 'gradient', colors: ['#0a1a0a', '#1a2e1a'], name: 'Зелёная чаща' },
    { type: 'gradient', colors: ['#1a0a0a', '#2e1a1a'], name: 'Кровавая луна' },
    { type: 'gradient', colors: ['#0a0a3a', '#1a1a4e'], name: 'Синяя бездна' },
    { type: 'gradient', colors: ['#3a0a0a', '#4e1a1a'], name: 'Огненная земля' },
    { type: 'gradient', colors: ['#0a3a0a', '#1a4e1a'], name: 'Изумрудный лес' },
    { type: 'gradient', colors: ['#2a0a2a', '#3a1a3a'], name: 'Фиолетовый туман' },
    { type: 'gradient', colors: ['#3a2a0a', '#4e3a1a'], name: 'Золотая пустошь' },
    { type: 'gradient', colors: ['#0a2a3a', '#1a3a4e'], name: 'Ледяная пещера' }
];

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let particlePool;
let platforms = [], enemies = [], flyingEnemies = [], vortexEnemies = [], coins = [], powerUps = [];
let player, cameraX = 0, keys = {}, gameRunning = true, levelWidth = 0;
let currentLevel = 1, score = 0, playerHealth = 100, maxHealth = 100;
let comboCount = 1, maxCombo = 1, comboTimer = 0, comboMultiplier = 1;
let screenShake = 0, shakeIntensity = 0, lastCheckpointX = 0, boss = null, bossesDefeated = 0;
let levelKeys = [];

const platformTextures = [ {color: '#FF2E63', pattern: 'stripes'}, {color: '#08D9D6', pattern: 'dots'}, {color: '#FFDE7D', pattern: 'checker'}, {color: '#6A2C70', pattern: 'zigzag'}, {color: '#4ECDC4', pattern: 'bricks'}, {color: '#FF9A76', pattern: 'waves'} ];
const enemyColors = ['#FF2E63', '#FFDE7D', '#6A2C70', '#08D9D6', '#AA00FF'];
const flyingEnemyColors = ['#FF00FF', '#00FFFF', '#FFFF00', '#FF6600'];

function clearKeys() {
    for (let key in keys) {
        keys[key] = false;
    }
}

function closeCurrentMenu() {
    clearKeys();
    
    const screens = [
        { id: 'caseShopScreen', close: closeShop },
        { id: 'classShopScreen', close: closeClassShop },
        { id: 'cardCraftScreen', close: closeCardCraft },
        { id: 'promoCodeScreen', close: closePromoCode },
        { id: 'profileScreen', close: closeProfile },
        { id: 'modsMenuScreen', close: closeModsMenu },
        { id: 'pauseMenu', close: () => {
            document.getElementById('pauseMenu').style.display = 'none';
            clearKeys();
            gameRunning = true;
            if(gameLoopId) cancelAnimationFrame(gameLoopId);
            gameLoop();
        }}
    ];
    
    for (const screen of screens) {
        const el = document.getElementById(screen.id);
        if (el && el.style.display === 'flex') {
            screen.close();
            return true;
        }
    }
    return false;
}

function safeTimeout(fn, delay) {
    const id = setTimeout(() => {
        fn();
        const index = activeTimeouts.indexOf(id);
        if (index > -1) activeTimeouts.splice(index, 1);
    }, delay);
    activeTimeouts.push(id);
    return id;
}

function clearAllTimeouts() {
    for (const id of activeTimeouts) clearTimeout(id);
    activeTimeouts = [];
}

function resizeCanvas(){canvas.width=window.innerWidth;canvas.height=window.innerHeight;}
function updateHealthBar(){document.getElementById('healthFill').style.width=`${(playerHealth/maxHealth)*100}%`;}
function updateBossHealth(){if(boss){const percent=(boss.health/boss.maxHealth)*100;document.getElementById('bossHealthFill').style.width=`${percent}%`;}}
function updateUI(){
    document.getElementById('levelDisplay').textContent=currentLevel;
    document.getElementById('scoreDisplay').textContent=score;
    document.getElementById('comboCount').textContent=`x${comboCount}`;
    document.getElementById('eloValue').textContent = Math.floor(playerELO);
    document.getElementById('classDisplay').textContent = CLASSES[currentClass].name;
    document.getElementById('cardCountDisplay').textContent = cardCount;
}
function addScore(points){score+=Math.floor(points*comboMultiplier);updateUI();}
function updateCombo(){comboCount++;comboTimer=CONFIG.combat.comboDecay;comboMultiplier=1+(comboCount-1)*0.1;maxCombo=Math.max(maxCombo,comboCount);const cd=document.getElementById('comboDisplay');cd.classList.add('active');document.getElementById('comboValue').textContent=comboCount;safeTimeout(()=>cd.classList.remove('active'),1000);if(comboCount>=5)AudioSys.combo();}
function decayCombo(){if(comboTimer>0){comboTimer--;if(comboTimer<=0){comboCount=1;comboMultiplier=1;updateUI();}}}
function shakeScreen(intensity){screenShake=20;shakeIntensity=intensity;}
function updateDashIndicator(){const dots=document.querySelectorAll('.dash-dot');dots.forEach((dot,i)=>{dot.classList.toggle('active',i<player.dashCharges);});}
function showCheckpointIndicator(){const ci=document.getElementById('checkpointIndicator');ci.classList.add('active');safeTimeout(()=>ci.classList.remove('active'),2000);}

function getKaleidoscopeColor() {
    const now = new Date();
    const today = now.toDateString();
    if (lastKaleidoscopeDate !== today) {
        lastKaleidoscopeDate = today;
        lastKaleidoscopeColor = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
        localStorage.setItem('kolblocks_kaleidoscope_color', lastKaleidoscopeColor);
        localStorage.setItem('kolblocks_kaleidoscope_date', today);
    } else if (!lastKaleidoscopeColor) {
        const saved = localStorage.getItem('kolblocks_kaleidoscope_color');
        lastKaleidoscopeColor = saved || '#ff00ff';
    }
    return lastKaleidoscopeColor;
}

function getEnemyMultiplier() {
    switch(currentClass) {
        case 'warrior': return 1.3;
        case 'archer': return 1.3;
        case 'mage': return 1.6;
        case 'rogue': return 1.6;
        default: return 1.0;
    }
}

function saveAllData() {
    localStorage.setItem('kolblocks_elo', playerELO);
    localStorage.setItem('kolblocks_keys', totalKeys);
    localStorage.setItem('kolblocks_cards', cardCount);
    localStorage.setItem('kolblocks_skins', JSON.stringify(unlockedSkins));
    localStorage.setItem('kolblocks_auras', JSON.stringify(unlockedAuras));
    localStorage.setItem('kolblocks_trails', JSON.stringify(unlockedTrails));
    localStorage.setItem('kolblocks_accessories', JSON.stringify(unlockedAccessories));
    localStorage.setItem('kolblocks_equipped', equippedSkin);
    localStorage.setItem('kolblocks_equipped_aura', equippedAura || '');
    localStorage.setItem('kolblocks_equipped_trail', equippedTrail || '');
    localStorage.setItem('kolblocks_equipped_accessory', equippedAccessory || '');
    localStorage.setItem('kolblocks_classes', JSON.stringify(unlockedClasses));
    localStorage.setItem('kolblocks_current_class', currentClass);
    localStorage.setItem('kolblocks_used_promos', JSON.stringify(usedPromoCodes));
    localStorage.setItem('kolblocks_nickname', playerNickname);
}

function updateCardDisplay() {
    const cardSpan = document.getElementById('cardCountDisplay');
    if(cardSpan) cardSpan.textContent = cardCount;
    const shopCardSpan = document.getElementById('shopCardCount');
    if(shopCardSpan) shopCardSpan.textContent = cardCount;
    const craftCardSpan = document.getElementById('craftCardCount');
    if(craftCardSpan) craftCardSpan.textContent = cardCount;
    const craftKeySpan = document.getElementById('craftKeyCount');
    if(craftKeySpan) craftKeySpan.textContent = totalKeys;
}

function updateEloDisplay() { document.getElementById('eloValue').textContent = Math.floor(playerELO); }
function showEloChange(change) {
    const el = document.createElement('div');
    el.className = 'elo-change ' + (change >= 0 ? 'positive' : 'negative');
    el.textContent = (change >= 0 ? '+' : '') + Math.floor(change);
    document.body.appendChild(el);
    if (change >= 0) AudioSys.eloGain(); else AudioSys.eloLoss();
    safeTimeout(() => el.remove(), 1500);
}
function calculateEloChange() {
    const coinsBonus = Math.floor(roundCoins * CONFIG.elo.coinsMultiplier);
    const damagePenalty = Math.floor(roundDamage / CONFIG.elo.damageDivider);
    const change = coinsBonus - damagePenalty;
    playerELO = Math.max(0, playerELO + change);
    saveAllData();
    return { change, coinsBonus, damagePenalty };
}

function getSkinData(id) {
    const all = [{id:'default',name:'Стандарт',color:'#4af626'}, ...CHEST_SKINS, ...PAID_SKINS];
    const skin = all.find(s=>s.id===id) || all[0];
    if (skin.id === 'kaleidoscope') skin.color = getKaleidoscopeColor();
    return skin;
}

function getAuraData(id) {
    if (!id) return null;
    return AURA_SKINS.find(a=>a.id===id) || null;
}

function getTrailData(id) {
    if (!id) return null;
    const all = [...CASE_TRAILS, ...SPECIAL_TRAILS, ...PAID_TRAILS];
    return all.find(t=>t.id===id) || null;
}

function canChangeClass() {
    return currentLevel === 1 || playerHealth <= 0;
}

function applyClassStats() {
    const classData = CLASSES[currentClass];
    maxHealth = classData.maxHealth;
    if (playerHealth > maxHealth) playerHealth = maxHealth;
    updateHealthBar();
    
    if (player) {
        player.speed = classData.speed;
        player.jumpPower = CONFIG.player.jumpPower;
        player.gravity = classData.gravity;
        player.maxJumps = classData.jumpCount;
        player.jumpCount = 0;
        player.color = classData.color;
    }
    
    if (classData.hasArrows) {
        document.getElementById('arrowIndicator').style.display = 'flex';
        document.getElementById('btnShoot').style.display = 'flex';
    } else {
        document.getElementById('arrowIndicator').style.display = 'none';
        document.getElementById('btnShoot').style.display = 'none';
    }
    
    updateUI();
}

function shootArrow() {
    if (currentClass !== 'archer') return;
    if (arrowCooldownTimer > 0) return;
    
    arrowCooldownTimer = CLASSES.archer.arrowCooldown;
    
    const direction = player.dashDirection === -1 ? -1 : 1;
    const startX = player.x + player.width/2 + (direction === 1 ? 28 : -28);
    const startY = player.y + player.height/2 - 5;
    
    const skin = getSkinData(equippedSkin);
    const arrowColor = skin.color;
    
    arrowsList.push({
        x: startX,
        y: startY,
        vx: direction * 16,
        vy: 0,
        active: true,
        damage: CLASSES.archer.arrowDamage,
        color: arrowColor
    });
    
    AudioSys.play(660, 0.08, 'sine', 0.12);
}

function updateArrows() {
    if (arrowCooldownTimer > 0) arrowCooldownTimer--;
    
    for (let i = 0; i < arrowsList.length; i++) {
        const a = arrowsList[i];
        a.x += a.vx;
        a.y += a.vy;
        
        let hit = false;
        
        for (let j = 0; j < enemies.length; j++) {
            const e = enemies[j];
            if (e.active && a.x > e.x && a.x < e.x + e.width && a.y > e.y && a.y < e.y + e.height) {
                if (e.takeDamage()) enemies.splice(j, 1);
                hit = true;
                updateCombo();
                for (let k = 0; k < 12; k++) particlePool.acquire(a.x, a.y, a.color || '#ffff00');
                break;
            }
        }
        
        if (!hit) {
            for (let j = 0; j < flyingEnemies.length; j++) {
                const fe = flyingEnemies[j];
                if (fe.active && a.x > fe.x && a.x < fe.x + fe.width && a.y > fe.y && a.y < fe.y + fe.height) {
                    if (fe.takeDamage()) flyingEnemies.splice(j, 1);
                    hit = true;
                    updateCombo();
                    for (let k = 0; k < 12; k++) particlePool.acquire(a.x, a.y, a.color || '#ffff00');
                    break;
                }
            }
        }
        
        if (!hit && vortexEnemies) {
            for (let j = 0; j < vortexEnemies.length; j++) {
                const ve = vortexEnemies[j];
                if (ve.active && a.x > ve.x && a.x < ve.x + ve.width && a.y > ve.y && a.y < ve.y + ve.height) {
                    if (ve.takeDamage()) vortexEnemies.splice(j, 1);
                    hit = true;
                    updateCombo();
                    for (let k = 0; k < 12; k++) particlePool.acquire(a.x, a.y, a.color || '#ffff00');
                    break;
                }
            }
        }
        
        if (!hit && boss && boss.active && a.x > boss.x && a.x < boss.x + boss.width && a.y > boss.y && a.y < boss.y + boss.height) {
            boss.takeDamage();
            hit = true;
            updateCombo();
            for (let k = 0; k < 18; k++) particlePool.acquire(a.x, a.y, a.color || '#ffff00');
        }
        
        if (hit || a.x < cameraX - 100 || a.x > cameraX + canvas.width + 100 || a.y > canvas.height + 100 || a.y < -100) {
            arrowsList.splice(i, 1);
            i--;
        }
    }
}

function drawArrows() {
    for (const a of arrowsList) {
        ctx.shadowBlur = 18;
        ctx.shadowColor = a.color || '#ffff00';
        
        ctx.beginPath();
        ctx.arc(a.x - cameraX, a.y, 14, 0, Math.PI * 2);
        ctx.fillStyle = (a.color || '#ffff00') + '40';
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(a.x - cameraX, a.y, 10, 0, Math.PI * 2);
        ctx.fillStyle = a.color || '#ffff00';
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(a.x - cameraX, a.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(a.x - cameraX - 12, a.y);
        ctx.lineTo(a.x - cameraX - 24, a.y - 6);
        ctx.lineTo(a.x - cameraX - 24, a.y + 6);
        ctx.fillStyle = a.color || '#ffff00';
        ctx.fill();
        
        ctx.shadowBlur = 0;
    }
}

function openCardCraft() {
    clearKeys();
    gameRunning = false;
    if(gameLoopId) cancelAnimationFrame(gameLoopId);
    document.getElementById('pauseMenu').style.display = 'none';
    document.getElementById('cardCraftScreen').style.display = 'flex';
    updateCardDisplay();
    
    const craftBtn = document.getElementById('craftBtn');
    if(craftBtn) craftBtn.disabled = cardCount < 3;
}

function closeCardCraft() {
    document.getElementById('cardCraftScreen').style.display = 'none';
    clearKeys();
    gameRunning = true;
    if(gameLoopId) cancelAnimationFrame(gameLoopId);
    gameLoop();
}

function craftKeys() {
    if(cardCount >= 3) {
        cardCount -= 3;
        totalKeys += 1;
        saveAllData();
        updateCardDisplay();
        
        const msg = document.createElement('div');
        msg.textContent = '🔨 3 карточки → 1 ключ! 🔑';
        msg.style.position = 'fixed';
        msg.style.top = '50%';
        msg.style.left = '50%';
        msg.style.transform = 'translate(-50%, -50%)';
        msg.style.color = '#FFD700';
        msg.style.fontSize = '24px';
        msg.style.fontWeight = 'bold';
        msg.style.backgroundColor = 'rgba(0,0,0,0.8)';
        msg.style.padding = '15px 30px';
        msg.style.borderRadius = '15px';
        msg.style.border = '2px solid #FFD700';
        msg.style.zIndex = '1000';
        document.body.appendChild(msg);
        safeTimeout(() => msg.remove(), 1500);
        
        const craftBtn = document.getElementById('craftBtn');
        if(craftBtn) craftBtn.disabled = cardCount < 3;
        
        AudioSys.play(440, 0.2, 'sine', 0.2);
    }
}

const AudioSys = {
    ctx: null, enabled: true,
    init() { try { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch(e) { this.enabled = false; } },
    play(frequency, duration, type = 'square', volume = 0.1, decay = 0.1) {
        if (!this.enabled || !this.ctx) return;
        try {
            const osc = this.ctx.createOscillator(), gain = this.ctx.createGain();
            osc.connect(gain); gain.connect(this.ctx.destination);
            osc.frequency.value = frequency; osc.type = type;
            gain.gain.setValueAtTime(volume, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration * decay);
            osc.start(this.ctx.currentTime); osc.stop(this.ctx.currentTime + duration);
        } catch(e) {}
    },
    jump() { this.play(440, 0.15, 'sine', 0.15); },
    meleeSwing() { this.play(380, 0.12, 'sawtooth', 0.2); },
    hit() { this.play(220, 0.2, 'sawtooth', 0.2, 0.3); },
    collect() { this.play(660, 0.1, 'sine', 0.12); },
    combo() { this.play(523, 0.12, 'sine', 0.15); },
    dash() { this.play(330, 0.1, 'triangle', 0.1); },
    checkpoint() { this.play(784, 0.3, 'sine', 0.2); },
    levelComplete() { [523, 659, 784, 1047].forEach((freq, i) => safeTimeout(() => this.play(freq, 0.2, 'sine', 0.15), i * 100)); },
    bossSpawn() { [200, 250, 300, 250, 200].forEach((freq, i) => safeTimeout(() => this.play(freq, 0.3, 'sawtooth', 0.2, 0.5), i * 100)); },
    bossHit() { this.play(150, 0.3, 'sawtooth', 0.25, 0.4); },
    bossDefeat() { [400, 500, 600, 800, 1000].forEach((freq, i) => safeTimeout(() => this.play(freq, 0.4, 'square', 0.2), i * 150)); },
    gameOver() { [392, 349, 294, 262].forEach((freq, i) => safeTimeout(() => this.play(freq, 0.3, 'sawtooth', 0.15, 0.5), i * 150)); },
    eloGain() { this.play(880, 0.2, 'sine', 0.2); },
    eloLoss() { this.play(200, 0.25, 'sawtooth', 0.15); },
    chestOpen() { [300, 450, 600, 900].forEach((f, i) => safeTimeout(() => this.play(f, 0.15, 'square', 0.15), i * 80)); }
};

class Particle {
    constructor(x, y, color) { this.reset(x, y, color); }
    reset(x, y, color) {
        this.x = x; this.y = y; this.size = Math.random() * 5 + 2;
        this.speedX = Math.random() * 8 - 4; this.speedY = Math.random() * 8 - 4;
        this.color = color; this.life = 20 + Math.random() * 15; this.maxLife = this.life; this.active = true; return this;
    }
    update() { if (!this.active) return; this.x += this.speedX; this.y += this.speedY; this.speedY += 0.1; this.life--; this.size *= 0.96; if (this.life <= 0) this.active = false; }
    draw(ctx, cameraX) { if (!this.active) return; ctx.globalAlpha = this.life / this.maxLife; ctx.fillStyle = this.color; ctx.beginPath(); ctx.arc(this.x - cameraX, this.y, this.size, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1; }
}

class ObjectPool {
    constructor(createFn, maxSize = 500) { this.createFn = createFn; this.maxSize = maxSize; this.pool = []; this.active = []; }
    acquire(...args) { let obj = this.pool.pop(); if (!obj) obj = this.createFn(...args); obj.active = true; this.active.push(obj); return obj; }
    release(obj) { obj.active = false; const idx = this.active.indexOf(obj); if (idx > -1) this.active.splice(idx, 1); if (this.pool.length < this.maxSize) this.pool.push(obj); }
    releaseAll() { while (this.active.length > 0) this.release(this.active[0]); }
    get activeObjects() { return [...this.active]; }
}

const bossTextures = { images: [], loaded: false, specialUrls: [] };
bossTextures.load = function() { return Promise.resolve(); };
bossTextures.getRandomTexture = function(colors) { return { type: 'color', color: colors[Math.floor(Math.random() * colors.length)] }; };

class Player {
    constructor() { this.reset(); }
    
    reset() {
        const classData = CLASSES[currentClass];
        this.width = CONFIG.player.width;
        this.height = CONFIG.player.height;
        this.x = 100;
        this.y = 200;
        this.velX = 0;
        this.velY = 0;
        this.jumping = false;
        this.jumpCount = 0;
        this.maxJumps = classData.jumpCount;
        this.color = classData.color;
        this.speed = classData.speed;
        this.jumpPower = CONFIG.player.jumpPower;
        this.gravity = classData.gravity;
        this.friction = CONFIG.player.friction;
        this.trail = [];
        this.maxTrail = 8;
        this.trailPoints = [];
        this.maxTrailPoints = 30;
        this.invulnerable = 0;
        this.dashCharges = CONFIG.player.maxDashes;
        this.dashCooldown = 0;
        this.isDashing = false;
        this.dashTimer = 0;
        this.dashDirection = 1;
        this.lastCheckpoint = { x: 100, y: 200 };
        this.meleeCooldown = 0;
        this.swingEffect = 0;
        this.vortexCache = { target: null, frame: 0 };
        return this;
    }
    
    update(keys) {
        if (this.invulnerable > 0) this.invulnerable--; 
        if (this.dashCooldown > 0) this.dashCooldown--;
        if (this.meleeCooldown > 0) this.meleeCooldown--;
        if (this.swingEffect > 0) this.swingEffect--;
        
        if (equippedTrail && !this.isDashing) {
            const lastPoint = this.trailPoints[this.trailPoints.length - 1];
            const shouldAdd = !lastPoint || Math.hypot(this.x - lastPoint.x, this.y - lastPoint.y) > 4;
            if (shouldAdd) {
                this.trailPoints.push({
                    x: this.x + this.width/2,
                    y: this.y + this.height/2,
                    life: 40,
                    maxLife: 40
                });
                if (this.trailPoints.length > this.maxTrailPoints) {
                    this.trailPoints.shift();
                }
            }
        }
        
        for (let i = this.trailPoints.length - 1; i >= 0; i--) {
            this.trailPoints[i].life--;
            if (this.trailPoints[i].life <= 0) {
                this.trailPoints.splice(i, 1);
            }
        }
        
        if (!this.isDashing) {
            this.trail.push({x: this.x, y: this.y});
            if (this.trail.length > this.maxTrail) this.trail.shift();
        }
        
        if (this.isDashing) {
            this.dashTimer--;
            this.x += CONFIG.player.dashSpeed * this.dashDirection;
            if (this.dashTimer <= 0) {
                this.isDashing = false;
                this.velY = 0;
            }
            return;
        }
        
        this.velY += this.gravity;
        
        if (keys['ArrowLeft'] || keys['a'] || keys['ф']) {
            this.velX = -this.speed;
            this.dashDirection = -1;
        } else if (keys['ArrowRight'] || keys['d'] || keys['в']) {
            this.velX = this.speed;
            this.dashDirection = 1;
        } else {
            this.velX *= this.friction;
        }
        
        if ((keys[' '] || keys['ArrowUp'] || keys['w'] || keys['ц']) && this.jumpCount < this.maxJumps) {
            if (!this.jumping || this.maxJumps > 1) {
                this.velY = -this.jumpPower;
                this.jumping = true;
                this.jumpCount++;
                this.createJumpParticles();
                AudioSys.jump();
                keys[' '] = false;
                keys['ArrowUp'] = false;
                keys['w'] = false;
                keys['ц'] = false;
            }
        }
        
        if ((keys['Shift'] || keys['shift'] || keys['q'] || keys['й']) && this.dashCharges > 0 && this.dashCooldown <= 0) {
            this.startDash();
            keys['Shift'] = false;
            keys['shift'] = false;
            keys['q'] = false;
            keys['й'] = false;
        }
        
        this.x += this.velX;
        this.y += this.velY;
        
        this.x = Math.max(cameraX + 50, Math.min(this.x, cameraX + canvas.width - 50 - this.width));
        
        if (this.y > canvas.height + 200) {
            this.respawn();
            return;
        }
        
        this.checkPlatformCollisions();
    }
    
    startDash() {
        this.isDashing = true;
        this.dashTimer = CONFIG.player.dashDuration;
        this.dashCharges--;
        this.dashCooldown = CONFIG.player.dashCooldown;
        this.invulnerable = 15;
        this.velY = 0;
        AudioSys.dash();
        
        for (let i = 0; i < 20; i++) {
            particlePool.acquire(
                this.x + this.width/2 + Math.random() * 20 - 10,
                this.y + this.height/2 + Math.random() * 20 - 10,
                '#FFDE7D'
            );
        }
        updateDashIndicator();
    }
    
    meleeAttack() {
        if (this.meleeCooldown > 0 || !gameRunning) return;
        
        const classData = CLASSES[currentClass];
        this.meleeCooldown = CONFIG.melee.cooldownMax;
        this.swingEffect = 8;
        AudioSys.meleeSwing();
        
        const centerX = this.x + this.width/2;
        const centerY = this.y + this.height/2;
        const radius = classData.meleeRadius;
        const damage = classData.damage;
        
        if (equippedAura) {
            const aura = getAuraData(equippedAura);
            if (aura) {
                const screenX = centerX - cameraX;
                const screenY = centerY;
                showAuraEffectOnPlayer(screenX, screenY, aura);
            }
        }
        
        let hitSomething = false;
        
        for (let i = 0; i < enemies.length; i++) {
            const e = enemies[i];
            if (!e.active) continue;
            const enemyCenterX = e.x + e.width/2;
            const enemyCenterY = e.y + e.height/2;
            const dist = Math.hypot(centerX - enemyCenterX, centerY - enemyCenterY);
            if (dist < radius) {
                for (let d = 0; d < damage; d++) {
                    if (e.takeDamage()) {
                        enemies = enemies.filter(x => x !== e);
                        break;
                    }
                }
                hitSomething = true;
                updateCombo();
                this.createHitEffect(enemyCenterX, enemyCenterY);
            }
        }
        
        for (let i = 0; i < flyingEnemies.length; i++) {
            const fe = flyingEnemies[i];
            if (!fe.active) continue;
            const feCenterX = fe.x + fe.width/2;
            const feCenterY = fe.y + fe.height/2;
            const dist = Math.hypot(centerX - feCenterX, centerY - feCenterY);
            if (dist < radius) {
                for (let d = 0; d < damage; d++) {
                    if (fe.takeDamage()) {
                        flyingEnemies = flyingEnemies.filter(x => x !== fe);
                        break;
                    }
                }
                hitSomething = true;
                updateCombo();
                this.createHitEffect(feCenterX, feCenterY);
            }
        }
        
        for (let i = 0; i < vortexEnemies.length; i++) {
            const ve = vortexEnemies[i];
            if (!ve.active) continue;
            const veCenterX = ve.x + ve.width/2;
            const veCenterY = ve.y + ve.height/2;
            const dist = Math.hypot(centerX - veCenterX, centerY - veCenterY);
            if (dist < radius) {
                for (let d = 0; d < damage; d++) {
                    if (ve.takeDamage()) {
                        vortexEnemies = vortexEnemies.filter(x => x !== ve);
                        break;
                    }
                }
                hitSomething = true;
                updateCombo();
                this.createHitEffect(veCenterX, veCenterY);
            }
        }
        
        if (boss && boss.active) {
            const bossCenterX = boss.x + boss.width/2;
            const bossCenterY = boss.y + boss.height/2;
            const dist = Math.hypot(centerX - bossCenterX, centerY - bossCenterY);
            if (dist < radius + 15) {
                for (let d = 0; d < damage; d++) {
                    if (boss.takeDamage()) {
                        boss = null;
                        document.getElementById('bossHealthBar').style.display = 'none';
                        break;
                    }
                }
                hitSomething = true;
                updateCombo();
                this.createHitEffect(bossCenterX, bossCenterY);
                AudioSys.bossHit();
            }
        }
        
        if (hitSomething) {
            for (let i = 0; i < 25; i++) {
                particlePool.acquire(
                    centerX + (Math.random() - 0.5) * 40,
                    centerY + (Math.random() - 0.5) * 40,
                    '#ffaa33'
                );
            }
            shakeScreen(3);
        }
        
        const skinData = getSkinData(equippedSkin);
        if (skinData.festive && hitSomething) {
            for (let i = 0; i < 25; i++) {
                safeTimeout(() => {
                    const particle = document.createElement('div');
                    particle.className = 'skin-particle-05';
                    particle.textContent = Math.random() > 0.5 ? '05' : '🎂';
                    particle.style.left = (centerX - cameraX - 40 + Math.random() * 80) + 'px';
                    particle.style.top = (centerY - 40 + Math.random() * 80) + 'px';
                    particle.style.fontSize = (Math.random() * 10 + 10) + 'px';
                    particle.style.color = ['#ffaa44', '#ff3366', '#33ff66', '#ffcc00'][Math.floor(Math.random() * 4)];
                    document.body.appendChild(particle);
                    safeTimeout(() => particle.remove(), 1200);
                }, i * 12);
            }
        }
        
        if (skinData.id === 'sixseven' && hitSomething) {
            for (let i = 0; i < 12; i++) {
                safeTimeout(() => {
                    const particle = document.createElement('div');
                    particle.className = 'skin-particle-67';
                    particle.textContent = '67';
                    particle.style.left = (centerX - cameraX + (Math.random() - 0.5) * 100) + 'px';
                    particle.style.top = (centerY + (Math.random() - 0.5) * 80) + 'px';
                    document.body.appendChild(particle);
                    safeTimeout(() => particle.remove(), 800);
                }, i * 20);
            }
        }
    }
    
    createHitEffect(x, y) {
        for (let i = 0; i < 15; i++) {
            particlePool.acquire(
                x + (Math.random() - 0.5) * 20,
                y + (Math.random() - 0.5) * 20,
                '#ff5500'
            );
        }
    }
    
    createJumpParticles() {
        for (let i = 0; i < 12; i++) {
            particlePool.acquire(this.x + this.width/2, this.y + this.height, '#4af626');
        }
    }
    
    createLandParticles() {
        for (let i = 0; i < 8; i++) {
            particlePool.acquire(this.x + this.width/2, this.y + this.height, '#08D9D6');
        }
    }
    
    checkPlatformCollisions() {
        let onGround = false;
        for (let platform of platforms) {
            if (this.checkCollision(platform)) {
                if (this.velY > 0 && this.y + this.height - this.velY <= platform.y + 10) {
                    this.y = platform.y - this.height;
                    this.velY = 0;
                    if (this.jumping) {
                        this.createLandParticles();
                        this.jumping = false;
                    }
                    this.jumpCount = 0;
                    onGround = true;
                    if (platform.type === 'breaking' && !platform.broken) platform.breakTimer = 60;
                }
            }
        }
        if (onGround) this.jumpCount = 0;
    }
    
    checkCollision(obj) {
        return this.x < obj.x + obj.width &&
               this.x + this.width > obj.x &&
               this.y < obj.y + obj.height &&
               this.y + this.height > obj.y;
    }
    
    takeDamage(amount, knockbackX, knockbackY, color) {
        if (this.invulnerable > 0 || this.isDashing) return false;
        
        playerHealth = Math.max(0, playerHealth - amount);
        updateHealthBar();
        this.knockback(knockbackX, knockbackY);
        this.invulnerable = 45;
        AudioSys.hit();
        roundDamage += amount;
        
        for (let i = 0; i < 15; i++) {
            particlePool.acquire(this.x + this.width/2, this.y + this.height/2, color || '#ff2e63');
        }
        
        if (playerHealth <= 0) {
            gameOver();
            return true;
        }
        return false;
    }
    
    knockback(x, y) {
        this.velX = x;
        this.velY = y;
        this.jumping = true;
    }
    
    respawn() {
        this.takeDamage(30);
        this.x = this.lastCheckpoint.x;
        this.y = this.lastCheckpoint.y;
        this.velX = 0;
        this.velY = 0;
        this.jumping = false;
        this.jumpCount = 0;
        this.invulnerable = 90;
        
        for (let i = 0; i < 25; i++) {
            particlePool.acquire(this.x + this.width/2, this.y + this.height/2, '#FF2E63');
        }
        shakeScreen(5);
    }
    
    saveCheckpoint() {
        this.lastCheckpoint = { x: this.x, y: this.y };
        showCheckpointIndicator();
        AudioSys.checkpoint();
    }
    
    drawShape(ctx, x, y, w, h, skin) {
        let useDarkEdges = false;
        if (skin.id === 'blackghost') {
            useDarkEdges = (this.invulnerable > 0 || this.swingEffect > 0 || equippedAura !== null);
        }
        
        const mainColor = skin.color;
        
        // ==================== КЕКС (БЕЗ РТА - v2.5) ====================
        if (skin.shape === 'cupcake') {
            // Основа кекса (коричневая часть)
            ctx.fillStyle = '#8B4513';
            ctx.beginPath();
            ctx.moveTo(x + 5, y + h);
            ctx.lineTo(x + w - 5, y + h);
            ctx.lineTo(x + w, y + h * 0.6);
            ctx.lineTo(x, y + h * 0.6);
            ctx.closePath();
            ctx.fill();
            
            // Глазурь (розовая шапочка)
            ctx.fillStyle = mainColor;
            ctx.beginPath();
            ctx.arc(x + w/2, y + h * 0.5, w * 0.55, Math.PI, 0, false);
            ctx.closePath();
            ctx.fill();
            
            // Вишенка на верху
            ctx.fillStyle = '#ff0000';
            ctx.beginPath();
            ctx.arc(x + w/2, y + 5, 5, 0, Math.PI * 2);
            ctx.fill();
            
            // Посыпка (разноцветная)
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(x + 10, y + h * 0.35, 3, 3);
            ctx.fillRect(x + 20, y + h * 0.4, 3, 3);
            ctx.fillRect(x + 30, y + h * 0.35, 3, 3);
            
            // Только глаза, БЕЗ РТА
            this.drawEyes(ctx, x, y + h * 0.5, w, h * 0.5, '#222');
            return;
        }
        
        if (skin.shape === 'pillow') {
            ctx.fillStyle = mainColor;
            ctx.shadowColor = 'rgba(0,0,0,0.3)';
            ctx.shadowBlur = 10;
            
            const rx = 12;
            const ry = 8;
            ctx.beginPath();
            ctx.moveTo(x + rx, y);
            ctx.lineTo(x + w - rx, y);
            ctx.quadraticCurveTo(x + w + 3, y, x + w + 3, y + ry);
            ctx.lineTo(x + w + 3, y + h - ry);
            ctx.quadraticCurveTo(x + w + 3, y + h, x + w - rx, y + h);
            ctx.lineTo(x + rx, y + h);
            ctx.quadraticCurveTo(x - 3, y + h, x - 3, y + h - ry);
            ctx.lineTo(x - 3, y + ry);
            ctx.quadraticCurveTo(x - 3, y, x + rx, y);
            ctx.closePath();
            ctx.fill();
            ctx.shadowBlur = 0;
            
            ctx.strokeStyle = '#cccccc';
            ctx.lineWidth = 1;
            ctx.setLineDash([3, 3]);
            ctx.beginPath();
            ctx.moveTo(x, y + h/2);
            ctx.lineTo(x + w, y + h/2);
            ctx.stroke();
            ctx.setLineDash([]);
            
            ctx.fillStyle = 'rgba(0,0,0,0.05)';
            ctx.fillRect(x + 5, y + h - 8, w - 10, 4);
            
            this.drawEyes(ctx, x, y, w, h, '#222');
            ctx.fillStyle = '#222';
            ctx.fillRect(x + 12, y + 25, 16, 3);
            return;
        }
        
        if (skin.shape === 'cone') {
            ctx.beginPath();
            ctx.moveTo(x + w/2, y);
            ctx.lineTo(x + w, y + h);
            ctx.lineTo(x, y + h);
            ctx.closePath();
            ctx.fillStyle = mainColor;
            ctx.fill();
            ctx.fillStyle = '#222';
            ctx.fillRect(x + w/2 - 4, y + 10, 8, 8);
            ctx.fillRect(x + w/2 - 4, y + 22, 8, 8);
            ctx.fillRect(x + w/2 - 10, y + 35, 20, 4);
            return;
        }
        
        if (skin.id === 'sixseven') {
            ctx.fillStyle = mainColor;
            ctx.fillRect(x, y, w, h);
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 28px monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('67', x + w/2, y + h/2 - 5);
            ctx.fillStyle = '#222';
            ctx.fillRect(x + 10, y + 10, 8, 8);
            ctx.fillRect(x + 22, y + 10, 8, 8);
            ctx.fillRect(x + 10, y + 25, 20, 4);
            return;
        }
        
        if (skin.id === 'halfyear') {
            ctx.fillStyle = mainColor;
            ctx.fillRect(x, y, w, h);
            
            ctx.fillStyle = '#ff3366';
            ctx.fillRect(x + 5, y + 5, 4, 4);
            ctx.fillStyle = '#33ff66';
            ctx.fillRect(x + 31, y + 5, 4, 4);
            ctx.fillStyle = '#ffcc00';
            ctx.fillRect(x + 18, y + 3, 4, 4);
            ctx.fillStyle = '#ff66cc';
            ctx.fillRect(x + 5, y + 32, 4, 4);
            ctx.fillStyle = '#66ccff';
            ctx.fillRect(x + 31, y + 32, 4, 4);
            
            ctx.fillStyle = '#222';
            ctx.fillRect(x + 10, y + 10, 8, 8);
            ctx.fillRect(x + 22, y + 10, 8, 8);
            ctx.fillRect(x + 10, y + 25, 20, 4);
            
            ctx.fillStyle = '#ff3366';
            ctx.font = 'bold 7px monospace';
            ctx.textAlign = 'center';
            ctx.fillText('🎂', x + w/2, y + 22);
            ctx.fillStyle = '#222';
            ctx.font = 'bold 6px monospace';
            ctx.fillText('6 МЕСЯЦЕВ', x + w/2, y + 36);
            
            ctx.beginPath();
            ctx.moveTo(x, y + 15);
            ctx.lineTo(x - 3, y + 20);
            ctx.lineTo(x, y + 25);
            ctx.fillStyle = '#ff3366';
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(x + w, y + 15);
            ctx.lineTo(x + w + 3, y + 20);
            ctx.lineTo(x + w, y + 25);
            ctx.fill();
            return;
        }
        
        if (skin.id === 'blackghost') {
            ctx.fillStyle = mainColor;
            ctx.fillRect(x, y, w, h);
            
            if (useDarkEdges) {
                ctx.fillStyle = '#444444';
                ctx.fillRect(x, y, w, 3);
                ctx.fillRect(x, y + h - 3, w, 3);
                ctx.fillRect(x, y, 3, h);
                ctx.fillRect(x + w - 3, y, 3, h);
            }
            
            this.drawEyes(ctx, x, y, w, h, '#ffffff');
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(x + 10, y + 25, 20, 4);
            return;
        }
        
        if (skin.id === 'kaleidoscope') {
            ctx.fillStyle = getKaleidoscopeColor();
            ctx.fillRect(x, y, w, h);
        } else {
            ctx.fillStyle = mainColor;
            ctx.fillRect(x, y, w, h);
        }
        
        this.drawEyes(ctx, x, y, w, h, '#222');
        ctx.fillStyle = '#222';
        ctx.fillRect(x + 10, y + 25, 20, 4);
    }
    
    drawEyes(ctx, x, y, w, h, color) {
        if (equippedAccessory === 'vortex_eyes') {
            this.vortexCache.frame++;
            if (this.vortexCache.frame >= 4) {
                this.vortexCache.frame = 0;
                
                let targetX = this.x + w/2, targetY = this.y + h/2;
                let minDist = Infinity;
                
                const allEnemies = enemies;
                for (let i = 0; i < allEnemies.length; i++) {
                    const e = allEnemies[i];
                    if (!e.active) continue;
                    const dx = e.x - this.x;
                    const dy = e.y - this.y;
                    const dist = dx * dx + dy * dy;
                    if (dist < minDist) {
                        minDist = dist;
                        targetX = e.x + e.width/2;
                        targetY = e.y + e.height/2;
                    }
                }
                
                for (let i = 0; i < flyingEnemies.length; i++) {
                    const e = flyingEnemies[i];
                    if (!e.active) continue;
                    const dx = e.x - this.x;
                    const dy = e.y - this.y;
                    const dist = dx * dx + dy * dy;
                    if (dist < minDist) {
                        minDist = dist;
                        targetX = e.x + e.width/2;
                        targetY = e.y + e.height/2;
                    }
                }
                
                for (let i = 0; i < vortexEnemies.length; i++) {
                    const e = vortexEnemies[i];
                    if (!e.active) continue;
                    const dx = e.x - this.x;
                    const dy = e.y - this.y;
                    const dist = dx * dx + dy * dy;
                    if (dist < minDist) {
                        minDist = dist;
                        targetX = e.x + e.width/2;
                        targetY = e.y + e.height/2;
                    }
                }
                
                if (boss && boss.active) {
                    const dx = boss.x - this.x;
                    const dy = boss.y - this.y;
                    const dist = dx * dx + dy * dy;
                    if (dist < minDist) {
                        targetX = boss.x + boss.width/2;
                        targetY = boss.y + boss.height/2;
                    }
                }
                
                this.vortexCache.target = { x: targetX, y: targetY };
            }
            
            const target = this.vortexCache.target || { x: this.x + w/2, y: this.y + h/2 };
            const dx = target.x - (this.x + w/2);
            const dy = target.y - (this.y + h/2);
            const maxOffset = 3;
            const lookX = Math.max(-maxOffset, Math.min(maxOffset, dx / 50));
            const lookY = Math.max(-maxOffset, Math.min(maxOffset, dy / 50));
            
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.ellipse(x + 12, y + 14, 7, 8, 0, 0, Math.PI * 2);
            ctx.ellipse(x + 28, y + 14, 7, 8, 0, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = '#000';
            ctx.beginPath();
            ctx.arc(x + 12 + lookX, y + 14 + lookY, 4, 0, Math.PI * 2);
            ctx.arc(x + 28 + lookX, y + 14 + lookY, 4, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(x + 10 + lookX * 0.5, y + 11 + lookY * 0.5, 1.5, 0, Math.PI * 2);
            ctx.arc(x + 26 + lookX * 0.5, y + 11 + lookY * 0.5, 1.5, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.strokeStyle = 'rgba(0, 204, 255, 0.6)';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.ellipse(x + 12, y + 14, 8, 9, 0, 0, Math.PI * 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.ellipse(x + 28, y + 14, 8, 9, 0, 0, Math.PI * 2);
            ctx.stroke();
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(x + 10, y + 10, 8, 8);
            ctx.fillRect(x + 22, y + 10, 8, 8);
        }
    }
    
    draw(ctx, cameraX) {
        const skin = getSkinData(equippedSkin);
        const drawX = this.x - cameraX;
        
        this.drawTrail(ctx, cameraX);
        
        for (let i = 0; i < this.trail.length; i++) {
            ctx.globalAlpha = i / this.trail.length * 0.25;
            this.drawShape(ctx, this.trail[i].x - cameraX, this.trail[i].y, this.width, this.height, skin);
        }
        ctx.globalAlpha = 1;
        
        if (this.isDashing) {
            ctx.shadowColor = skin.color;
            ctx.shadowBlur = 20;
            this.drawShape(ctx, drawX, this.y, this.width, this.height, skin);
            ctx.shadowBlur = 0;
        } else {
            this.drawShape(ctx, drawX, this.y, this.width, this.height, skin);
        }
        
        if (this.swingEffect > 0) {
            ctx.beginPath();
            ctx.arc(drawX + this.width/2, this.y + this.height/2, CLASSES[currentClass].meleeRadius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 80, 40, ${0.3 * (this.swingEffect / 8)})`;
            ctx.fill();
            ctx.beginPath();
            ctx.arc(drawX + this.width/2, this.y + this.height/2, CLASSES[currentClass].meleeRadius - 10, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 200, 0, 0.5)`;
            ctx.fill();
        }
        
        if (this.jumpCount === 1 && !this.jumping && this.maxJumps > 1) {
            ctx.fillStyle = 'rgba(8, 217, 214, 0.7)';
            ctx.beginPath();
            ctx.arc(drawX + this.width/2, this.y - 8, 5, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    drawTrail(ctx, cameraX) {
        if (!equippedTrail || this.trailPoints.length === 0) return;
        
        const trailData = getTrailData(equippedTrail);
        if (!trailData) return;
        
        const type = trailData.type;
        const color = trailData.color;
        const time = Date.now() / 1000;
        
        for (let i = 0; i < this.trailPoints.length; i++) {
            const p = this.trailPoints[i];
            const lifeRatio = p.life / p.maxLife;
            const drawX = p.x - cameraX;
            const drawY = p.y;
            
            ctx.globalAlpha = lifeRatio * 0.8;
            
            switch(type) {
                case 'rainbow':
                    const rainbowColors = ['#ff0000', '#ff8800', '#ffff00', '#00ff00', '#0088ff', '#8800ff'];
                    const colorIdx = Math.floor((1 - lifeRatio) * rainbowColors.length) % rainbowColors.length;
                    ctx.fillStyle = rainbowColors[colorIdx];
                    ctx.beginPath();
                    ctx.arc(drawX, drawY, 8 * lifeRatio, 0, Math.PI * 2);
                    ctx.fill();
                    break;
                    
                case 'fire':
                    ctx.fillStyle = lifeRatio > 0.5 ? '#ffaa00' : '#ff4400';
                    ctx.beginPath();
                    ctx.arc(drawX, drawY - (1 - lifeRatio) * 10, 10 * lifeRatio, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = '#ffff00';
                    ctx.beginPath();
                    ctx.arc(drawX, drawY - (1 - lifeRatio) * 10, 5 * lifeRatio, 0, Math.PI * 2);
                    ctx.fill();
                    break;
                    
                case 'ice':
                    ctx.fillStyle = '#aaddff';
                    ctx.shadowColor = '#00ccff';
                    ctx.shadowBlur = 10;
                    ctx.beginPath();
                    for (let j = 0; j < 6; j++) {
                        const angle = (j / 6) * Math.PI * 2 + lifeRatio * Math.PI;
                        const r = 6 * lifeRatio;
                        const px = drawX + Math.cos(angle) * r;
                        const py = drawY + Math.sin(angle) * r;
                        if (j === 0) ctx.moveTo(px, py);
                        else ctx.lineTo(px, py);
                    }
                    ctx.closePath();
                    ctx.fill();
                    ctx.shadowBlur = 0;
                    break;
                    
                case 'stars':
                    ctx.fillStyle = '#ffff00';
                    ctx.shadowColor = '#ffff00';
                    ctx.shadowBlur = 8;
                    ctx.beginPath();
                    for (let j = 0; j < 5; j++) {
                        const outerAngle = (j / 5) * Math.PI * 2 - Math.PI / 2;
                        const innerAngle = outerAngle + Math.PI / 5;
                        const outerR = 8 * lifeRatio;
                        const innerR = 4 * lifeRatio;
                        const ox = drawX + Math.cos(outerAngle) * outerR;
                        const oy = drawY + Math.sin(outerAngle) * outerR;
                        const ix = drawX + Math.cos(innerAngle) * innerR;
                        const iy = drawY + Math.sin(innerAngle) * innerR;
                        if (j === 0) ctx.moveTo(ox, oy);
                        else ctx.lineTo(ox, oy);
                        ctx.lineTo(ix, iy);
                    }
                    ctx.closePath();
                    ctx.fill();
                    ctx.shadowBlur = 0;
                    break;
                    
                case 'hearts':
                    ctx.fillStyle = '#ff69b4';
                    ctx.shadowColor = '#ff69b4';
                    ctx.shadowBlur = 6;
                    const hs = 6 * lifeRatio;
                    ctx.beginPath();
                    ctx.moveTo(drawX, drawY + hs/2);
                    ctx.bezierCurveTo(drawX, drawY, drawX - hs, drawY, drawX - hs, drawY + hs/2);
                    ctx.bezierCurveTo(drawX - hs, drawY + hs, drawX, drawY + hs * 1.5, drawX, drawY + hs * 1.5);
                    ctx.bezierCurveTo(drawX, drawY + hs * 1.5, drawX + hs, drawY + hs, drawX + hs, drawY + hs/2);
                    ctx.bezierCurveTo(drawX + hs, drawY, drawX, drawY, drawX, drawY + hs/2);
                    ctx.fill();
                    ctx.shadowBlur = 0;
                    break;
                    
                case 'music':
                    ctx.fillStyle = '#ffffff';
                    ctx.shadowColor = '#ffffff';
                    ctx.shadowBlur = 10;
                    const fontSize = 28 * lifeRatio;
                    ctx.font = `bold ${fontSize}px Arial`;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    const notes = ['♪', '♫', '♩', '♬'];
                    ctx.fillText(notes[Math.floor(i / 3) % notes.length], drawX, drawY + (1 - lifeRatio) * -15);
                    ctx.shadowBlur = 0;
                    break;
                    
                case 'neon':
                    ctx.strokeStyle = color;
                    ctx.shadowColor = color;
                    ctx.shadowBlur = 15;
                    ctx.lineWidth = 3 * lifeRatio;
                    ctx.beginPath();
                    ctx.arc(drawX, drawY, 10 * lifeRatio, 0, Math.PI * 2);
                    ctx.stroke();
                    ctx.shadowBlur = 0;
                    break;
                    
                case 'shadow':
                    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
                    ctx.fillRect(drawX - 20 * lifeRatio, drawY - 20 * lifeRatio, 40 * lifeRatio, 40 * lifeRatio);
                    break;
                    
                case 'galaxy':
                    const gradient = ctx.createRadialGradient(drawX, drawY, 0, drawX, drawY, 15 * lifeRatio);
                    gradient.addColorStop(0, '#ffffff');
                    gradient.addColorStop(0.3, '#9b59b6');
                    gradient.addColorStop(1, 'rgba(155, 89, 182, 0)');
                    ctx.fillStyle = gradient;
                    ctx.beginPath();
                    ctx.arc(drawX, drawY, 15 * lifeRatio, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = '#ffffff';
                    for (let j = 0; j < 3; j++) {
                        const a = (j / 3) * Math.PI * 2 + lifeRatio * 3;
                        ctx.fillRect(drawX + Math.cos(a) * 8, drawY + Math.sin(a) * 8, 2, 2);
                    }
                    break;
                    
                case 'golden':
                    ctx.fillStyle = '#FFD700';
                    ctx.shadowColor = '#FFD700';
                    ctx.shadowBlur = 12;
                    ctx.beginPath();
                    ctx.arc(drawX, drawY, 8 * lifeRatio, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = '#ffff88';
                    ctx.beginPath();
                    ctx.arc(drawX, drawY, 4 * lifeRatio, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.shadowBlur = 0;
                    break;
                    
                case 'sparks':
                    const sparkColors = ['#ff6600', '#ffaa00', '#ff3300', '#ffff00', '#ff8800'];
                    const sparkCount = 6;
                    
                    for (let j = 0; j < sparkCount; j++) {
                        const sparkColor = sparkColors[j % sparkColors.length];
                        const angle = (j / sparkCount) * Math.PI * 2 + time * 3 + i * 0.3;
                        const baseR = 10 * (1 - lifeRatio);
                        const wobble = Math.sin(time * 10 + j + i) * 3;
                        const r = baseR + wobble;
                        
                        const sx = drawX + Math.cos(angle) * r;
                        const sy = drawY + Math.sin(angle) * r * 0.5 - (1 - lifeRatio) * 12;
                        
                        const sparkSize = (2 + Math.sin(time * 15 + j) * 1) * lifeRatio;
                        
                        ctx.shadowColor = sparkColor;
                        ctx.shadowBlur = 15 * lifeRatio;
                        
                        ctx.fillStyle = '#ffffff';
                        ctx.beginPath();
                        ctx.arc(sx, sy, sparkSize * 0.5, 0, Math.PI * 2);
                        ctx.fill();
                        
                        ctx.fillStyle = sparkColor;
                        ctx.beginPath();
                        ctx.arc(sx, sy, sparkSize, 0, Math.PI * 2);
                        ctx.fill();
                        
                        ctx.strokeStyle = sparkColor;
                        ctx.lineWidth = 1.5 * lifeRatio;
                        ctx.globalAlpha = lifeRatio * 0.6;
                        ctx.beginPath();
                        ctx.moveTo(sx, sy);
                        ctx.lineTo(sx - Math.cos(angle) * 4, sy - Math.sin(angle) * 2 + 3);
                        ctx.stroke();
                        ctx.globalAlpha = lifeRatio * 0.8;
                    }
                    ctx.shadowBlur = 0;
                    break;
                    
                case 'cat':
                    const catSize = 32 * lifeRatio;
                    ctx.font = `${catSize}px Arial`;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    const catWobble = Math.sin(time * 5 + i * 0.5) * 3;
                    ctx.fillText('😸', drawX + catWobble, drawY);
                    break;
                    
                // ==================== ДЕНЬ РОЖДЕНИЯ (УПРОЩЁННЫЙ - v2.5) ====================
                case 'birthday':
                    // Только большой эмодзи, без конфетти/кругов/блёсток
                    const bdEmojis = ['🎂', '🎉', '🎁', '🎈', '🎊', '🥳', '🍰', '🎀'];
                    const bdEmoji = bdEmojis[Math.floor(i / 2) % bdEmojis.length];
                    const bdSize = 36 * lifeRatio;
                    
                    ctx.save();
                    ctx.translate(drawX, drawY);
                    ctx.rotate(Math.sin(time * 3 + i) * 0.3);
                    ctx.font = `bold ${bdSize}px Arial`;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(bdEmoji, 0, 0);
                    ctx.restore();
                    break;
                    
                default:
                    ctx.fillStyle = color;
                    ctx.beginPath();
                    ctx.arc(drawX, drawY, 6 * lifeRatio, 0, Math.PI * 2);
                    ctx.fill();
            }
        }
        
        ctx.globalAlpha = 1;
    }
}

class Enemy { 
    constructor(x,y,type=0){
        this.x=x;this.y=y;this.width=40;this.height=40;
        this.type=type;
        this.color=enemyColors[Math.floor(Math.random()*enemyColors.length)];
        this.speed=type===0?0:type===1?1+Math.random()*2:0;
        this.direction=Math.random()>0.5?1:-1;
        this.shootCooldown=0;
        this.patrolRange=100+Math.random()*200;
        this.startX=x;
        this.jumpCooldown=0;
        this.health=CONFIG.enemies.baseHealth[type===0?'normal':type===1?'patrol':'jumper'];
        this.maxHealth=this.health;
        this.scoreValue=CONFIG.enemies.baseScore[type===0?'normal':type===1?'patrol':'jumper'];
        this.texture=Math.floor(Math.random()*3);
        this.active=true;
    }
    update(){
        if(!this.active) return;
        if(this.type===1){
            this.x+=this.speed*this.direction;
            if(Math.abs(this.x-this.startX)>this.patrolRange) this.direction*=-1;
        }
        if(this.type===2 && this.jumpCooldown<=0){
            let onPlatform=false;
            for(let p of platforms){
                if(this.x<p.x+p.width && this.x+this.width>p.x && this.y+this.height>p.y && this.y+this.height<p.y+30){
                    onPlatform=true;
                    break;
                }
            }
            if(onPlatform){
                const dir=player.x>this.x?1:-1;
                this.y-=12+Math.random()*4;
                this.x+=dir*(8+Math.random()*4);
                this.jumpCooldown=60+Math.random()*120;
            }
        }
        this.jumpCooldown--;
        this.y+=0.8;
        for(let platform of platforms){
            if(this.x<platform.x+platform.width && this.x+this.width>platform.x && this.y+this.height>platform.y && this.y+this.height<platform.y+30){
                this.y=platform.y-this.height;
                if(this.type===1 && (this.x<=platform.x+5 || this.x+this.width>=platform.x+platform.width-5)) this.direction*=-1;
            }
        }
    }
    takeDamage(){
        this.health--;
        if(this.health<=0){
            this.destroy();
            return true;
        }
        return false;
    }
    destroy(){
        this.active=false;
        addScore(this.scoreValue*comboMultiplier);
        updateCombo();
        AudioSys.collect();
        for(let i=0;i<20;i++) particlePool.acquire(this.x+this.width/2, this.y+this.height/2, this.color);
        if(Math.random()<0.35) coins.push({x:this.x+this.width/2,y:this.y+this.height/2,size:12,color:'#FFDE7D',bounce:0});
        if(Math.random()<0.12) powerUps.push({x:this.x+this.width/2,y:this.y+this.height/2,size:15,color:'#FF2E63',type:'health'});
    }
    draw(ctx){
        if(!this.active) return;
        ctx.fillStyle=this.color;
        ctx.fillRect(this.x-cameraX,this.y,this.width,this.height);
        ctx.fillStyle='rgba(0,0,0,0.25)';
        if(this.texture===0){
            for(let i=0;i<this.width;i+=15) ctx.fillRect(this.x-cameraX+i,this.y,8,this.height);
        } else if(this.texture===1){
            for(let i=0;i<this.width;i+=10) for(let j=0;j<this.height;j+=10) if((Math.floor(i/10)+Math.floor(j/10))%2===0) ctx.fillRect(this.x-cameraX+i,this.y+j,10,10);
        } else {
            ctx.beginPath(); ctx.arc(this.x-cameraX+this.width/2,this.y+this.height/2,this.width/4,0,Math.PI*2); ctx.fill();
        }
        ctx.fillStyle='#000';
        ctx.fillRect(this.x-cameraX+10,this.y+10,8,8);
        ctx.fillRect(this.x-cameraX+this.width-18,this.y+10,8,8);
        ctx.fillStyle=this.type===0?'#ff0000':this.type===1?'#0088ff':'#ffff00';
        ctx.fillRect(this.x-cameraX,this.y,this.width,5);
        if(this.health<this.maxHealth){
            ctx.fillStyle='#4af626';
            ctx.fillRect(this.x-cameraX,this.y-8,(this.width*this.health)/this.maxHealth,4);
        }
    }
}

class FlyingEnemy { 
    constructor(x,y){
        this.x=x;this.y=y;this.originalY=y;
        this.width=35;this.height=35;
        this.color=flyingEnemyColors[Math.floor(Math.random()*flyingEnemyColors.length)];
        this.speed=1.5+Math.random()*1.5;
        this.direction=Math.random()>0.5?1:-1;
        this.health=2;
        this.maxHealth=2;
        this.wingPhase=0;
        this.floatAmplitude=20+Math.random()*30;
        this.floatSpeed=0.05+Math.random()*0.03;
        this.floatPhase=Math.random()*Math.PI*2;
        this.chargeCooldown=0;
        this.isCharging=false;
        this.chargeDirection=0;
        this.active=true;
    } 
    update(){
        if(!this.active) return;
        this.wingPhase+=0.2;
        this.floatPhase+=this.floatSpeed;
        this.y=this.originalY+Math.sin(this.floatPhase)*this.floatAmplitude;
        this.x+=this.speed*this.direction;
        if(this.x<cameraX-50||this.x>cameraX+canvas.width+50) this.direction*=-1;
        if(!this.isCharging){
            this.chargeCooldown--;
            if(this.chargeCooldown<=0){
                const dx=player.x-this.x,dy=player.y-this.y;
                if(Math.sqrt(dx*dx+dy*dy)<300){
                    this.isCharging=true;
                    this.chargeDirection=dx>0?1:-1;
                    this.chargeCooldown=120+Math.random()*120;
                }
            }
        } else {
            this.x+=8*this.chargeDirection;
            this.y+=(player.y-this.y)*0.1;
            if(Math.abs(player.x-this.x)<50||this.x<cameraX-100||this.x>cameraX+canvas.width+100){
                this.isCharging=false;
                this.chargeCooldown=60+Math.random()*60;
            }
        }
    } 
    takeDamage(){
        this.health--;
        if(this.health<=0){
            this.destroy();
            return true;
        }
        return false;
    } 
    destroy(){
        this.active=false;
        addScore(200*comboMultiplier);
        updateCombo();
        AudioSys.collect();
        for(let i=0;i<30;i++) particlePool.acquire(this.x+this.width/2,this.y+this.height/2,this.color);
        if(Math.random()<0.5) coins.push({x:this.x+this.width/2,y:this.y+this.height/2,size:12,color:'#FFDE7D',bounce:0});
        if(Math.random()<0.3) powerUps.push({x:this.x+this.width/2,y:this.y+this.height/2,size:15,color:'#FF2E63',type:'health'});
    } 
    draw(ctx){
        if(!this.active) return;
        ctx.fillStyle=this.color;
        ctx.fillRect(this.x-cameraX,this.y,this.width,this.height);
        ctx.fillStyle=this.color+'80';
        const wy=this.y+this.height/2,wa=Math.sin(this.wingPhase)*10;
        ctx.beginPath();
        ctx.moveTo(this.x-cameraX-15,wy);
        ctx.quadraticCurveTo(this.x-cameraX-25,wy-wa,this.x-cameraX-15,wy);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(this.x-cameraX+this.width+15,wy);
        ctx.quadraticCurveTo(this.x-cameraX+this.width+25,wy-wa,this.x-cameraX+this.width+15,wy);
        ctx.fill();
        ctx.fillStyle='#000';
        ctx.fillRect(this.x-cameraX+8,this.y+8,6,6);
        ctx.fillRect(this.x-cameraX+21,this.y+8,6,6);
        if(this.isCharging){
            ctx.fillStyle='#FF0000';
            for(let i=0;i<3;i++){
                ctx.beginPath();
                ctx.arc(this.x-cameraX+this.width/2,this.y-10-i*5,2,0,Math.PI*2);
                ctx.fill();
            }
        }
        ctx.shadowColor=this.color;
        ctx.shadowBlur=15;
        ctx.fillRect(this.x-cameraX,this.y,this.width,this.height);
        ctx.shadowBlur=0;
        if(this.health<this.maxHealth){
            ctx.fillStyle='#4af626';
            ctx.fillRect(this.x-cameraX,this.y-8,(this.width*this.health)/this.maxHealth,4);
        }
    }
}

class VortexEnemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 55;
        this.height = 55;
        this.color = '#00ccff';
        this.innerColor = '#0088ff';
        this.health = 6;
        this.maxHealth = 6;
        this.scoreValue = 400;
        this.active = true;
        this.rotation = 0;
        this.pulsePhase = 0;
        this.floatOffset = Math.random() * Math.PI * 2;
        this.floatAmplitude = 25;
        this.floatSpeed = 0.03;
        this.floatY = 0;
        this.frameCount = 0;
        this.speed = 0.4;
        this.suckForce = 1.8;
        this.suckRadius = 220;
        this.suckCooldown = 0;
        this.isSucking = false;
        this.suckTimer = 0;
        this.suckDuration = 60;
        this.suckCooldownMax = 120;
        this.knockbackImmune = 0;
    }
    
    update() {
        if (!this.active) return;
        this.frameCount++;
        this.rotation += 0.08;
        this.pulsePhase += 0.05;
        this.floatOffset += this.floatSpeed;
        this.floatY = Math.sin(this.floatOffset) * this.floatAmplitude;
        if (this.suckCooldown > 0) this.suckCooldown--;
        if (this.suckTimer > 0) {
            this.suckTimer--;
            this.isSucking = this.suckTimer > 0;
        } else {
            this.isSucking = false;
        }
        if (this.knockbackImmune > 0) this.knockbackImmune--;
        if (player && player.active !== false) {
            const dx = player.x + player.width / 2 - (this.x + this.width / 2);
            const dy = player.y + player.height / 2 - (this.y + this.height / 2);
            const dist = Math.hypot(dx, dy);
            if (dist > 10) {
                const angle = Math.atan2(dy, dx);
                const move = Math.min(this.speed, dist / 50);
                this.x += Math.cos(angle) * move;
            }
        }
        this.y += 0.6;
        for (let platform of platforms) {
            if (this.x < platform.x + platform.width &&
                this.x + this.width > platform.x &&
                this.y + this.height > platform.y &&
                this.y + this.height < platform.y + 30) {
                this.y = platform.y - this.height;
            }
        }
        if (this.suckCooldown <= 0 && !this.isSucking && player && player.active !== false) {
            const dx = (player.x + player.width / 2) - (this.x + this.width / 2);
            const dy = (player.y + player.height / 2) - (this.y + this.height / 2);
            const dist = Math.hypot(dx, dy);
            if (dist < this.suckRadius) {
                this.startSuck();
            }
        }
        if (this.isSucking && player && player.active !== false && !player.isDashing) {
            const dx = (this.x + this.width / 2) - (player.x + player.width / 2);
            const dy = (this.y + this.height / 2) - (player.y + player.height / 2);
            const dist = Math.hypot(dx, dy);
            if (dist > 15) {
                const angle = Math.atan2(dy, dx);
                const force = Math.min(this.suckForce, dist / 35);
                player.velX += Math.cos(angle) * force;
                player.velY += Math.sin(angle) * force;
                if (this.frameCount % 5 === 0) {
                    for (let i = 0; i < 2; i++) {
                        particlePool.acquire(
                            player.x + player.width / 2 + (Math.random() - 0.5) * 20,
                            player.y + player.height / 2 + (Math.random() - 0.5) * 20,
                            '#ffffff'
                        );
                    }
                }
                if (dist < 35 && player.invulnerable <= 0) {
                    player.takeDamage(18, player.x < this.x ? -10 : 10, -6, '#00ccff');
                    this.suckTimer = Math.max(10, this.suckTimer - 15);
                }
            } else {
                if (this.frameCount % 12 === 0 && player.invulnerable <= 0) {
                    player.takeDamage(12, (Math.random() - 0.5) * 14, -10 + Math.random() * 8, '#00ccff');
                }
            }
        }
        if (this.frameCount % 8 === 0) {
            const cx = this.x + this.width / 2;
            const cy = this.y + this.height / 2;
            const angle = Math.random() * Math.PI * 2;
            const radius = 30 + Math.random() * 20;
            particlePool.acquire(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius, '#00ccff');
        }
    }
    
    startSuck() {
        this.isSucking = true;
        this.suckTimer = this.suckDuration;
        this.suckCooldown = this.suckCooldownMax;
        for (let i = 0; i < 20; i++) {
            const cx = this.x + this.width / 2;
            const cy = this.y + this.height / 2;
            const angle = Math.random() * Math.PI * 2;
            const radius = 40 + Math.random() * 50;
            particlePool.acquire(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius, '#ffffff');
        }
    }
    
    takeDamage(amount = 1) {
        if (this.knockbackImmune > 0) return false;
        this.health -= amount;
        this.knockbackImmune = 8;
        for (let i = 0; i < 15; i++) {
            particlePool.acquire(this.x + Math.random() * this.width, this.y + Math.random() * this.height, '#ffaa44');
        }
        if (this.isSucking) this.suckTimer = Math.max(5, this.suckTimer - 20);
        if (this.health <= 0) { this.destroy(); return true; }
        return false;
    }
    
    destroy() {
        this.active = false;
        addScore(this.scoreValue * comboMultiplier);
        updateCombo();
        AudioSys.collect();
        for (let i = 0; i < 60; i++) {
            particlePool.acquire(this.x + this.width / 2 + (Math.random() - 0.5) * this.width, this.y + this.height / 2 + (Math.random() - 0.5) * this.height, '#00ccff');
        }
        if (Math.random() < 0.5) coins.push({x: this.x + this.width / 2, y: this.y + this.height / 2, size: 12, color: '#FFDE7D', bounce: 0});
        if (Math.random() < 0.25) powerUps.push({x: this.x + this.width / 2, y: this.y + this.height / 2, size: 15, color: '#FF2E63', type: 'health'});
        shakeScreen(6);
    }
    
    draw(ctx) {
        if (!this.active) return;
        const drawX = this.x - cameraX;
        const drawY = this.y + this.floatY;
        const centerX = drawX + this.width / 2;
        const centerY = drawY + this.height / 2;
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(this.rotation);
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 20 + Math.sin(this.pulsePhase) * 10;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        for (let i = 0; i < 3; i++) ctx.arc(0, 0, 25 - i * 6, this.rotation, this.rotation + Math.PI * 2);
        ctx.stroke();
        ctx.strokeStyle = this.innerColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i < 360; i += 15) {
            const r = 20 - (i / 360) * 18;
            const angleRad = i * Math.PI / 180 + this.rotation * 2;
            const px = Math.cos(angleRad) * r;
            const py = Math.sin(angleRad) * r;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.stroke();
        ctx.restore();
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.ellipse(centerX - 12, centerY - 8, 9, 11, 0, 0, Math.PI * 2);
        ctx.ellipse(centerX + 12, centerY - 8, 9, 11, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#000';
        let lookX = 0, lookY = 0;
        if (player && player.active !== false) {
            const playerCenterX = player.x + player.width / 2;
            const playerCenterY = player.y + player.height / 2;
            const dx = playerCenterX - (this.x + this.width / 2);
            const dy = playerCenterY - (this.y + this.height / 2);
            const maxOffset = 5;
            lookX = Math.max(-maxOffset, Math.min(maxOffset, dx / 35));
            lookY = Math.max(-maxOffset, Math.min(maxOffset, dy / 35));
        }
        ctx.beginPath();
        ctx.arc(centerX - 12 + lookX, centerY - 8 + lookY, 5, 0, Math.PI * 2);
        ctx.arc(centerX + 12 + lookX, centerY - 8 + lookY, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(centerX - 14 + lookX * 0.5, centerY - 11 + lookY * 0.5, 2, 0, Math.PI * 2);
        ctx.arc(centerX + 10 + lookX * 0.5, centerY - 11 + lookY * 0.5, 2, 0, Math.PI * 2);
        ctx.fill();
        if (this.health < this.maxHealth) {
            ctx.fillStyle = '#333';
            ctx.fillRect(drawX, drawY - 12, this.width, 5);
            ctx.fillStyle = '#4af626';
            ctx.fillRect(drawX, drawY - 12, (this.width * this.health) / this.maxHealth, 5);
        }
    }
}

class Platform { 
    constructor(x,y,width,textureIndex){
        this.x=x;this.y=y;this.width=width;this.height=25;
        this.texture=platformTextures[textureIndex];
        this.hasGlow=Math.random()>0.7;
        this.glowPhase=Math.random()*Math.PI*2;
        this.type=Math.random()>0.8?(Math.random()>0.5?'moving':'breaking'):'normal';
        this.moveDirection=1;
        this.moveSpeed=1;
        this.originalX=x;
        this.breakTimer=0;
        this.broken=false;
    } 
    update(){
        if(this.hasGlow) this.glowPhase+=0.05;
        if(this.type==='moving' && !this.broken){
            this.x+=this.moveSpeed*this.moveDirection;
            if(Math.abs(this.x-this.originalX)>100) this.moveDirection*=-1;
        }
        if(this.type==='breaking' && this.breakTimer>0){
            this.breakTimer--;
            if(this.breakTimer===0){
                this.broken=true;
                safeTimeout(()=>{ if(this) this.broken=false; }, 3000);
            }
        }
    } 
    draw(ctx){
        if(this.broken) return;
        ctx.fillStyle='rgba(0,0,0,0.25)';
        ctx.fillRect(this.x-cameraX+3,this.y+3,this.width,this.height);
        ctx.fillStyle=this.texture.color;
        if(this.type==='breaking'&&this.breakTimer>0) ctx.globalAlpha=Math.sin(Date.now()/100)*0.3+0.7;
        ctx.fillRect(this.x-cameraX,this.y,this.width,this.height);
        ctx.globalAlpha=1;
        ctx.fillStyle='rgba(255,255,255,0.12)';
        const p=this.texture.pattern;
        if(p==='stripes'){
            for(let i=0;i<this.width;i+=30) ctx.fillRect(this.x-cameraX+i,this.y,15,this.height);
        } else if(p==='dots'){
            for(let i=6;i<this.width;i+=12) for(let j=6;j<this.height;j+=12){ ctx.beginPath(); ctx.arc(this.x-cameraX+i,this.y+j,2,0,Math.PI*2); ctx.fill(); }
        } else if(p==='checker'){
            for(let i=0;i<this.width;i+=8) for(let j=0;j<this.height;j+=8) if((Math.floor(i/8)+Math.floor(j/8))%2===0) ctx.fillRect(this.x-cameraX+i,this.y+j,8,8);
        } else if(p==='zigzag'){
            for(let i=0;i<this.width;i+=20){ ctx.beginPath(); ctx.moveTo(this.x-cameraX+i,this.y+this.height); ctx.lineTo(this.x-cameraX+i+10,this.y); ctx.lineTo(this.x-cameraX+i+20,this.y+this.height); ctx.fill(); }
        } else if(p==='bricks'){
            for(let i=0;i<this.width;i+=25) for(let j=0;j<this.height;j+=12) if((i/25+j/12)%2===0) ctx.fillRect(this.x-cameraX+i,this.y+j,25,12);
        } else if(p==='waves'){
            for(let i=0;i<this.width;i+=30){ ctx.beginPath(); ctx.moveTo(this.x-cameraX+i,this.y+this.height/2); for(let j=0;j<30;j+=5){ const x=this.x-cameraX+i+j,y=this.y+this.height/2+Math.sin(j/30*Math.PI*2)*5; ctx.lineTo(x,y); } ctx.lineTo(this.x-cameraX+i+30,this.y+this.height); ctx.lineTo(this.x-cameraX+i,this.y+this.height); ctx.closePath(); ctx.fill(); }
        }
        if(this.hasGlow){
            const gi=Math.sin(this.glowPhase)*0.3+0.7;
            ctx.shadowColor=this.texture.color;
            ctx.shadowBlur=15*gi;
            ctx.strokeStyle=this.texture.color;
            ctx.lineWidth=2;
            ctx.strokeRect(this.x-cameraX,this.y,this.width,this.height);
            ctx.shadowBlur=0;
        }
        ctx.strokeStyle='rgba(0,0,0,0.25)';
        ctx.lineWidth=2;
        ctx.strokeRect(this.x-cameraX,this.y,this.width,this.height);
        if(this.type==='breaking'){
            ctx.fillStyle='#ff0000';
            for(let i=0;i<3;i++){ ctx.beginPath(); ctx.arc(this.x-cameraX+this.width/4+i*(this.width/4),this.y+5,3,0,Math.PI*2); ctx.fill(); }
        }
        if(this.type==='moving'){
            ctx.fillStyle='#0088ff';
            const ac=Math.floor(this.width/30);
            for(let i=0;i<ac;i++){ const ax=this.x-cameraX+15+i*30; ctx.beginPath(); ctx.moveTo(ax,this.y+this.height/2); ctx.lineTo(ax+10*this.moveDirection,this.y+10); ctx.lineTo(ax+10*this.moveDirection,this.y+this.height-10); ctx.closePath(); ctx.fill(); }
        }
    }
}

class Boss { 
    constructor(x,y) {
        this.x=x;this.y=y;this.width=80;this.height=80;
        this.maxHealth=CONFIG.boss.health+Math.floor(currentLevel/5)*5;
        this.health=this.maxHealth;
        this.speed=CONFIG.boss.moveSpeed;
        this.direction=1;
        this.attackCooldown=0;
        this.active=true;
        this.texture=bossTextures.getRandomTexture(enemyColors);
        this.phase=0;
        this.movePhase=0;
        this.shootPattern=0;
        this.color=this.texture.type==='color'?this.texture.color:'#ff0000';
    }
    update() {
        if(!this.active || !player) return;
        this.movePhase+=0.02;
        this.attackCooldown--;
        if(Math.abs(this.x-player.x)>200){
            this.x+=this.speed*this.direction;
            if(this.x<cameraX+100||this.x>cameraX+canvas.width-100-this.width) this.direction*=-1;
        }
        this.y+=Math.sin(this.movePhase)*2;
        if(this.attackCooldown<=0){
            this.performAttack();
            this.attackCooldown=CONFIG.boss.attackCooldown-(currentLevel*2);
        }
        if(player.checkCollision(this)){
            if(player.takeDamage(CONFIG.boss.damage, this.x<player.x?15:-15, -10, '#ff0000')) return;
        }
    }
    performAttack() {
        this.shootPattern=(this.shootPattern+1)%3;
        const cx = this.x+this.width/2;
        const cy = this.y+this.height/2;
        switch(this.shootPattern){
            case 0:
                for(let i=0;i<20;i++) { particlePool.acquire(cx + (Math.random()-0.5)*50, cy + (Math.random()-0.5)*50, '#ff0000'); }
                break;
            case 1:
                for(let i=-1;i<=1;i++) { for(let j=0;j<8;j++) { particlePool.acquire(cx + i*30, cy + (Math.random()-0.5)*40, '#ff6600'); } }
                break;
            case 2:
                for(let i=0;i<12;i++) { const angle=(i/12)*Math.PI*2; const px = cx + Math.cos(angle)*40; const py = cy + Math.sin(angle)*40; particlePool.acquire(px, py, '#ff4400'); }
                break;
        }
        for(let i=0;i<15;i++) { particlePool.acquire(cx + (Math.random()-0.5)*60, cy + (Math.random()-0.5)*60, '#ff0000'); }
    }
    takeDamage(amount = 1) {
        this.health -= amount;
        AudioSys.bossHit();
        for(let i=0;i<15;i++) { particlePool.acquire(this.x+Math.random()*this.width, this.y+Math.random()*this.height, '#ff0000'); }
        if(this.health <= 0){ this.defeat(); return true; }
        updateBossHealth();
        return false;
    }
    defeat() {
        this.active=false;
        AudioSys.bossDefeat();
        bossesDefeated++;
        for(let i=0;i<100;i++) { particlePool.acquire(this.x+this.width/2, this.y+this.height/2, this.color); }
        addScore(5000*comboMultiplier);
        updateCombo();
        document.getElementById('bossHealthBar').style.display='none';
        const rewardRoll = Math.random();
        const rewardX = this.x + this.width / 2;
        const rewardY = this.y + this.height / 2;
        let rewardColor = '';
        if (rewardRoll < 0.4) {
            totalKeys += 5;
            saveAllData();
            rewardColor = '#FFD700';
        } else if (rewardRoll < 0.7) {
            addScore(250);
            rewardColor = '#FFDE7D';
        } else {
            playerHealth = maxHealth;
            updateHealthBar();
            rewardColor = '#FF2E63';
        }
        for(let i=0;i<40;i++) particlePool.acquire(rewardX + (Math.random()-0.5)*60, rewardY + (Math.random()-0.5)*60, rewardColor);
        shakeScreen(10);
    }
    draw(ctx) {
        if(!this.active) return;
        const drawX=this.x-cameraX;
        ctx.shadowColor='#ff0000';
        ctx.shadowBlur=30;
        if(this.texture.type==='image'&&this.texture.image){
            try{ ctx.drawImage(this.texture.image, drawX, this.y, this.width, this.height); }
            catch(e){ ctx.fillStyle=this.color; ctx.fillRect(drawX, this.y, this.width, this.height); }
        } else {
            ctx.fillStyle=this.color;
            ctx.fillRect(drawX, this.y, this.width, this.height);
            ctx.fillStyle='rgba(0,0,0,0.3)';
            for(let i=0;i<this.width;i+=20)
                for(let j=0;j<this.height;j+=20)
                    if((i/20+j/20)%2===0) ctx.fillRect(drawX+i, this.y+j, 20, 20);
        }
        ctx.shadowBlur=0;
        ctx.fillStyle='#fff';
        ctx.beginPath();
        ctx.arc(drawX+25, this.y+30, 10, 0, Math.PI*2);
        ctx.arc(drawX+55, this.y+30, 10, 0, Math.PI*2);
        ctx.fill();
        ctx.fillStyle='#000';
        ctx.beginPath();
        ctx.arc(drawX+25+(this.direction*3), this.y+30, 5, 0, Math.PI*2);
        ctx.arc(drawX+55+(this.direction*3), this.y+30, 5, 0, Math.PI*2);
        ctx.fill();
        ctx.fillStyle='#000';
        ctx.fillRect(drawX+20, this.y+55, 40, 10);
        ctx.fillStyle='#ff6600';
        ctx.beginPath();
        ctx.moveTo(drawX+10, this.y+20);
        ctx.lineTo(drawX, this.y);
        ctx.lineTo(drawX+20, this.y+15);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(drawX+70, this.y+20);
        ctx.lineTo(drawX+80, this.y);
        ctx.lineTo(drawX+60, this.y+15);
        ctx.fill();
        if(this.health<this.maxHealth*0.3 && Math.floor(Date.now()/200)%2===0){
            ctx.strokeStyle='#ff0000';
            ctx.lineWidth=4;
            ctx.strokeRect(drawX-5, this.y-5, this.width+10, this.height+10);
        }
    }
}

function generateLevel(level){ 
    platforms=[]; enemies=[]; flyingEnemies=[]; vortexEnemies=[]; coins=[]; powerUps=[]; levelKeys=[]; 
    roundCoins=0; roundDamage=0; 
    const minHeight=100,maxHeight=canvas.height-150; 
    
    const enemyMultiplier = getEnemyMultiplier();
    const platformCount = CONFIG.level.basePlatforms + Math.floor(level * CONFIG.level.platformGrowth); 
    const baseEnemyCount = CONFIG.level.baseEnemies + Math.floor(level * CONFIG.level.enemyGrowth);
    const enemyCount = Math.floor(baseEnemyCount * enemyMultiplier);
    const flyingEnemyCount = Math.max(0, Math.floor(level / 3 * enemyMultiplier));
    
    levelWidth = CONFIG.level.baseWidth + (level - 1) * CONFIG.level.widthGrowth; 
    platforms.push(new Platform(80, canvas.height - 200, 180, 0)); 
    
    let lastX = 100, lastY = canvas.height - 250, direction = 1; 
    for(let i = 0; i < platformCount; i++){ 
        const width = 70 + Math.random() * 130;
        const minXGap = 120 + (level * 10);
        const maxXGap = 220 + (level * 15); 
        const x = lastX + minXGap + Math.random() * (maxXGap - minXGap); 
        if(Math.random() > 0.6) direction *= -1; 
        const yChange = 80 + Math.random() * 100; 
        let y = Math.max(minHeight, Math.min(maxHeight, lastY + direction * yChange)); 
        platforms.push(new Platform(x, y, width, Math.floor(Math.random() * platformTextures.length))); 
        if(i > 2 && i < platformCount - 2 && Math.random() < 0.4){
            const cc = Math.floor(Math.random() * 3) + 1;
            for(let j = 0; j < cc; j++) coins.push({x: x + 20 + j * 25, y: y - 30, size: 12, color: '#FFDE7D', bounce: Math.random() * Math.PI * 2});
        } 
        lastX = x;
        lastY = y; 
    } 
    platforms.push(new Platform(levelWidth - 200, canvas.height - 200, 200, 5));
    
    const isBossLevel = level % 5 === 0;
    
    if(level <= 5) {
        const cardPlat = platforms[Math.floor(Math.random() * (platforms.length - 3)) + 2];
        if(cardPlat) {
            levelKeys.push({
                x: cardPlat.x + cardPlat.width / 2 - 15,
                y: cardPlat.y - 45,
                size: 28,
                collected: false,
                floatOffset: 0,
                isCard: true
            });
        }
    } else {
        const keyPlat = platforms[Math.floor(Math.random() * (platforms.length - 3)) + 2];
        if(keyPlat) {
            levelKeys.push({
                x: keyPlat.x + keyPlat.width / 2 - 15,
                y: keyPlat.y - 45,
                size: 28,
                collected: false,
                floatOffset: 0,
                isCard: false
            });
        }
    }
    
    const platformEnemyCount = {};
    const MAX_ENEMIES_PER_PLATFORM = 2;
    
    function trySpawnEnemyOnPlatform(platformIndex) {
        const count = platformEnemyCount[platformIndex] || 0;
        if (count >= MAX_ENEMIES_PER_PLATFORM) return false;
        
        const p = platforms[platformIndex];
        if (!p) return false;
        
        enemies.push(new Enemy(p.x + p.width/2 - 20, p.y - 40, Math.floor(Math.random()*3)));
        platformEnemyCount[platformIndex] = count + 1;
        return true;
    }
    
    if(isBossLevel){ 
        for(let i=0;i<Math.floor(enemyCount/2);i++){
            let attempts = 0;
            let spawned = false;
            while (attempts < 20 && !spawned) {
                const pi = Math.floor(Math.random()*(platforms.length-5))+2;
                spawned = trySpawnEnemyOnPlatform(pi);
                attempts++;
            }
        }
        boss=new Boss(levelWidth-400,canvas.height-350);
        const bw = document.getElementById('bossWarning');
        if(bw) bw.style.display='flex';
        AudioSys.bossSpawn();
        safeTimeout(()=>{ const bw2 = document.getElementById('bossWarning'); if(bw2) bw2.style.display='none'; },2000);
        const bhb = document.getElementById('bossHealthBar');
        if(bhb) bhb.style.display='block';
        updateBossHealth(); 
    }else{ 
        for(let i=0;i<enemyCount;i++){
            let attempts = 0;
            let spawned = false;
            while (attempts < 20 && !spawned) {
                const pi = Math.floor(Math.random()*(platforms.length-5))+2;
                spawned = trySpawnEnemyOnPlatform(pi);
                attempts++;
            }
        }
        boss=null;
        const bhb = document.getElementById('bossHealthBar');
        if(bhb) bhb.style.display='none'; 
    } 
    for(let i=0;i<flyingEnemyCount;i++)flyingEnemies.push(new FlyingEnemy(300+Math.random()*(levelWidth-600),100+Math.random()*200)); 
    
    let vortexEnemyCount = 0;
    if (!isBossLevel) {
        if (level <= 5) vortexEnemyCount = 1;
        else {
            const rand = Math.random();
            if (rand < 0.6) vortexEnemyCount = 1;
            else if (rand < 0.85) vortexEnemyCount = 2;
            else vortexEnemyCount = 0;
        }
    }
    
    for (let i = 0; i < vortexEnemyCount; i++) {
        const pi = Math.floor(Math.random() * (platforms.length - 5)) + 2;
        const p = platforms[pi];
        if (p) {
            vortexEnemies.push(new VortexEnemy(p.x + p.width / 2 - 27.5, p.y - 60));
        }
    }
    
    for(let i=0;i<Math.floor(level/2)+1;i++){const pi=Math.floor(Math.random()*(platforms.length-10))+5;const p=platforms[pi]; if(p) powerUps.push({x:p.x+p.width/2,y:p.y-40,size:15,color:'#FF2E63',type:'health'});} 
    for(let cx=800;cx<levelWidth-300;cx+=800)platforms.push(new Platform(cx,canvas.height-180,100,2)); 
    return levelWidth; 
}

function updateCamera(){const targetX=player.x-canvas.width*CONFIG.camera.playerOffset;cameraX+=(targetX-cameraX)*CONFIG.camera.followSpeed;cameraX=Math.max(0,Math.min(cameraX,levelWidth-canvas.width));}
function updateCoins(){for(let i=coins.length-1;i>=0;i--){const c=coins[i];c.bounce+=0.1;c.y+=Math.sin(c.bounce)*0.5;if(player.checkCollision({x:c.x-c.size/2,y:c.y-c.size/2,width:c.size,height:c.size})){addScore(50*comboMultiplier);updateCombo();AudioSys.collect();roundCoins++;for(let j=0;j<15;j++)particlePool.acquire(c.x,c.y,'#FFDE7D');coins.splice(i,1);}}}
function updateKeys(){for(let i=levelKeys.length-1;i>=0;i--){const k=levelKeys[i];if(k.collected)continue;k.floatOffset+=0.06;const ky=k.y+Math.sin(k.floatOffset)*6;if(player.checkCollision({x:k.x,y:ky,width:k.size,height:k.size})){k.collected=true;if(k.isCard){cardCount++;saveAllData();updateCardDisplay();AudioSys.collect();for(let j=0;j<20;j++)particlePool.acquire(k.x+k.size/2,ky+k.size/2,'#FFDE7D');}else{totalKeys++;saveAllData();AudioSys.collect();for(let j=0;j<20;j++)particlePool.acquire(k.x+k.size/2,ky+k.size/2,'#00BFFF');}levelKeys.splice(i,1);}}}
function updatePowerUps(){for(let i=powerUps.length-1;i>=0;i--){const p=powerUps[i];p.y+=Math.sin(Date.now()/500)*0.5;if(player.checkCollision({x:p.x-p.size/2,y:p.y-p.size/2,width:p.size,height:p.size})){if(p.type==='health'){playerHealth=Math.min(maxHealth,playerHealth+30);updateHealthBar();}else if(p.type==='dash'){player.dashCharges=Math.min(CONFIG.player.maxDashes,player.dashCharges+1);updateDashIndicator();}for(let j=0;j<20;j++)particlePool.acquire(p.x,p.y,p.color);AudioSys.collect();powerUps.splice(i,1);}}}
function checkEnemyCollisions(){for(let e of enemies){if(e.active&&player.checkCollision(e)){if(player.takeDamage(20,e.x<player.x?10:-10,-8,e.color))return;}}for(let e of flyingEnemies){if(e.active&&player.checkCollision(e)){if(player.takeDamage(25,e.x<player.x?12:-12,-10,'#FF00FF'))return;}}for(let e of vortexEnemies){if(e.active&&player.checkCollision(e)){if(player.takeDamage(15,e.x<player.x?8:-8,-6,'#00ccff'))return;}}}
function checkCheckpoints(){if(player.x>lastCheckpointX+800){lastCheckpointX=player.x;player.saveCheckpoint();}}

function drawBackground() {
    if (currentBiom && currentBiom.tagName === 'IMG' && currentBiom.complete && currentBiom.naturalWidth > 0) {
        const imgWidth = currentBiom.width;
        const imgHeight = currentBiom.height;
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const scaleX = canvasWidth / imgWidth;
        const scaleY = canvasHeight / imgHeight;
        const scale = Math.max(scaleX, scaleY);
        const scaledWidth = imgWidth * scale;
        const scaledHeight = imgHeight * scale;
        const x = (canvasWidth - scaledWidth) / 2;
        const y = (canvasHeight - scaledHeight) / 2;
        ctx.drawImage(currentBiom, x, y, scaledWidth, scaledHeight);
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0.4)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.6)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    else if (currentBiom && currentBiom.type === 'gradient') {
        const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
        grad.addColorStop(0, currentBiom.colors[0]);
        grad.addColorStop(1, currentBiom.colors[1]);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'rgba(255,255,255,0.03)';
        for (let i = 0; i < 200; i++) ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 2, 2);
    }
    else {
        const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
        grad.addColorStop(0, '#0a0a1a');
        grad.addColorStop(1, '#000000');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        for (let layer = 0; layer < 3; layer++) {
            const spd = 0.05 + layer * 0.1;
            const alpha = 0.1 + layer * 0.15;
            const size = 1 + layer * 0.5;
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            for (let i = 0; i < 40; i++) {
                const x = (i * 67 + cameraX * spd) % canvas.width;
                const y = (i * 41 + layer * 100) % canvas.height;
                ctx.fillRect(x, y, size, size);
            }
        }
    }
}

function drawGoal(){const gx=levelWidth-cameraX;if(gx<canvas.width+100&&gx>-100){const grad=ctx.createRadialGradient(gx,canvas.height/2,10,gx,canvas.height/2,180);grad.addColorStop(0,'#4af626aa');grad.addColorStop(1,'#4af62600');ctx.fillStyle=grad;ctx.fillRect(gx-180,0,360,canvas.height);ctx.strokeStyle='#4af626';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(gx,0);ctx.lineTo(gx,canvas.height);ctx.stroke();const pulse=Math.sin(Date.now()/250)*0.4+0.6;ctx.fillStyle=`rgba(74,246,38,${pulse})`;ctx.font='bold 26px monospace';ctx.textAlign='center';ctx.fillText('🏁 ФИНИШ',gx,canvas.height-45);}}
function drawParticles(){if(!CONFIG.particles.enabled)return;for(let p of particlePool.activeObjects){p.update();p.draw(ctx,cameraX);if(!p.active)particlePool.release(p);}}
function drawCoins(){for(const c of coins){ctx.fillStyle=c.color;ctx.beginPath();ctx.arc(c.x-cameraX,c.y,c.size,0,Math.PI*2);ctx.fill();ctx.fillStyle='#FFFFFF88';ctx.beginPath();ctx.arc(c.x-cameraX-3,c.y-3,c.size/3,0,Math.PI*2);ctx.fill();}}
function drawKeys(){for(const k of levelKeys){if(k.collected)continue;k.floatOffset+=0.06;const ky=k.y+Math.sin(k.floatOffset)*6;ctx.font='26px Arial';ctx.textAlign='center';ctx.textBaseline='middle';ctx.shadowColor=k.isCard?'#FFDE7D':'#00BFFF';ctx.shadowBlur=12;ctx.fillText(k.isCard?'🎫':'🔑',k.x+k.size/2-cameraX,ky+k.size/2);ctx.shadowBlur=0;}}
function drawPowerUps(){for(const p of powerUps){ctx.fillStyle=p.color;ctx.beginPath();if(p.type==='health'){ctx.moveTo(p.x-cameraX,p.y+p.size/2);ctx.bezierCurveTo(p.x-cameraX,p.y,p.x-cameraX-p.size,p.y,p.x-cameraX-p.size,p.y+p.size/2);ctx.bezierCurveTo(p.x-cameraX-p.size,p.y+p.size,p.x-cameraX,p.y+p.size*1.5,p.x-cameraX,p.y+p.size*1.5);ctx.bezierCurveTo(p.x-cameraX,p.y+p.size*1.5,p.x-cameraX+p.size,p.y+p.size,p.x-cameraX+p.size,p.y+p.size/2);ctx.bezierCurveTo(p.x-cameraX+p.size,p.y,p.x-cameraX,p.y,p.x-cameraX,p.y+p.size/2);}else{ctx.arc(p.x-cameraX,p.y,p.size,0,Math.PI*2);}ctx.fill();ctx.shadowColor=p.color;ctx.shadowBlur=10;ctx.fill();ctx.shadowBlur=0;}}

function openShop() {
    clearKeys();
    gameRunning = false;
    if (gameLoopId) cancelAnimationFrame(gameLoopId);
    document.getElementById('pauseMenu').style.display = 'none';
    document.getElementById('caseShopScreen').style.display = 'flex';
    document.getElementById('shopKeyCount').textContent = totalKeys;
    document.getElementById('skinShopKeyCount').textContent = totalKeys;
    updateCardDisplay();
    renderSkins();
    renderAuras();
    renderTrails();
    renderPaidTrails();
    renderPaidSkins();
    renderAccessories();
    updateTrailChestVisibility();
    updateUnequipButtons();
    switchShopTab('chests');
}

function closeShop() {
    document.getElementById('caseShopScreen').style.display = 'none';
    clearKeys();
    gameRunning = true;
    if (gameLoopId) cancelAnimationFrame(gameLoopId);
    gameLoop();
}

function switchShopTab(tabName) {
    document.querySelectorAll('.shop-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.shop-tab-content').forEach(c => c.classList.remove('active'));
    
    const tab = document.querySelector(`.shop-tab[data-tab="${tabName}"]`);
    const content = document.getElementById(`tab-${tabName}`);
    if (tab) tab.classList.add('active');
    if (content) content.classList.add('active');
}

function updateTrailChestVisibility() {
    const card = document.getElementById('trailChestCard');
    const timer = document.getElementById('trailChestTimer');
    if (!card || !timer) return;
    
    if (isBefore(JULY_26_2026)) {
        card.style.display = 'block';
        const diff = JULY_26_2026 - new Date();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        timer.textContent = `⏰ Осталось: ${days}д ${hours}ч`;
        timer.style.color = '#ff69b4';
    } else {
        card.style.display = 'none';
    }
}

function updateUnequipButtons() {
    const trailBtn = document.getElementById('unequipTrailBtn');
    const accBtn = document.getElementById('unequipAccessoryBtn');
    
    if (trailBtn) {
        trailBtn.style.display = equippedTrail ? 'inline-block' : 'none';
    }
    if (accBtn) {
        accBtn.style.display = equippedAccessory ? 'inline-block' : 'none';
    }
}

function unequipTrail() {
    equippedTrail = null;
    saveAllData();
    renderTrails();
    renderPaidTrails();
    updateUnequipButtons();
    document.getElementById('currentTrailDisplay').textContent = 'Нет';
    
    const msg = document.createElement('div');
    msg.textContent = '❌ Трейл снят';
    msg.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);color:#ff6b6b;font-size:20px;font-weight:bold;background:rgba(0,0,0,0.9);padding:12px 25px;border-radius:15px;border:2px solid #ff6b6b;z-index:2000;font-family:Unbounded,monospace;';
    document.body.appendChild(msg);
    safeTimeout(() => msg.remove(), 1200);
}

function unequipAccessory() {
    equippedAccessory = null;
    saveAllData();
    renderAccessories();
    updateUnequipButtons();
    
    const msg = document.createElement('div');
    msg.textContent = '❌ Аксессуар снят';
    msg.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);color:#ff6b6b;font-size:20px;font-weight:bold;background:rgba(0,0,0,0.9);padding:12px 25px;border-radius:15px;border:2px solid #ff6b6b;z-index:2000;font-family:Unbounded,monospace;';
    document.body.appendChild(msg);
    safeTimeout(() => msg.remove(), 1200);
}

function renderSkins() {
    const g = document.getElementById('skinsGrid'); if(!g) return;
    g.innerHTML = '';
    const all = [{id:'default',name:'Стандарт',color:'#4af626'}, ...CHEST_SKINS];
    all.forEach(s => {
        const u = unlockedSkins.includes(s.id), e = equippedSkin === s.id;
        let displayColor = s.color;
        if (s.id === 'kaleidoscope' && u) displayColor = getKaleidoscopeColor();
        if (s.id === 'blackghost' && u) displayColor = '#222222';
        const d = document.createElement('div'); d.className = 'skin-item ' + (e ? 'equipped' : '') + (!u ? 'locked' : '');
        d.innerHTML = '<div class="skin-preview" style="background:' + (u ? displayColor : '#333') + '"></div><span class="skin-name">' + s.name + '</span><button class="equip-btn" onclick="equipSkin(\'' + s.id + '\')" ' + (!u || e ? 'disabled' : '') + '>' + (e ? '✓ Выбран' : 'Выбрать') + '</button>';
        g.appendChild(d);
    });
}

function renderAuras() {
    const g = document.getElementById('aurasGrid'); if(!g) return;
    g.innerHTML = '';
    if (unlockedAuras.length === 0) {
        g.innerHTML = '<div style="color:#aaa; text-align:center; grid-column:1/-1;">Нет аур. Открывайте кейсы!</div>';
        return;
    }
    AURA_SKINS.forEach(a => {
        const u = unlockedAuras.includes(a.id), e = equippedAura === a.id;
        const d = document.createElement('div'); 
        d.className = 'skin-item ' + (e ? 'equipped' : '') + (!u ? 'locked' : '');
        d.innerHTML = '<div class="skin-preview" style="background:' + (u ? a.color : '#333') + '; box-shadow:0 0 10px ' + (u ? a.color : '#333') + ';"></div><span class="skin-name">' + a.name + '</span><button class="equip-btn" onclick="equipAura(\'' + a.id + '\')" ' + (!u || e ? 'disabled' : '') + '>' + (e ? '✓ Активирована' : 'Активировать') + '</button>';
        g.appendChild(d);
    });
}

function equipSkin(id) {
    if (unlockedSkins.includes(id)) { equippedSkin = id; saveAllData(); renderSkins(); }
}

function equipAura(id) {
    if (unlockedAuras.includes(id)) { 
        equippedAura = equippedAura === id ? null : id; 
        saveAllData(); 
        renderAuras(); 
    }
}

function openChest() {
    if (totalKeys < 10) { alert('Нужно минимум 10 ключей!'); return; }
    totalKeys -= 10; saveAllData(); 
    const keySpan = document.getElementById('shopKeyCount');
    if(keySpan) keySpan.textContent = totalKeys;
    const btn = document.getElementById('openChestBtn'), chest = document.getElementById('chestVisual');
    if(btn) btn.disabled = true; 
    if(chest) chest.classList.add('shaking'); 
    AudioSys.chestOpen();
    safeTimeout(() => {
        if(chest) chest.classList.remove('shaking');
        let roll = Math.random() * 100;
        let cumulative = 0;
        let drop = null;
        for (let s of CHEST_SKINS) {
            cumulative += s.chance;
            if (roll < cumulative) { drop = s; break; }
        }
        if (!drop) drop = CHEST_SKINS[0];
        const has = unlockedSkins.includes(drop.id);
        if (has) {
            const refund = 3;
            totalKeys += refund;
            saveAllData();
            if(keySpan) keySpan.textContent = totalKeys;
            showResult('🔄 Повторка: ' + drop.name, 'Возврат: +' + refund + ' 🔑', '#aaa');
        } else {
            unlockedSkins.push(drop.id);
            saveAllData();
            showResult('✨ Новый скин: ' + drop.name + '!', 'Получен ' + drop.name, drop.color);
        }
        if(btn) btn.disabled = false; 
        renderSkins();
    }, 1200);
}

function openAuraChest() {
    if (totalKeys < 12) { alert('Нужно минимум 12 🔑 ключей!'); return; }
    totalKeys -= 12; saveAllData(); 
    const keySpan = document.getElementById('shopKeyCount');
    if(keySpan) keySpan.textContent = totalKeys;
    const btn = document.getElementById('openAuraChestBtn'), chest = document.getElementById('auraChestVisual');
    if(btn) btn.disabled = true; 
    if(chest) chest.classList.add('shaking'); 
    AudioSys.chestOpen();
    safeTimeout(() => {
        if(chest) chest.classList.remove('shaking');
        let totalChance = 0;
        for (let a of AURA_SKINS) totalChance += a.chance;
        let roll = Math.random() * totalChance;
        let cumulative = 0;
        let drop = null;
        for (let a of AURA_SKINS) {
            cumulative += a.chance;
            if (roll < cumulative) { drop = a; break; }
        }
        if (!drop) drop = AURA_SKINS[0];
        const has = unlockedAuras.includes(drop.id);
        if (has) {
            const refund = 4;
            totalKeys += refund;
            saveAllData();
            if(keySpan) keySpan.textContent = totalKeys;
            showResult('🔄 Повторка ауры: ' + drop.name, 'Возврат: +' + refund + ' 🔑', '#aaa');
        } else {
            unlockedAuras.push(drop.id);
            saveAllData();
            let message = '✨ Новая аура: ' + drop.name + '!';
            if(drop.id === 'batidao_aura') message = '🔥 НО БАТИДАО! ' + message;
            if(drop.id === 'explosion_aura') message = '💥 ВЗРЫВ ANIMATED! ' + message;
            if(drop.id === 'cucumber_aura') message = '🥒 ОГУРЕЧНАЯ! ' + message;
            showResult(message, 'Теперь при ударе будет эффект!', drop.color);
        }
        if(btn) btn.disabled = false; 
        renderAuras();
    }, 1200);
}

function openSpringChest() {
    if (totalKeys < 14) { alert('Нужно минимум 14 🔑 ключей!'); return; }
    totalKeys -= 14; saveAllData(); 
    const keySpan = document.getElementById('shopKeyCount');
    if(keySpan) keySpan.textContent = totalKeys;
    const btn = document.getElementById('openSpringChestBtn'), chest = document.getElementById('springChestVisual');
    if(btn) btn.disabled = true; 
    if(chest) chest.classList.add('shaking'); 
    AudioSys.chestOpen();
    safeTimeout(() => {
        if(chest) chest.classList.remove('shaking');
        let totalChance = 0;
        for (let s of SPRING_SKINS) totalChance += s.chance;
        let roll = Math.random() * totalChance;
        let cumulative = 0;
        let drop = null;
        for (let s of SPRING_SKINS) {
            cumulative += s.chance;
            if (roll < cumulative) { drop = s; break; }
        }
        if (!drop) drop = SPRING_SKINS[0];
        
        if (drop.isAura) {
            const has = unlockedAuras.includes(drop.id);
            if (has) {
                const refund = 5;
                totalKeys += refund;
                saveAllData();
                if(keySpan) keySpan.textContent = totalKeys;
                showResult('🔄 Повторка ауры: ' + drop.name, 'Возврат: +' + refund + ' 🔑', '#aaa');
            } else {
                unlockedAuras.push(drop.id);
                saveAllData();
                showResult('🌸 Новая аура: ' + drop.name + '!', 'Весенняя коллекция!', '#ff69b4');
            }
        } else {
            const has = unlockedSkins.includes(drop.skinId);
            if (has) {
                const refund = 5;
                totalKeys += refund;
                saveAllData();
                if(keySpan) keySpan.textContent = totalKeys;
                showResult('🔄 Повторка скина: ' + drop.name, 'Возврат: +' + refund + ' 🔑', '#aaa');
            } else {
                unlockedSkins.push(drop.skinId);
                saveAllData();
                showResult('🌸 Новый скин: ' + drop.name + '!', 'Весенняя коллекция!', '#ff69b4');
            }
        }
        if(btn) btn.disabled = false; 
        renderSkins();
        renderAuras();
    }, 1200);
}

function openEliteChest() {
    if (totalKeys < 15) { alert('Нужно минимум 15 🔑 ключей!'); return; }
    totalKeys -= 15; saveAllData(); 
    const keySpan = document.getElementById('shopKeyCount');
    if(keySpan) keySpan.textContent = totalKeys;
    const btn = document.getElementById('openEliteChestBtn'), chest = document.getElementById('eliteChestVisual');
    if(btn) btn.disabled = true; 
    if(chest) chest.classList.add('shaking'); 
    AudioSys.chestOpen();
    safeTimeout(() => {
        if(chest) chest.classList.remove('shaking');
        let totalChance = 0;
        for (let s of ELITE_SKINS) totalChance += s.chance;
        let roll = Math.random() * totalChance;
        let cumulative = 0;
        let drop = null;
        for (let s of ELITE_SKINS) {
            cumulative += s.chance;
            if (roll < cumulative) { drop = s; break; }
        }
        if (!drop) drop = ELITE_SKINS[0];
        
        const has = unlockedSkins.includes(drop.skinId);
        if (has) {
            const refund = 6;
            totalKeys += refund;
            saveAllData();
            if(keySpan) keySpan.textContent = totalKeys;
            showResult('🔄 Повторка скина: ' + drop.name, 'Возврат: +' + refund + ' 🔑', '#aaa');
        } else {
            unlockedSkins.push(drop.skinId);
            saveAllData();
            let message = '💎 ELITE СКИН: ' + drop.name + '! 💎';
            if(drop.skinId === 'blackghost') message = '👻 ЧЁРНЫЙ ПРИЗРАК! ' + message;
            if(drop.skinId === 'halfyear') message = '🎂 ПОЛГОДА КОЛБЛОКСУ! ' + message;
            if(drop.skinId === 'kaleidoscope') message = '🌈 КАЛЕЙДОСКОП! ' + message;
            if(drop.skinId === 'sixseven') message = '6️⃣7️⃣ СИКС СЕВЕН! ' + message;
            if(drop.skinId === 'cone') message = '🔺 КОНУС! ' + message;
            showResult(message, 'Редкий скин из Elite кейса!', '#FF44FF');
        }
        if(btn) btn.disabled = false; 
        renderSkins();
    }, 1200);
}

function openTrailChest() {
    if (!isBefore(JULY_26_2026)) {
        alert('⏰ Кейс трейлов больше недоступен!');
        return;
    }
    if (totalKeys < 20) { alert('Нужно минимум 20 🔑 ключей!'); return; }
    totalKeys -= 20; saveAllData();
    const keySpan = document.getElementById('shopKeyCount');
    if(keySpan) keySpan.textContent = totalKeys;
    const btn = document.getElementById('openTrailChestBtn'), chest = document.getElementById('trailChestVisual');
    if(btn) btn.disabled = true;
    if(chest) chest.classList.add('shaking');
    AudioSys.chestOpen();
    safeTimeout(() => {
        if(chest) chest.classList.remove('shaking');
        let totalChance = 0;
        for (let t of CASE_TRAILS) totalChance += t.chance;
        let roll = Math.random() * totalChance;
        let cumulative = 0;
        let drop = null;
        for (let t of CASE_TRAILS) {
            cumulative += t.chance;
            if (roll < cumulative) { drop = t; break; }
        }
        if (!drop) drop = CASE_TRAILS[0];
        
        const has = unlockedTrails.includes(drop.id);
        if (has) {
            const refund = 8;
            totalKeys += refund;
            saveAllData();
            if(keySpan) keySpan.textContent = totalKeys;
            showResult('🔄 Повторка трейла: ' + drop.name, 'Возврат: +' + refund + ' 🔑', '#aaa');
        } else {
            unlockedTrails.push(drop.id);
            saveAllData();
            let message = '💫 НОВЫЙ ТРЕЙЛ: ' + drop.name + '!';
            if(drop.id === 'golden_trail') message = '🌟 ЛЕГЕНДАРНЫЙ: ' + drop.name + '!';
            if(drop.id === 'galaxy_trail') message = '🌌 ЭПИЧЕСКИЙ: ' + drop.name + '!';
            showResult(message, 'Активируйте трейл во вкладке Трейлы!', drop.color);
        }
        if(btn) btn.disabled = false;
        renderTrails();
        renderPaidTrails();
    }, 1200);
}

function renderTrails() {
    const g = document.getElementById('trailsGrid');
    if (!g) return;
    g.innerHTML = '';
    
    const allTrails = [...CASE_TRAILS, ...SPECIAL_TRAILS];
    let anyOwned = false;
    
    allTrails.forEach(t => {
        const u = unlockedTrails.includes(t.id);
        if (!u) return;
        anyOwned = true;
        const e = equippedTrail === t.id;
        const d = document.createElement('div');
        d.className = 'skin-item ' + (e ? 'equipped' : '');
        d.innerHTML = `
            <div class="skin-preview" style="background:linear-gradient(135deg, ${t.color}, ${t.color}88); box-shadow:0 0 15px ${t.color};"></div>
            <span class="skin-name">${t.name}</span>
            ${t.description ? `<span class="skin-desc">${t.description}</span>` : ''}
            <button class="equip-btn" onclick="equipTrail('${t.id}')" ${e ? 'disabled' : ''}>${e ? '✓ Активен' : 'Активировать'}</button>
        `;
        g.appendChild(d);
    });
    
    if (!anyOwned) {
        g.innerHTML = '<div style="color:#aaa; text-align:center; grid-column:1/-1;">Откройте трейлы в кейсе или через промокоды!</div>';
    }
}

function renderPaidTrails() {
    const g = document.getElementById('paidTrailsGrid');
    const title = document.getElementById('paidTrailsTitle');
    if (!g || !title) return;
    g.innerHTML = '';
    
    if (!isBefore(AUG_31_2026)) {
        title.style.display = 'none';
        g.innerHTML = '<div style="color:#aaa; text-align:center; grid-column:1/-1;">Сезон платных трейлов завершён</div>';
        return;
    }
    
    const diff = AUG_31_2026 - new Date();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    title.innerHTML = `💎 Платные трейлы (осталось ${days} дней):`;
    
    PAID_TRAILS.forEach(t => {
        const u = unlockedTrails.includes(t.id);
        const e = equippedTrail === t.id;
        const d = document.createElement('div');
        d.className = 'skin-item paid-skin ' + (e ? 'equipped' : '');
        let btnHtml = '';
        if (u) {
            btnHtml = `<button class="equip-btn" onclick="equipTrail('${t.id}')" ${e ? 'disabled' : ''}>${e ? '✓ Активен' : 'Активировать'}</button>`;
        } else {
            btnHtml = `<button class="equip-btn buy-btn" onclick="buyTrail('${t.id}')">КУПИТЬ (${t.price} 🔑)</button>`;
        }
        d.innerHTML = `
            <div class="skin-preview" style="background:linear-gradient(135deg, ${t.color}, ${t.color}88); box-shadow:0 0 15px ${t.color};"></div>
            <span class="skin-name">${t.name}</span>
            <span class="skin-desc">${t.description || ''}</span>
            ${btnHtml}
        `;
        g.appendChild(d);
    });
}

function equipTrail(id) {
    if (unlockedTrails.includes(id)) {
        equippedTrail = id;
        saveAllData();
        renderTrails();
        renderPaidTrails();
        updateUnequipButtons();
        const trailData = getTrailData(equippedTrail);
        document.getElementById('currentTrailDisplay').textContent = trailData ? trailData.name : 'Нет';
    }
}

function buyTrail(id) {
    const trail = PAID_TRAILS.find(t => t.id === id);
    if (!trail) return;
    if (!isBefore(AUG_31_2026)) {
        alert('⏰ Платные трейлы больше недоступны!');
        return;
    }
    if (unlockedTrails.includes(id)) {
        equipTrail(id);
        return;
    }
    if (totalKeys < trail.price) {
        alert(`Недостаточно ключей! Нужно ${trail.price} 🔑`);
        return;
    }
    totalKeys -= trail.price;
    unlockedTrails.push(id);
    equippedTrail = id;
    saveAllData();
    renderTrails();
    renderPaidTrails();
    updateUnequipButtons();
    document.getElementById('shopKeyCount').textContent = totalKeys;
    document.getElementById('skinShopKeyCount').textContent = totalKeys;
    const trailData = getTrailData(equippedTrail);
    document.getElementById('currentTrailDisplay').textContent = trailData ? trailData.name : 'Нет';
    
    const msg = document.createElement('div');
    msg.textContent = `✨ ТРЕЙЛ "${trail.name}" КУПЛЕН!`;
    msg.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);color:#FFD700;font-size:24px;font-weight:bold;background:rgba(0,0,0,0.9);padding:15px 30px;border-radius:15px;border:2px solid #FFD700;z-index:1000;';
    document.body.appendChild(msg);
    safeTimeout(() => msg.remove(), 2000);
}

function renderPaidSkins() {
    const g = document.getElementById('paidSkinsGrid');
    if (!g) return;
    g.innerHTML = '';
    
    PAID_SKINS.forEach(s => {
        const u = unlockedSkins.includes(s.id);
        const e = equippedSkin === s.id;
        const d = document.createElement('div');
        d.className = 'skin-item paid-skin ' + (e ? 'equipped' : '');
        let btnHtml = '';
        if (u) {
            btnHtml = `<button class="equip-btn" onclick="equipSkin('${s.id}')" ${e ? 'disabled' : ''}>${e ? '✓ Выбран' : 'Выбрать'}</button>`;
        } else {
            btnHtml = `<button class="equip-btn buy-btn" onclick="buyPaidSkin('${s.id}')">КУПИТЬ (${s.price} 🔑)</button>`;
        }
        d.innerHTML = `
            <div class="skin-preview" style="background:${s.color};"></div>
            <span class="skin-name">${s.name}</span>
            <span class="skin-desc">${s.description}</span>
            ${btnHtml}
        `;
        g.appendChild(d);
    });
}

function renderAccessories() {
    const g = document.getElementById('accessoriesGrid');
    if (!g) return;
    g.innerHTML = '';
    
    ACCESSORIES.forEach(a => {
        const u = unlockedAccessories.includes(a.id);
        const e = equippedAccessory === a.id;
        const d = document.createElement('div');
        d.className = 'skin-item ' + (e ? 'equipped' : '') + (!u ? 'locked' : '');
        
        if (u) {
            d.innerHTML = `
                <div class="skin-preview" style="background:#00ccff; box-shadow:0 0 10px #00ccff;"></div>
                <span class="skin-name">${a.name}</span>
                <span class="skin-desc">${a.description}</span>
                <button class="equip-btn" onclick="equipAccessory('${a.id}')" ${e ? 'disabled' : ''}>${e ? '✓ Активен' : 'Надеть'}</button>
            `;
        } else {
            d.innerHTML = `
                <div class="skin-preview" style="background:#333;"></div>
                <span class="skin-name">🔒 ${a.name}</span>
                <span class="skin-desc">${a.description}</span>
                <button class="equip-btn" disabled>Получить</button>
            `;
        }
        g.appendChild(d);
    });
    
    if (unlockedAccessories.length === 0) {
        g.innerHTML = '<div style="color:#aaa; text-align:center; grid-column:1/-1;">Нет доступных аксессуаров</div>';
    }
}

function buyPaidSkin(id) {
    const skin = PAID_SKINS.find(s => s.id === id);
    if (!skin) return;
    if (unlockedSkins.includes(id)) {
        equipSkin(id);
        return;
    }
    if (totalKeys < skin.price) {
        alert(`Недостаточно ключей! Нужно ${skin.price} 🔑`);
        return;
    }
    totalKeys -= skin.price;
    unlockedSkins.push(id);
    equippedSkin = id;
    saveAllData();
    document.getElementById('shopKeyCount').textContent = totalKeys;
    document.getElementById('skinShopKeyCount').textContent = totalKeys;
    renderPaidSkins();
    renderSkins();
    
    const msg = document.createElement('div');
    msg.textContent = `✨ СКИН "${skin.name}" КУПЛЕН!`;
    msg.style.cssText = `position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);color:${skin.color};font-size:24px;font-weight:bold;background:rgba(0,0,0,0.9);padding:15px 30px;border-radius:15px;border:2px solid ${skin.color};z-index:1000;`;
    document.body.appendChild(msg);
    safeTimeout(() => msg.remove(), 2000);
}

function equipAccessory(id) {
    if (unlockedAccessories.includes(id)) {
        equippedAccessory = id;
        saveAllData();
        renderAccessories();
        updateUnequipButtons();
    }
}

function openPromoCode() {
    clearKeys();
    gameRunning = false;
    if (gameLoopId) cancelAnimationFrame(gameLoopId);
    document.getElementById('pauseMenu').style.display = 'none';
    document.getElementById('promoCodeScreen').style.display = 'flex';
    const input = document.getElementById('promoInput');
    if (input) input.value = '';
    const msg = document.getElementById('promoMessage');
    if (msg) msg.textContent = '';
}

function closePromoCode() {
    document.getElementById('promoCodeScreen').style.display = 'none';
    clearKeys();
    gameRunning = true;
    if (gameLoopId) cancelAnimationFrame(gameLoopId);
    gameLoop();
}

function applyPromoCode() {
    const input = document.getElementById('promoInput');
    const msg = document.getElementById('promoMessage');
    if (!input || !msg) return;
    
    const code = input.value.trim().toUpperCase();
    
    if (!code) {
        msg.textContent = '❌ Введите промокод!';
        msg.style.color = '#ff2e63';
        return;
    }
    
    const promo = PROMO_CODES[code];
    if (!promo) {
        msg.textContent = '❌ Неверный промокод!';
        msg.style.color = '#ff2e63';
        return;
    }
    
    if (promo.expiresAt && !isBefore(promo.expiresAt)) {
        msg.textContent = '⏰ Срок действия промокода истёк!';
        msg.style.color = '#ff6600';
        return;
    }
    
    if (promo.oneTime && usedPromoCodes.includes(code)) {
        msg.textContent = '❌ Этот промокод уже использован!';
        msg.style.color = '#ff2e63';
        return;
    }
    
    switch(promo.type) {
        case 'keys':
            totalKeys += promo.value;
            saveAllData();
            msg.innerHTML = `✅ Успех! Получено <span style="color:#FFD700">${promo.value} ключей!</span><br><small>${promo.description}</small>`;
            msg.style.color = '#4af626';
            break;
            
        case 'trail':
            if (unlockedTrails.includes(promo.value)) {
                msg.innerHTML = `ℹ️ У вас уже есть этот трейл!<br><small>${promo.description}</small>`;
                msg.style.color = '#08D9D6';
            } else {
                unlockedTrails.push(promo.value);
                equippedTrail = promo.value;
                saveAllData();
                const trailData = getTrailData(promo.value);
                msg.innerHTML = `✅ Получен трейл: <span style="color:${trailData.color}">${trailData.name}</span>!<br><small>${promo.description}</small>`;
                msg.style.color = '#4af626';
            }
            break;
            
        case 'accessory':
            if (unlockedAccessories.includes(promo.value)) {
                msg.innerHTML = `ℹ️ У вас уже есть этот аксессуар!<br><small>${promo.description}</small>`;
                msg.style.color = '#08D9D6';
            } else {
                unlockedAccessories.push(promo.value);
                equippedAccessory = promo.value;
                saveAllData();
                const acc = ACCESSORIES.find(a => a.id === promo.value);
                msg.innerHTML = `✅ Получен аксессуар: <span style="color:#00ccff">${acc.name}</span>!<br><small>${promo.description}</small>`;
                msg.style.color = '#4af626';
            }
            break;
    }
    
    usedPromoCodes.push(code);
    saveAllData();
    input.value = '';
    
    AudioSys.chestOpen();
}

function openProfile() {
    clearKeys();
    gameRunning = false;
    if (gameLoopId) cancelAnimationFrame(gameLoopId);
    document.getElementById('pauseMenu').style.display = 'none';
    document.getElementById('profileScreen').style.display = 'flex';
    
    const nickInput = document.getElementById('nicknameInput');
    if (nickInput) nickInput.value = playerNickname;
    
    document.getElementById('profileKeys').textContent = totalKeys;
    document.getElementById('profileElo').textContent = Math.floor(playerELO);
    document.getElementById('profileClass').textContent = CLASSES[currentClass].name;
    
    const skinData = getSkinData(equippedSkin);
    document.getElementById('profileSkin').textContent = skinData ? skinData.name : 'Стандарт';
    
    const auraData = getAuraData(equippedAura);
    document.getElementById('profileAura').textContent = auraData ? auraData.name : 'Нет';
    
    const trailData = getTrailData(equippedTrail);
    document.getElementById('profileTrail').textContent = trailData ? trailData.name : 'Нет';
    
    document.getElementById('profileSkinCount').textContent = unlockedSkins.length;
    document.getElementById('profileAuraCount').textContent = unlockedAuras.length;
    document.getElementById('profileTrailCount').textContent = unlockedTrails.length;
    
    renderProfilePreviews();
}

function renderProfilePreviews() {
    const skinsPrev = document.getElementById('profileSkinsPreview');
    const aurasPrev = document.getElementById('profileAurasPreview');
    const trailsPrev = document.getElementById('profileTrailsPreview');
    
    if (skinsPrev) {
        skinsPrev.innerHTML = '';
        unlockedSkins.forEach(id => {
            const skin = getSkinData(id);
            const el = document.createElement('div');
            el.className = 'profile-item';
            el.style.background = skin.color;
            el.title = skin.name;
            skinsPrev.appendChild(el);
        });
    }
    
    if (aurasPrev) {
        aurasPrev.innerHTML = '';
        unlockedAuras.forEach(id => {
            const aura = getAuraData(id);
            if (!aura) return;
            const el = document.createElement('div');
            el.className = 'profile-item';
            el.style.background = `radial-gradient(circle, ${aura.color}, ${aura.color}88)`;
            el.style.boxShadow = `0 0 10px ${aura.color}`;
            el.title = aura.name;
            aurasPrev.appendChild(el);
        });
    }
    
    if (trailsPrev) {
        trailsPrev.innerHTML = '';
        unlockedTrails.forEach(id => {
            const trail = getTrailData(id);
            if (!trail) return;
            const el = document.createElement('div');
            el.className = 'profile-item';
            el.style.background = `linear-gradient(135deg, ${trail.color}, ${trail.color}88)`;
            el.style.boxShadow = `0 0 10px ${trail.color}`;
            el.title = trail.name;
            trailsPrev.appendChild(el);
        });
    }
}

function saveNickname() {
    const input = document.getElementById('nicknameInput');
    if (!input) return;
    playerNickname = input.value.trim().substring(0, 20);
    saveAllData();
    
    const msg = document.createElement('div');
    msg.textContent = '✅ Никнейм сохранён!';
    msg.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);color:#4af626;font-size:22px;font-weight:bold;background:rgba(0,0,0,0.9);padding:15px 30px;border-radius:15px;border:2px solid #4af626;z-index:2000;';
    document.body.appendChild(msg);
    safeTimeout(() => msg.remove(), 1500);
}

function closeProfile() {
    document.getElementById('profileScreen').style.display = 'none';
    clearKeys();
    gameRunning = true;
    if (gameLoopId) cancelAnimationFrame(gameLoopId);
    gameLoop();
}

function showResult(title, text, col) {
    const r = document.getElementById('chestResult');
    if(!r) return;
    document.getElementById('resultTitle').textContent = title; 
    document.getElementById('resultText').textContent = text;
    if (col && r.querySelector('h3')) r.querySelector('h3').style.color = col;
    r.style.display = 'block';
}

function hideResult() { const r = document.getElementById('chestResult'); if(r) r.style.display = 'none'; }

function openClassShop() {
    clearKeys();
    gameRunning = false;
    if (gameLoopId) cancelAnimationFrame(gameLoopId);
    document.getElementById('pauseMenu').style.display = 'none';
    document.getElementById('classShopScreen').style.display = 'flex';
    document.getElementById('classShopKeyCount').textContent = totalKeys;
    document.getElementById('currentClassDisplay').textContent = CLASSES[currentClass].name;
    updateCardDisplay();
    
    const warning = document.getElementById('classSwitchWarning');
    const canChange = canChangeClass();
    if (warning) {
        warning.style.display = canChange ? 'none' : 'block';
    }
    
    const defaultBtn = document.getElementById('selectDefaultBtn');
    if (defaultBtn) {
        defaultBtn.textContent = currentClass === 'default' ? '✓ ВКЛ' : 'ВКЛ';
        defaultBtn.disabled = !canChange && currentClass !== 'default';
    }
    
    for (const [id, data] of Object.entries(CLASSES)) {
        if (id !== 'default') {
            const btn = document.getElementById(`buy${id.charAt(0).toUpperCase() + id.slice(1)}Btn`);
            if (btn) {
                if (unlockedClasses.includes(id)) {
                    btn.textContent = currentClass === id ? '✓ ВКЛ' : 'ВКЛ';
                    btn.disabled = !canChange || currentClass === id;
                } else {
                    btn.textContent = `КУПИТЬ (${data.price} 🔑)`;
                    btn.disabled = totalKeys < data.price || !canChange;
                }
            }
        }
    }
}

function closeClassShop() {
    document.getElementById('classShopScreen').style.display = 'none';
    clearKeys();
    gameRunning = true;
    if (gameLoopId) cancelAnimationFrame(gameLoopId);
    gameLoop();
}

function selectClass(className) {
    if (!canChangeClass() && currentClass !== className) {
        alert('⚠️ Смена класса доступна только на 1 уровне или после смерти!');
        return;
    }
    if (unlockedClasses.includes(className)) {
        currentClass = className;
        localStorage.setItem('kolblocks_current_class', currentClass);
        applyClassStats();
        closeClassShop();
    }
}

function buyClass(className) {
    if (!canChangeClass()) {
        alert('⚠️ Смена класса доступна только на 1 уровне или после смерти!');
        return;
    }
    if (unlockedClasses.includes(className)) {
        currentClass = className;
        localStorage.setItem('kolblocks_current_class', currentClass);
        applyClassStats();
        closeClassShop();
        return;
    }
    
    const classData = CLASSES[className];
    if (totalKeys >= classData.price) {
        totalKeys -= classData.price;
        unlockedClasses.push(className);
        currentClass = className;
        saveAllData();
        applyClassStats();
        
        const msg = document.createElement('div');
        msg.textContent = `✨ КЛАСС ${classData.name} РАЗБЛОКИРОВАН! ✨`;
        msg.style.position = 'fixed';
        msg.style.top = '50%';
        msg.style.left = '50%';
        msg.style.transform = 'translate(-50%, -50%)';
        msg.style.color = classData.color;
        msg.style.fontSize = '24px';
        msg.style.fontWeight = 'bold';
        msg.style.backgroundColor = 'rgba(0,0,0,0.8)';
        msg.style.padding = '15px 30px';
        msg.style.borderRadius = '15px';
        msg.style.border = `2px solid ${classData.color}`;
        msg.style.zIndex = '1000';
        document.body.appendChild(msg);
        safeTimeout(() => msg.remove(), 2000);
        
        closeClassShop();
    } else {
        alert(`Недостаточно ключей! Нужно ${classData.price} 🔑`);
    }
}

// ==================== ЗАГРУЗКА КАРТИНОК ДЛЯ АУР (v2.5) ====================
function loadAuraImages() {
    let loadedCount = 0;
    const totalToLoad = 3;
    
    function checkAllLoaded() {
        loadedCount++;
        if (loadedCount >= totalToLoad) {
            auraImagesLoaded = true;
            console.log('✅ Все картинки аур загружены');
        }
    }
    
    // Огурец
    cucumberImage = new Image();
    cucumberImage.crossOrigin = 'anonymous';
    cucumberImage.onload = () => {
        console.log('✅ Огурец загружен:', cucumberImage.src);
        checkAllLoaded();
    };
    cucumberImage.onerror = () => {
        console.error('❌ Не удалось загрузить огурец');
        cucumberImage = null;
        checkAllLoaded();
    };
    cucumberImage.src = 'ogurec.webp';
    
    // Батидао
    batidaoImage = new Image();
    batidaoImage.crossOrigin = 'anonymous';
    batidaoImage.onload = () => {
        console.log('✅ Батидао загружен:', batidaoImage.src);
        checkAllLoaded();
    };
    batidaoImage.onerror = () => {
        console.error('❌ Не удалось загрузить батидао');
        batidaoImage = null;
        checkAllLoaded();
    };
    batidaoImage.src = 'batidao.png';
    
    // Взрыв GIF
    explosionGif = new Image();
    explosionGif.crossOrigin = 'anonymous';
    explosionGif.onload = () => {
        console.log('✅ Взрыв загружен:', explosionGif.src);
        checkAllLoaded();
    };
    explosionGif.onerror = () => {
        console.error('❌ Не удалось загрузить взрыв');
        explosionGif = null;
        checkAllLoaded();
    };
    explosionGif.src = 'vzryv.gif';
}

// ==================== ПОКАЗ АУРЫ С КАРТИНКОЙ (v2.5) ====================
function showAuraEffectOnPlayer(x, y, aura) {
    if(activeAuraEffect) { activeAuraEffect.remove(); activeAuraEffect = null; }
    
    const effect = document.createElement('div');
    effect.className = 'aura-effect player-aura';
    effect.style.position = 'fixed';
    effect.style.pointerEvents = 'none';
    effect.style.zIndex = '200';
    effect.style.left = (x - 150) + 'px';
    effect.style.top = (y - 150) + 'px';
    effect.style.width = '300px';
    effect.style.height = '300px';
    
    // ==================== АУРЫ С КАРТИНКАМИ ====================
    if (aura.id === 'cucumber_aura' && cucumberImage && cucumberImage.complete && cucumberImage.naturalWidth > 0) {
        // Огуречная аура
        effect.style.background = 'none';
        effect.style.boxShadow = 'none';
        effect.style.borderRadius = '0';
        effect.style.overflow = 'visible';
        
        const img = document.createElement('img');
        img.src = cucumberImage.src;
        img.style.cssText = `
            width: 100%;
            height: 100%;
            object-fit: contain;
            animation: cucumberAuraPlayer 0.8s ease-out forwards;
            filter: drop-shadow(0 0 20px #7CFC00);
        `;
        effect.appendChild(img);
    } 
    else if (aura.id === 'batidao_aura' && batidaoImage && batidaoImage.complete && batidaoImage.naturalWidth > 0) {
        // Но батидао
        effect.style.background = 'none';
        effect.style.boxShadow = 'none';
        effect.style.borderRadius = '0';
        effect.style.overflow = 'visible';
        
        const img = document.createElement('img');
        img.src = batidaoImage.src;
        img.style.cssText = `
            width: 100%;
            height: 100%;
            object-fit: contain;
            animation: batidaoAuraPlayer 0.8s ease-out forwards;
            filter: drop-shadow(0 0 20px #ff0000);
        `;
        effect.appendChild(img);
    } 
    else if (aura.id === 'explosion_aura' && explosionGif && explosionGif.complete && explosionGif.naturalWidth > 0) {
        // Взрыв Animated
        effect.style.background = 'none';
        effect.style.boxShadow = 'none';
        effect.style.borderRadius = '0';
        effect.style.overflow = 'visible';
        
        const img = document.createElement('img');
        img.src = explosionGif.src;
        img.style.cssText = `
            width: 100%;
            height: 100%;
            object-fit: contain;
            animation: explosionAuraPlayer 0.8s ease-out forwards;
            filter: drop-shadow(0 0 20px #FF4500);
        `;
        effect.appendChild(img);
    } 
    else {
        // Обычные ауры — градиент
        effect.style.borderRadius = '50%';
        effect.style.background = `radial-gradient(circle, ${aura.effectColor}, transparent)`;
        effect.style.boxShadow = `0 0 40px ${aura.color}`;
        effect.style.animation = 'auraExpandPlayer 0.4s ease-out forwards';
    }
    
    document.body.appendChild(effect);
    activeAuraEffect = effect;
    safeTimeout(() => { 
        if(activeAuraEffect) { 
            activeAuraEffect.remove(); 
            activeAuraEffect = null; 
        } 
    }, 800);
}

function gameLoop(){
    if(!gameRunning) return;
    
    const levelComplete = document.getElementById('levelComplete');
    if (levelComplete && levelComplete.style.display === 'flex') {
        return;
    }
    
    player.update(keys);
    updateCamera();
    updateCoins();
    updateKeys();
    updatePowerUps();
    updateArrows();
    decayCombo();
    checkEnemyCollisions();
    checkCheckpoints();
    if(boss) boss.update();
    for(let i=0; i<enemies.length; i++) {
        enemies[i].update();
        if(!enemies[i].active) { enemies.splice(i,1); i--; }
    }
    for(let i=0; i<flyingEnemies.length; i++) {
        flyingEnemies[i].update();
        if(!flyingEnemies[i].active) { flyingEnemies.splice(i,1); i--; }
    }
    for(let i=0; i<vortexEnemies.length; i++) {
        vortexEnemies[i].update();
        if(!vortexEnemies[i].active) { vortexEnemies.splice(i,1); i--; }
    }
    if(player.x>levelWidth-100 && (!boss || !boss.active)){
        completeLevel();
        return;
    }
    if(screenShake>0){
        screenShake--;
        ctx.setTransform(1,0,0,1,(Math.random()-0.5)*shakeIntensity,(Math.random()-0.5)*shakeIntensity);
    }
    ctx.clearRect(0,0,canvas.width,canvas.height);
    drawBackground();
    for(let pf of platforms){ pf.update(); pf.draw(ctx); }
    for(let e of enemies) e.draw(ctx);
    for(let e of flyingEnemies) e.draw(ctx);
    for(let e of vortexEnemies) e.draw(ctx);
    if(boss) boss.draw(ctx);
    drawKeys();
    drawCoins();
    drawPowerUps();
    drawArrows();
    drawParticles();
    player.draw(ctx,cameraX);
    drawGoal();
    ctx.setTransform(1,0,0,1,0,0);
    updateDashIndicator();
    gameLoopId = requestAnimationFrame(gameLoop);
}

function completeLevel(){
    if (inputBlocked) return;
    inputBlocked = true;
    
    gameRunning=false;
    if(gameLoopId) cancelAnimationFrame(gameLoopId);
    AudioSys.levelComplete();
    changeBiom();
    addScore(1000*currentLevel);
    const eloResult = calculateEloChange();
    const ls = document.getElementById('levelScore');
    if(ls) ls.textContent=Math.floor(1000*currentLevel*comboMultiplier);
    const mc = document.getElementById('maxCombo');
    if(mc) mc.textContent=`x${maxCombo}`;
    const cc = document.getElementById('coinsCollected');
    if(cc) cc.textContent = roundCoins;
    const dt = document.getElementById('damageTaken');
    if(dt) dt.textContent = roundDamage;
    const eloChangeEl = document.getElementById('eloChangeDisplay');
    if(eloChangeEl) {
        eloChangeEl.textContent = (eloResult.change >= 0 ? '+' : '') + eloResult.change;
        eloChangeEl.style.color = eloResult.change >= 0 ? '#4af626' : '#ff2e63';
    }
    const lcDiv = document.getElementById('levelComplete');
    if(lcDiv) lcDiv.style.display='flex';
    showEloChange(eloResult.change);
    for(let i=0;i<80;i++) particlePool.acquire(player.x+player.width/2,player.y+player.height/2,platformTextures[Math.floor(Math.random()*platformTextures.length)].color);
    safeTimeout(()=>{
        const lcDiv2 = document.getElementById('levelComplete');
        if(lcDiv2) lcDiv2.style.display='none';
        currentLevel++;
        generateLevel(currentLevel);
        player.reset();
        applyClassStats();
        playerHealth = maxHealth;
        updateHealthBar();
        cameraX=0;
        comboCount=1;
        comboMultiplier=1;
        maxCombo=1;
        lastCheckpointX=0;
        updateUI();
        updateDashIndicator();
        updateEloDisplay();
        
        inputBlocked = false;
        gameRunning=true;
        gameLoop();
    },2500);
}

function gameOver(){
    if (inputBlocked) return;
    inputBlocked = true;
    
    gameRunning=false;
    if(gameLoopId) cancelAnimationFrame(gameLoopId);
    clearAllTimeouts();
    AudioSys.gameOver();
    const fs = document.getElementById('finalScore');
    if(fs) fs.textContent=score;
    const fl = document.getElementById('finalLevel');
    if(fl) fl.textContent=currentLevel-1;
    const fc = document.getElementById('finalCombo');
    if(fc) fc.textContent=`x${maxCombo}`;
    const bd = document.getElementById('bossesDefeated');
    if(bd) bd.textContent=bossesDefeated;
    const fe = document.getElementById('finalElo');
    if(fe) fe.textContent = Math.floor(playerELO);
    const goDiv = document.getElementById('gameOver');
    if(goDiv) goDiv.style.display='flex';
}

function restartGame(){
    inputBlocked = false;
    
    if(gameLoopId) cancelAnimationFrame(gameLoopId);
    clearAllTimeouts();
    clearKeys();
    if(activeAuraEffect) { activeAuraEffect.remove(); activeAuraEffect = null; }
    if(particlePool) particlePool.releaseAll();
    const goDiv = document.getElementById('gameOver');
    if(goDiv) goDiv.style.display='none';
    const pmDiv = document.getElementById('pauseMenu');
    if(pmDiv) pmDiv.style.display='none';
    const csDiv = document.getElementById('caseShopScreen');
    if(csDiv) csDiv.style.display='none';
    const classDiv = document.getElementById('classShopScreen');
    if(classDiv) classDiv.style.display='none';
    const craftDiv = document.getElementById('cardCraftScreen');
    if(craftDiv) craftDiv.style.display='none';
    const lcDiv = document.getElementById('levelComplete');
    if(lcDiv) lcDiv.style.display='none';
    
    currentLevel=1;score=0;playerHealth=maxHealth;comboCount=1;maxCombo=1;comboMultiplier=1;lastCheckpointX=0;bossesDefeated=0;
    roundCoins=0;roundDamage=0;
    generateLevel(currentLevel);
    player = new Player();
    applyClassStats();
    cameraX=0;
    updateUI();
    updateHealthBar();
    updateDashIndicator();
    updateEloDisplay();
    updateCardDisplay();
    const bhb = document.getElementById('bossHealthBar');
    if(bhb) bhb.style.display='none';
    gameRunning=true;
    gameLoop();
}

function togglePause(){
    const pm = document.getElementById('pauseMenu');
    if(pm && pm.style.display === 'flex'){
        pm.style.display = 'none';
        clearKeys();
        gameRunning = true;
        gameLoop();
    } else {
        showPauseMenu();
    }
}

function showPauseMenu(){
    clearKeys();
    gameRunning = false;
    if(gameLoopId) cancelAnimationFrame(gameLoopId);
    const pm = document.getElementById('pauseMenu');
    if(pm) pm.style.display = 'flex';
}

function performMelee(){
    if(gameRunning && player) player.meleeAttack();
}

function changeBiom() {
    if (!biomLoaded && biomLoadingStarted) return;
    const validIndices = [];
    for (let i = 0; i < biomImages.length; i++) {
        if (biomImages[i] !== null && biomImages[i].complete && biomImages[i].naturalWidth > 0) validIndices.push(i);
    }
    if (validIndices.length > 0) {
        const randomIndex = validIndices[Math.floor(Math.random() * validIndices.length)];
        currentBiom = biomImages[randomIndex];
    } else if (BUILTIN_BIOMS.length > 0) {
        const randomBiom = BUILTIN_BIOMS[Math.floor(Math.random() * BUILTIN_BIOMS.length)];
        currentBiom = randomBiom;
    }
}

function startAsyncBiomLoading() {
    if (biomLoadingStarted) return;
    biomLoadingStarted = true;
    const possibleFiles = [];
    for (let i = 1; i <= 50; i++) {
        possibleFiles.push(`bioms/biom${i}.png`);
        possibleFiles.push(`bioms/biom${i}.jpg`);
    }
    const namedFiles = ['forest', 'cave', 'mountain', 'volcano', 'ice', 'swamp', 'jungle', 'ruins', 'temple', 'waterfall', 'cliffs', 'valley', 'desert', 'snow', 'lava', 'abyss', 'sky', 'ocean'];
    for (const name of namedFiles) {
        possibleFiles.push(`bioms/${name}.png`);
        possibleFiles.push(`bioms/${name}.jpg`);
        possibleFiles.push(`bioms/${name}.webp`);
    }
    let loadedCount = 0;
    let totalToLoad = possibleFiles.length;
    biomImages = new Array(totalToLoad);
    biomFileNames = new Array(totalToLoad);
    function checkComplete() {
        loadedCount++;
        if (loadedCount >= totalToLoad) {
            const validCount = biomFileNames.filter(f => f !== null).length;
            console.log(`Загружено биомов: ${validCount} шт.`);
            biomLoaded = true;
            selectRandomBiom();
        }
    }
    possibleFiles.forEach((file, index) => {
        const img = new Image();
        img.onload = () => { biomImages[index] = img; biomFileNames[index] = file; checkComplete(); };
        img.onerror = () => { biomImages[index] = null; biomFileNames[index] = null; checkComplete(); };
        img.src = file;
    });
}

function selectRandomBiom() {
    const validIndices = [];
    for (let i = 0; i < biomImages.length; i++) {
        if (biomImages[i] !== null && biomImages[i].complete && biomImages[i].naturalWidth > 0) validIndices.push(i);
    }
    if (validIndices.length > 0) {
        const randomIndex = validIndices[Math.floor(Math.random() * validIndices.length)];
        currentBiom = biomImages[randomIndex];
    } else {
        const randomBiom = BUILTIN_BIOMS[Math.floor(Math.random() * BUILTIN_BIOMS.length)];
        currentBiom = randomBiom;
    }
}

function handleKeyDown(e) {
    keys[e.key] = true;
    if(['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) e.preventDefault();
    
    if(e.key === 'p' || e.key === 'P' || e.key === 'Escape'){
        e.preventDefault();
        
        const levelComplete = document.getElementById('levelComplete');
        const gameOverScreen = document.getElementById('gameOver');
        if ((levelComplete && levelComplete.style.display === 'flex') || 
            (gameOverScreen && gameOverScreen.style.display === 'flex')) {
            return;
        }
        
        if (!closeCurrentMenu()) {
            showPauseMenu();
        }
        return;
    }
    
    if (inputBlocked) return;
    
    if(e.key === 'v' || e.key === 'V' || e.key === 'м' || e.key === 'М'){
        e.preventDefault();
        performMelee();
    }
    if((e.key === 'f' || e.key === 'F' || e.key === 'c' || e.key === 'C') && currentClass === 'archer'){
        e.preventDefault();
        shootArrow();
    }
    if((e.key === 'r' || e.key === 'R') && !gameRunning) restartGame();
}

function handleKeyUp(e) { keys[e.key] = false; }

window.addEventListener('keydown', handleKeyDown);
window.addEventListener('keyup', handleKeyUp);

canvas.addEventListener('mousedown', (e) => { 
    if(e.button === 0 && gameRunning){ 
        performMelee(); 
    } 
});

function setupMobileControls(){
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if(isTouch || window.innerWidth <= 768){
        const mc = document.getElementById('mobileControls');
        if(mc) mc.style.display = 'flex';
        const bind = (id, key) => {
            const btn = document.getElementById(id);
            if(!btn) return;
            btn.addEventListener('touchstart', (e) => { e.preventDefault(); keys[key] = true; });
            btn.addEventListener('touchend', (e) => { e.preventDefault(); keys[key] = false; });
            btn.addEventListener('mousedown', () => keys[key] = true);
            btn.addEventListener('mouseup', () => keys[key] = false);
            btn.addEventListener('mouseleave', () => keys[key] = false);
        };
        bind('btnLeft', 'ArrowLeft');
        bind('btnRight', 'ArrowRight');
        bind('btnJump', ' ');
        bind('btnDash', 'Shift');
        const attackBtn = document.getElementById('btnAttack');
        if(attackBtn) {
            attackBtn.addEventListener('touchstart', (e) => { e.preventDefault(); performMelee(); });
            attackBtn.addEventListener('mousedown', () => performMelee());
        }
        const shootBtn = document.getElementById('btnShoot');
        if(shootBtn) {
            shootBtn.addEventListener('touchstart', (e) => { e.preventDefault(); if(currentClass === 'archer') shootArrow(); });
            shootBtn.addEventListener('mousedown', () => { if(currentClass === 'archer') shootArrow(); });
        }
    }
}

const soundToggle = document.getElementById('soundToggle');
if(soundToggle) soundToggle.addEventListener('change', (e) => { 
    CONFIG.audio.enabled = e.target.checked; 
    AudioSys.enabled = e.target.checked; 
});

const particlesToggle = document.getElementById('particlesToggle');
if(particlesToggle) particlesToggle.addEventListener('change', (e) => { 
    CONFIG.particles.enabled = e.target.checked; 
    if(!e.target.checked && particlePool) particlePool.releaseAll(); 
});

let installedMods = JSON.parse(localStorage.getItem('kolblocks_mods')) || [];

function openModsMenu() {
    clearKeys();
    gameRunning = false;
    if (gameLoopId) cancelAnimationFrame(gameLoopId);
    document.getElementById('pauseMenu').style.display = 'none';
    document.getElementById('modsMenuScreen').style.display = 'flex';
    renderModsList();
}

function closeModsMenu() {
    document.getElementById('modsMenuScreen').style.display = 'none';
    clearKeys();
    gameRunning = true;
    if (gameLoopId) cancelAnimationFrame(gameLoopId);
    gameLoop();
}

function installMod() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.qbm';
    input.style.display = 'none';
    document.body.appendChild(input);
    
    input.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(event) {
            try {
                const content = event.target.result;
                const modData = parseModFile(content);
                if (modData) {
                    if (modData.codeword !== 'ПРИВНЁСА ПОНОСА') {
                        alert('❌ Ошибка: неверное кодовое слово!\nМод не будет установлен.');
                        return;
                    }
                    
                    const exists = installedMods.some(m => m.name === modData.name);
                    if (exists) {
                        alert('❌ Мод с таким названием уже установлен!');
                        return;
                    }
                    
                    modData.id = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
                    modData.enabled = true;
                    installedMods.push(modData);
                    saveMods();
                    renderModsList();
                    
                    if (modData.enabled) {
                        applyMod(modData);
                    }
                    
                    showModMessage('✅ Мод "' + modData.name + '" успешно установлен!');
                }
            } catch (err) {
                alert('❌ Ошибка при чтении файла: ' + err.message);
            }
        };
        reader.readAsText(file);
        document.body.removeChild(input);
    });
    
    input.click();
}

function parseModFile(content) {
    const lines = content.split('\n');
    const mod = {
        avatar: '',
        name: 'Без названия',
        author: 'Неизвестен',
        codeword: '',
        code: ''
    };
    
    let codeStart = false;
    let codeLines = [];
    
    for (let line of lines) {
        line = line.trim();
        
        if (line.startsWith('AVATAR:')) {
            mod.avatar = line.substring(7).trim();
        } else if (line.startsWith('NAME:')) {
            mod.name = line.substring(5).trim();
        } else if (line.startsWith('AUTHOR:')) {
            mod.author = line.substring(7).trim();
        } else if (line.startsWith('CODEWORD:')) {
            mod.codeword = line.substring(9).trim();
        } else if (line === '// Код мода (JavaScript)' || line === '// КОД МОДА') {
            codeStart = true;
        } else if (codeStart) {
            codeLines.push(line);
        }
    }
    
    if (codeLines.length === 0) {
        let found = false;
        for (let line of lines) {
            line = line.trim();
            if (found) {
                if (!line.startsWith('AVATAR:') && !line.startsWith('NAME:') && 
                    !line.startsWith('AUTHOR:') && !line.startsWith('CODEWORD:')) {
                    codeLines.push(line);
                }
            }
            if (line.startsWith('CODEWORD:')) {
                found = true;
            }
        }
    }
    
    mod.code = codeLines.join('\n');
    
    if (!mod.codeword) {
        alert('❌ Ошибка: в файле отсутствует CODEWORD!');
        return null;
    }
    
    return mod;
}

function applyMod(modData) {
    try {
        const fn = new Function('CONFIG', 'CLASSES', modData.code);
        fn(CONFIG, CLASSES);
        console.log('✅ Мод "' + modData.name + '" применён!');
    } catch (err) {
        console.error('❌ Ошибка при применении мода:', err);
        alert('❌ Ошибка при применении мода: ' + err.message);
    }
}

function toggleMod(id) {
    const mod = installedMods.find(m => m.id === id);
    if (!mod) return;
    
    mod.enabled = !mod.enabled;
    saveMods();
    renderModsList();
    
    if (mod.enabled) {
        applyMod(mod);
        showModMessage('✅ Мод "' + mod.name + '" включён!');
    } else {
        showModMessage('⛔ Мод "' + mod.name + '" выключен');
        if (confirm('Для полного отключения мода требуется перезагрузка игры. Перезагрузить?')) {
            location.reload();
        }
    }
}

function deleteMod(id) {
    if (!confirm('Удалить этот мод?')) return;
    
    const mod = installedMods.find(m => m.id === id);
    installedMods = installedMods.filter(m => m.id !== id);
    saveMods();
    renderModsList();
    showModMessage('🗑️ Мод "' + (mod ? mod.name : '') + '" удалён');
}

function saveMods() {
    localStorage.setItem('kolblocks_mods', JSON.stringify(installedMods));
}

function renderModsList() {
    const container = document.getElementById('modsList');
    const countSpan = document.getElementById('modsCount');
    
    if (!container) return;
    
    if (installedMods.length === 0) {
        container.innerHTML = '<div style="color:#888; text-align:center; padding:20px;">Нет установленных модов</div>';
        if (countSpan) countSpan.textContent = '0';
        return;
    }
    
    if (countSpan) countSpan.textContent = installedMods.length;
    
    container.innerHTML = '';
    installedMods.forEach(mod => {
        const div = document.createElement('div');
        div.className = 'mod-item' + (mod.enabled ? ' active' : '');
        
        const avatarImg = document.createElement('img');
        avatarImg.className = 'mod-avatar';
        avatarImg.src = mod.avatar || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50"%3E%3Crect width="50" height="50" fill="%23333"/%3E%3Ctext x="25" y="30" font-size="20" text-anchor="middle" fill="%23666"%3E📦%3C/text%3E%3C/svg%3E';
        avatarImg.onerror = function() {
            this.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50"%3E%3Crect width="50" height="50" fill="%23333"/%3E%3Ctext x="25" y="30" font-size="20" text-anchor="middle" fill="%23666"%3E📦%3C/text%3E%3C/svg%3E';
        };
        div.appendChild(avatarImg);
        
        const info = document.createElement('div');
        info.className = 'mod-info';
        info.innerHTML = `
            <div class="mod-name">${mod.name}</div>
            <div class="mod-author">👤 ${mod.author}</div>
            <div class="mod-status">${mod.enabled ? '🟢 Включён' : '🔴 Выключен'}</div>
        `;
        div.appendChild(info);
        
        const actions = document.createElement('div');
        actions.className = 'mod-actions';
        
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'mod-btn toggle' + (mod.enabled ? '' : ' off');
        toggleBtn.textContent = mod.enabled ? 'ВКЛ' : 'ВЫКЛ';
        toggleBtn.onclick = function(e) {
            e.stopPropagation();
            toggleMod(mod.id);
        };
        actions.appendChild(toggleBtn);
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'mod-btn delete';
        deleteBtn.textContent = '✕';
        deleteBtn.onclick = function(e) {
            e.stopPropagation();
            deleteMod(mod.id);
        };
        actions.appendChild(deleteBtn);
        
        div.appendChild(actions);
        container.appendChild(div);
    });
}

function showModMessage(text) {
    const msg = document.createElement('div');
    msg.textContent = text;
    msg.style.position = 'fixed';
    msg.style.top = '50%';
    msg.style.left = '50%';
    msg.style.transform = 'translate(-50%, -50%)';
    msg.style.color = '#4af626';
    msg.style.fontSize = '20px';
    msg.style.fontWeight = 'bold';
    msg.style.backgroundColor = 'rgba(0,0,0,0.9)';
    msg.style.padding = '15px 30px';
    msg.style.borderRadius = '15px';
    msg.style.border = '2px solid #4af626';
    msg.style.zIndex = '9999';
    msg.style.fontFamily = 'Unbounded, monospace';
    msg.style.textAlign = 'center';
    msg.style.maxWidth = '80%';
    document.body.appendChild(msg);
    safeTimeout(() => msg.remove(), 3000);
}

function showMobileWarning() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                     ('ontouchstart' in window && window.innerWidth <= 1024);
    
    if (!isMobile) return;
    
    if (localStorage.getItem('kolblocks_mobile_warning_shown')) return;
    
    const overlay = document.createElement('div');
    overlay.id = 'mobileWarningOverlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.95);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        backdrop-filter: blur(10px);
        font-family: 'Unbounded', monospace;
    `;
    
    const content = document.createElement('div');
    content.style.cssText = `
        background: rgba(26, 26, 46, 0.98);
        padding: 30px;
        border-radius: 20px;
        max-width: 450px;
        width: 90%;
        text-align: center;
        border: 2px solid #ff6b6b;
        box-shadow: 0 0 30px rgba(255, 107, 107, 0.3);
    `;
    
    content.innerHTML = `
        <div style="font-size: 64px; margin-bottom: 15px;">📱</div>
        <h2 style="color: #ff6b6b; font-size: 24px; margin-bottom: 15px; font-family: 'Unbounded', monospace;">
            ВНИМАНИЕ!
        </h2>
        <p style="color: #fff; font-size: 16px; margin-bottom: 15px; line-height: 1.5; font-family: 'Unbounded', sans-serif;">
            Похоже, вы играете на <strong style="color:#FFDE7D">мобильном устройстве</strong>.
        </p>
        <p style="color: #ccc; font-size: 14px; margin-bottom: 20px; line-height: 1.5; font-family: 'Unbounded', sans-serif;">
            Скорее всего, играть будет <strong style="color:#ff6b6b">очень неудобно</strong>. 
            Управление, интерфейс и механики игры оптимизированы под клавиатуру и мышь.
        </p>
        <div style="background: rgba(74, 246, 38, 0.1); border: 1px solid #4af626; padding: 15px; border-radius: 10px; margin-bottom: 20px;">
            <p style="color: #4af626; font-size: 14px; margin: 0; font-family: 'Unbounded', sans-serif;">
                💡 <strong>Рекомендация:</strong> Играйте на компьютере для лучшего опыта!
            </p>
        </div>
        <button id="mobileWarningBtn" style="
            background: linear-gradient(135deg, #4af626, #08D9D6);
            color: #000;
            border: none;
            padding: 12px 30px;
            border-radius: 25px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            font-family: 'Unbounded', monospace;
            text-transform: uppercase;
            letter-spacing: 1px;
        ">ПОНЯТНО, ИГРАТЬ</button>
    `;
    
    overlay.appendChild(content);
    document.body.appendChild(overlay);
    
    document.getElementById('mobileWarningBtn').addEventListener('click', () => {
        overlay.style.opacity = '0';
        overlay.style.transition = 'opacity 0.3s';
        localStorage.setItem('kolblocks_mobile_warning_shown', 'true');
        setTimeout(() => overlay.remove(), 300);
    });
}

async function initGame(){
    resizeCanvas();
    AudioSys.init();
    await bossTextures.load();
    startAsyncBiomLoading();
    loadAuraImages();
    particlePool = new ObjectPool((x,y,c) => new Particle(x,y,c), CONFIG.particles.maxCount);
    
    cardCount = parseInt(localStorage.getItem('kolblocks_cards')) || 0;
    updateCardDisplay();
    
    const savedClass = localStorage.getItem('kolblocks_current_class');
    if (savedClass && unlockedClasses.includes(savedClass)) {
        currentClass = savedClass;
    } else {
        currentClass = 'default';
    }
    
    installedMods = JSON.parse(localStorage.getItem('kolblocks_mods')) || [];
    for (const mod of installedMods) {
        if (mod.enabled) {
            try {
                const fn = new Function('CONFIG', 'CLASSES', mod.code);
                fn(CONFIG, CLASSES);
            } catch (err) {
                console.error('Ошибка при загрузке мода "' + mod.name + '":', err);
            }
        }
    }
    
    let progress = 0;
    const pi = setInterval(() => {
        progress += Math.random() * 15;
        const pf = document.getElementById('progressFill');
        if(pf) pf.style.width = `${Math.min(progress, 100)}%`;
        if(progress >= 100){
            clearInterval(pi);
            safeTimeout(() => {
                const loading = document.getElementById('loading');
                if(loading) {
                    loading.style.opacity = '0';
                    safeTimeout(() => { 
                        if(loading) loading.style.display = 'none';
                        showMobileWarning();
                    }, 500);
                }
            }, 300);
        }
    }, 100);
    generateLevel(currentLevel);
    player = new Player();
    applyClassStats();
    updateUI();
    updateHealthBar();
    updateDashIndicator();
    updateEloDisplay();
    updateCardDisplay();
    setupMobileControls();
    renderSkins();
    renderAuras();
    safeTimeout(() => { gameRunning = true; gameLoop(); }, 800);
}

window.addEventListener('load', initGame);
window.addEventListener('resize', () => { 
    resizeCanvas(); 
    if(gameRunning){ 
        generateLevel(currentLevel); 
        if(player) player.reset(); 
        applyClassStats(); 
        cameraX = 0; 
    } 
});

document.addEventListener('touchmove', (e) => { 
    if(!e.target.closest('#mobileControls')) e.preventDefault(); 
}, { passive: false });
