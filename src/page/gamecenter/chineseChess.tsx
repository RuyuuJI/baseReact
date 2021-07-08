import React from 'react';
import { person } from '../../constants/user';
import { arrayRandomSplite } from '../../tool/fn';
import './chineseChess.scss'
enum GameState { idle, ready, ing, win, aborted }

function ChineseChess() {
    return (
        <div className="ChineseChess"></div>
    )
}
class Bord {

}
type character = { currentIndex: number, list: number[] }
class Game {
    protected players: [person]
    protected state: GameState = GameState.idle
    protected Bord: Bord


    protected characters: { red: character, black: character }

    constructor(players: [person]) {
        this.players = [...players]
        this.Bord = new Bord()

        const [redPlayers, blackplayers] = arrayRandomSplite(this.players, 2)
        this.characters = { red: { currentIndex: 0, list: redPlayers }, black: { currentIndex: 0, list: blackplayers } }
    }
}

export default ChineseChess