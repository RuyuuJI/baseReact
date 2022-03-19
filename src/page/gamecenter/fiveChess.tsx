import React, { useCallback, useEffect, useState } from 'react';
import './fiveChess.scss'
import { deepCopy } from '../../tool/fn'
import { person, PersonState } from '../../constants/user';

enum GameState { 'idle', 'ready', 'ing', 'drew', 'win', 'pause' }


export function NineChess() {
    let playerA: person, playerB: person

    playerA = {
        name: '测试仪',
        id: Math.random().toLocaleString(),
        write: 'qin',
        state: PersonState.ready
    }
    playerB = {
        name: '地球仪',
        id: Math.random().toLocaleString(),
        write: 'O',
        state: PersonState.ready
    }

    return (
        <div className="FiveChess">
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
        console.log('cell handleClick', props.c)
        if (!props.c.value) {
            // empty and successful to continue
            props.c.value =
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

function Border(props: { next: Function, gameState: GameState, currentPlayer: person }) {
    type record = { currentPlayer: person, cellList: cell[][] }
    const [cellList, setCellList] = useState<cell[][]>([])
    const [records, setRecords] = useState<record[]>([])
    const BordSize = 50
    const init = useCallback(
        () => {
            const tempCellList = [] as cell[][]
            let i = 0, j = 0
            while (i < (BordSize / 2)) {
                const row = []
                let k = 0
                while (k < (BordSize / 2)) {
                    let c: cell = {
                        value: null, position: j
                    }
                    row.push(c)
                    k++; j++
                }
                tempCellList.push(row)
                i++
            }

            setCellList(tempCellList)
            setRecords([])
        },
        [],
    )
    // game state handler
    useEffect(() => {
        switch (props.gameState) {
            case GameState.drew:
            case GameState.ready:
                init(); break;
            default: break
        }
    }, [init, props.gameState])
    const handlePlacePiece = (position: number) => {
        if (props.gameState !== GameState.ing && props.gameState !== GameState.ready) return
        let y = position % (BordSize / 2)
        let x = Math.floor(position / (BordSize / 2))
        const tempCellList = deepCopy(cellList)
        tempCellList[x][y].value = props.currentPlayer.write
        setCellList(tempCellList)
        // record what happened
        const record = {
            currentPlayer: props.currentPlayer,
            cellList: tempCellList
        }
        const tempRecords = deepCopy(records)
        tempRecords.push(record)
        setRecords(tempRecords)
        if (checkPosition(tempCellList, { x, y })) {
            props.next(GameState.win)
        } else {
            props.next(GameState.ing)
        }

    }
    const checkPosition = useCallback((cellList: cell[][], position: { x: number, y: number }) => {
        let { x, y } = position
        const columCheck = () => {
            let number = 0
            for (let i = Math.max(y - 4, 0); i >= 0 && i <= Math.min(BordSize, y + 4); i++) {
                if (cellList[x]?.[i]?.value === cellList[x][y].value) {
                    number += 1;
                    if (number === 5) {
                        console.log('columCheck')
                        return true
                    }
                } else {
                    number = 0
                }
            }
            return false
        }
        const rowCheck = () => {
            let number = 0
            for (let i = Math.max(x - 4, 0); i >= 0 && i <= Math.min(BordSize, x + 4); i++) {
                if (cellList?.[i][y]?.value === cellList[x][y].value) {
                    number += 1;
                    if (number === 5) {
                        console.log('rowchecked')
                        return true
                    }
                } else {
                    number = 0
                }
            }
            return false
        }
        const xyCheck = () => {
            let number = 0
            for (let i = x - 4, j = y - 4; i <= Math.min(BordSize, y + 4) && j <= Math.min(BordSize, y + 4); i++, j++) {
                if (cellList?.[i]?.[j]?.value === cellList[x][y].value) {
                    number += 1;
                    if (number === 5) {
                        console.log('xyCheck 1')
                        return true
                    }
                } else {
                    number = 0
                }
            }
            for (let i = x - 4, j = y + 4; i <= Math.min(BordSize, y + 4) && j >= Math.max(0, y - 4); i++, j--) {
                if (cellList?.[i]?.[j]?.value === cellList[x][y].value) {
                    number += 1;
                    if (number === 5) {
                        console.log('xyCheck 2')
                        return true
                    }
                } else {
                    number = 0
                }
            }
            return false
        }

        return columCheck() || rowCheck() || xyCheck()
    }, [])


    return (
        <div className="flexbox" >
            <div className="bord" >
                {cellList.map((cellRow, i) => (
                    <div className="border-row" key={i}>
                        {cellRow.map((cell, j) => (
                            <Cell c={cell} key={j}
                                placePiece={(position: number) => handlePlacePiece(position)}></Cell>
                        ))}
                    </div>
                )
                )}
            </div>
            <div className="records" >
                {records.map((record, index) => (
                    <p className="records-record" key={index}>
                        {index + 1 + '、' + record.currentPlayer.name}
                    </p>
                ))}
            </div>
        </div>
    )
}


function Game(props: { players: { A: person, B: person } },) {
    const { players } = props
    const [msg, setMsg] = useState('')
    const [gameState, setGameState] = useState(GameState.idle)
    const [currentPlayer, setPlayer] = useState(players.A)

    // gameState handler
    useEffect(() => {
        let msg = ''
        switch (gameState) {
            case GameState.idle:
                msg = '请开始游戏'
                break;
            case GameState.ready:
                msg = `当前操作：${currentPlayer.name}`
                break;
            case GameState.ing:
                msg = `当前操作：${currentPlayer.name}`
                break;
            case GameState.drew:
                msg = '游戏结束'
                break;
            case GameState.win:
                msg = `winner：${currentPlayer.name}`
                break;

        }
        setMsg(msg)
    }, [gameState, currentPlayer])

    const start = () => {
        if (players['A'].state === PersonState.ready && players['B'].state === PersonState.ready) {
            // players are ready
            // this.state.border.current.init()
            setGameState(GameState.ready)
        } else {
            notice({ msg: 'someone maybe lose attention', from: 'All', to: 'All' })
        }
    }
    // 
    const notice = (params: { msg: string; from: person | string; to: person | string }) => {
        const { msg, from, to } = params
        console.log('msg', msg, from, to);
        setMsg(msg)
    }
    //
    const next = (newGameState: GameState) => {
        const nextplayer = players.A?.name === currentPlayer?.name ? players.B : players.A
        newGameState === GameState.ing && setPlayer(nextplayer);
        setGameState(newGameState)
    }
    //
    const kill = () => {
        setGameState(GameState.drew)
    }
    //
    return (
        <>
            <div className="operation" >
                <span className="operation-btn" onClick={start}>start</span>
                <span className="operation-btn" onClick={kill}>kill</span>
                <span className="operation-show" >
                    {msg}
                </span>
            </div>
            <Border gameState={gameState} currentPlayer={currentPlayer}
                next={next} />
        </>
    )
}
