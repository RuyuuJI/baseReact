import React, { Fragment, useEffect, useState } from 'react';
import { person, PersonState } from '../../../constants/user';
import { arrayRandomSplite, isNull } from '../../../tool/fn';
import { CharacterEnum, Chess, chessList, position } from './chesses';
import './chineseChess.scss'
export enum ElementClassEnum { Chess = 'Chess', Cell = 'Cell', Bord = 'Bord' }
enum CellStatusEnum { current, placable, default }
enum GameState { idle, ready, change, ing, win, aborted }
enum GameModel { single, team } // two models

type Env = {
    gameModel: GameModel
}
const env: Env = {
    gameModel: GameModel.team
}

// cell
class Cell {
    public content: Chess | null = null
    public type: CharacterEnum
    protected status: CellStatusEnum
    protected position: position
    protected option: { [key: string]: any } = {} // extra option
    // element
    // protected component:
    // function
    constructor(position: position, type: CharacterEnum) {
        this.position = position
        this.content = null
        this.type = type
        this.status = CellStatusEnum.default
    }
    // cell status change
    changeStatus(newStatus: CellStatusEnum) {
        this.status = newStatus
    }
    // destory when is eaten
    protected destroyChess() {
        this.content = null
    }
    static Element(cell: Cell) {
        const x = cell?.position?.x
        const y = cell?.position?.y
        return function Render() {
            return (
                <div className={`${ElementClassEnum.Cell} ${x + ' ' + y} ${cell && CellStatusEnum[cell.status]}`} key={x + '-' + y}>
                    {
                        cell?.content
                            ? Chess.Element(cell.content)
                            : null}
                </div >
            )
        }
    }
}


const cellrowCreate = () => new Array<Cell>(9)
//  bord
export class Bord {
    protected current: { state?: GameState, player?: player, target?: position, pre?: position } // current operation
    public cellList = new Array<ReturnType<typeof cellrowCreate>>(10)
    protected chessList: Array<Chess>
    // void
    protected next: Function
    // 
    constructor(next: (state: GameState) => any) {
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
                const type = y > 4 ? CharacterEnum.black : CharacterEnum.red
                this.cellList[y][x] = new Cell({ x, y }, type)
            }
        }

        // install chess
        // this.chessList = deepCopy(chessList)
        this.chessList = [...chessList]
        // set chess position
        this.chessList.forEach((chess, i) => {
            chess.option.index = i
            const { x, y } = chess.option.defaultPosition
            this.cellList[y][x].content = chess
        })
    }
    // bord bclick
    onClickHandler(e: React.MouseEvent) {
        // dispatch action, cahnge cell
        const element = e.target as HTMLDivElement
        const classNames = element?.className.split(' ')
        const type = classNames?.[0]
        const player = this.current?.player
        // per-condition
        if (!player) return false

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
            if (isNull(this.current.pre?.x) || isNull(this.current.pre?.y)) return false // not move
            const x = Number(classNames[1])
            const y = Number(classNames[2])
            position = { x, y }
        } else {
            // todo more actions
            return false
        }

        // change position
        this.changeChessPosition(position)
        //eate chess
    }
    // change chess position
    changeChessPosition(position: position) {

        //already picked one chess
        if (!isNull(this.current?.pre?.x) && !isNull(this.current?.pre?.y)) {

            const preposition = this.current.pre! // go through not isNUll
            const preCell = this.cellList[preposition.y][preposition.x]
            const tempChess = preCell.content! // go through not isNull
            console.log(tempChess, 'move here', position)
            // toggle chess status when clicked the same chess
            if (preposition.x === position.x && preposition.y === position.y) {
                // clear current
                this.current.pre = undefined
                this.cellList[position.y][position.x].content?.toggleStatus()
            }
            // continue
            // check if is able to move
            // find all the available positions
            const availablePositions = tempChess.rule(this, preposition)
            console.log('availablePositions', availablePositions)
            if (!availablePositions.length) {
                this.next(GameState.ing)
                return false // no place can set chess
            }
            let flag = false // default is no place to set chess
            for (let i = 0; i < availablePositions.length; i++) {
                if (position.x === availablePositions[i].x && position.y === availablePositions[i].y) {
                    flag = true
                    break
                }
            }
            if (flag) {
                // place chess
                this.cellList[position.y][position.x].content = tempChess
                this.cellList[preposition.y][preposition.x].content = null
            } else {
                console.log('// this place is not available')
            }
            // clear current
            this.current.pre = undefined
            this.cellList[position.y][position.x].content?.toggleStatus()
            preCell.changeStatus(CellStatusEnum.default)
            // start to next
            flag ? this.next(GameState.change) : this.next(GameState.ing)
        } else if (isNull(this.current?.pre?.x) || isNull(this.current?.pre?.y)) {
            // 
            const cell = this.cellList[position.y][position.x]
            const tempChess = cell.content
            console.log(tempChess, "pick up current chess", position)
            // pick upchess
            if (!tempChess) return false
            if (!this.checkCurrent(tempChess)) return false
            tempChess.toggleStatus()
            cell.changeStatus(CellStatusEnum.current)
            // set current as pre
            this.current.pre = { ...position }
            this.next(GameState.ing)
        } else {
            console.log('==================error')
        }
    }

    // check current operation is valid 
    checkCurrent(chess: Chess): Boolean {
        let flag = false
        console.log('checkCurrent', chess, this.current.player)
        // only current player can set 
        // I am current player,and my team is current team
        if (env.gameModel === GameModel.single) {
            if (this.current.player && (this.current.player?.character === chess.option.character)) {
                flag = true
            }
        } else if (env.gameModel === GameModel.team) {
            // TODO: 
            if (this.current.player
                && (this.current.player?.character === chess.option.character)
                // && this.current.player === this.current.player)
            ) {
                flag = true
            }
        }
        return flag
    }
    //  render element
    static ElementFunction() {
        const refn = function (bord: Bord) {
            return (
                <div className={ElementClassEnum.Bord} onClick={e => bord.onClickHandler(e)}>
                    {
                        bord.cellList.map((cellrow, y) => <div key={'cellrow' + y} className="cellrow">
                            {cellrow.map((cell, x) => <Fragment key={'cell' + x}>
                                {Cell.Element(cell)()}
                            </Fragment>)}
                        </div>)
                    }
                </div>
            )
        }
        return refn
    }

}

