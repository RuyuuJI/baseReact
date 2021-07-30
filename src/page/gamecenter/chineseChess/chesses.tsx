import { isNull } from "../../../tool/fn"
import { Bord, ElementClassEnum } from "./chineseChess"

export enum CharacterEnum { red = 'red', black = 'black' }
export enum ChessTypeEnum { boss, soldier, staff, elephant, rider, cannon, car }
export enum ChessStatusEnum { up, down }
export interface position { x: number, y: number }

class ChessType {
    public option: { defaultPosition: position, character: CharacterEnum, [key: string]: any } // extra option
    public text: string

    public rule: Function
    protected type: ChessTypeEnum
    protected price: number = 0
    constructor(type: ChessTypeEnum, { defaultPosition = { x: 0, y: 0 }, character = CharacterEnum.red }) {
        this.type = type
        this.text = ''
        this.rule = () => { }
        this.option = {
            defaultPosition,
            character
        }
    }
    // init rule and price
    static init(chess: ChessType) {
        const character = chess.option.character
        let textmap = {
            [CharacterEnum.red]: '无',
            [CharacterEnum.black]: '有'
        }
        switch (chess.type) {
            case ChessTypeEnum.boss:
                //  add move rule
                chess.rule = (bord: Bord, chessPosition: position): position[] => {
                    const move = [
                        { x: 1, y: 0 }, // move right
                        { x: 0, y: 1 }, // move down
                        { x: 0, y: -1 }, // move top
                        { x: -1, y: 0 }, // move left
                    ]
                    const availableMove = move.filter(way => {
                        const result = {
                            x: chessPosition.x + way.x,
                            y: chessPosition.y + way.y
                        }
                        const cell = bord.cellList?.[result.y]?.[result.x]
                        if (cell?.content?.option?.character === character) return false
                        if (Math.abs(result.x - chess.option.defaultPosition.x) > 1) return false // over row
                        if (character === CharacterEnum.red && (result.y < chess.option.defaultPosition.y || (result.y - chess.option.defaultPosition.y) > 2)) return false // over colum
                        if (character === CharacterEnum.black && (result.y > chess.option.defaultPosition.y || (chess.option.defaultPosition.y - result.y) > 2)) return false // over colum
                        return true
                    })
                    // return available position
                    availableMove.forEach(result => {
                        result.x = chessPosition.x + result.x
                        result.y = chessPosition.y + result.y
                    })
                    return availableMove
                }
                // write text
                textmap = {
                    [CharacterEnum.red]: '帅',
                    [CharacterEnum.black]: '将'
                }
                chess.text = textmap[character]
                break;
            case ChessTypeEnum.soldier:
                chess.rule = () => { }
                textmap = {
                    [CharacterEnum.red]: '兵',
                    [CharacterEnum.black]: '卆'
                }
                chess.text = textmap[character]
                // move rule
                chess.rule = (bord: Bord, chessPosition: position): position[] => {
                    const move = character === CharacterEnum.red
                        ? (
                            chessPosition.y - chess.option.defaultPosition.y >= 2
                                ? [
                                    { x: 1, y: 0 }, // move right
                                    { x: 0, y: 1 }, // move down
                                    { x: -1, y: 0 }, // move left
                                ]
                                : [
                                    { x: 0, y: 1 }, // move down
                                ]
                        )
                        : (chess.option.defaultPosition.y - chessPosition.y >= 2)
                            ? [
                                { x: 1, y: 0 }, // move right
                                { x: 0, y: -1 }, // move up
                                { x: -1, y: 0 }, // move left
                            ]
                            : [
                                { x: 0, y: -1 }, // move up
                            ]
                    const availableMOve: position[] = []
                    move.forEach(way => {
                        const result = {
                            x: way.x + chessPosition.x,
                            y: way.y + chessPosition.y
                        }
                        const cell = bord.cellList?.[result.y]?.[result.x]
                        if (cell?.content?.option?.character !== character) {
                            if (character === CharacterEnum.red
                                && (result.x >= 0 && result.x <= 8)
                                && (result.y <= 9 && result.y >= chess.option.defaultPosition.y)) availableMOve.push(result)
                            if (character === CharacterEnum.black
                                && (result.x >= 0 && result.x <= 8)
                                && (result.y >= 0 && result.y <= chess.option.defaultPosition.y)) availableMOve.push(result)

                        }
                    })
                    return availableMOve
                }
                break;
            case ChessTypeEnum.staff:
                chess.rule = () => { }
                textmap = {
                    [CharacterEnum.red]: '士',
                    [CharacterEnum.black]: '侍'
                }
                chess.text = textmap[character]
                // move rule
                chess.rule = (bord: Bord, chessPosition: position): position[] => {
                    const move = [
                        { x: 1, y: 1 }, // move right
                        { x: 1, y: -1 }, // move down
                        { x: -1, y: 1 }, // move top
                        { x: -1, y: -1 }, // move left
                    ]
                    const availableMOve: position[] = []
                    move.forEach(way => {
                        const result = {
                            x: way.x + chessPosition.x,
                            y: way.y + chessPosition.y
                        }
                        const cell = bord.cellList?.[result.y]?.[result.x]
                        if (cell?.content?.option?.character !== character) {
                            if (character === CharacterEnum.red
                                && (result.x >= 3 && result.x <= 5)
                                && (result.y >= 0 && result.y <= 2)) availableMOve.push(result)
                            if (character === CharacterEnum.black
                                && (result.x >= 3 && result.x <= 5)
                                && (result.y >= 7 && result.y <= 9)) availableMOve.push(result)
                        }
                    })
                    return availableMOve
                }
                break;
            case ChessTypeEnum.elephant:
                chess.rule = () => { }
                textmap = {
                    [CharacterEnum.red]: '相',
                    [CharacterEnum.black]: '🐘'
                }
                chess.text = textmap[character]
                // move rule
                chess.rule = (bord: Bord, chessPosition: position): position[] => {
                    const move = [
                        {
                            x: 2, y: 2, blockPosition: { x: 1, y: 1 }
                        }, // move right
                        { x: 2, y: -2, blockPosition: { x: 1, y: -1 } }, // move down
                        { x: -2, y: 2, blockPosition: { x: -1, y: 1 } }, // move top
                        { x: -2, y: -2, blockPosition: { x: -1, y: -1 } }, // move left
                    ]
                    const availableMOve: position[] = []
                    move.forEach(way => {
                        const result = {
                            x: way.x + chessPosition.x,
                            y: way.y + chessPosition.y
                        }
                        const cell = bord.cellList?.[result.y]?.[result.x]
                        if (cell?.content?.option?.character !== character) {
                            if (bord.cellList?.[way.blockPosition.y + chessPosition.y]?.[way.blockPosition.x + chessPosition.x]?.content === null) {
                                if (character === cell?.type) availableMOve.push(result) // only move in own country
                            }
                        }
                    })
                    return availableMOve
                }
                break;
            case ChessTypeEnum.rider:
                chess.rule = () => { }
                textmap = {
                    [CharacterEnum.red]: '🐎',
                    [CharacterEnum.black]: '马'
                }
                chess.text = textmap[character]
                // move rule
                chess.rule = (bord: Bord, chessPosition: position): position[] => {
                    const move = [
                        { x: 2, y: 1, blockPosition: { x: 1, y: 0 } },
                        { x: 2, y: -1, blockPosition: { x: 1, y: 0 } },
                        { x: 1, y: 2, blockPosition: { x: 0, y: 1 } },
                        { x: 1, y: -2, blockPosition: { x: 0, y: -1 } },
                        { x: -1, y: 2, blockPosition: { x: 0, y: 1 } },
                        { x: -1, y: -2, blockPosition: { x: 0, y: -1 } },
                        { x: -2, y: 1, blockPosition: { x: -1, y: 0 } },
                        { x: -2, y: -1, blockPosition: { x: -1, y: 0 } },
                    ]
                    const availableMOve: position[] = []
                    move.forEach(way => {
                        const result = {
                            x: way.x + chessPosition.x,
                            y: way.y + chessPosition.y
                        }
                        if (bord.cellList?.[result.y]?.[result.x]?.content?.option.character !== character) {
                            // and no block chess
                            const blockCell = bord.cellList?.[way.blockPosition.y + chessPosition.y]?.[way.blockPosition.x + chessPosition.x]
                            if (blockCell?.content === null) {
                                availableMOve.push(result)
                            }
                        }
                    })
                    return availableMOve
                }
                break;

            case ChessTypeEnum.cannon:
                chess.rule = () => { }
                textmap = {
                    [CharacterEnum.red]: '仗',
                    [CharacterEnum.black]: '炮'
                }
                chess.text = textmap[character]
                // move rule
                chess.rule = (bord: Bord, chessPosition: position): position[] => {
                    const availableMOve: position[] = []
                    {
                        // // right move
                        let i = chessPosition.x + 1
                        while (i <= 8 && bord.cellList?.[chessPosition.y]?.[i]?.content === null) {
                            availableMOve.push({
                                x: i,
                                y: chessPosition.y
                            })
                            i++;
                        }
                        if (i <= 8) {
                            for (let j = i + 1; j <= 8; j++) {
                                let cell = bord.cellList?.[chessPosition.y]?.[j]
                                if (cell?.content && cell.content?.option.character !== character) {
                                    availableMOve.push({
                                        x: j,
                                        y: chessPosition.y
                                    })
                                    break
                                }
                            }
                        }
                    }
                    {
                        // left move
                        let i = chessPosition.x - 1
                        while (i >= 0 && bord.cellList?.[chessPosition.y]?.[i]?.content === null) {
                            availableMOve.push({
                                x: i,
                                y: chessPosition.y
                            })
                            i--;
                        }
                        if (i >= 0) {
                            for (let j = i - 1; j >= 0; j--) {
                                let cell = bord.cellList?.[chessPosition.y]?.[j]
                                if (cell?.content && cell.content?.option.character !== character) {
                                    availableMOve.push({
                                        x: j,
                                        y: chessPosition.y
                                    })
                                    break
                                }
                            }
                        }
                    }
                    {
                        // // top move
                        let i = chessPosition.y - 1
                        while (i >= 0 && bord.cellList?.[i]?.[chessPosition.x]?.content === null) {
                            availableMOve.push({
                                y: i,
                                x: chessPosition.x
                            })
                            i--;
                        }
                        if (i >= 0) {
                            for (let j = i - 1; j >= 0; j--) {
                                let cell = bord.cellList?.[j]?.[chessPosition.x]
                                if (cell?.content && cell.content?.option.character !== character) {
                                    availableMOve.push({
                                        y: j,
                                        x: chessPosition.x
                                    })
                                    break
                                }
                            }
                        }
                    }
                    {
                        // down move
                        let i = chessPosition.y + 1
                        while (i <= 9 && bord.cellList?.[i]?.[chessPosition.x]?.content === null) {
                            availableMOve.push({
                                y: i,
                                x: chessPosition.x
                            })
                            i++;
                        }
                        if (i <= 9) {
                            for (let j = i + 1; j <= 9; j++) {
                                let cell = bord.cellList?.[j]?.[chessPosition.x]
                                if (cell?.content && cell.content?.option.character !== character) {
                                    availableMOve.push({
                                        y: j,
                                        x: chessPosition.x
                                    })
                                    break
                                }
                            }
                        }
                    }

                    return availableMOve
                }
                break;
            case ChessTypeEnum.car:
                chess.rule = () => {

                }
                textmap = {
                    [CharacterEnum.red]: '🚗',
                    [CharacterEnum.black]: '车'
                }
                chess.text = textmap[character]
                // move rule
                chess.rule = (bord: Bord, chessPosition: position): position[] => {
                    const availableMOve: position[] = []
                    {
                        // // right move
                        let i = chessPosition.x + 1
                        while (i <= 8 && bord.cellList?.[chessPosition.y]?.[i]?.content === null) {
                            availableMOve.push({
                                x: i,
                                y: chessPosition.y
                            })
                            i++;
                        }
                        if (i <= 8 && bord.cellList?.[chessPosition.y]?.[i]?.content?.option.character !== character) {
                            availableMOve.push({
                                x: i,
                                y: chessPosition.y
                            })
                        }
                    }
                    {
                        // left move
                        let i = chessPosition.x - 1
                        while (i >= 0 && bord.cellList?.[chessPosition.y]?.[i]?.content === null) {
                            availableMOve.push({
                                x: i,
                                y: chessPosition.y
                            })
                            i--;
                        }
                        if (i >= 0 && bord.cellList?.[chessPosition.y]?.[i]?.content?.option.character !== character) {
                            availableMOve.push({
                                x: i,
                                y: chessPosition.y
                            })
                        }
                    }
                    {
                        // // top move
                        let i = chessPosition.y - 1
                        while (i >= 0 && bord.cellList?.[i]?.[chessPosition.x]?.content === null) {
                            availableMOve.push({
                                y: i,
                                x: chessPosition.x
                            })
                            i--;
                        }
                        if (i >= 0 && bord.cellList?.[i]?.[chessPosition.x]?.content?.option.character !== character) {
                            availableMOve.push({
                                y: i,
                                x: chessPosition.x
                            })
                        }
                    }
                    {
                        // down move
                        let i = chessPosition.y + 1
                        while (i <= 9 && bord.cellList?.[i]?.[chessPosition.x]?.content === null) {
                            availableMOve.push({
                                y: i,
                                x: chessPosition.x
                            })
                            i++;
                        }
                        if (i <= 9 && bord.cellList?.[i]?.[chessPosition.x]?.content?.option.character !== character) {
                            availableMOve.push({
                                y: i,
                                x: chessPosition.x
                            })
                        }
                    }

                    return availableMOve
                }
                break;

            default:
                break;
        }
    }
}

