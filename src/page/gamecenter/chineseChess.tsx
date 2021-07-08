import React from 'react';
import { person, PersonState } from '../../constants/user';
import { arrayRandomSplite } from '../../tool/fn';
import './chineseChess.scss'
enum GameState { idle, ready, ing, win, aborted }

function ChineseChess() {
    return (
        <div className="ChineseChess"></div>
    )
}

//  bord
class Bord {


}

//  game
type character = { currentIndex: number, list: number[] }
class Game {
    protected players: person[]
    protected state: GameState = GameState.idle
    protected bord: Bord

    protected current: { character: 'red' | 'black', player?: person }
    protected characters: { red: character, black: character }

    constructor(players: person[]) {
        this.players = [...players]
        this.bord = new Bord()

        const defaultCharacter = { currentIndex: 0, list: [] }
        this.characters = { red: defaultCharacter, black: defaultCharacter }

        this.current = { character: 'red' }
    }
    //  functions
    // init 
    protected init() {
        const result = this.players.find(player => player.state === PersonState.ready)
        if (!result) return false // someone is not ready

        // splite the players random
        const [redPlayers, blackplayers] = arrayRandomSplite(this.players, 2)
        this.characters = { red: { currentIndex: 0, list: redPlayers }, black: { currentIndex: 0, list: blackplayers } }
        this.cur

        // init bord
        // this.bord.init()

        // change current player
        this.changeCurrentPlayer()
    }

    // change current player
    protected changeCurrentPlayer() {
        const character = this.current.character === 'red' ? 'black' : 'red'
        let index = ++this.characters[character].currentIndex

        // get the next player index
        const indexList = this.characters[character].list
        index = (index + 1) > indexList.length ? 0 : index

        // set the current player
        this.current = { character, player: this.players[indexList[index]] }
    }

}

export default ChineseChess