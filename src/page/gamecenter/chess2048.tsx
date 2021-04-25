import React from 'react';
import './chess2048Style.scss'
enum Direction { ArrowUp = 'ArrowUp', ArrowDown = 'ArrowDown', ArrowLeft = 'ArrowLeft', ArrowRight = 'ArrowRight' }

class Game {
    matix: Matrix

    constructor () {
        this.matix = new Matrix()
    }
    init() {
        
    }
}
const game = new Game()

class Matrix {
    values: number[]

    constructor() {
        this.values = new Array(16)
    }
    init() {
        this.values = new Array(16)
    }
    // generate the little number
    generate (direction: Direction) {
        let position = this.randomPosition(direction)
        this.values[position] = 2
    }
    // the postions can be used
    randomPosition(direction: Direction) {
        let row = 1, column = 1, positions = []
        let currentIndex = 0
        switch (direction) {
            case Direction.ArrowUp:
                while (column <= 4) {
                    currentIndex = Matrix.GetValueIndex(row, column)
                    if (!this.values[currentIndex]) positions.push(currentIndex)
                }
                break;
            case Direction.ArrowDown:
                row = 4
                while (column <= 4) {
                    currentIndex = Matrix.GetValueIndex(row, column)
                    if (!this.values[currentIndex]) positions.push(currentIndex)
                }
                break;
            case Direction.ArrowLeft:
                while (row <= 4) {
                    currentIndex = Matrix.GetValueIndex(row, column)
                    if (!this.values[currentIndex]) positions.push(currentIndex)
                }
                break;
            case Direction.ArrowRight:
                column = 4
                while (row <= 4) {
                    currentIndex = Matrix.GetValueIndex(row, column)
                    if (!this.values[currentIndex]) positions.push(currentIndex)
                }
                break;
        }
        currentIndex = positions[Math.round(Math.random() * (positions.length - 1))]
        return currentIndex
    }

    static GetValueIndex(x: number, y: number): number {
        x--; y--;
        return x + (y * 4)
    }
}


export default class Chess2048 extends React.Component<{}, {
    values: number[]
}>{
    componentDidMount() {
        this.update()
    }
    constructor(props: any) {
        super(props)
        this.state = {
            values: game.matix.values
        }
    }
    update() {
        game.matix.generate(Direction.ArrowLeft)
        this.setState({
            values: game.matix.values
        })
    }
    render() {
        const { values } = this.state
        return (
            <div className="Chess2048">
                <div className="bord">
                    {values.map((value: number, index: number) => (
                        <div className="cell" key={index}>{value && value}</div>
                    ))}
                </div>
            </div>
        )
    }
}