
let ctx = null;
if (barrageCanvas.getContext) {
    ctx = barrageCanvas.getContext('2d')
}

let BarrageUtil = {


    /**
     * 绘制弹幕
     */
    drawBarrage() {
        let p = new Barrage(ctx);
        p.draw();
    }
}



