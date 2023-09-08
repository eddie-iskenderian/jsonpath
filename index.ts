/* eslint-disable no-console */

import * as jp from "jsonpath";
import * as _ from "lodash"
import payload from "./payload";

const jsonPaths: Array<string> = [
    // '$',
    // '$.level_0_string',
    '$.name',
    '$.description',
    '$.packages[:].tour.itinerary',
    // '$.*'
];

const pathMap= {}
const allPaths = []
jsonPaths.forEach((jpPath) => {
    const paths = jp.paths(payload, jpPath)
    allPaths.push(...paths)
});

const orderedPaths = allPaths.sort((a, b) => a.length > b.length ? -1 : 1)

for (const path of orderedPaths) {
    let node = pathMap
    for (let i = 0; i < path.length; i++) {
        const key = path[i];
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

// console.log(JSON.stringify(pathMap, null, 2))

const contentCopy = { '$': _.cloneDeep(payload) };
const content = crop(contentCopy, pathMap)
console.log(JSON.stringify(content, null, 2))

function crop(obj, keepMap) {
    if (keepMap === null) {
        return `Translate(de_DE, '${obj}')`
    }
    for (const key of Object.keys(obj)) {
        if (!(key in keepMap)) {
            delete obj[key]
        } else {
            obj[key] = crop(obj[key], keepMap[key])
        }
    }
    return obj
}
