/* eslint-disable no-console */

import * as jp from "jsonpath";
import payload from "./payload";

const jsonPaths: Array<string> = [
    // '$',
    // '$.level_0_string',
    '$.level_0_array[:]',
    '$.level_0_array[:]',
    // '$.*'
];

const pathMap= {}
const allPaths = []
jsonPaths.forEach((jpPath) => {
    const paths = jp.paths(payload, jpPath)
    allPaths.push(...paths)
});

const orderedPaths = allPaths.sort((a, b) => a.length <= b.length ? -1 : 1)

for (const path of allPaths) {
    let node = pathMap
    for (let i = 0; i < path.length; i++) {
        const key = path[i];
        console.log(key)
        if (node[key] === null) {
            break
        }
        if (node[key] === undefined) {
            if(i < path.length - 1 && typeof path[i+1] === 'number') {
                node[key] = [];
            } else {
                node[key] = {};
            }
        }
        if (i === path.length - 1) {
            node[key] = null
        } else {
            node = node[key]
        }
    }
}

console.log(pathMap)