class board {
  constructor(wid, hei, noMines) {
    this.boxSize = 25;
    this.cells = [];
    this.width = wid;
    this.height = hei;
    this.initialiseBoard(noMines);
    this.showMines=false;
  }

  initialiseBoard(noMines) {
    this.noMines = 0;
    for (let i = 0; i < this.height; i++) {
      this.cells[i] = [];
      for (let j = 0; j < this.width; j++) this.cells[i][j] = new cell();
    }
    while (this.noMines < noMines) {
      let i = floor(random(this.height));
      let j = floor(random(this.width));
      if (!this.cells[i][j].mine) {
        this.cells[i][j].mine = true;
        this.noMines++;
      }
    }
    for (let i = 0; i < this.height; i++)
      for (let j = 0; j < this.width; j++)
        for (let k = -1; k <= 1; k++)
          for (let l = -1; l <= 1; l++)
            if (this.check(i + k, j + l) && this.cells[i + k][j + l].mine && (k != 0 || l != 0)) this.cells[i][j].digit++;
  }

  check(i, j) {
    if (i < 0 || i >= this.height) return false;
    if (j < 0 || j >= this.width) return false;
    return true
  }

  show() {
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        if (this.cells[i][j].hidden) fill(128);
        else fill(255);
        rect(this.boxSize * j, this.boxSize * i, this.boxSize, this.boxSize);
        fill(255, 0, 0);
        if (this.cells[i][j].flag) rect(this.boxSize * j + this.boxSize / 4, this.boxSize * i + this.boxSize / 4, this.boxSize / 2, this.boxSize / 2);
        fill(0);
        if ((this.showMines||!this.cells[i][j].hidden) && this.cells[i][j].mine) circle(this.boxSize * j + this.boxSize / 2, this.boxSize * i + this.boxSize / 2, this.boxSize / 3, this.boxSize / 3);
        fill(0);
        if (this.cells[i][j].showDigit && this.cells[i][j].digit > 0) text(this.cells[i][j].digit, this.boxSize * j + this.boxSize / 2, this.boxSize * i + this.boxSize / 2)
      }
    }
  }

  clicked(i, j) {
    if (!this.check(i, j)) return;
    this.cells[i][j].hidden = false;
    this.cells[i][j].showDigit = true;
    this.cells[i][j].flag = false;
    for (let k = -1; k <= 1; k++)
      for (let l = -1; l <= 1; l++) {
        if (k == 0 && l == 0) continue;
        if (this.check(i + k, j + l) && this.cells[i + k][j + l].hidden && this.cells[i + k][j + l].digit == 0 && !this.cells[i + k][j + l].mine) this.clicked(i + k, j + l);
        if (this.check(i + k, j + l) && this.cells[i + k][j + l].hidden && this.cells[i + k][j + l].digit > 0 && !this.cells[i + k][j + l].mine) {
          this.cells[i + k][j + l].hidden = false;
          this.cells[i + k][j + l].showDigit = true;
        }
      }
    gameResult = this.checkWinLose();
  }

  keyT(i, j, k) {
    if (!this.check(i, j)) return;
    if (k == 'f' && this.cells[i][j].hidden) this.cells[i][j].flag = !this.cells[i][j].flag;
    if (k == 'n') this.ai();
    gameResult = this.checkWinLose();
  }

  showAllMines(){
    this.showMines=true;
  }
  
  //true if win, false if loss, undefined if the game is not over
  checkWinLose() {
    let mf = false; // true if we have a flag without a mine or a mine without a flag
    for (let i = 0; i < this.height; i++)
      for (let j = 0; j < this.width; j++) {
        if (!this.cells[i][j].hidden && this.cells[i][j].mine) return false;
        if (this.cells[i][j].flag != this.cells[i][j].mine) mf = true;
      }
    if (mf) return undefined;
    return true;
  }

  //simple ai, gets stuck sometimes
  ai() {
    for (let i = 0; i < this.height; i++)
      for (let j = 0; j < this.width; j++)
        if (!this.cells[i][j].hidden) {
          let noFlags = 0;
          let noHidden = 0;
          for (let k = -1; k <= 1; k++)
            for (let l = -1; l <= 1; l++) {
              if (k == 0 && l == 0) continue;
              if (this.check(i + k, j + l)) {
                if (this.cells[i + k][j + l].hidden) noHidden++;
                if (this.cells[i + k][j + l].flag) noFlags++; // we assume the flags are correct
              }
            }
          if (this.cells[i][j].digit == noHidden) {
            for (let k = -1; k <= 1; k++)
              for (let l = -1; l <= 1; l++) {
                if (k == 0 && l == 0) continue;
                if (this.check(i + k, j + l) && this.cells[i + k][j + l].hidden && !this.cells[i + k][j + l].flag) this.cells[i + k][j + l].flag = true;
              }
          }

          if (this.cells[i][j].digit == noFlags) {
            for (let k = -1; k <= 1; k++)
              for (let l = -1; l <= 1; l++) {
                if (k == 0 && l == 0) continue;
                if (this.check(i + k, j + l) && this.cells[i + k][j + l].hidden && !this.cells[i + k][j + l].flag) this.clicked(i + k, j + l);
              }
          }
        }
  }
}