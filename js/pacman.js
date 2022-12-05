'use strict'

const PACMAN = '😷'
var gPacman


function createPacman(board) {
    // DONE: initialize gPacman...
    gPacman = {
        location: {
            i: 2,
            j: 2
        },
        isSuper: false
    }
    gBoard[gPacman.location.i][gPacman.location.j] = PACMAN
}

function movePacman(ev) {
    if (!gGame.isOn) return
    // DONE: use getNextLocation(), nextCell
    const nextLocation = getNextLocation(ev.key)
    const nextCell = gBoard[nextLocation.i][nextLocation.j]

    if (nextCell === SUPER_FOOD && gPacman.isSuper) return

    // DONE: return if cannot move
    if (nextCell === WALL) return

    // DONE: hitting a ghost? call gameOver

    if (nextCell === FOOD) {
        updateScore(1)
        gGame.foodCount--
        console.log('AFTER FOOD COUNT:', gGame.foodCount)
        checkVictory()
    }

    if (nextCell === CHERRY) updateScore(10)

    if (nextCell === SUPER_FOOD && !gPacman.isSuper) {
        gPacman.isSuper = true
        for (var i = 0; i < gGhosts.length; i++) {
            const currGhost = gGhosts[i]
            renderCell(currGhost.location, getGhostHTML(currGhost))
        }

        setTimeout(() => {
            gPacman.isSuper = false
            reviveGhosts()
        }, 5000)
    }

    if (nextCell === GHOST) {
        if (!gPacman.isSuper) return gameOver()
        killGhost(nextLocation)
    }
    // DONE: moving from current location:
    // DONE: update the model
    gBoard[gPacman.location.i][gPacman.location.j] = EMPTY
    // DONE: update the DOM
    renderCell(gPacman.location, EMPTY)


    // DONE: Move the pacman to new location:
    // DONE: update the model
    gBoard[nextLocation.i][nextLocation.j] = PACMAN
    gPacman.location = nextLocation
    // DONE: update the DOM
    renderCell(nextLocation, PACMAN)
}

function getNextLocation(eventKeyboard) {
    const nextLocation = {
        i: gPacman.location.i,
        j: gPacman.location.j
    }
    var degrees
    // DONE: figure out nextLocation
    switch (eventKeyboard) {
        case 'ArrowUp':
            nextLocation.i--
            degrees = 180
            break;
        case 'ArrowRight':
            nextLocation.j++
            degrees = 270
            break;
        case 'ArrowDown':
            nextLocation.i++
            degrees = 0
            break;
        case 'ArrowLeft':
            nextLocation.j--
            degrees = 90
            break;
    }
    rotatePacman(degrees, nextLocation)
    return nextLocation
}

function rotatePacman(degrees, nextLocation) {
    if (gBoard[nextLocation.i][nextLocation.j] === WALL) return
    if (gBoard[nextLocation.i][nextLocation.j] === SUPER_FOOD && gPacman.isSuper) return
    const elPrevCell = document.querySelector(`.cell-${gPacman.location.i}-${gPacman.location.j}`)
    elPrevCell.style.transform = 'none'
    const elPacman = document.querySelector(`.cell-${nextLocation.i}-${nextLocation.j} `)
    elPacman.style.transform = `rotate(${degrees}deg)`
}
