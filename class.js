class Bounds {
    constructor(x, y) {
        this.x=x
        this.y=y
        this.width = 52.8
        this.height = 52.8
    }

    draw() {
        context.fillStyle = "rgba(255, 0, 0, 0.5)"
        context.fillRect(this.x, this.y, this.width, this.height)
    }
}

class Sprite {
    constructor(x, y, img, frame = 1) {
        this.x = x
        this.y = y
        this.img = img
        this.frame = frame
        this.hold = 10
        this.val = 0
        this.elapsed = 0
        this.img.onload = () => {
            this.width = this.img.width / this.frame
            this.height = this.img.height
        }
        this.moving = false
        this.health = 100
        this.opacity = 1
        this.isEnemy = false
    }
    draw() {
        context.save()
        context.globalAlpha = this.opacity
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
        context.restore()
        if (this.moving) {
            if (this.frame > 1) {
                this.elapsed += 1
            }
            if (this.elapsed % this.hold === 0) {
                if (this.val < this.frame - 1) {
                    this.val++
                } else {
                    this.val = 0
                }
            }
        }
    }

    attack({attack, recipient}) {
        const tl = gsap.timeline()
        recipient.health -= attack.damage
        let healthBar = "#embyHealth"
        if (recipient.isEnemy) healthBar = "#enemyHealth"
        tl.to(this,{ x: this.x - 20}).to(this, {
            x: this.x + 40, duration:0.1, 
            onComplete: () => {
                gsap.to(healthBar, {width: recipient.health + "%"})
                gsap.to(recipient, {
                    x: recipient.x + 10,
                    yoyo: true,
                    repeat:3,
                    duration: 0.09
                })
                gsap.to(recipient, {
                    opacity: 0,
                    yoyo: true,
                    repeat:3,
                    duration: 0.09
                })
                if (recipient.health == 0) {
                    recipient.opacity = 0
                }
            }}
        ).to(this, {x:this.x})
    }


}