import React, { Fragment, useEffect, useState } from 'react';
import { Type } from 'typescript';
import { person, PersonState } from '../../../constants/user';
import { arrayRandomSplite, deepCopy, isNull } from '../../../tool/fn';
import { CharacterEnum, Chess, chessList, position } from './chesses';
import './chineseChess.scss'
export enum ElementClassEnum { Chess = 'Chess', Cell = 'Cell', Bord = 'Bord' }

enum GameState { idle, ready, ing, win, aborted }


// cell
class Cell {
    public content: Chess | null = null

    protected position: position
    protected option: { [key: string]: any } = {} // extra option
    // element
    // protected component:
    // function
    constructor(position: position) {
        this.position = position
        this.content = null
    }
    // destory when is eaten
    protected destroyChess() {
        this.content = null
    }
    static Element(cell?: Cell) {
        const x = cell?.position?.x
        const y = cell?.position?.y
        return (
            <div className={`${ElementClassEnum.Cell} ${x + ' ' + y}`} key={x + '-' + y}>
                {
                    cell?.content
                        ? Chess.Element(cell.content)
                        : null}
            </div >
        )
    }
}


const cellrowCreate = () => new Array<Cell>(9)
//  bord
class Bord {
    protected current: { state?: GameState, player?: player, target?: position, pre?: position } // current operation
    public cellList = new Array<ReturnType<typeof cellrowCreate>>(10)
    protected chessList: Array<Chess>
    // void
    protected next: Function
    // 
    constructor(next: Function) {
        this.current = {}
        this.next = next
        for (let y = 0; y < 10; y++) {
            this.cellList[y] = [...cellrowCreate()]
        }
        this.chessList = []
        this.init()
    }
    public changeCurrent(current: { state?: GameState, player?: player, target?: position, pre?: position }) {
        this.current = current
    }
    //init, setup cell and chess
    init() {
        // init all cells
        for (let y = 0; y < this.cellList.length; y++) {
            for (let x = 0; x < this.cellList[y].length; x++) {
                this.cellList[y][x] = new Cell({ x, y })
            }
        }

        // install chess
        this.chessList = deepCopy(chessList)
        // set chess position
        this.chessList.forEach((chess, i) => {
            chess.option.index = i
            const { x, y } = chess.option.defaultPosition
            this.cellList[y][x].content = chess
        })
    }
    // bord bclick
    onClickHandler(e: React.MouseEvent) {
        console.log(e)
        // dispatch action, cahnge cell
        const element = e.target as HTMLDivElement
        const classNames = element?.className.split(' ')
        const type = classNames?.[0]
        const player = this.current?.player
        // per-condition
        console.log(player)
        if (!player) return false
        debugger

        let position: position
        // 
        if (type === ElementClassEnum.Chess) {
            const cell = element.parentElement
            const cellClassNames = cell?.className.split(' ')
            if (!cellClassNames || cellClassNames?.length < 3) return false
            const x = Number(cellClassNames[1])
            const y = Number(cellClassNames[2])
            position = { x, y }
        } else if (type === ElementClassEnum.Cell) {
            const x = Number(classNames[1])
            const y = Number(classNames[2])
            position = { x, y }


        } else {
            // todo more actions
            return false
        }
        //already picked one chess
        if (this.current?.pre?.x && this.current?.pre?.y) {
            const preposition = this.current.pre
            const tempChess = this.cellList[preposition.y][preposition.x].content
            this.cellList[position.y][position.x].content = tempChess

            this.cellList[preposition.y][preposition.x].content = null

            // start to next
            this.next()
        } else if (isNull(this.current?.pre?.x) || isNull(this.current?.pre?.y)) {
            this.current.pre = { ...position }
        }

        //eate chess
        console.dir(element)



    }
    // 
    static ElementFunction() {
        return (bord: Bord) => {
            return (
                <div className={ElementClassEnum.Bord} onClick={e => bord.onClickHandler(e)}>
                    {
                        bord.cellList.map((cellrow, y) => <div key={'cellrow' + y} className="cellrow">
                            {cellrow.map((cell, x) => <Fragment key={'cell' + x}>
                                {Cell.Element(cell)}</Fragment>)}
                        </div>)
                    }
                </div>
            )
        }
    }

}

//  game
type team = { currentIndex: number, list: number[] }
type player = { character?: CharacterEnum } & person
class Game {
    public bord: Bord
    protected count = 0 // count steps

    protected players: player[]
    protected state: GameState = GameState.idle

    protected current: { character: CharacterEnum, player?: player }
    protected characters: { red: team, black: team }

    constructor(persons: person[]) {

        this.players = [...persons]

        this.bord = new Bord(this.next)

        const defaultCharacter = { currentIndex: 0, list: [] }
        this.characters = { red: defaultCharacter, black: defaultCharacter }

        this.current = { character: CharacterEnum.red }
        this.changeCurrentPlayer()
    }
    //  functions
    // init 
    protected init() {
        const result = this.players.find(player => player.state === PersonState.ready)
        if (!result) return false // someone is not ready

        // splite the players random
        const [redPlayers, blackplayers] = arrayRandomSplite(this.players, 2)
        redPlayers.forEach(redplayerIndex => {
            this.players[redplayerIndex].character = CharacterEnum.red
        })
        blackplayers.forEach(blackplayerIndex => {
            this.players[blackplayerIndex].character = CharacterEnum.black
        })
        this.characters = { [CharacterEnum.red]: { currentIndex: 0, list: redPlayers }, [CharacterEnum.black]: { currentIndex: 0, list: blackplayers } }

        // init bord
        this.bord.init()

        // change current player
        this.changeCurrentPlayer()

        // reday to begin
        this.state = GameState.ready
    }

    // change current player
    protected changeCurrentPlayer() {
        const character = this.current.character === CharacterEnum.red ? CharacterEnum.black : CharacterEnum.red
        let index = ++this.characters[character].currentIndex

        // get the next player index
        const indexList = this.characters[character].list
        index = (index + 1) > indexList.length ? 0 : index

        // set the current player
        this.current = { character, player: this.players[indexList[index]] }
        this.bord.changeCurrent({ state: this.state, player: this.current.player })
    }
    // next after every change
    protected next(state: GameState) {
        console.log('next', ++this.count)
        this.state = state
        switch (this.state) {
            case GameState.idle:
                this.init()
                break;
            case GameState.ready:

                break;
            case GameState.ing:
                this.changeCurrentPlayer()
                break;
            case GameState.aborted:

                break;
            case GameState.win:

                break;

            default:
                break;
        }
    }


}
// =======================
const person1: person = { name: '1号选手', id: '123', write: 'one' }
const person2: person = { name: '2号选手', id: '123', write: 'two' }
const game = new Game([person1, person2])
function ChineseChess() {


    const [count, setcount] = useState(1);
    const [currentbord, setCurrentbord] = useState(game.bord);


    // variable
    let BordElement: JSX.Element = Bord.ElementFunction()(currentbord)

    // logic
    const clickStart = () => {
        console.log('click start', count)
        setcount(count => count + 1)
        // setCurrentbord(game.bord)
    }

    return (
        <div className="ChineseChess">
            <div className="operation">
                <span className='start' onClick={clickStart}>start</span>
            </div>
            {BordElement}
        </div>
    )
}

export default ChineseChess