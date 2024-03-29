class Bounds {
    constructor(x, y) {
        this.x=x;
        this.y=y;
        this.width = 52.8;
        this.height = 52.8;
    }

    draw() {
        context.fillStyle = "rgba(255, 0, 0, 0)";
        context.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Sprite {
    constructor(x, y, img, frame = 1) {
        this.x = x;
        this.y = y;
        this.img = img;
        this.frame = frame;
        this.hold = 10;
        this.val = 0;
        this.elapsed = 0;
        this.img.onload = () => {
            this.width = this.img.width / this.frame;
            this.height = this.img.height;
        }
        this.moving = false;
        this.health = 100;
        this.opacity = 1;
        this.isEnemy = false;
    }
    draw() {
        context.save()
        context.globalAlpha = this.opacity;
        context.drawImage(
            this.img,
            this.val * this.width,
            0,
            this.img.width / this.frame,
            this.img.height,
            this.x,
            this.y,
            this.img.width / this.frame,
            this.img.height
        )
        context.restore();
        if (this.moving) {
            if (this.frame > 1) {
                this.elapsed += 1;
            }
            if (this.elapsed % this.hold === 0) {
                if (this.val < this.frame - 1) {
                    this.val++;
                } else {
                    this.val = 0;
                }
            }
        }
    }

    attack({attack, recipient, renderedSprites}) {
        let healthBar = "#embyHealth";
        if (recipient.isEnemy) healthBar = "#enemyHealth";

        recipient.health -= attack.damage;

        // attack based on selected attack
        switch (attack.name) {
            case "Fireball":
                const fireballImg = new Image();
                fireballImg.src = "./images/fireball.png";
                const fireball = new Sprite(this.x, this.y, fireballImg, 4);
                fireball.moving = true;
                //put fireball at index 1 without removing any elements in renderedSprites
                renderedSprites.splice(1, 0, fireball);

                gsap.to(fireball, {
                    x: recipient.x,
                    y: recipient.y,
                    onComplete: () => {
                        gsap.to(healthBar, {width: recipient.health + "%"});
                        gsap.to(recipient, {
                            x: recipient.x + 10,
                            yoyo: true,
                            repeat:3,
                            duration: 0.09
                        });
                        gsap.to(recipient, {
                            opacity: 0,
                            yoyo: true,
                            repeat:3,
                            duration: 0.09,
                            onComplete: () => {
                                if (recipient.isEnemy) {
                                    draggle.attack({
                                        attack: attacks["Tackle"],
                                        recipient: emby,
                                        renderedSprites
                                    });
                                }
                                if (emby.health <= 0 || draggle.health <= 0) {
                                    gsap.to("#overlappingDiv", {
                                        opacity: 1,
                                        onComplete: () => {
                                            cancelAnimationFrame(battleAnimationId)
                                            document.querySelector("#userInterface").style.display = "none";
                                            battle.initiated = false;
                                            //ensure battle is reset
                                            draggle.opacity = 1;
                                            emby.opacity = 1;
                                            emby.health = 100;
                                            draggle.health = 100;
                                            gsap.to("#embyHealth", {width: "100%"});
                                            gsap.to("#enemyHealth", {width: "100%"});
                        
                                            gsap.to("#overlappingDiv", {
                                                opacity: 0
                                            })
                                            animate();
                                        }
                                    })
                                }
                            }
                        });
                        renderedSprites.splice(1, 1);
                    }
                })
                break;

            case "Tackle":
                const tl = gsap.timeline();
                recipient.health -= attack.damage;
                tl.to(this,{ x: this.x - 20}).to(this, {
                    x: this.x + 40, 
                    duration:0.1, 
                    onComplete: () => {
                        gsap.to(healthBar, {width: recipient.health + "%"});
                        gsap.to(recipient, {
                            x: recipient.x + 10,
                            yoyo: true,
                            repeat:3,
                            duration: 0.09
                        });
                        gsap.to(recipient, {
                            opacity: 0,
                            yoyo: true,
                            repeat:3,
                            duration: 0.09
                        });
                    }
                }).to(this, {
                    x:this.x,
                    onComplete: () => {
                        if (recipient.isEnemy) {
                            draggle.attack({
                                attack: attacks["Fireball"],
                                recipient: emby,
                                renderedSprites
                            });
                        }
                        //reset battle if one of the monster's health falls to 0 or under
                        if (emby.health <= 0 || draggle.health <= 0) {
                            gsap.to("#overlappingDiv", {
                                opacity: 1,
                                onComplete: () => {
                                    cancelAnimationFrame(battleAnimationId)
                                    document.querySelector("#userInterface").style.display = "none";
                                    battle.initiated = false;
                                    //ensure battle is reset
                                    draggle.opacity = 1;
                                    emby.opacity = 1;
                                    emby.health = 100;
                                    draggle.health = 100;
                                    gsap.to("#embyHealth", {width: "100%"});
                                    gsap.to("#enemyHealth", {width: "100%"});
                
                                    gsap.to("#overlappingDiv", {
                                        opacity: 0
                                    })
                                    animate();
                                }
                            })
                        }
                    }
                })
                break;
        }
    }
}