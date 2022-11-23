'use strict'

const MINE = '💣'
const FLAG = '🚩'

const gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

const gLevel = {
    size: 4,
    mines: 2
}

let gBoard

function onInitGame() {
    gBoard = buildBoard()
    plantMines(2, gBoard)
    setMinesAroundCount(gBoard)
    renderBoard(gBoard)
}

function onCellClicked(i, j) {
    gBoard[i][j].isShown = true
    renderCell(i, j)
}

function buildBoard() {
    const board = makeBoard(gLevel.size)
    return board
}

function makeBoard(size = 4) {
    const board = []
    for (let i = 0; i < size; i++) {
        board[i] = []
        for (let j = 0; j < size; j++) {
            board[i][j] = makeCell()
        }
    }
    return board
}

function makeCell() {
    return {
        minesAroundCount: null,
        isShown: false,
        isMine: false,
        isMarked: false
    }
}

function plantMines(minesAmount, board) {
    const emptyCells = getEmptyCells(board)
    for (let i = 0; i < minesAmount; i++) {
        const randomIdX = getRandomInt(0, emptyCells.length)
        const location = emptyCells[randomIdX]
        console.log(location)
        gBoard[location.i][location.j].isMine = true
    }
}

function setMinesAroundCount(board) {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            const cell = board[i][j]
            cell.minesAroundCount = getNeigCount(i, j, board)
        }
    }
}

function getNeigCount(rowIdxi, colIdx, board) {
    let count = 0
    for (let i = rowIdxi - 1; i <= rowIdxi + 1; i++) {
        if (i < 0 || i > board.length - 1) continue
        for (let j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > board[i].length - 1) continue
            const cell = board[i][j]
            if (cell.isMine) count++
        }
    }
    return count
}

function getEmptyCells(board) {
    const emptyCells = []
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            const cell = board[i][j]
            const { isMine, isMarked, isShown } = cell
            if (!isMine && !isMarked && !isShown) emptyCells.push({ i, j })
        }
    }
    return emptyCells
}

function renderCell(i, j) {
    const cell = gBoard[i][j]
    const { isMarked, isMine, isShown, minesAroundCount } = cell
    let content = ''
    if (isShown) {
        if (isMine) content = MINE
        else if (isMarked) content = FLAG
        else content = minesAroundCount
    }
    const elCell = document.querySelector(`.cell-${i}-${j}`)
    elCell.innerHTML = `<span>${content}</span>`
}

function renderBoard(board) {
    let strHTML = ''
    for (let i = 0; i < board.length; i++) {
        strHTML += '<tr class="flex row">'
        for (let j = 0; j < board[i].length; j++) {
            const cell = board[i][j]
            const content = cell.isShown ? cell.minesAroundCount : ''
            strHTML += `<td onclick="onCellClicked(${i},${j})" class="flex column cell cell-${i}-${j}">
            <span data-${i}-${j} class="cell-${content}">${content}</span>
            </td>`
        }
        strHTML += '</tr>'
    }
    document.querySelector('.game-board').innerHTML = strHTML
}