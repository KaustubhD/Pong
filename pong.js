class Vector {
	constructor(x = 0, y = 0) {
		this.x = x
		this.y = y
	}
}

class Rect {
	constructor(w, h) {
		this.pos = new Vector()
		this.size = new Vector(w, h)
	}
	// Getters for respective edges
	get left() {
		return this.pos.x - this.size.x / 2
	}
	get right() {
		return this.pos.x + this.size.x / 2
	}
	get top() {
		return this.pos.y - this.size.y / 2
	}
	get bottom() {
		return this.pos.y + this.size.y / 2
	}
}

class Ball extends Rect {
	constructor() {
		super(10, 10)
		this.velocity = new Vector()
	}
}

class Pong {
	constructor(canvas) {
		this.canvas = canvas
		this.ctx = canvas.getContext('2d')

		this.ball = new Ball()

		this.ball.pos.x = 10
		this.ball.pos.y = 10
		this.ball.velocity.x = 100
		this.ball.velocity.y = 100
		let lastTime
		let animationFrame
		const callAnimate = mil => {
			if (lastTime) this.update((mil - lastTime) / 1000)
			lastTime = mil
			// update(0.01) // Making time difference almost same as above three lines
			animationFrame = requestAnimationFrame(callAnimate)
		}
		callAnimate()
  }

  draw(){
    this.ctx.fillStyle = '#000'
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    
    this.drawRect(this.ball)
  }
  
  drawRect(rect){
    this.ctx.fillStyle = '#fff'
		this.ctx.fillRect(
			rect.pos.x,
			rect.pos.y,
			rect.size.x,
			rect.size.y
		)
  }

	update(diff) {
		this.ball.pos.x += this.ball.velocity.x * diff
		this.ball.pos.y += this.ball.velocity.y * diff

		if (this.ball.left < 0 || this.ball.right > this.canvas.width)
			this.ball.velocity.x *= -1
		if (this.ball.top < 0 || this.ball.bottom > this.canvas.height)
			this.ball.velocity.y *= -1

		this.draw()
	}
}

const canvas = document.getElementById('canvas')

const pong = new Pong(canvas)

//callAnimate()
