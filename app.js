// EventListener provavelmente para capturar os cliques do teclado
document.addEventListener('DOMContentLoaded', () => {
  /** Seleciona a id div que contem os 200 quadrados */
  const grid = document.querySelector('.grid')

  /** Coloca cada quadrado no array squares de 200 elementos
   * note o querySelectorAll, necessario pois se tratam de varios elementos */
  let squares = Array.from(document.querySelectorAll('.grid div'))

  /** Seleciona o campo de score atraves do CSS */
  const scoreDisplay = document.querySelector('#score')

  /** Seleciona o botao start/stop atraves do CSS */
  const startBtn = document.querySelector('#start-button')

  // Importante observar que os seletores da Dom sao todos pra o CSS
  // pois esse game faz alteracoes no CSS para simular o game

  /** Variavel para a altura. Vai facilitar a movimentacao vertical dos tetrominos */
  const width = 10

  /** = Math.floor(Math.random() * theTetrominoes.length) */
  let nextRandom = 0

  let timerId

  let score = 0

  const colors = ['orange', 'red', 'purple', 'green', 'blue']

  //The Tetrominoes
  /*****************************
   * A principio parece bem estranha essa variavel. Mas vamos la:
   * Sao declaradas as 5 figuras (Tetromino eh o nome) em um array
   * com as 4 posicoes possiveis das pecas no jogo. As rotacoes pra ser mais
   * especifico.
   *
   * A parte complicada eh o desenho dessas pecas. Voce deve imaginar que a tela
   * do jogo contem 200 quadrados no total. O formato da tela eh de 10 quadrados
   * de largura por por 20 quadrados de comprimento. Como em todo array, o primeiro
   * elemento eh identificado com o zero (0), o ultimo recebe o indice 199.
   * Para desenhar um L no comeco do jogo, devemos "pintar" com CSS os seguintes
   * quadrados na div Como segue: lTetromino = [1, 11, 21, 2]
   * XX--------
   * -X--------
   * -X--------
   * ----------
   * ----------
   * ----------
   * ----------
   * ----------
   * ----------
   * ----------
   *
   * zTetromino = [0, 10, 11, 21]
   * X---------
   * XX--------
   * -X--------
   * ----------
   * ----------
   * ----------
   * ----------
   * ----------
   * ----------
   * ----------
   *
   * tTetromino = [1, 10, 11, 12]
   * -X--------
   * XXX-------
   * ----------
   * ----------
   * ----------
   * ----------
   * ----------
   * ----------
   * ----------
   * ----------
   *
   * oTetromino = [0, 1, 10, 11]
   * XX--------
   * XX--------
   * ----------
   * ----------
   * ----------
   * ----------
   * ----------
   * ----------// Array obvio...
   * ----------
   *
   * iTetromino = [1, 11, 21, 31]
   * -X--------
   * -X--------
   * -X--------
   * -X--------
   * ----------
   * ----------
   * ----------
   * ----------
   * ----------
   * ----------
   * lembrando que sao todas posicoes iniciais no jogo. Sempre vao aparecer em cima
   */
  const lTetromino = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2],
  ]

  const zTetromino = [
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
  ]

  const tTetromino = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1],
  ]

  const oTetromino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
  ]

  const iTetromino = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
  ]

  /** Todos os tetrominos com seus arrays de movimentos */
  const theTetrominoes = [
    lTetromino,
    zTetromino,
    tTetromino,
    oTetromino,
    iTetromino,
  ]

  /** Desenha na linha 4 fazendo aparecer o tetromino por completo.
   * Se desenhar na linha 1 corta o comeco da figura */
  let currentPosition = 4
  .

  /** Indice das posicoes dos tetrominos.
   * Lembra que o tetromino pode ser rodado, girado? a gente colocou as quatro possiveis
   * posicoes em cada const que declara os tetrominos, as rotacoes dos tetrominos
   * estao em formato Array */
  let currentRotation = 0

  /** Aqui usamos a funcao Math.floor e Math.random para selecionar um tetramino
   * de forma aleatoria (famoso randomico, palavra estranha para mim em portugues)
   * se voce nao entende oque faz o floor e random, de uma pesquisada pois tem
   * aparecido muitos tutoriais usando elas. Eu mesmo nao me aprofundei mas de
   * forma porca e simples, estas funcoes selecionam um numero aleatorio e
   * arredondam o valor. */
  let random = Math.floor(Math.random() * theTetrominoes.length)

  /** Atribui a current um tetromino aleatorio com a rotacao inicial
   * em zero(0); primeira peca no array de posicoes. Aqui vai ser um array
   * de quatro numeros. */
  let current = theTetrominoes[random][currentRotation]

/** para cada quadradinho em current(array de 4 numeros) 
 * squares sao todas as 200 divs(quadrados). Aqui vai passar por cada um
 * deles e so vai pintar os quadrados que formam a figura.
 * Vai "pintar" o css atribuindo uma classe css (class="tetromino")
 * como a gente deixou essa classe .tetromino em azul no style.css, vai funcionar
 * o currentPosition eh 4, para nao ficar muito pra cima na tela. deixe 1 e
 * veja o que acontece.
 * o index eh exatamente o valor de cada um dos quatro quadrados que serao
 * pintados. */
  function draw() {
    current.forEach((index) => {
      squares[currentPosition + index].classList.add('tetromino')
      squares[currentPosition + index].style.backgroundColor = colors[random]
      // aqui soh muda a cor da peca para uma das outras definidas na variavel colors e nao ficar tudo azul
    })
  }

  /** Apaga o tetromino
   * remove a classe css "tetromino" de cada quadrado que a contem.
   * remove o background color dos quadrados */
  function undraw() {
    current.forEach((index) => {
      squares[currentPosition + index].classList.remove('tetromino')
      squares[currentPosition + index].style.backgroundColor = ''
      
    })
  }

