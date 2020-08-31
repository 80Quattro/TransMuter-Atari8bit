function Main() {
    var that = this;
    var up = left = right = down = shoot = false; 
    var playerBullets = [];
    var collision = false;
    var render = false;
    var animate = true;
    var go = true;
    var startCounter = 0;
    var shoot = document.getElementById("shoot");
    var dieSound = true;
    
    function initEngine() {
        engine = new ChevyEngine();
        engine.initCanvas(document.getElementById("playfield"), settings.playfieldSize.x, settings.playfieldSize.y, "#000000");
        ctx = engine.getContext();
        engine.start(that);
    }
    
    function initData() {
        new initImages();
        new initObjects();
        Start();
    }
    
    function initEvents() {
        document.addEventListener("keydown", onKeyDown, false);
        document.addEventListener("keyup", onKeyUp, false);
    }
    
    initEngine();
    initData();
    initEvents();
    
    this.animateScene = function() {
        var start = new Date().getTime();
        if(go) {
            startCounter += 16;
            if(startCounter > 2000) {
                go = false;
                render = true;
                document.getElementById("comm").style.display = "none";
            }
        }
        if(render) {
            engine.camera.position.x += settings.scrollSpeed * engine.deltaTime;
            Background();
            BulletsUpdate();
            PlayerController();
            EnemysUpdate();
            scoreUpdate();
            if(engine.camera.position.x > 7000 + settings.playfieldSize.x / 2) {
                // boss
                settings.scrollSpeed = 0;
                objects.hamster.shieldActive = false;
                document.getElementById("active").style.display = "none";
                bossUpdate();
            }
        }
        if(collision) Collision();
        var stop = new Date().getTime();
    }
    
    function Background() {
        
        ctx.drawImage(objects.backgroundUp01.img, objects.backgroundUp01.position.x, objects.backgroundUp01.position.y);
        objects.backgroundUp01.position.x -= settings.scrollSpeed * engine.deltaTime;
        //if(objects.backgroundUp01.position.x <= -settings.playfieldSize.x) objects.backgroundUp01.position.x = settings.playfieldSize.x;
        
        ctx.drawImage(objects.backgroundUp02.img, objects.backgroundUp02.position.x, objects.backgroundUp02.position.y);
        objects.backgroundUp02.position.x -= settings.scrollSpeed * engine.deltaTime;
        //if(objects.backgroundUp02.position.x <= -settings.playfieldSize.x) objects.backgroundUp02.position.x = settings.playfieldSize.x;
        
        if(objects.backgroundUp01.position.x <= -settings.playfieldSize.x) {
            objects.backgroundUp01.position.x = 0;
            objects.backgroundUp02.position.x = settings.playfieldSize.x;
        }
        
        ctx.drawImage(objects.backgroundDown01.img, objects.backgroundDown01.position.x, objects.backgroundDown01.position.y);
        objects.backgroundDown01.position.x -= settings.scrollSpeed * engine.deltaTime;
        //if(objects.backgroundDown01.position.x <= -settings.playfieldSize.x) objects.backgroundDown01.position.x = settings.playfieldSize.x;
        
        ctx.drawImage(objects.backgroundDown02.img, objects.backgroundDown02.position.x, objects.backgroundDown02.position.y);
        objects.backgroundDown02.position.x -= settings.scrollSpeed * engine.deltaTime;
        //if(objects.backgroundDown02.position.x <= -settings.playfieldSize.x) objects.backgroundDown02.position.x = settings.playfieldSize.x;
        
        if(objects.backgroundDown01.position.x <= -settings.playfieldSize.x) {
            objects.backgroundDown01.position.x = 0;
            objects.backgroundDown02.position.x = settings.playfieldSize.x;
        }
        
    }
    
    function PlayerController() {
        var player = objects.hamster;
        var wallUp = objects.backgroundUp01;
        var wallDown = objects.backgroundDown01;
        if(up) {
            if(player.position.y > wallUp.size.y)
                player.position.y -= settings.playerSpeed * engine.deltaTime;
            else {
                player.position.y = wallUp.size.y;
                Collision();
            }
            if(player.position.y + player.size.y + 15 < objects.addon.position.y) {
                objects.addon.position.y -= settings.playerSpeed * engine.deltaTime;
            }
        }
        if(left) {
            if(player.position.x + player.size.x + 120 < settings.playfieldSize.x)
                player.position.x += settings.playerSpeed * engine.deltaTime;
            if(player.position.x > objects.addon.position.x + objects.addon.size.x - 20) {
                objects.addon.position.x += settings.playerSpeed * engine.deltaTime;
            }
        }
        if(right) {
            if(player.position.x > 40)
                player.position.x -= settings.playerSpeed * engine.deltaTime;
            if(player.position.x + player.size.x < objects.addon.position.x + objects.addon.size.x) {
                objects.addon.position.x -= settings.playerSpeed * engine.deltaTime;
            }
        }
        if(down) {
            if(player.position.y + player.size.y < settings.playfieldSize.y - wallDown.size.y)
                player.position.y += settings.playerSpeed * engine.deltaTime;
            else
                Collision();
            if(player.position.y > objects.addon.position.y + objects.addon.size.y + 8) {
                objects.addon.position.y += settings.playerSpeed * engine.deltaTime;
            }
        }
        
        if(objects.hamster.addonActive) {
            ctx.drawImage(objects.addon.img, objects.addon.position.x, objects.addon.position.y);
        }
        ctx.drawImage(objects.hamster.animate(), objects.hamster.position.x, objects.hamster.position.y);
        
    }
    
    function onKeyDown(event) {

        var keyCode = event.which;
        
        switch (keyCode) {
            case settings.keyCodes.playerUp: //up
                up = true;
                break;
            case settings.keyCodes.playerLeft: //left
                left = true;
                break;
            case settings.keyCodes.playerRight: //right
                right = true;
                break;
            case settings.keyCodes.playerDown: //down
                down = true;
                break;
            case settings.keyCodes.playerShoot: //shoot
                if(!shoot) {
                    shoot = true;
                    playerShoot();
                }
                break;
            case settings.keyCodes.speed:
                if(settings.speedIsActive) {
                    document.getElementById("speed").style.display = "none";
                    document.getElementById("info").innerHTML = "";
                    settings.playerSpeed = 0.22;
                    settings.speedIsActive = false;
                    settings.killedCounter = 4;
                }
                break;
            case settings.keyCodes.ammo:
                if(settings.ammoIsActive) {
                    document.getElementById("ammo").style.display = "none";
                    document.getElementById("info").innerHTML = "";
                    settings.maxAmmo *= 2;
                    settings.ammoIsActive = false;
                    settings.killedCounter = 4;
                }
                break;
            case settings.keyCodes.bomb:
                if(settings.bombIsActive) {
                    document.getElementById("bomb").style.display = "none";
                    document.getElementById("info").innerHTML = "";
                    objects.hamster.bombActive = true;
                    settings.bombIsActive = false;
                    settings.killedCounter = 4;
                }
                break;
            case settings.keyCodes.laser:
                if(settings.laserIsActive) {
                    document.getElementById("laser").style.display = "none";
                    document.getElementById("info").innerHTML = "";
                    objects.hamster.laserActive = true;
                    settings.laserIsActive = false;
                    settings.killedCounter = 4;
                }
            case settings.keyCodes.addon:
                if(settings.addonIsActive) {
                    document.getElementById("addon").style.display = "none";
                    document.getElementById("info").innerHTML = "";
                    objects.hamster.addonActive = true;
                    objects.hamster.laserActive = false;
                    objects.hamster.bombActive = false;
                    settings.addonIsActive = false;
                    settings.killedCounter = 4;
                    settings.maxAmmo *= 2;
                }
                break;
            case settings.keyCodes.shiled:
                if(settings.shieldIsActive) {
                    document.getElementById("shield").style.display = "none";
                    document.getElementById("info").innerHTML = "";
                    objects.hamster.shieldActive = true;
                    settings.shieldIsActive = false;
                    settings.killedCounter = 4;
                    document.getElementById("active").style.display = "block";
                }
                break;
        }

    }
    
    function onKeyUp(event) {

        var keyCode = event.which;

        switch (keyCode) {
            case settings.keyCodes.playerUp: //up
                up = false;
                break;
            case settings.keyCodes.playerLeft: //left
                left = false;
                break;
            case settings.keyCodes.playerRight: //right
                right = false;
                break;
            case settings.keyCodes.playerDown: //down
                down = false;
                break;
            case settings.keyCodes.playerShoot: //shoot
                shoot = false;
                break;
        }

    }
    
    function Collision() {
        render = false;
        collision = true;
        if(animate) {
            if(dieSound) {
                new Audio('audio/die.wav').play()
                dieSound = false;
            }
            ctx.drawImage(objects.theEnd.animate(), objects.theEnd.position.x, objects.theEnd.position.y);
            animate = true;
            if(objects.theEnd.frame == 18) {
                animate = false;
                dieSound = true;
            }
            
        }
        if(!animate) {
            if(settings.playerHP > 0) {
                objects = {};
                new initObjects();
                settings.playerSpeed = 0.14;
                settings.maxAmmo = 3;
                settings.killedCounter = 0;
                settings.speedIsActive = false;
                settings.ammoIsActive = false;
                settings.bombIsActive = false;
                settings.laserIsActive = false;
                settings.addonIsActive = false;
                settings.shieldIsActive = false;
                collision = false;
                render = true;
                settings.playerHP--;
                showHP();
                animate = true;
                engine.camera.position.x = settings.playfieldSize.x / 2;
                scoreUpdate();
                new Audio('audio/chance.wav').play()
            }
            else {
                document.getElementById("comm").style.display = "block";
                document.getElementById("comm").innerHTML = "GAME OVER";
                collision = false;
            }
        }
    }
    
    function playerShoot() {
        if(!objects.hamster.laserActive) {
            if(playerBullets.length < settings.maxAmmo) {
                new Audio('audio/shoot.wav').play()
                var player = objects.hamster;
                var bullet = new objects.playerBullet();
                bullet.position.x = player.position.x + player.size.x / 2;
                bullet.position.y = player.position.y + player.size.y / 2 + 5;

                playerBullets.push(bullet);
                
                if(objects.hamster.addonActive) {
                    var addon = objects.addon;
                    var bullet = new objects.playerBullet();
                    bullet.position.x = addon.position.x + addon.size.x / 2;
                    bullet.position.y = addon.position.y + addon.size.y / 2 + 5;

                    playerBullets.push(bullet);
                }
            }
        }
        else if(objects.hamster.laserActive && !objects.hamster.laser) {
            objects.hamster.laser = true;
            new Audio('audio/shoot.wav').play()
        }
        if(objects.hamster.bombActive && !objects.hamster.bomb) {
            var bomb = new objects.bomb();
            var player = objects.hamster;
            bomb.position.x = player.position.x + player.size.x / 2 - 10;
            bomb.position.y = player.position.y + player.size.y;
            playerBullets.push(bomb);
            objects.hamster.bomb = true;
        }
    }
    
    function BulletsUpdate() {
        // Player bullets
        for(var i = 0; i < playerBullets.length; i++) {
            var bullet = playerBullets[i];
            var player = objects.hamster;
            bullet.flight(engine.deltaTime);
            if( bullet.position.x >= settings.playfieldSize.x || bullet.position.x <= 0 )
                playerBullets.splice(i, 1);
            else {
                ctx.drawImage(bullet.img, bullet.position.x, bullet.position.y);
                var enemys = objects.enemys;
                for(var j = 0; j < enemys.length; j++) {
                    if(ctx.isPointInPath(enemys[j].collider, bullet.position.x + bullet.size.x, bullet.position.y + bullet.size.y / 2)) {
                        enemys[j].hp -= settings.playerStrength;
                        if(enemys[j].hp <= 0) {
                            if(enemys[j].objectType == "cannon") {
                                objects.explosions.push(new objects.smallExplosion(enemys[j].position.x, enemys[j].position.y));
                                settings.score += 100;
                                settings.killedCounter++;
                            }
                            else if(enemys[j].objectType == "spawner") {
                                objects.explosions.push(new objects.bigExplostion(enemys[j].position.x, enemys[j].position.y));
                                settings.score += 1000;
                                settings.killedCounter++;
                            }
                            enemys.splice(j, 1);
                        }
                        if(playerBullets[i].type == "bomb") player.bomb = false;
                        playerBullets.splice(i, 1);
                    }
                }
                var enemys = objects.enemysFromSpawner;
                for(var j = 0; j < enemys.length; j++) {
                    if(ctx.isPointInPath(enemys[j].collider, bullet.position.x + bullet.size.x, bullet.position.y + bullet.size.y / 2)) {
                        enemys[j].hp -= settings.playerStrength;
                        if(enemys[j].hp <= 0) {
                            enemys.splice(j, 1);
                            settings.killedCounter += 0.5;
                            settings.score += 50;
                        }
                        playerBullets.splice(i, 1);
                    }
                }
                var enemys = objects.dragons;
                for(var j = 0; j < enemys.length; j++) {
                    if(ctx.isPointInPath(enemys[j].collider, bullet.position.x + bullet.size.x, bullet.position.y + bullet.size.y / 2)) {
                        enemys[j].hp -= settings.playerStrength;
                        if(enemys[j].hp <= 0) {
                            objects.explosions.push(new objects.bigExplostion(enemys[j].position.x, enemys[j].position.y));
                            enemys.splice(j, 1);
                            settings.killedCounter++;
                            settings.score += 1000;
                        }
                        if(playerBullets[i].type == "bomb") player.bomb = false;
                        playerBullets.splice(i, 1);
                    }
                }
                var enemys = objects.topToys;
                for(var j = 0; j < enemys.length; j++) {
                    if(ctx.isPointInPath(enemys[j].collider, bullet.position.x + bullet.size.x, bullet.position.y + bullet.size.y / 2)) {
                        enemys[j].hp -= settings.playerStrength;
                        if(enemys[j].hp <= 0) {
                            objects.explosions.push(new objects.smallExplosion(enemys[j].position.x, enemys[j].position.y));
                            enemys.splice(j, 1);
                            settings.killedCounter++;
                            settings.score += 1000;
                        }
                        if(playerBullets[i].type == "bomb") player.bomb = false;
                        playerBullets.splice(i, 1);
                    }
                }
                var rocks = objects.rocks;
                for(var j = 0; j < rocks.length; j++) {
                    rocks[j].collider = new Path2D();
                    if(rocks[j].type == "small-up" || rocks[j].type == "small-down")
                        rocks[j].collider.rect(rocks[j].position.x, rocks[j].position.y, rocks[j].position.x + rocks[j].size.x, rocks[j].position.y + rocks[j].size.y);
                    else
                        rocks[j].collider.rect(rocks[j].position.x + 60, rocks[j].position.y, rocks[j].position.x + rocks[j].size.x - 80, rocks[j].position.y + rocks[j].size.y);
                    if(ctx.isPointInPath(rocks[j].collider, bullet.position.x + bullet.size.x, bullet.position.y + bullet.size.y / 2)) {
                        if(bullet.type == "bomb") player.bomb = false;
                        playerBullets.splice(i, 1);
                    }
                }
                var boss = objects.boss;
                if(boss.isActive) {
                    boss.collider = new Path2D();
                    boss.collider.rect(boss.position.x, boss.position.y, boss.position.x + boss.size.x, boss.position.y + boss.size.y);
                    if(ctx.isPointInPath(boss.collider, bullet.position.x + bullet.size.x, bullet.position.y + bullet.size.y / 2)) {
                        boss.hp -= settings.playerStrength;
                        if(boss.hp <= 0) {
                            objects.explosions.push(new objects.bigExplostion(boss.position.x, boss.position.y));
                            objects.explosions.push(new objects.bigExplostion(boss.position.x + boss.size.x / 2, boss.position.y));
                            objects.explosions.push(new objects.bigExplostion(boss.position.x, boss.position.y + boss.size.y / 2));
                            objects.explosions.push(new objects.bigExplostion(boss.position.x + boss.size.x / 2, boss.position.y + boss.size.y / 2));
                            boss.isAlive = false;
                            boss.isAlive = false;
                            settings.killedCounter++;
                            settings.score += 4000;
                        }
                        if(playerBullets[i].type == "bomb") player.bomb = false;
                        playerBullets.splice(i, 1);
                    }
                }
            }
        }
        // laser
        if(objects.hamster.laserActive && objects.hamster.laser) {
            var player = objects.hamster;
            var laserStartX = player.position.x + player.size.x;
            var laserStartY = player.position.y + player.size.y / 2;
            ctx.beginPath();
            ctx.moveTo(laserStartX, laserStartY);
            ctx.strokeStyle = "rgb(223,150,56)";
            ctx.lineWidth = 5;
            var target = {};
            target.position = { x: settings.playfieldSize.x, y: laserStartY };
            target.size = { x: 0, y: 0 };
            var tabPosition = 0;
            var enemys = objects.enemys;
            for(var j = 0; j < enemys.length; j++) {
                if(enemys[j].position.y < laserStartY && enemys[j].position.y + enemys[j].size.y > laserStartY && enemys[j].position.x > laserStartX) {
                    if(target.position.x > enemys[j].position.x) {
                        target = enemys[j];
                        tabPosition = j;
                    }
                }
            }
            var enemys = objects.enemysFromSpawner;
            for(var j = 0; j < enemys.length; j++) {
                if(enemys[j].position.y < laserStartY && enemys[j].position.y + enemys[j].size.y > laserStartY && enemys[j].position.x > laserStartX) {
                    if(target.position.x > enemys[j].position.x) {
                        target = enemys[j];
                        tabPosition = j;
                    }
                }
            }
            var enemys = objects.dragons;
            for(var j = 0; j < enemys.length; j++) {
                if(enemys[j].position.y < laserStartY && enemys[j].position.y + enemys[j].size.y > laserStartY && enemys[j].position.x > laserStartX) {
                    if(target.position.x > enemys[j].position.x) {
                        target = enemys[j];
                        tabPosition = j;
                    }
                }
            }
            var enemys = objects.topToys;
            for(var j = 0; j < enemys.length; j++) {
                if(enemys[j].position.y < laserStartY && enemys[j].position.y + enemys[j].size.y > laserStartY && enemys[j].position.x > laserStartX) {
                    if(target.position.x > enemys[j].position.x) {
                        target = enemys[j];
                        tabPosition = j;
                    }
                }
            }
            var enemys = objects.rocks;
            for(var j = 0; j < enemys.length; j++) {
                if(enemys[j].position.y < laserStartY && enemys[j].position.y + enemys[j].size.y > laserStartY && enemys[j].position.x > laserStartX) {
                    if(target.position.x > enemys[j].position.x) {
                        target = enemys[j];
                        tabPosition = j;
                    }
                }
            }
            var boss = objects.boss;
            if(boss.isActive) {
                if(boss.position.y < laserStartY && boss.position.y + boss.size.y > laserStartY && boss.position.x > laserStartX) {
                    if(target.position.x > boss.position.x)
                        target = boss;
                }
            }
            ctx.lineTo(target.position.x + target.size.x / 2, laserStartY);
            ctx.stroke();
            player.laser = false;
            // if != rock
            if(target.objectType != "rock") {
                target.hp -= settings.playerStrength;
                if(target.hp <= 0) {
                    if(target.objectType == "cannon") {
                        objects.explosions.push(new objects.smallExplosion(target.position.x, target.position.y));
                        settings.score += 100;
                        objects.enemys.splice(tabPosition, 1);
                        settings.killedCounter++;
                    }
                    else if(target.objectType == "spawner") {
                        objects.explosions.push(new objects.bigExplostion(target.position.x, target.position.y));
                        settings.score += 1000;
                        objects.enemys.splice(tabPosition, 1);
                        settings.killedCounter++;
                    }
                    else if(target.objectType == "enemy") {
                        objects.enemysFromSpawner.splice(tabPosition, 1);
                        settings.killedCounter += 0.5;
                        settings.score += 50;
                    }
                    else if(target.objectType == "dragon") {
                        objects.explosions.push(new objects.bigExplostion(target.position.x, target.position.y));
                        objects.dragons.splice(tabPosition, 1);
                        settings.killedCounter++;
                        settings.score += 1000;
                    }
                    else if(target.objectType == "top-toy") {
                        objects.explosions.push(new objects.smallExplosion(target.position.x, target.position.y));
                        objects.topToys.splice(tabPosition, 1);
                        settings.killedCounter++;
                        settings.score += 1000;
                    }
                    else if(target.objectType == "boss") {
                        objects.explosions.push(new objects.bigExplostion(target.position.x, target.position.y));
                        objects.explosions.push(new objects.bigExplostion(target.position.x + target.size.x / 2, target.position.y));
                        objects.explosions.push(new objects.bigExplostion(target.position.x, target.position.y + target.size.y / 2));
                        objects.explosions.push(new objects.bigExplostion(target.position.x + target.size.x / 2, target.position.y + target.size.y / 2));
                        target.isAlive = false;
                        target.isAlive = false;
                        settings.killedCounter++;
                        settings.score += 4000;
                    }
                }
            }
        }
        
        // Enemy bullets
        for(var i = 0; i < objects.enemyBullets.length; i++) {
            var bullet = objects.enemyBullets[i];
            bullet.flight(engine.deltaTime);
            if( bullet.position.x >= settings.playfieldSize.x - bullet.size.x || bullet.position.x <= - bullet.size.x  || bullet.position.y <= objects.backgroundUp01.size.y || bullet.position.y >= settings.playfieldSize.y - objects.backgroundDown01.size.y )
                objects.enemyBullets.splice(i, 1);
            else {
                var player = objects.hamster;
                if( bullet.position.x < player.position.x + player.size.x && bullet.position.x > player.position.x && bullet.position.y + bullet.size.y > player.position.y && bullet.position.y < player.position.y + player.size.y ) {
                    if(!player.shieldActive)
                        Collision();
                    objects.enemyBullets.splice(i, 1);
                }
                ctx.drawImage(bullet.img, bullet.position.x, bullet.position.y);
            }
        }
        // Enemys from spawner
        for(var i = 0; i < objects.enemysFromSpawner.length; i++) {
            var enemy = objects.enemysFromSpawner[i];
            enemy.flight(engine.deltaTime);
            if( enemy.position.x <= - enemy.size.x  || enemy.position.y <= objects.backgroundUp01.size.y || enemy.position.y >= settings.playfieldSize.y - objects.backgroundDown01.size.y )
                objects.enemysFromSpawner.splice(i, 1);
            else {
                var player = objects.hamster;
                if( player.position.x + player.size.x > enemy.position.x && player.position.x < enemy.position.x + enemy.size.x && player.position.y + player.size.y > enemy.position.y && player.position.y < enemy.position.y + enemy.size.y ) {
                    if(!player.shieldActive)
                        Collision();
                    objects.enemysFromSpawner.splice(i, 1);
                }
                ctx.drawImage(enemy.img, enemy.position.x, enemy.position.y);
            }
        }
        // explosions
        for(var i = 0; i < objects.explosions.length; i++) {
            var result = objects.explosions[i].update(engine.deltaTime);
            if(!result) ctx.drawImage(objects.explosions[i].img, objects.explosions[i].position.x, objects.explosions[i].position.y);
            else objects.explosions.splice(i, 1);
        }
    }
    
    function EnemysUpdate() {
        // Enemys (cannons, spawners)
        var enemyTab = objects.enemys;
        for(var i = 0; i < enemyTab.length; i++) {
            var noContinue = false;
            if( enemyTab[i].position.x <= settings.playfieldSize.x && enemyTab[i].position.x >= -enemyTab[i].size.x && !enemyTab[i].isActive )
                enemyTab[i].isActive = true;
            else if( (enemyTab[i].position.x >= settings.playfieldSize.x || enemyTab[i].position.x <= -enemyTab[i].size.x) && enemyTab[i].isActive )
                enemyTab[i].isActive = false;
            if(enemyTab[i].isAlive) {
                enemyTab[i].position.x -= settings.scrollSpeed * engine.deltaTime;
                enemyTab[i].collider = new Path2D();
                enemyTab[i].collider.rect(enemyTab[i].position.x, enemyTab[i].position.y, enemyTab[i].size.x, enemyTab[i].size.y);
                // collision with player
                var player = objects.hamster;
                var enemy = enemyTab[i];
                if( player.position.x + player.size.x > enemy.position.x && player.position.x < enemy.position.x + enemy.size.x &&player.position.y + player.size.y > enemy.position.y && player.position.y < enemy.position.y + enemy.size.y ) {
                    if(player.shieldActive) {
                        noContinue = true;
                        if(enemy.objectType == "cannon") {
                            objects.explosions.push(new objects.smallExplosion(enemy.position.x, enemy.position.y));
                            settings.score += 100;
                            settings.killedCounter++;
                        }
                        else if(enemy.objectType == "spawner") {
                            objects.explosions.push(new objects.bigExplostion(enemy.position.x, enemy.position.y));
                            settings.score += 1000;
                            settings.killedCounter++;
                        }
                        enemyTab.splice(i, 1);
                    }
                    else Collision();
                }
            }
            if(!noContinue && enemyTab[i].isActive) {
                ctx.drawImage(enemyTab[i].img, enemyTab[i].position.x, enemyTab[i].position.y);
                enemyTab[i].shoot(engine.deltaTime);
            }
        }
        // dragons
        var dragonTab = objects.dragons;
        for(var i = 0; i < dragonTab.length; i++) {
            if( dragonTab[i].position.x <= settings.playfieldSize.x && dragonTab[i].position.x >= -dragonTab[i].size.x && !dragonTab[i].isActive )
                dragonTab[i].isActive = true;
            else if( (dragonTab[i].position.x >= settings.playfieldSize.x || dragonTab[i].position.x <= -dragonTab[i].size.x) && dragonTab[i].isActive )
                dragonTab[i].isActive = false;
            if(dragonTab[i].isAlive) {
                dragonTab[i].position.x -= settings.scrollSpeed * engine.deltaTime;
            }
            if(dragonTab[i].isActive) {
                dragonTab[i].move(engine.deltaTime);
                ctx.drawImage(dragonTab[i].animate(), dragonTab[i].position.x, dragonTab[i].position.y);
                // collision with player
                var player = objects.hamster;
                var dragon = dragonTab[i];
                if( player.position.x + player.size.x > dragon.position.x && player.position.x < dragon.position.x + dragon.size.x && player.position.y + player.size.y > dragon.position.y && player.position.y < dragon.position.y + dragon.size.y  ) {
                    if(player.shieldActive) {
                        objects.explosions.push(new objects.bigExplostion(dragon.position.x, dragon.position.y));
                        dragonTab.splice(i, 1);
                        settings.killedCounter++;
                        settings.score += 1000;
                    }
                    else Collision();
                }
            }
        }
        // topToys
        var topToyTab = objects.topToys;
        for(var i = 0; i < topToyTab.length; i++) {
            if( topToyTab[i].position.x <= settings.playfieldSize.x && topToyTab[i].position.x >= -topToyTab[i].size.x && !topToyTab[i].isActive )
                topToyTab[i].isActive = true;
            else if( (topToyTab[i].position.x >= settings.playfieldSize.x || topToyTab[i].position.x <= -topToyTab[i].size.x) && topToyTab[i].isActive )
                topToyTab[i].isActive = false;
            if(topToyTab[i].isAlive) {
                topToyTab[i].position.x -= settings.scrollSpeed * engine.deltaTime;
            }
            if(topToyTab[i].isActive) {
                topToyTab[i].move(engine.deltaTime);
                ctx.drawImage(topToyTab[i].img, topToyTab[i].position.x, topToyTab[i].position.y);
                // collision with player
                var player = objects.hamster;
                var topToy = topToyTab[i];
                if( player.position.x + player.size.x > topToy.position.x && player.position.x < topToy.position.x + topToy.size.x && player.position.y + player.size.y > topToy.position.y && player.position.y < topToy.position.y + topToy.size.y ) {
                    if(player.shieldActive) {
                        objects.explosions.push(new objects.smallExplosion(topToy.position.x, topToy.position.y));
                        topToyTab.splice(i, 1);
                        settings.killedCounter++;
                        settings.score += 1000;
                    }
                    else Collision();
                }
            }
        }
        // rocks
        var rocksTab = objects.rocks;
        for(var i = 0; i < rocksTab.length; i++) {
            if( rocksTab[i].position.x <= settings.playfieldSize.x && rocksTab[i].position.x >= -rocksTab[i].size.x && !rocksTab[i].isActive )
                rocksTab[i].isActive = true;
            else if( (rocksTab[i].position.x >= settings.playfieldSize.x || rocksTab[i].position.x <= -rocksTab[i].size.x) && rocksTab[i].isActive )
                rocksTab[i].isActive = false;
            var rock = rocksTab[i];
            rock.position.x -= settings.scrollSpeed * engine.deltaTime;
            if(rock.isActive) {
                ctx.drawImage(rock.img, rock.position.x, rock.position.y);
                // collision with player
                var player = objects.hamster;
                if( (rock.type == "big-up" && player.position.x + player.size.x > rock.position.x + 60 && player.position.x < rock.position.x + rock.size.x - 20 && player.position.y + player.size.y > rock.position.y && player.position.y < rock.position.y + rock.size.y) || (rock.type == "big-down" && player.position.x + player.size.x > rock.position.x + 60 && player.position.x < rock.position.x + rock.size.x - 20 && player.position.y + player.size.y > rock.position.y && player.position.y < rock.position.y + rock.size.y) || ((rock.type == "small-up" || rock.type == "small-down") && player.position.x + player.size.x > rock.position.x && player.position.x < rock.position.x + rock.size.x && player.position.y + player.size.y > rock.position.y && player.position.y < rock.position.y + rock.size.y))
                    Collision();
            }
        }
    }
    
    function bossUpdate() {
        var boss = objects.boss;
        if(boss.isAlive) {
            ctx.drawImage(boss.img, boss.position.x, boss.position.y);
            if(!boss.isActive) {
                if(boss.position.y > objects.backgroundUp01.size.y + 73) {
                    boss.position.y -= settings.bossSpeed * engine.deltaTime;
                }
                else if(boss.position.x < settings.playfieldSize.x / 2 + 200) {
                    boss.position.x += settings.bossSpeed * engine.deltaTime;
                }
                else {
                    boss.isActive = true;
                }
            }
            else {
                boss.move(engine.deltaTime);
                boss.shoot(engine.deltaTime);
                var player = objects.hamster;
                if( player.position.x + player.size.x > boss.position.x && player.position.x < boss.position.x + boss.size.x && player.position.y + player.size.y > boss.position.y && player.position.y < boss.position.y + boss.size.y )
                    Collision();
            }
        }
    }
    
    function scoreUpdate() {
        var scoreDiv = document.getElementById("score");
        settings.score += 0.152;
        var scoreString = "";
        if(settings.score < 1000000) scoreString += "0";
        if(settings.score < 100000) scoreString += "0";
        if(settings.score < 10000) scoreString += "0";
        if(settings.score < 1000) scoreString += "0";
        if(settings.score < 100) scoreString += "0";
        if(settings.score < 10) scoreString += "0";
        scoreString += Math.round(settings.score);
        scoreDiv.innerHTML = scoreString;
        
        if(settings.killedCounter > 7 && settings.killedCounter < 11 && !settings.speedIsActive) {
            settings.speedIsActive = true;
            document.getElementById("speed").style.display = "block";
            document.getElementById("info").innerHTML = "SPEED";
        }
        if(settings.killedCounter >= 11 && settings.killedCounter < 15 && !settings.ammoIsActive) {
            document.getElementById("speed").style.display = "none";
            settings.ammoIsActive = true;
            document.getElementById("ammo").style.display = "block";
            document.getElementById("info").innerHTML = "DOUBLE";
        }
        if(settings.killedCounter >= 15 && settings.killedCounter < 20 && !settings.bombIsActive) {
            document.getElementById("ammo").style.display = "none";
            settings.bombIsActive = true;
            document.getElementById("bomb").style.display = "block";
            document.getElementById("info").innerHTML = "BOMB";
        }
        if(settings.killedCounter >= 20 && settings.killedCounter < 24 && !settings.laserIsActive) {
            document.getElementById("bomb").style.display = "none";
            settings.laserIsActive = true;
            document.getElementById("laser").style.display = "block";
            document.getElementById("info").innerHTML = "LASER";
        }
        if(settings.killedCounter >= 24 && settings.killedCounter < 28 && !settings.addonIsActive) {
            document.getElementById("laser").style.display = "none";
            settings.addonIsActive = true;
            document.getElementById("addon").style.display = "block";
            document.getElementById("info").innerHTML = "ADDON";
        }
        if(settings.killedCounter >= 28 && !settings.shieldIsActive) {
            document.getElementById("addon").style.display = "none";
            settings.shieldIsActive = true;
            document.getElementById("shield").style.display = "block";
            document.getElementById("info").innerHTML = "SHIELD";
        }
    }
    
    function showHP() {
        if(settings.playerHP <= 0) {
            document.getElementById("life1").style.display = "none";
            document.getElementById("life2").style.display = "none";
            document.getElementById("life3").style.display = "none";
        }
        if(settings.playerHP == 1) {
            document.getElementById("life1").style.display = "block";
            document.getElementById("life2").style.display = "none";
            document.getElementById("life3").style.display = "none";
        }
        if(settings.playerHP == 2) {
            document.getElementById("life1").style.display = "block";
            document.getElementById("life2").style.display = "block";
            document.getElementById("life3").style.display = "none";
        }
        if(settings.playerHP == 3) {
            document.getElementById("life1").style.display = "block";
            document.getElementById("life2").style.display = "block";
            document.getElementById("life3").style.display = "block";
        }
    }
    
    function Start() {
        new Audio('audio/start.wav').play()
        document.getElementById("comm").style.display = "block";
        document.getElementById("comm").innerHTML = "START";
    }

}