export class Chess extends ChessType {

    protected status: ChessStatusEnum
    // 
    protected availablePositions: position[]
    //
    constructor(type: ChessTypeEnum, { defaultPosition = { x: 0, y: 0 }, character = CharacterEnum.red }) {
        super(type, { defaultPosition, character })
        this.status = ChessStatusEnum.down // init status
        this.availablePositions = []

        this.init()
    }
    private init() {
        ChessType.init(this)
    }
    // toggle status
    public toggleStatus() {
        if (this.status === ChessStatusEnum.down) {
            // pick up one chess
            this.status = ChessStatusEnum.up
            // apply rule


        } else if (this.status === ChessStatusEnum.up) {
            this.status = ChessStatusEnum.down
            this.availablePositions = []
        }
    }
    protected showMsg() {
        console.log(this.text, ':', arguments)
    }
    // render element
    static Element(chess: Chess) {
        return (
            <div className={`${ElementClassEnum.Chess} ${chess.option.index} ${chess.option.character} ${ChessStatusEnum[chess.status]}`}
                onClick={e => e.preventDefault()}>{chess.text}</div>
        )
    }
}

export const chessList = [
    // red
    new Chess(ChessTypeEnum.car, { defaultPosition: { x: 0, y: 0 } }),
    new Chess(ChessTypeEnum.rider, { defaultPosition: { x: 1, y: 0 } }),
    new Chess(ChessTypeEnum.elephant, { defaultPosition: { x: 2, y: 0 } }),
    new Chess(ChessTypeEnum.staff, { defaultPosition: { x: 3, y: 0 } }),
    new Chess(ChessTypeEnum.boss, { defaultPosition: { x: 4, y: 0 } }),
    new Chess(ChessTypeEnum.staff, { defaultPosition: { x: 5, y: 0 } }),
    new Chess(ChessTypeEnum.elephant, { defaultPosition: { x: 6, y: 0 } }),
    new Chess(ChessTypeEnum.rider, { defaultPosition: { x: 7, y: 0 } }),
    new Chess(ChessTypeEnum.car, { defaultPosition: { x: 8, y: 0 } }),

    new Chess(ChessTypeEnum.cannon, { defaultPosition: { x: 1, y: 2 } }),
    new Chess(ChessTypeEnum.cannon, { defaultPosition: { x: 7, y: 2 } }),

    new Chess(ChessTypeEnum.soldier, { defaultPosition: { y: 3, x: 0 } }),
    new Chess(ChessTypeEnum.soldier, { defaultPosition: { y: 3, x: 2 } }),
    new Chess(ChessTypeEnum.soldier, { defaultPosition: { y: 3, x: 4 } }),
    new Chess(ChessTypeEnum.soldier, { defaultPosition: { y: 3, x: 6 } }),
    new Chess(ChessTypeEnum.soldier, { defaultPosition: { y: 3, x: 8 } }),

    // black
    new Chess(ChessTypeEnum.car, { defaultPosition: { x: 0, y: 9 }, character: CharacterEnum.black }),
    new Chess(ChessTypeEnum.rider, { defaultPosition: { x: 1, y: 9 }, character: CharacterEnum.black }),
    new Chess(ChessTypeEnum.elephant, { defaultPosition: { x: 2, y: 9 }, character: CharacterEnum.black }),
    new Chess(ChessTypeEnum.staff, { defaultPosition: { x: 3, y: 9 }, character: CharacterEnum.black }),
    new Chess(ChessTypeEnum.boss, { defaultPosition: { x: 4, y: 9 }, character: CharacterEnum.black }),
    new Chess(ChessTypeEnum.staff, { defaultPosition: { x: 5, y: 9 }, character: CharacterEnum.black }),
    new Chess(ChessTypeEnum.elephant, { defaultPosition: { x: 6, y: 9 }, character: CharacterEnum.black }),
    new Chess(ChessTypeEnum.rider, { defaultPosition: { x: 7, y: 9 }, character: CharacterEnum.black }),
    new Chess(ChessTypeEnum.car, { defaultPosition: { x: 8, y: 9 }, character: CharacterEnum.black }),

    new Chess(ChessTypeEnum.cannon, { defaultPosition: { x: 1, y: 7 }, character: CharacterEnum.black }),
    new Chess(ChessTypeEnum.cannon, { defaultPosition: { x: 7, y: 7 }, character: CharacterEnum.black }),

    new Chess(ChessTypeEnum.soldier, { defaultPosition: { x: 0, y: 6 }, character: CharacterEnum.black }),
    new Chess(ChessTypeEnum.soldier, { defaultPosition: { x: 2, y: 6 }, character: CharacterEnum.black }),
    new Chess(ChessTypeEnum.soldier, { defaultPosition: { x: 4, y: 6 }, character: CharacterEnum.black }),
    new Chess(ChessTypeEnum.soldier, { defaultPosition: { x: 6, y: 6 }, character: CharacterEnum.black }),
    new Chess(ChessTypeEnum.soldier, { defaultPosition: { x: 8, y: 6 }, character: CharacterEnum.black }),
]
