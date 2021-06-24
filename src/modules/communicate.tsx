import { useMemo, useState } from "react"
import { person } from "../constants/user"
import { Client } from "../websocket/client"
import { User } from '../core/user'

export function Communicate (props: { user: User}) {
    const { user }  = props
    const [state, setState] = useState(false)
    user.onReady('initClient', () => {
        setState(true)
    })
    console.log('user', user.person)
    const client = useMemo(() => {
        if (user.person) {
            return new Client(user.person)
        } else {
            return false
        }
    }, [user.person, state])
    return (
        <div className="communication"></div>
    )
}