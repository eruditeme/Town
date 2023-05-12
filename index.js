const canvas = document.querySelector("canvas");
canvas.width = 1024
canvas.height=576

const context = canvas.getContext("2d")
context.fillStyle = "white"
context.fillRect(0, 0, canvas.width, canvas.height)

const image = new Image()
image.src = "./images/Cozy Game Map.png"
const playerDown = new Image()
playerDown.src = "./images/playerDown.png"
const foreground_img = new Image()
foreground_img.src = "./images/Foreground.png"
const playerLeft = new Image()
playerLeft.src = "./images/playerLeft.png"
const playerRight = new Image()
playerRight.src = "./images/playerRight.png"
const playerUp = new Image()
playerUp.src = "./images/playerUp.png"

const cBlock = []
for (let i = 0; i < collisions.length;  i+=70) {
    cBlock.push(collisions.slice(i, i + 70))
}

const bBlock = []
for (let i = 0; i < battleZones.length;  i+=70) {
    bBlock.push(battleZones.slice(i, i + 70))
}

const boundary = []
cBlock.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol == 2221) {
            boundary.push(new Bounds(j * 52.8, i * 52.8 - 175))
        }
    })
})

const battleZonesBoundary = []

bBlock.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol == 2221) {
            battleZonesBoundary.push(new Bounds(j * 52.8, i * 52.8 - 175))
        }
    })
})

const keys = {
    a:{pressed: false},
    w:{pressed: false},
    s:{pressed: false},
    d:{pressed: false},
}

const background = new Sprite(0, -175, image)
const foreground = new Sprite(0, -175, foreground_img)
const player = new Sprite(canvas.width/2 - 110, canvas.height/2 + 80, playerDown, 4)

//Returns whether key pressed will result in running into a collision block
function rectangularCollision({rect1, rect2}) {
    return (
        rect1.x + rect1.width >= rect2.x &&
        rect1.x <= rect2.x + rect2.width &&
        rect1.y <= rect2.y + rect2.height &&
        rect1.y + rect1.height >= rect2.y
    )
}

const block = [background, ...boundary, foreground, ...battleZonesBoundary]

function animate() {
    window.requestAnimationFrame(animate)
    background.draw()
    boundary.forEach((b) => {
        b.draw()
    })
    battleZonesBoundary.forEach((battleZone) => {
        battleZone.draw()
    })
    player.draw()
    foreground.draw()

    if (keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed) {
        for (let i = 0; i < battleZonesBoundary.length; i++) {
            const battleZone = battleZonesBoundary[i]
            if (rectangularCollision({
                rect1: player,
                rect2: battleZone
            }) && Math.random() < 0.005){
                console.log('collision')
                break
            }
        }
    }

    let moving = true
    player.moving = false
    if (keys.a.pressed) {
        player.img = playerLeft
        player.moving = true
        for (let i = 0; i < boundary.length; i++) {
            const boundaries = boundary[i]
            if (rectangularCollision({rect1: player,
                rect2: {...boundaries, x: boundaries.x + 3, y:boundaries.y}})) {
                moving=false
                break
            }
        }
        if (moving) {
            block.forEach((movable) => {
                movable.x += 3
            })
        }
    } else if (keys.w.pressed) {
        player.img = playerUp
        player.moving = true
        for (let i = 0; i < boundary.length; i++) {
            const boundaries = boundary[i]
            if (rectangularCollision({rect1: player,
                rect2: {...boundaries, x: boundaries.x, y:boundaries.y + 3}})) {
                moving=false
                break
            }
        }
        if (moving) {
            block.forEach((movable) => {
                movable.y += 3         
            })
        }
    } else if (keys.s.pressed) {
        player.img = playerDown
        player.moving = true
        for (let i = 0; i < boundary.length; i++) {
            const boundaries = boundary[i]
            if (rectangularCollision({rect1: player,
                rect2: {...boundaries, x: boundaries.x, y:boundaries.y - 3}})) {
                moving=false
                break
            }
        }
        if (moving) {
            block.forEach((movable) => {
                movable.y -= 3
            })
        }
    } else if (keys.d.pressed) {
        player.img = playerRight
        player.moving = true
        for (let i = 0; i < boundary.length; i++) {
            const boundaries = boundary[i]
            if (rectangularCollision({rect1: player,
                rect2: {...boundaries, x: boundaries.x - 3, y:boundaries.y}})) {
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