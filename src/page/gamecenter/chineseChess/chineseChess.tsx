import React from 'react';
import { Type } from 'typescript';
import { person, PersonState } from '../../../constants/user';
import { arrayRandomSplite } from '../../../tool/fn';
import { CharacterEnum, Chess, position } from './chesses';
import './chineseChess.scss'
enum GameState { idle, ready, ing, win, aborted }
function ChineseChess() {
    const person1: person = { name: '1号选手', id: '123', write: 'one' }
    const person2: person = { name: '2号选手', id: '123', write: 'two' }
    const game = new Game([person1, person2])
    return (
        <div className="ChineseChess"></div>
    )
}


// cell
class Cell {
    protected position: position
    protected content: Chess | null = null
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
}


const cellrow = new Array<Cell>(9)
//  bord
class Bord {
    protected current: { state?: GameState, player?: person, target?: position, pre?: position } // current operation
    protected cellList = new Array<typeof cellrow>(10)
    protected chessList: Array<Chess>
    // void
    protected next: Function
    // 
    constructor(next: Function) {
        this.current = {}
        this.next = next
        this.chessList = []
    }
    //init, setup cell and chess
    init() {
        // init all cells
        this.cellList.forEach((row, x) => row.forEach((c, y) => {
            c = new Cell({ x, y })
        }))
        // install chess

    }
    // bord bclick
    onClickHandler(position: position) {
        // dispatch action, cahnge cell

        // start to next
        this.next()

    }

}

//  game
type character = { currentIndex: number, list: number[] }
class Game {
    protected players: person[]
    protected state: GameState = GameState.idle
    protected bord: Bord

    protected current: { character: CharacterEnum, player?: person }
    protected characters: { red: character, black: character }

    constructor(players: person[]) {
        this.players = [...players]
        this.bord = new Bord(this.next)

        const defaultCharacter = { currentIndex: 0, list: [] }
        this.characters = { red: defaultCharacter, black: defaultCharacter }

        this.current = { character: CharacterEnum.red }
    }
    //  functions
    // init 
    protected init() {
        const result = this.players.find(player => player.state === PersonState.ready)
        if (!result) return false // someone is not ready

        // splite the players random
        const [redPlayers, blackplayers] = arrayRandomSplite(this.players, 2)
        this.characters = { [CharacterEnum.red]: { currentIndex: 0, list: redPlayers }, [CharacterEnum.black]: { currentIndex: 0, list: blackplayers } }

        // init bord
        // this.bord.init()

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
    }
    // next after every change
    protected next(state: GameState) {
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

export default ChineseChess