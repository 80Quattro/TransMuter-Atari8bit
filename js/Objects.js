function initObjects() {
    
    objects.backgroundUp01 = {
        img: images.backgroundUp,
        position: { x: 1135, y: 0 },
        size: images.backgroundUp.size,
    }
    
    objects.backgroundUp02 = {
        img: images.backgroundUp,
        position: { x: 2270, y: 0 },
        size: images.backgroundUp.size,
    }
    
    objects.backgroundDown01 = {
        img: images.backgroundDown,
        position: { x: 1135, y: 468 },
        size: images.backgroundDown.size,
    }
    
    objects.backgroundDown02 = {
        img: images.backgroundDown,
        position: { x: 2270, y: 468 },
        size: images.backgroundDown.size,
    }
    
    objects.hamster = {
        frames: [images.hamster01, images.hamster02],
        position: { x: 20, y: 200 },
        size: { x: images.hamster01.size.x, y: images.hamster01.size.y },
        frame: 0,
        animateSpeed: 0.14,
        animateCounter: 0,
        bombActive: false,
        bomb: false,
        laserActive: false,
        laser: false,
        laserCounter: 0,
        addonActive: false,
        animate: function() {
            this.animateCounter += this.animateSpeed;
            if(this.animateCounter >= 1) {
                this.frame++;
                if(this.frame > this.frames.length - 1) this.frame = 0;
                this.animateCounter = 0;
            }
            return this.frames[this.frame];
        }
    }
    
    objects.playerBullet = function() {
        this.img = images.playerBullet;
        this.size = { x: images.playerBullet.size.x, y: images.playerBullet.size.y };
        this.position = { x: 0, y: 0 };
        this.type = "bullet";
        this.flight = function(deltaTime) {
            this.position.x += settings.scrollSpeed + settings.playerBulletSpeed * deltaTime;
        }
    }
    
    objects.bomb = function() {
        this.img = images.playerBullet;
        this.size = { x: images.playerBullet.size.x, y: images.playerBullet.size.y };
        this.position = { x: 0, y: 0 };
        this.type = "bomb";
        this.flight = function(deltaTime) {
            if(this.position.y < settings.playfieldSize.y - objects.backgroundDown01.size.y - 40)
                this.position.y += settings.bombFallSpeed * deltaTime;
            else
                this.position.x += settings.playerBulletSpeed * deltaTime + settings.scrollSpeed;
            //this.position.x += settings.scrollSpeed + settings.playerBulletSpeed * deltaTime;
        }
    }
    
    objects.enemyBullet = function() {
        var that = this;
        this.img = images.enemyBullet;
        this.size = { x: images.enemyBullet.size.x, y: images.enemyBullet.size.y };
        this.position = { x: 0, y: 0 };
        this.direction = { x: 0, y: 0 };
        this.flight = function(deltaTime) {
            this.position.x += settings.enemyBulletSpeed * deltaTime * that.direction.x - settings.scrollSpeed * deltaTime;
            this.position.y += settings.enemyBulletSpeed * deltaTime * that.direction.y;
        }
    }
    
    objects.enemy = function() {
        var that = this;
        this.img = images.enemy;
        this.size = { x: images.enemy.size.x, y: images.enemy.size.y };
        this.position = { x: 0, y: 0 };
        this.direction = { x: 0, y: 0 };
        this.objectType = "enemy";
        this.hp = 1;
        this.collider = new Path2D();
        this.flight = function(deltaTime) {
            this.position.x += settings.enemySpeed * deltaTime * that.direction.x - settings.scrollSpeed * deltaTime;
            this.position.y += settings.enemySpeed * deltaTime * that.direction.y;
            if( that.type == "up" && that.position.y + that.size.y + 50 < settings.playfieldSize.y / 2 ) {
                that.direction.y = 0;
            }
            if( that.type == "down" && that.position.y - 10 > settings.playfieldSize.y / 2 ) {
                that.direction.y = 0;
            }
            that.collider = new Path2D();
            that.collider.rect(that.position.x, that.position.y, that.size.x, that.size.y);
        }
    }
    
    objects.cannon = function( type, positionX ) {
        var that = this;
        this.type;
        this.objectType = "cannon";
        this.img, this.size;
        this.schootDirection = {};
        this.position = {};
        this.position.x = positionX;
        this.isAlive = true;
        this.isActive = false;
        this.collider = new Path2D();
        this.hp = 4;
        function init(type) {
            switch(type) {
                case "up":
                    that.img = images.cannonUp;
                    that.size = images.cannonUp.size;
                    that.position.y = settings.playfieldSize.y - objects.backgroundDown01.size.y - that.size.y;
                    that.schootDirection = { x: 0, y: -1 };
                    //that.gunEnd = { x: that.position.x + that.size.x / 2, y: that.position.y - 10 }
                    break;
                case "up-left":
                    that.img = images.cannonUpLeft;
                    that.size = images.cannonUpLeft.size;
                    that.position.y = settings.playfieldSize.y - objects.backgroundDown01.size.y - that.size.y;
                    that.schootDirection = { x: -1, y: -1 };
                    //that.gunEnd = { x: that.position.x + 10, y: that.position.y - 10 }
                    break;
                case "up-right":
                    that.img = images.cannonUpRight;
                    that.size = images.cannonUpRight.size;
                    that.position.y = settings.playfieldSize.y - objects.backgroundDown01.size.y - that.size.y;
                    that.schootDirection = { x: 1, y: -1 };
                    //that.gunEnd = { x: that.position.x - 10, y: that.position.y - 10 }
                    break;
                case "down":
                    that.img = images.cannonDown;
                    that.size = images.cannonDown.size;
                    that.position.y = objects.backgroundUp01.size.y;
                    that.schootDirection = { x: 0, y: 1 };
                    //that.gunEnd = { x: that.position.x + that.size.x / 2, y: that.position.y + that.size.y + 10 }
                    break;
                case "down-left":
                    that.img = images.cannonDownLeft;
                    that.size = images.cannonDownLeft.size;
                    that.position.y = objects.backgroundUp01.size.y;
                    that.schootDirection = { x: -1, y: 1 };
                    //that.gunEnd = { x: that.position.x + 10, y: that.position.y + that.size.y + 10 }
                    break;
                case "down-right":
                    that.img = images.cannonDownRight;
                    that.size = images.cannonDownRight.size;
                    that.position.y = objects.backgroundUp01.size.y;
                    that.schootDirection = { x: 1, y: 1 };
                    //that.gunEnd = { x: that.position.x + that.size.x - 10, y: that.position.y + that.size.y + 10 }
                    break;
                default:
                    console.warn("Invalid cannon type");
                    return;
            }
            that.type = type;
        }
        init(type);
        this.shoot = function(deltaTime) {
            shootCounter += shootSpeed * deltaTime;
            if(shootCounter > 200 && los > 0) {
                var bullet = new objects.enemyBullet();
                switch(that.type) {
                    case "up":
                        that.gunEnd = { x: that.position.x + that.size.x / 2 - bullet.size.x / 2, y: that.position.y - bullet.size.y - 10 }
                        break;
                    case "up-left":
                        that.gunEnd = { x: that.position.x - bullet.size.x / 2 + 10, y: that.position.y - 10 }
                        break;
                    case "up-right":
                        that.gunEnd = { x: that.position.x + that.size.x - 10, y: that.position.y - 10 }
                        break;
                    case "down":
                        that.gunEnd = { x: that.position.x + that.size.x / 2 - bullet.size.x / 2, y: that.position.y + that.size.y + 10 }
                        break;
                    case "down-left":
                        that.gunEnd = { x: that.position.x - bullet.size.x / 2 + 10, y: that.position.y + that.size.y + 10 }
                        break;
                    case "down-right":
                        that.gunEnd = { x: that.position.x + that.size.x - 10, y: that.position.y + that.size.y + 10 }
                        break;  
                }
                bullet.position = that.gunEnd; //{ x: that.position.x + that.size.x / 2 - bullet.size.x / 2, y: that.position.y - bullet.size.y - 10 };
                bullet.direction = { x: that.schootDirection.x, y: that.schootDirection.y };
                objects.enemyBullets.push(bullet);
                los--;
                shootCounter = 0;
            }
            if(shootCounter > 1700) {
                los = Math.floor(Math.random() * 3) + 1;
                shootCounter = 0;
            }
        }
        var shootCounter = 0;
        var shootSpeed = 1;
        var los;
    }
    
    objects.spawner = function( type, positionX ) {
        var that = this;
        this.type;
        this.objectType = "spawner";
        this.img, this.size;
        this.position = {};
        this.position.x = positionX;
        this.isAlive = true;
        this.isActive = false;
        this.collider = new Path2D();
        this.hp = 10;
        function init(type) {
            if(type == "up") {
                that.img = images.spawnerUp;
                that.type = type;
                that.size = images.spawnerUp.size;
                that.position.y = settings.playfieldSize.y - objects.backgroundDown01.size.y - that.size.y;
                that.shootDirection = { x: -1, y: -1 };
            }
            else if(type == "down") {
                that.img = images.spawnerDown;
                that.type = type;
                that.size = images.spawnerDown.size;
                that.position.y = objects.backgroundUp01.size.y;
                that.shootDirection = { x: -1, y: 1 };
            }
            else console.warn("Invalid spawner type");
        }
        init(type);
        this.shoot = function(deltaTime) {
            shootCounter += shootSpeed * deltaTime;
            if(shootCounter > 700 && los >= 0) {
                var enemy = new objects.enemy();
                if(that.type == "up") {
                    that.spawnPosition = { x: that.position.x + that.size.x / 2, y: that.position.y - enemy.size.y - 10 };
                }
                else if(that.type == "down") {
                    that.spawnPosition = { x: that.position.x + that.size.x / 2 , y: that.position.y + that.size.y + 10 };
                }
                enemy.position = that.spawnPosition;
                enemy.direction = { x: that.shootDirection.x, y: that.shootDirection.y };
                enemy.type = that.type;
                objects.enemysFromSpawner.push(enemy);
                los--;
                shootCounter = 0;
            }
            if(shootCounter > 20000) {
                los = 5;
                shootCounter = 0;
            }
        }
        var shootCounter = 0;
        var shootSpeed = 1;
        var los = 5;
    }
    
    objects.dragon = function( type, positionX ) {
        var that = this;
        this.frames = [];
        this.position = {};
        this.position.x = positionX;
        this.size = {};
        this.type = type;
        var frame = 0;
        this.isAlive = true;
        this.isActive = false;
        this.objectType = "dragon";
        this.hp = 1;
        this.animateSpeed = 0.057;
        var animateCounter = 0;
        this.collider = new Path2D();
        function init(type) {
            if(type == "up") {
                that.frames.push(images.dragonUp01);
                that.frames.push(images.dragonUp02);
                that.size.x = images.dragonUp01.size.x;
                that.size.y = images.dragonUp01.size.y;
                that.position.y = settings.playfieldSize.y - objects.backgroundDown01.size.y - that.size.y;
            }
            else if(type == "down") {
                that.frames.push(images.dragonDown01);
                that.frames.push(images.dragonDown02);
                that.size.x = images.dragonDown01.size.x;
                that.size.y = images.dragonDown01.size.y;
                that.position.y = objects.backgroundUp01.size.y;
            }
            else console.warn("Invalid type of dragon");
        }
        init(type);
        this.animate = function() {
            animateCounter += that.animateSpeed;
            if(animateCounter >= 1) {
                frame++;
                if(frame > that.frames.length - 1) frame = 0;
                animateCounter = 0;
            }
            return that.frames[frame];
        }
        this.move = function(deltaTime) {
            that.position.x -= settings.dragonSpeed * deltaTime + settings.scrollSpeed;
            that.collider = new Path2D();
            that.collider.rect(that.position.x, that.position.y, that.size.x, that.size.y);
        }
    }
    
    objects.topToy = function( positionX ) {
        var that = this;
        this.img = images.topToy;
        this.size = images.topToy.size;
        this.position = { x: positionX, y: settings.playfieldSize.y - objects.backgroundDown01.size.y - that.size.y - 10 };
        this.isAlive = true;
        this.isActive = false;
        this.objectType = "top-toy";
        this.hp = 1;
        this.collider = new Path2D();
        var angle = Math.random() * 2;
        this.move = function(deltaTime) {
            that.position.x -= Math.sin(angle / 2.5) * settings.topToySpeed * 2 * deltaTime + settings.scrollSpeed;
            that.position.y -= Math.sin(angle) * settings.topToySpeed * deltaTime;
            angle += 0.13;
            that.collider = new Path2D();
            that.collider.rect(that.position.x, that.position.y, that.size.x, that.size.y);
        }
    }
    
    objects.rock = function( type, positionX ) {
        var that = this;
        this.img;
        this.position = {};
        this.position.x = positionX;
        this.size = {};
        this.type = type;
        this.objectType = "rock";
        this.isActive = false;
        this.collider = new Path2D();
        function init(type) {
            switch(type) {
                case "small-up":
                    that.img = images.rockSmallUp;
                    that.size = images.rockSmallUp.size;
                    that.position.y = settings.playfieldSize.y - objects.backgroundDown01.size.y - that.size.y;
                    break;
                case "small-down":
                    that.img = images.rockSmallDown;
                    that.size = images.rockSmallDown.size;
                    that.position.y = objects.backgroundUp01.size.y;
                    break;
                case "big-up":
                    that.img = images.rockBigUp;
                    that.size = images.rockBigUp.size;
                    that.position.y = settings.playfieldSize.y - objects.backgroundDown01.size.y - that.size.y;
                    break;
                case "big-down":
                    that.img = images.rockBigDown;
                    that.size = images.rockBigDown.size;
                    that.position.y = objects.backgroundUp01.size.y;
                    break;
                default:
                    console.warn("invalid rock type");
            }
        }
        init(type);
    }
    
    objects.boss = {
        img: images.boss,
        position: { x: settings.playfieldSize.x / 2 - images.boss.size.x / 2, y: 200 },
        size: images.boss.size,
        hp: 10,
        isActive: false,
        isAlive: true,
        objectType: "boss",
        move: function(deltaTime) {
            this.position.y -= Math.sin(this.angle) * settings.bossRange * deltaTime;
            this.angle += 0.08;
        },
        angle: 1.7,
        shoot: function(deltaTime) {
            this.shootCounter += this.shootSpeed * deltaTime;
            if(this.shootCounter > 2000) {
                this.shootCounter = 0;
                var bullet1 = new objects.bossBullet();
                var bullet2 = new objects.bossBullet();
                bullet1.position.x = this.position.x;
                bullet2.position.x = this.position.x;
                bullet1.position.y = this.position.y + this.size.y / 3;
                bullet2.position.y = this.position.y + this.size.y * 2 / 3;
                objects.enemyBullets.push(bullet1);
                objects.enemyBullets.push(bullet2);
                new Audio('audio/boss-shoot.wav').play();
            }
        },
        shootCounter: 0,
        shootSpeed: 1,
    }
    
    objects.bossBullet = function() {
        this.img = images.bossBullet;
        this.size = { x: images.bossBullet.size.x, y: images.bossBullet.size.y };
        this.position = { x: 0, y: 0 };
        this.flight = function(deltaTime) {
            this.position.x -= settings.bossBulletSpeed * deltaTime;
        }
    }
    
    objects.smallExplosion = function(positionX, positionY) {
        var that = this;
        this.img = images.smallExplosion;
        this.position = {};
        this.position.x = positionX;
        this.position.y = positionY
        this.size = images.smallExplosion.size;
        this.explosionTime = 300;
        var explosionCounter = 0;
        new Audio('audio/explosion.wav').play();
        this.update = function(deltaTime) {
            explosionCounter += deltaTime;
            if(explosionCounter > that.explosionTime)
                return true;
            that.position.x -= settings.scrollSpeed * deltaTime;
            return false;
        }
    }
    
    objects.bigExplostion = function(positionX, positionY) {
        var that = this;
        this.img = images.bigExplostion;
        this.position = {};
        this.position.x = positionX;
        this.position.y = positionY
        this.size = images.bigExplostion.size;
        this.explosionTime = 300;
        var explosionCounter = 0;
        new Audio('audio/explosion.wav').play();
        this.update = function(deltaTime) {
            explosionCounter += deltaTime;
            if(explosionCounter > that.explosionTime)
                return true;
            that.position.x -= settings.scrollSpeed * deltaTime;
            return false;
        }
    }
    
    objects.addon = {
        img: images.addon,
        position: { x: objects.hamster.position.x, y: objects.hamster.position.y },
        size: images.addon.size,
        isActive: false,
        objectType: "addon",
        move: function(deltaTime) {
            
        },
        shoot: function(deltaTime) {
            
        }
    }
    
    objects.theEnd = {
        frames: [images.end01, images.end02, images.end03, images.end04, images.end05, images.end06, images.end07, images.end08, images.end09, images.end10, images.end11, images.end12, images.end13, images.end14, images.end15, images.end16, images.end17, images.end18, images.end19],
        position: { x: 0, y: 0 },
        size: { x: images.end01.size.x, y: images.end01.size.y },
        frame: 0,
        animateSpeed: 0.35,
        animateCounter: 0,
        animate: function() {
            this.animateCounter += this.animateSpeed;
            if(this.animateCounter >= 1) {
                this.frame++;
                if(this.frame > this.frames.length - 1) this.frame = 0;
                this.animateCounter = 0;
            }
            return this.frames[this.frame];
        }
    }
    
    objects.enemys = [];
    objects.dragons = [];
    objects.topToys = [];
    objects.rocks = [];
    
    objects.enemys.push(new objects.cannon("up-left", 1300));
    objects.enemys.push(new objects.spawner("up", 1400));
    objects.enemys.push(new objects.cannon("down-left", 1300));
    objects.enemys.push(new objects.cannon("down", 1430));
    objects.enemys.push(new objects.cannon("down-right", 1560));
    objects.topToys.push(new objects.topToy(2000));
    objects.topToys.push(new objects.topToy(2100));
    objects.dragons.push(new objects.dragon("up", 2240));
    objects.dragons.push(new objects.dragon("down", 2500));
    objects.enemys.push(new objects.spawner("down", 2600));
    objects.topToys.push(new objects.topToy(2600));
    objects.enemys.push(new objects.cannon("up", 2900));
    objects.enemys.push(new objects.spawner("up", 3300));
    objects.enemys.push(new objects.cannon("down", 3330));
    objects.rocks.push(new objects.rock("small-up", 3415));
    objects.enemys.push(new objects.spawner("down", 3415));
    objects.enemys.push(new objects.cannon("down", 3560));
    objects.enemys.push(new objects.cannon("up", 3700));
    objects.rocks.push(new objects.rock("small-up", 3950));
    objects.enemys.push(new objects.cannon("up-left", 4400));
    objects.enemys.push(new objects.cannon("down-left", 4400));
    objects.enemys.push(new objects.cannon("down", 4500));
    objects.enemys.push(new objects.cannon("up", 4500));
    objects.enemys.push(new objects.cannon("up-right", 4600));
    objects.enemys.push(new objects.cannon("down-right", 4600));
    objects.dragons.push(new objects.dragon("down", 5300));
    objects.rocks.push(new objects.rock("big-up", 5300));
    objects.rocks.push(new objects.rock("small-down", 5400));
    objects.topToys.push(new objects.topToy(5700));
    objects.rocks.push(new objects.rock("big-down", 5700));
    objects.rocks.push(new objects.rock("small-up", 5800));
    objects.enemys.push(new objects.spawner("up", 6200));
    objects.rocks.push(new objects.rock("small-up", 6315));
    objects.enemys.push(new objects.cannon("down-left", 6320));
    objects.enemys.push(new objects.spawner("down", 6420));
    objects.enemys.push(new objects.cannon("down-right", 6580));
    objects.enemys.push(new objects.cannon("up", 6580));
    objects.rocks.push(new objects.rock("small-up", 6700));
    objects.topToys.push(new objects.topToy(7000));
    objects.rocks.push(new objects.rock("small-up", 7050));
    objects.dragons.push(new objects.dragon("down", 7470));
    objects.rocks.push(new objects.rock("small-up", 7850));
        
    objects.enemyBullets = [];
    objects.enemysFromSpawner = [];
    objects.explosions = [];
    
}

var objects = {}