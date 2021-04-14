import React from 'react';
import './nineChessStyle.scss'
import { deepCopy } from '../../tool/fn'

enum PersonState { 'ready', 'stop', 'enable' } // the state of the player
enum GameState { 'ready', 'ing', 'drew', 'win', 'pause' }


export function NineChess() {
    let playerA: person, playerB: person
    playerA = {
        name: '测试仪',
        id: Math.random().toLocaleString(),
        write: 'X',
        state: PersonState.ready
    }
    playerB = {
        name: '地球仪',
        id: Math.random().toLocaleString(),
        write: 'O',
        state: PersonState.ready
    }

    return (
        <div className="NineChess">
            <Game players={{ A: playerA, B: playerB }}></Game>
        </div>
    );
}

export default NineChess;

interface cell {
    position: Number
    value?: string | null
}
// cell
function Cell(props: { placePiece: Function, c: cell }) {
    const state = props.c.value || null
    const handleClick = () => {
        if (!props.c.value) {
            // empty and successful to continue
            console.log('cell handleClick', props.c)
            props.placePiece(props.c.position)
        } else {
            // is not useful
            return
        }
    }

    return (
        <span className={`cell ${(state || '')}`}
            onClick={handleClick}>
            {state}
        </span>
    )
}

// bord
class Border extends React.Component
    <{ currentPlayer: person, next: Function, gameState: GameState }, {
        cellList: cell[][],
        records: { currentName: string, cellList: cell[][] }[]
    }>{
    constructor(props: any) {
        super(props)
        this.state = {
            cellList: [],
            records: []
        }
        this.init.bind(this)
        this.handlePlacePiece.bind(this)
    }
    // cell click and handlePlacePiece
    handlePlacePiece(position: number) {
        // game is unenable
        if (this.props.gameState !== GameState.ing && this.props.gameState !== GameState.ready) return false
        // ing
        let place = { x: position - (3 * Math.floor((position / 3))), y: Math.floor(position / 3) }
        const cellList = deepCopy(this.state.cellList)
        cellList[place.y][place.x].value = this.props.currentPlayer.write
        const record = {
            currentName: this.props.currentPlayer.name,
            cellList: cellList
        }
        this.setState({
            cellList,
            records: this.state.records.concat(record)
        }, () => {
            // check state of the current game
            const stop = this.checkPosition()
            if (!stop && this.state.records.length === 9) {
                // no cell left && nobldy win, stop the game
                this.props.next({ stop: true, gameState: GameState.drew })
            } else {
                this.props.next({ stop, gameState: stop ? GameState.win : GameState.ing })
            }
        })

    }
    componentDidMount() {
        this.init()
    }
    // check the current
    checkPosition = () => {
        const { cellList } = this.state
        const strategy1 = () => cellList[0][0].value && (
            (cellList[0][0].value === cellList[1][0].value && cellList[1][0].value === cellList[2][0].value)
            || (cellList[0][0].value === cellList[0][1].value && cellList[0][1].value === cellList[0][2].value)
            || (cellList[0][0].value === cellList[1][1].value && cellList[1][1].value === cellList[2][2].value)
        )
        const strategy2 = () => cellList[1][1].value && (
            (cellList[1][0].value === cellList[1][1].value && cellList[1][1].value === cellList[1][2].value)
            || (cellList[0][1].value === cellList[1][1].value && cellList[1][1].value === cellList[2][1].value)
            || (cellList[0][2].value === cellList[1][1].value && cellList[1][1].value === cellList[2][0].value)
        )
        const strategy3 = () => cellList[2][2].value && (
            (cellList[2][0].value === cellList[2][2].value && cellList[2][2].value === cellList[2][1].value)
            || (cellList[0][2].value === cellList[2][2].value && cellList[2][2].value === cellList[1][2].value)
        )
        return strategy1() || strategy2() || strategy3() || false
    }
    // init the bord
    init() {
        const cellList = []
        let i = 0, j = 0
        while (i < 3) {
            const row = []
            let k = 0
            while (k < 3) {
                let c: cell = {
                    value: null, position: j
                }
                row.push(c)
                k++; j++
            }
            cellList.push(row)
            i++
        }
        console.log('ninechess init', cellList)
        this.setState({
            cellList,
            records: []
        })
    }

    render() {
        return (
            <div className="flexbox" >
                <div className="bord" >
                    {this.state.cellList.map((cellRow, i) => (
                        <div className="border-row" key={i}>
                            {cellRow.map((cell, j) => (
                                <Cell c={cell} key={j}
                                    placePiece={(position: number) => this.handlePlacePiece(position)}></Cell>
                            ))}
                        </div>
                    )
                    )}
                </div>
                <div className="records" >
                    {this.state.records.map((record, index) => (
                        <p className="records-record" key={index}>
                            {index + 1 + '、' + record.currentName}
                        </p>
                    ))}
                </div>
            </div>
        )
    }
}

// the player of game
interface person {
    name: string
    id: string
    write: string
    state: PersonState
}
class Game extends React.Component
    <{ players: { A: person, B: person } },
    { border: any, currentPlayer: 'A' | 'B', gameState: GameState }>{
    constructor(props: any) {
        super(props)
        this.state = {
            currentPlayer: 'A',
            border: React.createRef(),
            gameState: GameState.pause
        }
        this.start.bind(this)
        this.notice.bind(this)
    }
    start = () => {
        console.log('start the game', this.state.border)
        const { players } = this.props
        if (players['A'].state === PersonState.ready && players['B'].state === PersonState.ready) {
            // players are ready
            this.state.border.current.init()
            this.setState({
                gameState: GameState.ready
            })
        } else {
            this.notice({ msg: 'someone maybe lose attention', from: 'All', to: 'All' })
        }
    }
    // send the msg to player
    notice = (params: { msg: String; from: person | string; to: person | string }) => {
        const { msg, from, to } = params
        console.log('msg', msg, from, to);
    }
    // kill the game
    kill = () => {
        this.setState({
            gameState: GameState.pause
        }, () => {
            this.state.border.current.init()
            console.log('kill the game')
        })
    }
    // after one player place his step
    next = (params: { stop: boolean, gameState: GameState }) => {
        // change player
        const { stop, gameState } = params
        if (stop) {
            // gameover
            console.log('result', gameState)
            this.setState({
                gameState
            })
        } else {
            // continue and change the player
            this.setState({
                currentPlayer: this.state.currentPlayer === 'A' ? 'B' : 'A'
            })

        }
    }
    render() {
        const currentPlayer = this.props.players[this.state.currentPlayer]
        let msg = ''
        switch (this.state.gameState) {
            case GameState.pause:
                msg = '请开始游戏'
                break;
            case GameState.ready:
            case GameState.ing:
                msg = `当前操作：${currentPlayer.name}`
                break;
            case GameState.drew:
                msg = '平局'
                break;
            case GameState.win:
                msg = `winner：${currentPlayer.name}`
                break;
        }
        return (
            <>
                <div className="operation" >
                    <span className="operation-btn" onClick={this.start}>start</span>
                    <span className="operation-btn" onClick={this.kill}>kill</span>
                    <span className="operation-show" >
                        {msg}
                    </span>
                </div>
                <Border currentPlayer={currentPlayer} gameState={this.state.gameState}
                    next={this.next} ref={this.state.border} />
            </>
        )
    }
}