//  game
type team = { currentIndex: number, list: number[] }
type player = { character?: CharacterEnum } & person
class Game {
    public bord: Bord
    public count: number // count steps

    protected players: player[]
    protected state: GameState = GameState.idle

    protected current: { character: CharacterEnum, player?: player }
    protected characters: { red: team, black: team }
    // 
    public updatedcallbacks: Function[] = []
    constructor(persons: person[]) {
        this.count = 0

        this.players = [...persons]
        this.bord = new Bord((state: GameState) => this.next(state))

        const defaultCharacter = { currentIndex: 0, list: [] }
        this.characters = { red: defaultCharacter, black: defaultCharacter }

        this.current = { character: CharacterEnum.red }
        this.init()
    }
    //  functions
    // init 
    protected init() {
        const result = this.players.find(player => player.state === PersonState.ready)
        if (!result) return false // someone is not ready

        // splite the players random
        const [redPlayers, blackplayers] = arrayRandomSplite(this.players, 2)
        console.log(this.players, redPlayers, blackplayers)
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
        index = index >= indexList.length ? 0 : index
        // set the current player
        this.current = { character, player: this.players[indexList[index]] }
        console.log(' this.current', this.current, index, indexList)

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
                break;
            case GameState.change:
                this.changeCurrentPlayer()
                break;
            case GameState.aborted:

                break;
            case GameState.win:

                break;

            default:
                break;
        }
        // 
        this.updatedcallbacks.forEach(fn => {
            fn()
        })
    }
    // add updated callback
    public addUpdatedCallback(fn: Function) {
        if (!fn) return false
        this.updatedcallbacks.push(fn)
    }


}
// =======================
const person1: person = { name: '1号选手', id: '123', write: 'one', state: PersonState.ready }
const person2: person = { name: '2号选手', id: '123', write: 'two', state: PersonState.ready }

const gamedefault = new Game([person1, person2])
function ChineseChess(props: { game?: Game }) {
    const { game = gamedefault } = props

    const [, setcount] = useState(1);
    const [currentbord,] = useState(game.bord);

    // variable
    let BordElement = Bord.ElementFunction()(currentbord)

    // logic
    const clickStart = () => {
        console.log('game start')
        // setCurrentbord(game.bord)
    }
    useEffect(() => {
        game.addUpdatedCallback(() => {
            setcount(count => count + 1)
        })
    })
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