/** aqui mesmo caso das funcoes Math. Usos genericos, estude mais quando puder */
  function control(e) {
    if (e.keyCode === 37) {
      moveLeft()
    } else if (e.keyCode === 38) {
      rotate()
    } else if (e.keyCode === 39) {
      moveRight()
    } else if (e.keyCode === 40) {
      moveDown()
    }
  }
  document.addEventListener('keyup', control)

  
  function moveDown() {
    undraw()
    currentPosition += width
    draw()
    freeze()
  }

  /****
   * funcao que faz o tetromino parar ao tocar na ultima linha ou em algum outro
   * tetromino que esteja no caminho.
   */
  function freeze() {
    // esse if verifica se o tetromino tocou a ultima linha, taken la no html.
    if (
      current.some((index) =>
        squares[currentPosition + index + width].classList.contains('taken')
      )
    ) {
      // se tocou ele transforma o tetromino que tocou em uma div 'taken',
      // criando um "obstaculo"
      current.forEach((index) =>
        squares[currentPosition + index].classList.add('taken')
      )
      // start, desenha o proximo tetromino para jogar.
      random = nextRandom
      nextRandom = Math.floor(Math.random() * theTetrominoes.length)
      current = theTetrominoes[random][currentRotation]
      currentPosition = 4
      draw()
      displayShape()
      addScore()
      gameOver()
    }
  }

  function moveLeft() {
    undraw()
    const isAtLeftEdge = current.some(
      (index) => (currentPosition + index) % width === 0
    )
    if (!isAtLeftEdge) currentPosition -= 1
    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains('taken')
      )
    ) {
      currentPosition += 1
    }
    draw()
  }

  //move the tetromino right, unless is at the edge or there is a blockage
  function moveRight() {
    undraw()
    const isAtRightEdge = current.some(
      (index) => (currentPosition + index) % width === width - 1
    )
    if (!isAtRightEdge) currentPosition += 1
    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains('taken')
      )
    ) {
      currentPosition -= 1
    }
    draw()
  }

  ///FIX ROTATION OF TETROMINOS A THE EDGE
  function isAtRight() {
    return current.some((index) => (currentPosition + index + 1) % width === 0)
  }

  function isAtLeft() {
    return current.some((index) => (currentPosition + index) % width === 0)
  }

  function checkRotatedPosition(P) {
    P = P || currentPosition //get current position.  Then, check if the piece is near the left side.
    if ((P + 1) % width < 4) {
      //add 1 because the position index can be 1 less than where the piece is (with how they are indexed).
      if (isAtRight()) {
        //use actual position to check if it's flipped over to right side
        currentPosition += 1 //if so, add one to wrap it back around
        checkRotatedPosition(P) //check again.  Pass position from start, since long block might need to move more.
      }
    } else if (P % width > 5) {
      if (isAtLeft()) {
        currentPosition -= 1
        checkRotatedPosition(P)
      }
    }
  }

  //rotate the tetromino
  function rotate() {
    undraw()
    currentRotation++
    if (currentRotation === current.length) {
      //if the current rotation gets to 4, make it go back to 0
      currentRotation = 0
    }
    current = theTetrominoes[random][currentRotation]
    checkRotatedPosition()
    draw()
  }
  /////////

  //show up-next tetromino in mini-grid display
  const displaySquares = document.querySelectorAll('.mini-grid div')
  const displayWidth = 4
  const displayIndex = 0

  //the Tetrominos without rotations
  const upNextTetrominoes = [
    [1, displayWidth + 1, displayWidth * 2 + 1, 2], //lTetromino
    [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], //zTetromino
    [1, displayWidth, displayWidth + 1, displayWidth + 2], //tTetromino
    [0, 1, displayWidth, displayWidth + 1], //oTetromino
    [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1], //iTetromino
  ]

  //display the shape in the mini-grid display
  function displayShape() {
    //remove any trace of a tetromino form the entire grid
    displaySquares.forEach((square) => {
      square.classList.remove('tetromino')
      square.style.backgroundColor = ''
    })
    upNextTetrominoes[nextRandom].forEach((index) => {
      displaySquares[displayIndex + index].classList.add('tetromino')
      displaySquares[displayIndex + index].style.backgroundColor =
        colors[nextRandom]
    })
  }

  //add functionality to the button
  startBtn.addEventListener('click', () => {
    if (timerId) {
      clearInterval(timerId)
      timerId = null
    } else {
      draw()
      timerId = setInterval(moveDown, 1000)
      nextRandom = Math.floor(Math.random() * theTetrominoes.length)
      displayShape()
    }
  })

  //add score
  function addScore() {
    for (let i = 0; i < 199; i += width) {
      const row = [
        i,
        i + 1,
        i + 2,
        i + 3,
        i + 4,
        i + 5,
        i + 6,
        i + 7,
        i + 8,
        i + 9,
      ]

      if (row.every((index) => squares[index].classList.contains('taken'))) {
        score += 10
        scoreDisplay.innerHTML = score
        row.forEach((index) => {
          squares[index].classList.remove('taken')
          squares[index].classList.remove('tetromino')
          squares[index].style.backgroundColor = ''
        })
        const squaresRemoved = squares.splice(i, width)
        squares = squaresRemoved.concat(squares)
        squares.forEach((cell) => grid.appendChild(cell))
      }
    }
  }

  //game over
  function gameOver() {
    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains('taken')
      )
    ) {
      scoreDisplay.innerHTML = 'end'
      clearInterval(timerId)
    }
  }
})
