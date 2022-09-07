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
const foreground_img = new Image()
foreground_img.src = "./images/Foreground.png"

const cBlock = []
for (let i = 0; i < collisions.length;  i+=70) {
    cBlock.push(collisions.slice(i, i + 70))

}

const boundary = []

cBlock.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol == 2221) {
            boundary.push(new Bounds(j * 52.8, i * 52.8 - 175))
        }
    })
})


const background = new Sprite(0, -175, image)
const foreground = new Sprite(0, -175, foreground_img)
const player = new Sprite(canvas.width/2 - 110, canvas.height/2 + 80, playerImg, 4)

const keys = {
    a:{pressed: false},
    w:{pressed: false},
    s:{pressed: false},
    d:{pressed: false},
}

function right(pc, blockk, block_x, block_y) {
    return (
        pc.x + pc.width >= block_x &&
        pc.x <= block_x + blockk.width &&
        pc.y <= block_y + blockk.height &&
        pc.y + pc.height >= block_y
    )
}

const block = [background, ...boundary, foreground]

function rectangularCollision({rect1, rect2}) {
    return (
        rect1.x + rect1.width >= rect2.x &&
        rect1.x <= rect2.x + rect2.width &&
        rect1.y <= rect2.y + rect2.height &&
        rect1.y + rect1.height >= rect2.y
    )
}

function animate() {
    window.requestAnimationFrame(animate)
    background.draw()
    boundary.forEach((b) => {
        b.draw()
    })
    player.draw()
    foreground.draw()

    if (keys.a.pressed) {
        let moving = true
        for (let i = 0; i < boundary.length; i++) {
            const boundaries = boundary[i]
            if (rectangularCollision({rect1: player, rect2: {...boundaries, x: boundaries.x + 3, y:boundaries.y}})) {
                console.log("colliding")
                moving=false
                break
            }
        }
        if (moving) {
            block.forEach((movable) => {
                movable.x += 3
            })
        }
    }
    else if (keys.w.pressed) {
        let moving = true
        for (let i = 0; i < boundary.length; i++) {
            const boundaries = boundary[i]
            if (rectangularCollision({rect1: player, rect2: {...boundaries, x: boundaries.x, y:boundaries.y + 3}})) {
                console.log("colliding")
                moving=false
                break
            }
        }
        if (moving) {
            block.forEach((movable) => {
                movable.y += 3         
            })
        }
    }
    else if (keys.s.pressed) {
        let moving = true
        for (let i = 0; i < boundary.length; i++) {
            const boundaries = boundary[i]
            if (rectangularCollision({rect1: player, rect2: {...boundaries, x: boundaries.x, y:boundaries.y - 3}})) {
                console.log("colliding")
                moving=false
                break
            }
        }
        if (moving) {
            block.forEach((movable) => {
                movable.y -= 3
            })
        }
    }
    else if (keys.d.pressed) {
        let moving = true
        for (let i = 0; i < boundary.length; i++) {
            const boundaries = boundary[i]
            if (rectangularCollision({rect1: player, rect2: {...boundaries, x: boundaries.x - 3, y:boundaries.y}})) {
                console.log("colliding")
                moving=false
                break
            }
        }
        if (moving) {
            block.forEach((movable) => {
                movable.x -= 3
            })
        }
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