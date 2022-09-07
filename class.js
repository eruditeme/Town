class Bounds {
    constructor(x, y) {
        this.x=x
        this.y=y
        this.width = 52.8
        this.height = 52.8
    }

    draw() {
        context.fillStyle = "rgba(255, 0, 0, 0)"
        context.fillRect(this.x, this.y, this.width, this.height)
    }
}

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