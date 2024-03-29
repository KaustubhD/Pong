class Vector {
	constructor(x = 0, y = 0) {
		this.x = x
		this.y = y
  }
  get len(){
    return Math.sqrt(this.x ** 2 + this.y ** 2)
  }
  set len(val){
    const factor = val / this.len
    this.x *= factor
    this.y *= factor
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

class Player extends Rect{
  constructor(){
    super(20, 100)
    this.score = 0
  }

}

let animationFrame

class Pong {
	constructor(canvas) {
		this.canvas = canvas
		this.ctx = canvas.getContext('2d')

		this.ball = new Ball()
    
    this.players = [new Player, new Player]

    this.players[0].pos.x = 40
    this.players[1].pos.x = this.canvas.width - 40
    this.players.forEach(pl => pl.pos.y = this.canvas.height / 2)

		let lastTime
		const callAnimate = mil => {
			if (lastTime) this.update((mil - lastTime) / 1000)
			lastTime = mil
			// update(0.01) // Making time difference almost same as above three lines
			animationFrame = requestAnimationFrame(callAnimate)
		}
    callAnimate()
    
    const NUMBER_SIZE = 10
    const NUMBER_WIDTH = 3     // Number is 3 blocks wide
    const NUMBER_HEIGHT = 5    //  and 5 blocks long
    this.numbers = [
      '111101101101111',
      '010010010010010',
      '111001111100111',
      '111001111001111',
      '100101111001001',
      '111100111001111',
      '111100111101111',
      '111001001001001',
      '111101111101111',
      '111101111001111',
    ].map(num => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      canvas.width = NUMBER_SIZE * NUMBER_WIDTH
      canvas.height = NUMBER_SIZE * NUMBER_HEIGHT
      
      ctx.fillStyle = '#fff'

      num.split('').forEach((bit, i) => {
        if(bit == 1){
          ctx.fillRect((i % NUMBER_WIDTH) * NUMBER_SIZE,
                       Math.floor(i / NUMBER_WIDTH) * NUMBER_SIZE,
                       NUMBER_SIZE,
                       NUMBER_SIZE)
        }
      })
      return canvas
    })


    this.reset()
  }

  collide(player, ball){
    /*
    *  X increases ➡️
    *  Y increases downwards ⬇️
    */
    if(player.left < ball.right && player.right > ball.left && player.bottom > ball.top && player.top < ball.bottom){
      ball.velocity.x *= -1
      ball.velocity.len *= 1.05
    }
  }
  draw(){
    this.ctx.fillStyle = '#000'
    this.ctx.strokeStyle = '#fff'
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    
    this.drawRect(this.ball)

    this.players.forEach(pl => this.drawRect(pl))

    this.drawScore()
  }
  
  drawRect(rect){
    this.ctx.fillStyle = '#fff'
		this.ctx.fillRect(
			rect.left,
			rect.top,
			rect.size.x,
			rect.size.y
		)
  }

  drawScore(){
    this.players.forEach((player, i) => {
      const digits = String(player.score).split('')
      const digitWidthWithPadding = this.numbers[0].width + 5
      const leftOffset = ((i+1) * (this.canvas.width / 3)) - ((digits.length * digitWidthWithPadding) / 2)
      digits.forEach((dig, index) =>{
        this.ctx.drawImage(this.numbers[Number(dig)], leftOffset + (index * digitWidthWithPadding), 20)
      })
    })
  }

  reset(){
    // Game will start on mouse click
    this.ball.pos.x = this.canvas.width / 2
		this.ball.pos.y = this.canvas.height / 2
		this.ball.velocity.x = 0 
    this.ball.velocity.y = 0
  }

  start(){
    if(this.ball.velocity.x == 0 && this.ball.velocity.y == 0){
      this.ball.velocity.x = 200 * (Math.random() > 0.5 ? -1 : 1) // Determines the direction
      this.ball.velocity.y = 200 * (Math.random() * 2 - 1) // Determines the magnitude
      this.ball.velocity.len = 250
    }
  }

	update(diff) {
		this.ball.pos.x += this.ball.velocity.x * diff
		this.ball.pos.y += this.ball.velocity.y * diff

    if (this.ball.left < 0 || this.ball.right > this.canvas.width){
      // In case ball hits left wall i.e with negative x velocity, player 1 scores. And vice versa
      const scoringPlayer = Number(this.ball.velocity.x < 0)
      this.players[scoringPlayer].score++
      this.reset()
    }
		if (this.ball.top < 0 || this.ball.bottom > this.canvas.height)
			this.ball.velocity.y *= -1

    this.players[1].pos.y = this.ball.pos.y

    this.players.forEach(pl => this.collide(pl, this.ball))
		this.draw()
	}
}

const canvas = document.getElementById('canvas')
canvas.height = Math.min(document.body.clientHeight, 500)
canvas.width = canvas.height * 3 / 2  // Aspect ratio 3:2  (width : height)

const pong = new Pong(canvas)


canvas.addEventListener('mousemove', ev => {
   pong.players[0].pos.y = ev.offsetY
})
canvas.addEventListener('click', ev => {
  pong.start()
})