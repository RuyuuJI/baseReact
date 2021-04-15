import React, { useState } from 'react';
import './snakeStyle.scss'
let gamesize = 300, size = 10
enum Direction {ArrowUp ='ArrowUp', ArrowDown = 'ArrowDown', ArrowLeft = 'ArrowLeft', ArrowRight = 'ArrowRight'}
// enum Direction {ArrowUp, ArrowDown}
class Game {
    food = new Food()
    panel = new Panel()
    snake = new Snake()

    private gameState = false
    private timer: any
    constructor() {

    }
    // start the game
    init() {
        document.addEventListener('keydown', this.keydownHandler.bind(this))
        this.gameState = true
        this.loop()
    }
    keydownHandler(e: KeyboardEvent) {
        if (!(Direction as any)[e.key]) return

        this.snake.direction = e.key
        this.snake.move()
        this.checkEat()
    }
    checkEat () {
        const result = this.snake.eat(this.food)
        if (result) {
            this.food.change()
            this.panel.addScore()
        }
    }
    loop () {
        const level = this.panel.level
        const that = this
        if (this.timer) clearInterval(this.timer)
        const time = 300 - (this.panel.level * this.panel.level * 10)
        console.log('time', time)
        this.timer = setInterval(() => {
            // check game state 
            if (!that.snake.isLive) {
                that.gameState = false
                console.log('game over')
            }

            if (!that.gameState) clearInterval(that.timer) // gameover

            // levelup
            if (that.panel.level !== level) {
                that.loop()
            }

            that.snake.move()
            that.checkEat()
        }, time)
    }
}
class Food {
    private element: HTMLElement
    constructor() {
        this.element = document.getElementsByClassName('food')[0] as HTMLElement
        console.log('this.element', this.element)
        this.init()
    }
    init() {
        this.element = document.querySelector('.food')!
    }
    get X() {
        if (!this.element) this.init()
        return this.element.offsetLeft
    }
    get Y() {
        if (!this.element) this.init()
        return this.element.offsetTop
    }
    change() {
        if (!this.element) this.init()
        let bord = document.querySelector('.SnakeGame-game')!
        let width = bord.clientWidth, height = bord.clientHeight
        let top = Math.round(Math.random() * Math.round((height - 10) / 10)) * 10
        let left = Math.round(Math.random() * Math.round((width - 10) / 10)) * 10

        this.element.style.top = top + 'px'
        this.element.style.left = left + 'px'
    }
}
class Panel {
    score: number = 0
    level: number = 1

    fn?: Function
    private hard: number = 10
    init() {
        this.score = 0
        this.level = 1
    }
    addScore() {
        this.score++
        this.fn && this.fn()
        if (this.score % (Math.round(this.hard / 3) + 5) === 0) this.levelUp()
    }
    levelUp() {
        if (this.level < this.hard) this.level++
    }
}
class Snake {
    elements: HTMLCollection
    direction: string
    speed: number = 10
    isLive = true
    constructor() {
        this.direction = Direction.ArrowDown // default
        this.elements = document.getElementsByClassName('snake')
       

    }
    init () {
        this.direction = Direction.ArrowDown // default
        this.isLive = true
    }
    get headPostion () {
        return {
            x: (this.elements[0] as HTMLElement).offsetLeft,
            y: (this.elements[0] as HTMLElement).offsetTop
        }
    }
    liveCheck () {
        let {x, y} = this.headPostion
        if ((x < 0 || x > gamesize - size) || (y < 0 || y > gamesize - size)) this.isLive = false
        for (let i = 1; i < this.elements.length; i++) {
            const body = this.elements[i] as HTMLElement
            if (x === body.offsetLeft && y === body.offsetTop) {
                console.log('crush self')
                this.isLive = false
                return
            }
        }
    }
    move () {
        let {x, y} = this.headPostion
        switch (this.direction) {
            case Direction.ArrowUp:
                y -= 10
                break;
            case Direction.ArrowDown:
                y += 10
                break;
            case Direction.ArrowLeft:
                x -= 10
                break;
            case Direction.ArrowRight:
                x += 10
                break;
            default: break
        }
        const head = this.elements[0] as HTMLElement
        
        for (let i = this.elements.length - 1; i > 0; i--) {
            const body = this.elements[i] as HTMLElement, prebody = this.elements[i - 1] as HTMLElement
            body.style.left = prebody.offsetLeft + 'px'
            body.style.top = prebody.offsetTop + 'px'
        }
        head.style.left = x + 'px'
        head.style.top = y + 'px'
        this.liveCheck()
    }
    grow () {
        let bord = document.querySelector('.SnakeGame-game')!
        const body = this.elements[0].cloneNode()
        bord.appendChild(body)

        console.log('grow')
    }
    eat (food: Food): boolean {
        const result = food.X === this.headPostion.x && food.Y === this.headPostion.y
        if (result) this.grow()
        return result
    }
}
const game = new Game()
game.init()
export default function SnakeGame() {
    
    const { panel, food, snake } = game
    panel.fn = () => Use()
    const [score, level, Use] = usePanel(panel)
    function eat() {
        food.change()
        panel.addScore()
        Use()
    }

    return (
        <div className="SnakeGame" >
            <div className="SnakeGame-game" style={{ width: gamesize, height: gamesize }}>
                <div className="snake"></div>
                <span className="food" style={{ width: size, height: size }} onClick={() => eat()}></span>
            </div>
            <div className="SnakeGame-bord">
                <span>score: {score}</span>
                <span onClick={() => {game.init()}}>restart</span>
                <span>level: {level}</span>
            </div>
        </div>
    )
}
function usePanel(p: Panel): [number, number, Function] {
    let [score, useScore] = useState(p.score)
    let [level, useLevel] = useState(p.level)
    function Use() {
        useLevel(p.level)
        useScore(p.score)
    }
    return [score, level, Use]
}
