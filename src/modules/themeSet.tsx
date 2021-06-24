import { ChangeEvent } from "react"
import { useDispatch } from "react-redux"
import { changeColor, ThemeColorType } from '../redux/global/theme'
export function ThemeSet() {
    return (
        <div className="themeset">
            <ColorPick colorType={ThemeColorType.backColor}></ColorPick>
            <ColorPick colorType={ThemeColorType.fontColor}></ColorPick>
        </div>
    )
}

function ColorPick(props: { colorType: ThemeColorType }) {
    const dispatch = useDispatch()
    const valueChange = (e: ChangeEvent) => {
        console.dir(e)
        const payload = {
            typename: props.colorType,
            value: (e.target as HTMLInputElement)?.value
        }
        dispatch(changeColor(payload))
    }
    return (
        <input className="colorpick" type='color' onChange={valueChange}></input>
    )
}