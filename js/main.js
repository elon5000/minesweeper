'use strict'

const MINE = '💣'
const FLAG = '🚩'
const LIFE = '💘'

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

const gPlayer = {
    life: 2
}

let gBoard

function onInitGame() {
    gBoard = buildBoard()
    renderBoard(gBoard)
    renderLife()
}

function onCellClicked(i, j) {
    if (!gGame.isOn) onFirstClick(i, j)
    if (gBoard[i][j].isShown) return
    else if (gBoard[i][j].isMine) onMine()
    else if (gBoard[i][j].minesAroundCount === 0) {
        checkNeighbors(gBoard, i, j)
    }
    gBoard[i][j].isShown = true
    renderCell(i, j)
    if (checkWin(gBoard)) return onWin()
}

function onLeftClick(ev, i, j) {
    ev.preventDefault()
    const cell = gBoard[i][j]
    if (cell.isShown) return
    cell.isMarked = !gBoard[i][j].isMarked
    renderCell(i, j)
    console.log(cell)
    if (checkWin(gBoard)) onWin()
}

function onFirstClick(i, j) {
    plantMines({ i, j }, 2, gBoard)
    setMinesAroundCount(gBoard)
    renderBoard(gBoard)
    setGameIsOn(true)
}

function onMine() {
    setLife(gPlayer.life - 1)
    renderLife()
    if (gPlayer.life <= 0) return onLose()
}

function onWin() {
    showAllCells(gBoard)
    setTimeout(() => {
        onShowModal(true, 'You win')
    }, 1000)
}

function onLose() {
    showAllCells(gBoard)
    setTimeout(() => {
        onShowModal(true, 'You lost')
    }, 1000)
}

function onShowModal(isOpen = false, message = '') {
    const elModal = document.querySelector('.message-modal')
    const elMessage = elModal.querySelector('.message')
    elMessage.innerText = message
    isOpen ? elModal.classList.remove('hidden') : elModal.classList.add('hidden')
}

function buildBoard(size = 4) {
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

function plantMines(firstClickLoc, minesAmount, board) {
    const emptyCells = getEmptyCells(board)
    for (let i = 0; i < emptyCells.length; i++) {
        const emptyCellLoc = emptyCells[i]
        if (emptyCellLoc.i === firstClickLoc.i
            && emptyCellLoc.j === firstClickLoc.j) emptyCells.splice(i, 1)
    }
    for (let i = 0; i < minesAmount; i++) {
        const randomIdX = getRandomInt(0, emptyCells.length)
        const location = emptyCells.splice(randomIdX, 1)[0]
        gBoard[location.i][location.j].isMine = true
    }
}

function showAllCells(board) {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            const cell = board[i][j]
            if (!cell.isShown) cell.isShown = true
        }
    }
    renderBoard(board)
}

function checkWin(board) {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            const cell = board[i][j]
            const { isMarked, isMine, isShown } = cell
            if (!isShown) {
                if (!isMine) return false
                else if (isMine && !isMarked) return false
            }
        }
    }
    return true
}

function checkNeighbors(board, rowIdx, colIdx) {
    if (gBoard[rowIdx][colIdx].isShown) return
    console.log('Checking cell', rowIdx, colIdx)
    gBoard[rowIdx][colIdx].isShown = true
    for (let i = rowIdx - 1; i <= rowIdx + 1; i++) {
        for (let j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i < 0 || i >= board.length || j < 0 || j >= board[i].length || (i === rowIdx && j === colIdx)) continue
            const cell = board[i][j]
            if (cell.minesAroundCount === 0) checkNeighbors(board, i, j)
            else cell.isShown = true
            renderCell(i, j)
        }
    }
}

function setMinesAroundCount(board) {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            const cell = board[i][j]
            if (cell.isMine) continue
            cell.minesAroundCount = getNeigCount(i, j, board)
        }
    }
}

function setGameIsOn(isOn) {
    gGame.isOn = isOn
}

function setLife(value) {
    gPlayer.life = value
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
    let className = ''
    if (isShown && isMine) content = MINE
    else if (isMarked) content = FLAG
    else if (isShown) {
        content = minesAroundCount
        if (minesAroundCount === 0) className = 'green'
        else if (minesAroundCount === 1) className = 'blue'
        else if (minesAroundCount === 2) className = 'orange'
        else className = 'red'
    }
    const elCell = document.querySelector(`.cell-${i}-${j}`)
    elCell.innerHTML = `<span class="${className}">${content}</span>`
}

function renderBoard(board) {
    let strHTML = ''
    for (let i = 0; i < board.length; i++) {
        strHTML += '<tr class="flex row">'
        for (let j = 0; j < board[i].length; j++) {
            const cell = board[i][j]
            const { isMarked, isMine, isShown, minesAroundCount } = cell
            let content = ''
            let className = ''
            if (isShown && isMine) content = MINE
            else if (isMarked) content = FLAG
            else if (isShown) {
                content = minesAroundCount
                if (minesAroundCount === 0) className = 'green'
                else if (minesAroundCount === 1) className = 'blue'
                else if (minesAroundCount === 2) className = 'orange'
                else className = 'red'
            }
            strHTML += `<td onclick="onCellClicked(${i},${j})" oncontextmenu="onLeftClick(event, ${i},${j})" class="flex column cell cell-${i}-${j}">
            <span class="${className}">${content}</span>
            </td>`
        }
        strHTML += '</tr>'
    }
    document.querySelector('.game-board').innerHTML = strHTML
}

function renderLife() {
    const elLifeCounter = document.querySelector('.life-counter')
    let strHTML = ''
    for (let i = gPlayer.life; i > 0; i--) {
        strHTML += LIFE
    }
    elLifeCounter.innerText = strHTML
}