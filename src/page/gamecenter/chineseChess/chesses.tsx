import { ElementClassEnum } from "./chineseChess"

export enum CharacterEnum { red = 'red', black = 'black' }
export enum ChessTypeEnum { boss, soldier, staff, elephant, rider, cannon, car }
export enum ChessStatusEnum { up, down }
export interface position { x: number, y: number }

class ChessType {
    public option: { defaultPosition: position, character: CharacterEnum, [key: string]: any } // extra option
    public text: string

    protected rule: Function
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
                chess.rule = () => { }
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
                break;
            case ChessTypeEnum.staff:
                chess.rule = () => { }
                textmap = {
                    [CharacterEnum.red]: '士',
                    [CharacterEnum.black]: '侍'
                }
                chess.text = textmap[character]
                break;
            case ChessTypeEnum.elephant:
                chess.rule = () => { }
                textmap = {
                    [CharacterEnum.red]: '相',
                    [CharacterEnum.black]: '🐘'
                }
                chess.text = textmap[character]
                break;
            case ChessTypeEnum.rider:
                chess.rule = () => { }
                textmap = {
                    [CharacterEnum.red]: '🐎',
                    [CharacterEnum.black]: '马'
                }
                chess.text = textmap[character]
                break;

            case ChessTypeEnum.cannon:
                chess.rule = () => { }
                textmap = {
                    [CharacterEnum.red]: '仗',
                    [CharacterEnum.black]: '炮'
                }
                chess.text = textmap[character]
                break;
            case ChessTypeEnum.car:
                chess.rule = () => { }
                textmap = {
                    [CharacterEnum.red]: '🚗',
                    [CharacterEnum.black]: '车'
                }
                chess.text = textmap[character]
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
    static Element(chess: Chess) {
        return (
            <div className={`${ElementClassEnum.Chess} ${chess.option.index}`} onClick={e => e.preventDefault()}>{chess.text}</div>
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
