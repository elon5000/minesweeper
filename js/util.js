'use strict'

function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min) + min)
}

function getCopiedMat(mat) {
    const copiedMat = []
    for (let i = 0; i < mat.length; i++) {
        copiedMat[i] = []
        for (let j = 0; j < mat[i].length; j++) {
            const cell = mat[i][j]
            copiedMat[i][j] = {...cell}
        }
    }
    return copiedMat
}