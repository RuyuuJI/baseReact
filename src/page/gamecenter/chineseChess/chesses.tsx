export enum CharacterEnum { red = 'red', black = 'black' }
export enum ChessTypeEnum { boss, soldier, staff, elephant, rider, cannon, car }
export enum ChessStatusEnum { up, down }
export interface position { x: number, y: number }

class ChessType {
    protected rule: Function
    protected type: ChessTypeEnum
    protected price: number = 0
    constructor(type: ChessTypeEnum) {
        this.type = type
        this.rule = () => { }
        this.init()
    }
    // init rule and price
    private init() {
        switch (this.type) {
            case ChessTypeEnum.boss:
                this.rule = () => { }
                break;
            case ChessTypeEnum.soldier:

                break;
            case ChessTypeEnum.staff:

                break;
            case ChessTypeEnum.elephant:

                break;
            case ChessTypeEnum.rider:

                break;

            case ChessTypeEnum.cannon:

                break;
            case ChessTypeEnum.car:

                break;

            default:
                break;
        }
    }
}

export class Chess extends ChessType {
    protected option: { defaultPosition: position, character: CharacterEnum, [key: string]: any } // extra option
    protected status: ChessStatusEnum
    // 
    protected availablePositions: position[]
    constructor(type: ChessTypeEnum, { defaultPosition = { x: 0, y: 0 }, character = CharacterEnum.red }) {
        super(type)
        this.status = ChessStatusEnum.down
        this.availablePositions = []
        this.option = {
            defaultPosition,
            character
        }
    }
}

const chessList = [
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
