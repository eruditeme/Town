const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d")

canvas.width = 1024
canvas.height=576

context.fillStyle = "white"
context.fillRect(0, 0, canvas.width, canvas.height)

const image = new Image()
image.src = "./images/Cozy Game Map.png"
const playerImg = new Image()
playerImg.src = "./images/playerDown.png"

const cBlock = []
for (let i = 0; i < collisions.length;  i+=70) {
    cBlock.push(collisions.slice(i, i + 70))

}

class Bounds {
    constructor(x, y) {
        this.x=x
        this.y=y
        this.width = 52.8
        this.height = 52.8
    }

    draw() {
        context.fillStyle = "green"
        context.fillRect(this.x, this.y, this.width, this.height)
    }
}

const boundary = []
const offset_c = {
    x: 0,
    y: -175
}

cBlock.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol == 2221) {
            boundary.push(new Bounds(j * 52.8 + 0, i * 52.8 - 175))
        }
    })
})

class Sprite {
    constructor(x, y, img, frame = 1) {
        this.x = x
        this.y = y
        this.img = img
        this.frame = frame
        this.img.onload = () => {
            this.width = this.img.width / this.frame
            this.height = this.img.height
        }
    }
    draw() {
        context.drawImage(
            this.img,
            0,
            0,
            this.img.width / this.frame,
            this.img.height,
            this.x,
            this.y,
            this.img.width / this.frame,
            this.img.height
        )
    }


}


const background = new Sprite(0, -175, image)
const player = new Sprite(canvas.width/2 - 110, canvas.height/2 + 60, playerImg, 4)

const keys = {
    a:{pressed: false},
    w:{pressed: false},
    s:{pressed: false},
    d:{pressed: false},
}

const block = [background]

function animate() {
    window.requestAnimationFrame(animate)
    background.draw()
    //boundary.forEach(boundary => {boundary.draw()})
    player.draw()
    //if (playerImg.x + playerImg.width >=) {}

    if (keys.a.pressed) {
        block.forEach(b => {b.x += 3})
    }
    else if (keys.w.pressed) {
        block.forEach(b => {b.y += 3})
    }
    else if (keys.s.pressed) {
        block.forEach(b => {b.y -= 3})
    }
    else if (keys.d.pressed) {
        block.forEach(b => {b.x -= 3})
    }
}

animate()

window.addEventListener("keydown", (e) => {
    console.log(e.key)
    switch (e.key) {
        case "a":
            keys.a.pressed = true
            break

        case "w":
            keys.w.pressed = true
            break

        case "s":
            keys.s.pressed = true
            break

        case "d":
            keys.d.pressed = true
            break
    }
})

window.addEventListener("keyup", (e) => {
    console.log(e.key)
    switch (e.key) {
        case "a":
            keys.a.pressed = false
            break

        case "w":
            keys.w.pressed = false
            break

        case "s":
            keys.s.pressed = false
            break

        case "d":
            keys.d.pressed = false
            break
    }
})