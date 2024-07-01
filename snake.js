const $get = (selector) => document.querySelector(selector)

const $canvas = $get('#canvas')
const $score = $get('#score')
const ctx = $canvas.getContext('2d')
const $startButton = $get('#start-btn')
const $startMenu = $get('.start-menu')

const highScore = window.localStorage.getItem('highScore') || 0
const $highScore = $get('#high-score')
$highScore.textContent = highScore

const gridSize = 20 // Tamaño de cada cuadrado en la cuadricula
const snake = [{ x: 5, y: 5 }, { x: 6, y: 5 }, { x: 7, y: 5 }]
const apple = { x: 10, y: 10 }
let direction = 'right'
let olderDirection = 'right'
let intervalId = null

function checkInput (event) {
  switch (event.keyCode) {
    case 37:
      direction = 'left'
      break
    case 38:
      direction = 'up'
      break
    case 39:
      direction = 'right'
      break
    case 40:
      direction = 'down'
      break
  }

  // Verificar que no se pueda ir en la direccion contraria
  if (direction === 'left' && olderDirection === 'right') {
    direction = 'right'
  } else if (direction === 'right' && olderDirection === 'left') {
    direction = 'left'
  } else if (direction === 'up' && olderDirection === 'down') {
    direction = 'down'
  } else if (direction === 'down' && olderDirection === 'up') {
    direction = 'up'
  }
}

function drawSnake (direction) {
  // Borrar el canvas
  ctx.clearRect(0, 0, $canvas.width, $canvas.height)
  const head = { x: snake[0].x, y: snake[0].y }

  // Mover la cabeza
  switch (direction) {
    case 'left':
      head.x--
      break
    case 'up':
      head.y--
      break
    case 'right':
      head.x++
      break
    case 'down':
      head.y++
      break
  }

  // Agregar la cabeza al inicio del arreglo
  snake.unshift(head)

  // Eliminar la cola
  snake.pop()

  ctx.fillStyle = 'green'
  for (let i = 0; i < snake.length; i++) {
    // Pintar la cabeza de otro color
    if (i === 0) {
      ctx.fillStyle = 'lightgreen'
    } else {
      ctx.fillStyle = 'green'
    }
    ctx.fillRect(snake[i].x * gridSize, snake[i].y * gridSize, gridSize, gridSize)
  }
  olderDirection = direction
}

function drawApple () {
  ctx.fillStyle = 'red'
  ctx.fillRect(apple.x * gridSize, apple.y * gridSize, gridSize, gridSize)
}

function generateRandomApples () {
  apple.x = Math.floor(Math.random() * 20)
  apple.y = Math.floor(Math.random() * 20)

  // Verificar que la manzana no este en el cuerpo de la serpiente
  for (let i = 0; i < snake.length; i++) {
    if (apple.x === snake[i].x && apple.y === snake[i].y) {
      generateRandomApples()
      return
    }
  }

  drawApple()
}

function checkApple () {
  if (snake[0].x === apple.x && snake[0].y === apple.y) {
    snake.push({ x: apple.x, y: apple.y })
    $score.textContent = snake.length - 3
    generateRandomApples()
  }
}

function checkColitions () {
  // Verificar que la cabeza no choque con el cuerpo
  for (let i = 2; i < snake.length; i++) {
    if (snake[1].x === snake[i].x && snake[1].y === snake[i].y) {
      if (snake.length - 3 > highScore) {
        window.localStorage.setItem('highScore', snake.length - 3)
      }
      clearInterval(intervalId)
      window.alert('Game Over')
      window.location.reload()
    }
  }

  // Verificar que cuando la serpiente salga del canvas, aparezca del otro lado
  if (snake[0].x > 19) {
    snake[0].x = 0
  } else if (snake[0].x < 0) {
    snake[0].x = 19
  }
  if (snake[0].y > 19) {
    snake[0].y = 0
  } else if (snake[0].y < 0) {
    snake[0].y = 19
  }
}

function gameLoop () {
  drawSnake(direction)
  drawApple()
  checkApple()
  checkColitions();
}

$startButton.addEventListener('click', () => {
  $startButton.disabled = true
  $startMenu.style.display = 'none'
  generateRandomApples()
  document.addEventListener('keydown', checkInput)
  intervalId = setInterval(gameLoop, 100)
})

// Iniciar el bucle del juego
