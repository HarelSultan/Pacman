'use strict'

const WALL = '#'
const FOOD = '.'
const EMPTY = ' '
const SUPER_FOOD = '🍄'
const CHERRY = '🍒'

var gGame
var gCherryIntervalId
var gBoard

function onInit() {
    gGame = {
        score: 0,
        isOn: false,
        isVictoy: false,
        foodCount: 0,
        deadGhosts: []
    }
    gGhosts = []
    closeModal()
    updateScore(0)

    gBoard = buildBoard()
    createGhosts(gBoard)
    createPacman(gBoard)
    renderBoard(gBoard, '.board-container')
    gGame.isOn = true
    if (gCherryIntervalId) clearInterval(gCherryIntervalId)
    gCherryIntervalId = setInterval(addCherry, 15000)
}

function buildBoard() {
    const size = 10
    const board = []

    for (var i = 0; i < size; i++) {
        board.push([])
        for (var j = 0; j < size; j++) {

            if (i === 0 || i === size - 1 ||
                j === 0 || j === size - 1 ||
                (j === 3 && i > 4 && i < size - 2)) {
                board[i][j] = WALL
            } else {
                board[i][j] = FOOD
                gGame.foodCount++
            }
        }
    }

    board[1][1] = SUPER_FOOD
    board[1][size - 2] = SUPER_FOOD
    board[size - 2][1] = SUPER_FOOD
    board[size - 2][size - 2] = SUPER_FOOD
    // Substracting foodCount by 4 because of super food and substracting 1 because of pacman (foodCount - 5)
    gGame.foodCount -= 5
    console.log('gGame.foodCount:', gGame.foodCount)
    return board
}

function updateScore(diff) {
    // TODO: update model and dom
    // Model
    gGame.score += diff
    // DOM
    document.querySelector('h2 span').innerText = gGame.score
}

function killGhost(killedGhostLocation) {
    for (var i = 0; i < gGhosts.length; i++) {
        const currGhostLocation = gGhosts[i].location
        if (killedGhostLocation.i === currGhostLocation.i && killedGhostLocation.j === currGhostLocation.j) {
            const killedGhost = gGhosts.splice(i, 1)[0]
            gGame.deadGhosts.push(killedGhost)
        }
    }
}

function reviveGhosts() {
    for (var i = 0; i < gGame.deadGhosts.length; i++) {
        const currGhost = gGame.deadGhosts[i]
        gGhosts.push(currGhost)
        // MODEL
        gBoard[currGhost.location.i][currGhost.location.j] = GHOST
        // DOM
        renderCell(currGhost.location, getGhostHTML(currGhost))
    }
    gGame.deadGhosts = []
}

function addCherry() {
    const emptyLocation = getEmptyCellLocation()
    if (!emptyLocation) return
    // MODEL
    gBoard[emptyLocation.i][emptyLocation.j] = CHERRY
    // DOM
    renderCell(emptyLocation, CHERRY)
}

function gameOver() {
    openModal()
    clearInterval(gIntervalGhosts)
    clearInterval(gCherryIntervalId)
    gGame.isOn = false
    renderCell(gPacman.location, '🪦')
}

function openModal() {
    const elModal = document.querySelector('.modal')
    const elModalMsg = elModal.querySelector('.modal-msg')
    elModalMsg.innerText = (gGame.isVictoy) ? 'Victorious!' : 'So Close!'
    elModal.classList.remove('hidden')
}

function closeModal() {
    const elModal = document.querySelector('.modal')
    elModal.classList.add('hidden')
}

function checkVictory() {
    if (!gGame.foodCount) {
        gGame.isVictoy = true
        gameOver()
    }
}


// Document object model