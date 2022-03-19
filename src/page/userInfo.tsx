import { useState } from "react";
import './userInfo.scss'
function UserInfo() {
    const [list, setList] = useState([{ name: "AAAA", open: true, height: "400" }, ...createItem(20)])
    return (
        <div className="UserInfo">
            <header className="UserInfo-header">
                UserInfo
                <div className="show-demo">
                    {list.map((item, i) => <div className="item" key={i} style={{ height: item?.height + "px" }} >{i + item.name}
                        {item.open && <span className="sub-item">subitem</span>}
                    </div>)}
                </div>
            </header>
        </div>
    );
}

function createItem(n: number = 1) {
    const list = []
    const getChar = () => String.fromCharCode(Math.random() * 100000)
    let i = 0
    while (i < n) {
        list.push({ name: getChar(), open: false, height: Math.random() * 200 })
        i++
    }
    return list
}
export default UserInfo;
