document.addEventListener("DOMContentLoaded", function () {
    var board = document.querySelector("#board");
    var submit = document.querySelector("#submit");
    var sizeX = document.querySelector("#sizeX");
    var sizeY = document.querySelector("#sizeY");
    var select = document.querySelector(".startOption");
    var gameSet = document.querySelector("#game-set");

    function GameOfLife(boardWidth, boardHeight) {
        self = this;
        this.width = boardWidth;
        this.height = boardHeight;
        this.board = board;
        this.cells = [];
    };

    //choosing the game options
    submit.addEventListener("click", function (e) {
        e.preventDefault();
        self.width = sizeX.value;
        self.height = sizeY.value;
        self.drawPattern();
    });

    GameOfLife.prototype.createBoard = function () {
        while (board.hasChildNodes()) {
            board.removeChild(board.lastChild);
            this.cells = [];
        };

        this.board.style.width = this.width * 10 + "px";
        this.board.style.height = this.height * 10 + "px";
        var numberOfCells = this.width * this.height;
        for (var i = 0; i < numberOfCells; i++) {
            var newCell = document.createElement("div");
            this.board.appendChild(newCell);
            this.cells.push(newCell);
            gameSet.style.display = 'block';

            // bringing cells to live by clicking and/or moving;
            var isMousedown = false;
            newCell.addEventListener("mousedown", function (event) {
                this.classList.toggle("live");
                isMousedown = true;
            });

            newCell.addEventListener("mouseup", function (event) {
                isMousedown = false;
            });

            newCell.addEventListener("mouseover", function (event) {
                if (isMousedown) {
                    this.classList.toggle("live");
                }
            });
        }
    };

    GameOfLife.prototype.getIndex = function (x, y) {
        return (x) + (y) * this.width;
    };

    GameOfLife.prototype.setCellState = function (x, y, state) {
        var currentDiv = this.getIndex(x, y);
        this.cells[currentDiv].classList.toggle(state);
    };

    //glider
    GameOfLife.prototype.firstGlider = function (startingX, startingY) {
        var arrayX = [0, 1, 2, 2, 1];
        var arrayY = [0, 0, 0, -1, -2];
        for (var i = 0; i < arrayX.length; i++) {
            this.setCellState(startingX + arrayX[i], startingY + arrayY[i], "live");
        }
    };

    //10 cell row
    GameOfLife.prototype.tenCellRow = function (startingX, startingY) {
        var arrayX = [-4, -3, -2, -1, 0, 1, 2, 3, 4, 5];
        for (var i = 0; i < arrayX.length; i++) {
            this.setCellState(startingX + arrayX[i], startingY, "live");
        }
    };

    //lightway Spaceship
    GameOfLife.prototype.lightwaySpaceship = function (startingX, startingY) {
        var arrayX = [0, 1, 2, 3, 4, 4, 4, 3, 0];
        var arrayY = [0, -1, -1, -1, -1, 0, 1, 2, 2];
        for (var i = 0; i < arrayX.length; i++) {
            this.setCellState(startingX + arrayX[i], startingY + arrayY[i], "live");
        }
    };

    //pulsar
    GameOfLife.prototype.pulsar = function (startingX, startingY) {
        var symmetricalArray = [2, 3, 4, 6, 6, 6, 4, 3, 2, 1, 1, 1];
        for (var i = 0; i < symmetricalArray.length; i++) {
            this.setCellState(startingX - symmetricalArray[i], startingY - symmetricalArray[symmetricalArray.length - 1 - i], "live");
            this.setCellState(startingX - symmetricalArray[i], startingY + symmetricalArray[symmetricalArray.length - 1 - i], "live");
            this.setCellState(startingX + symmetricalArray[i], startingY - symmetricalArray[symmetricalArray.length - 1 - i], "live");
            this.setCellState(startingX + symmetricalArray[i], startingY + symmetricalArray[symmetricalArray.length - 1 - i], "live");
        }
    };

    GameOfLife.prototype.drawPattern = function () {
        self.createBoard();

        for (var j = 0; j < this.cells.length; j++) {
            if (this.cells[j].classList == "live") {
                this.cells[j].classList.add("blue");
            }
        }

        if (select.value == "Clear") {
            for (var k = 0; k < this.cells.length; k++) {
                this.cells[k].classList.remove("live");
            }
        } else if (select.value == "Random") {
            for (var k = 0; k < this.cells.length; k++) {
                var z = Math.random();
                if (z < 0.5) {
                    this.cells[k].classList.add("live");
                }
            }
        } else if (select.value == "Glinder") {
            this.firstGlider(Math.floor(self.width / 2), Math.floor(self.height / 2));
        } else if (select.value == "Lightway spaceship") {
            this.lightwaySpaceship(Math.floor(self.width / 2), Math.floor(self.height / 2));
        } else if (select.value == "10 Cell Row") {
            this.tenCellRow(Math.floor(self.width / 2), Math.floor(self.height / 2));
        } else if (select.value == "Pulsar") {
            this.pulsar(Math.floor(self.width / 2), Math.floor(self.height / 2));
        }
    };

    GameOfLife.prototype.computeCellNextState = function (x, y) {
        var live = 0;
        var neighboursX = [x - 1, x, x + 1, x - 1, x + 1, x - 1, x, x + 1];
        var neighboursY = [y - 1, y - 1, y - 1, y, y, y + 1, y + 1, y + 1];

        for (var i = 0; i < neighboursX.length; i++) {
            if (neighboursX[i] >= 0 && neighboursX[i] < this.width && neighboursY[i] >= 0 && neighboursY[i] < this.height) {
                if (this.cells[this.getIndex(neighboursX[i], neighboursY[i])].classList.contains("live")) {
                    live++;
                }
            }
        }
        if (this.cells[this.getIndex(x, y)].classList.contains("live") && (live === 2 || live === 3)) {
            return 1;
        } else if (!(this.cells[this.getIndex(x, y)].classList.contains("live")) && live === 3) {
            return 1;
        } else {
            return 0;
        }
    };

    GameOfLife.prototype.computeNextGeneration = function () {
        this.nextState = [];
        for (var i = 0; i < this.height; i++) {
            for (var j = 0; j < this.width; j++) {
                this.nextState.push(this.computeCellNextState(j, i));
            }
        }
    };

    GameOfLife.prototype.printNextGeneration = function () {
        this.computeNextGeneration();
        for (var i = 0; i < this.cells.length; i++) {
            if (this.nextState[i] == 1) {
                this.cells[i].classList.add("live");
            } else if (this.nextState[i] == 0) {
                this.cells[i].classList.remove("live");
            }
        }
    };

    //Starting and pausing the game
    var play = document.getElementById("play");
    var pause = document.getElementById("pause");
    

    play.addEventListener("click", function (e) {
        this.disabled = true;
        interval = setInterval(function () {
            self.printNextGeneration();
        }, 500);
    });

    pause.addEventListener("click", function () {
        clearInterval(interval);
        play.disabled = false;
    });

    //creating the game
    var game = new GameOfLife(sizeX.value, sizeY.value);

});
