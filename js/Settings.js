var settings = {
    playfieldSize: { x: 1135, y: 535 },
    scrollSpeed: 0.05,//0.05,
    playerSpeed: 0.14,
    playerBulletSpeed: 0.6,
    playerHP: 3,
    maxAmmo: 3,
    playerStrength: 1,
    enemyBulletSpeed: 0.4,
    enemySpeed: 0.13,
    dragonSpeed: 0.08,
    topToySpeed: 0.1,
    bossSpeed: 0.3,
    bossRange: 0.33,
    bossBulletSpeed: 0.3,
    bombFallSpeed: 0.3,
    keyCodes: {
        playerUp: 38, // 38 - arrow up
        playerLeft: 39, // 39 - arrow left
        playerRight: 37, // 37 - arrow right
        playerDown: 40, // 40 - arrow down
        playerShoot: 32, // 32 - space
        speed: 49, // 49 - one
        ammo: 50, // 50 - two
        bomb: 51, // 51 - three
        laser: 52, // 52 - four
        addon: 53, // 53 - five
        shiled: 54, // 54 - six
    },
    score: 0,
    killedCounter: 0,
    speedIsActive: false,
    ammoIsActive: false,
    bombIsActive: false,
    laserIsActive: false,
    addonIsActive: false,
    shieldIsActive: false,
}