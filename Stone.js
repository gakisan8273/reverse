// 石を操作する → 配置する、描画を更新する
class Stone {
  constructor() {
    this.canvas = document.getElementById('reversi');
    this.ctx = this.canvas.getContext('2d');
  }

  // 石を新規に配置する
  put(x, y, isWhite) {
    this.ctx.fillStyle = isWhite ? 'white' : 'black';
    this.ctx.beginPath();
    this.ctx.arc((x - 1) * 40 + 20, (y - 1) * 40 + 20, 16, 0, 2 * Math.PI);
    this.ctx.fill();
  }

  // 配置されている石を描画し直す（色を変える）
  update(positions, isWhite) {
    this.ctx.fillStyle = isWhite ? 'white' : 'black';
    // positions[0]にしたくない
    positions.forEach(oneDirection => {
      oneDirection.forEach(position => {
        this.ctx.beginPath();
        this.ctx.arc((position[1] - 1) * 40 + 20, (position[0] - 1) * 40 + 20, 16, 0, 2 * Math.PI);
        this.ctx.fill();
      })
    })
  }
}
