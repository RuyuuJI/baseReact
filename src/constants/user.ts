export enum PersonState { 'ready', 'stop', 'enable' } // the state of the player

// the player of game
export interface person {
    name: string
    id: string
    write: string
    state?: PersonState
}