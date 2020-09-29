// ゲーム全体を管理する
class Game {
  constructor() {
    this.board = new Board();
    this.isWhite = true;
    this.win = null;
    this.passCount = 0;
  }

  initialize() {
    this.isWhite = true;
    this.win = null;
    this.board.initialize();
  }

  // プレイヤーが座標をクリックすると石を置く
  put(event) {
    // マス目[1, 1]から[8, 8]までのどれか
    const putPosition = {
      x: Math.floor((event.offsetX - 40 > 0 ? event.offsetX : 0) / 40) + 1,
      y: Math.floor((event.offsetY - 40 > 0 ? event.offsetY : 0) / 40) + 1,
    };

    console.log('プレイヤー: ' + (this.isWhite ? '白' : '黒'));
    console.log('(x:' + putPosition.x + ', y:' + putPosition.y + ') に石を置こうとした');
    // 石が置けるかどうか判定
    if (this.board.status[putPosition.y - 1][putPosition.x - 1] !== null) {
      alert('すでに石が置いてあります');
      return;
    }

    // 戻り値は1から始まるマス目の配列 [[1, 1], [1, 2], ...]
    const reversiblePositions = this.board.getReversiblePositions(putPosition.x, putPosition.y, this.isWhite);
    if (reversiblePositions.length === 0) {
      alert('ひっくり返せる石がありません');
      return;
    }

    // 盤面状態を更新する → 石を置く → 石の描画を更新する
    console.log('盤面更新');
    this.board.update(putPosition, reversiblePositions, this.isWhite);

    // 石をカウントする
    console.log('カウント');
    const count = this.board.count();
    document.getElementById('count').textContent = '白: ' + count.white + ' 黒:' + count.black;

    if (this.board.isFull()) {
      this.end(count);
      return;
    }

    // ゲーム終了でなければプレイヤーを交代する
    console.log('プレイヤー交代');
    this.changePlayer();

    // 置ける場所がなかったらパス 両者とも置けなければゲーム終了
    console.log('パス判定');
    this.judgeIfPass();
  }

  judgeIfPass() {
    if (!this.existsPutPosition()) {
      alert('置く場所がありません。パスします。');
      this.changePlayer();
      if (!this.existsPutPosition()) {
        // 両者とも置けなければゲーム終了
        alert('置く場所がありません。ゲーム終了です。');
        this.end(count);
        return;
      }
    }
  }

  existsPutPosition() {
    const canPutPosition = [];
    for (let i=1; i<=8; i++) {
      for (let j=1; j<=8; j++) {
        // 石が置いてあるセルは除外する
        if (this.board.status[j-1][i-1] === null) {
          canPutPosition.push(this.board.getReversiblePositions(i, j, this.isWhite));
        }
      }
    }
    console.log(canPutPosition);
    console.log(canPutPosition.flat(2));
    return Boolean(canPutPosition.flat(2).length);
  }

  changePlayer() {
    this.isWhite = !this.isWhite;
    document.getElementById('turn').textContent = (this.isWhite ? '白' : '黒') + 'のターン';
  }

  end(count) {
    console.log('終了');
    const result = count.white + ' vs ' + count.black;
    let message;
    if (count.white > count.black) {
      message = '白の勝利';
      this.win = 1;
    } else if (count.white < count.black) {
      message = '黒の勝利';
      this.win = 0;
    } else {
      message = '引き分け';
      this.win = 2;
    }
    alert(result + '\n' + message);
    document.getElementById('win').textContent = message;
    return;
  }
}
