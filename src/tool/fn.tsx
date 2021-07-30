
export function deepCopy(obj1: any) {
  var obj2: any = Array.isArray(obj1) ? [] : {};
  if (obj1 && typeof obj1 === "object") {
    for (var i in obj1) {
      if (obj1.hasOwnProperty(i)) {
        // 如果子属性为引用数据类型，递归复制
        if (obj1[i] && typeof obj1[i] === "object") {
          obj2[i] = deepCopy(obj1[i]);
        } else {
          // 如果是基本数据类型，只是简单的复制
          obj2[i] = obj1[i];
        }
      }
    }
  }
  return obj2;
}
// common not null
export function isNull(x: any) {
  return x === null || x === undefined
}

//  range rand
function getRandom(start: number, end: number, fixed = 0) {
  let differ = end - start
  let random = Math.random()
  return (start + differ * random).toFixed(fixed)
}

// array fucntions
// random splice array
export function arrayRandomSplite(arr: Array<any> = [], outnum: number = 2): Array<Array<number>> {
  let indexs: Array<any> = [...Array.from(arr.keys())]
  let out: Array<any> = []
  let evenNum = Math.floor(arr.length / outnum)
  for (let i = 0; i < outnum; i++) {
    if (i === outnum - 1) {
      for (let j = 0; j < evenNum; j++) {
        let randomIndex = Math.round(Math.random() * (indexs.length - 1))
        out.push([...indexs.splice(randomIndex, 1)])
      }
    } else {
      out.push([...indexs])
    }
  }
  return out
}


// RANDOM COLOR
enum ColorType { 'rgba', 'rgb', '#' } // wait to add more type and fn

export function randomColor(type: ColorType = ColorType["#"], range: { start: number, end: number } = { start: 0, end: 0 }): string {
  let color = '', rand = (start: number, end: number) => getRandom(start, end)
  switch (type) {
    case ColorType.rgb:
      color = `rgb(${rand(Math.max(range.start, 0), Math.min(255, range.end))},${rand(Math.max(range.start, 0), Math.min(255, range.end))},${rand(Math.max(range.start, 0), Math.min(255, range.end))})`
      break;
    case ColorType.rgba:
      color = `rgb(${rand(Math.max(range.start, 0), Math.min(255, range.end))},${rand(Math.max(range.start, 0), Math.min(255, range.end))},${rand(Math.max(range.start, 0), Math.min(255, range.end))},${getRandom(0, 1, 3)})`
      break;
    case ColorType["#"]:
      color = '#' + ('00000' + (Math.random() * 0x1000000 << 0).toString(16)).substr(-6);
      break;
    default: break;
  }
  return color
}
