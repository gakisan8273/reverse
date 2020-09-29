// 盤面の状態を管理する
class Board {
  constructor() {
    // どのセルに石が置かれているか管理する
    // 0: black,  1: white;
    this.initialStatus = [
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, 1, 0, null, null, null],
      [null, null, null, 0, 1, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
    ];
    this.status = [...this.initialStatus]; // 別オブジェクトを作る
    this.canvas = document.getElementById('reversi');
    this.ctx = this.canvas.getContext('2d');
    this.ctx.fillStyle = 'black';
    this.stone = new Stone();
  }

  // 盤面の初期化
  initialize() {
    this.ctx.clearRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);
    // 縦線
    for (let col = 0; col < 8; col++) {
      this.ctx.beginPath();
      this.ctx.moveTo(40 * col, 0);
      this.ctx.lineTo(40 * col, 320);
      this.ctx.stroke();
    }
    // 横線
    for (let row = 0; row < 8; row++) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, 40 * row);
      this.ctx.lineTo(320, 40 * row);
      this.ctx.stroke();
    }
    this.status = [...this.initialStatus];
    this.stone.put(4, 4, true);
    this.stone.put(5, 5, true);
    this.stone.put(4, 5, false);
    this.stone.put(5, 4, false);
  }

  // 盤面が埋まったかどうか
  isFull() {
    if (this.status.flat().indexOf(null) === -1) {
      return true;
    }
    return false;
  }

  // それぞれの色をカウント
  count() {
    const status = this.status.flat();
    return {
      white: status.filter(element => element === 1).length,
      black: status.filter(element => element === 0).length
    };
  }

  // 盤面を更新する
  update(putPosition, reversiblePositions, isWhite) {
    this.stone.put(putPosition.x, putPosition.y, isWhite);
    this.stone.update(reversiblePositions, isWhite);
    reversiblePositions.forEach(oneDirection => {
      oneDirection.forEach(reversiblePosition => {
        this.status[reversiblePosition[0] - 1][reversiblePosition[1] - 1] = isWhite ? 1 : 0;
      })
    });
    this.status[putPosition.y - 1][putPosition.x - 1] = isWhite ? 1 : 0;
  }

  // 石が置けるか判定する
  getReversiblePositions(x, y, isWhite) {
    // マス目[x, y]は1から始まるけどインデックスは0からなので1を引く
    const colorNumber = isWhite ? 1 : 0;
    // 8方向ごとのひっくり返せるセルの配列
    let reversiblePositions = [null, null, null, null, null, null, null, null];

    const updateReversiblePositions = (elementArray, next, i, number, array) => {
      // 隣に石がない or 同じ色ならだめ
      if (i === 1 && (next === null || next === colorNumber)) {
        return false;
      }

      // 隣が違う色で、2個以上隣に同じ色があればOK
      if (i > 1 && next === colorNumber) {
        reversiblePositions[number] = elementArray;
        return false;
      }
      elementArray.push(array);
      return true;
    };

    // 右方向
    const reversiblePositionsRight = [];
    for (let i=1; x+i<=8; i++) {
      const next = this.status[y-1][x-1 + i];
      if (! updateReversiblePositions(reversiblePositionsRight, next, i, 0, [y, x+i])) {
        break;
      }
    }
    // 下方向
    const reversiblePositionsDown = [];
    for (let i=1; y+i<=8; i++) {
      const next = this.status[y-1 + i][x-1];
      if (! updateReversiblePositions(reversiblePositionsDown, next, i, 1, [y+i, x])) {
        break;
      }
    }
    // 左方向
    const reversiblePositionsLeft = [];
    for (let i=1; x-i>0; i++) {
      const next = this.status[y-1][x-1 - i];
      if (! updateReversiblePositions(reversiblePositionsLeft, next, i, 2, [y, x-i])) {
        break;
      }
    }
    // 上方向
    const reversiblePositionsUp = [];
    for (let i=1; y-i>0; i++) {
      const next = this.status[y-1 - i][x-1];
      if (! updateReversiblePositions(reversiblePositionsUp, next, i, 3, [y-i, x])) {
        break;
      }
    }
    // 右下方向
    const reversiblePositionsRightDown = [];
    for (let i=1; x+i<=8 && y+i<8; i++) {
      const next = this.status[y-1 + i][x-1 + i];
      if (! updateReversiblePositions(reversiblePositionsRightDown, next, i, 4, [y+i, x+i])) {
        break;
      }
    }
    // 右上方向
    const reversiblePositionsRightUp = [];
    for (let i=1; x+i<=8 && y-i>0; i++) {
      const next = this.status[y-1 - i][x-1 + i];
      if (! updateReversiblePositions(reversiblePositionsRightUp, next, i, 5, [y-i, x+i])) {
        break;
      }
    }
    // 左下方向
    const reversiblePositionsLeftDown = [];
    for (let i=1; x-i>0 && y+i<8; i++) {
      const next = this.status[y-1 + i][x-1 - i];
      if (! updateReversiblePositions(reversiblePositionsLeftDown, next, i, 6, [y+i, x-i])) {
        break;
      }
    }
    // 左上方向
    const reversiblePositionsLeftUp = [];
    for (let i=1; x-i>0 && y-i>0; i++) {
      const next = this.status[y-1 - i][x-1 - i];
      if (! updateReversiblePositions(reversiblePositionsLeftUp, next, i, 7, [y-i, x-i])) {
        break;
      }
    }
    // 配列からnullを削除
    // 全方向だめなら空配列が返る
    return reversiblePositions = reversiblePositions.filter(element => element);
  }
}
