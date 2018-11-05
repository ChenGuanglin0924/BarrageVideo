
let Barrage = function(canvas, context, options) {
    this.context = context;
    this.canvas = canvas;
    // this.options = options || {};
    this.x = this.canvas.clientWidth;
    //这里减去（播放工具栏）大概60的高度
    this.y = Math.floor(Math.random() * (this.canvas.clientHeight - 60));
    this.text = options.text || "";
    this.width = context.measureText(this.text).width;
    this.fontSize = options.fontSize || 12;
    this.color = options.color || "#fff";
    this.speed = options.speed || 4;
    this.date = options.date || "";
    this.time = options.time || "";
    // this.animation = null;
    // this.position = "random";  //random, top, bottom, center
    // this.userInfo = {
    //     userName: ""
    // }
    this.draw = () => {
        // this.context.save();
        this.context.textBaseline = "top";
        this.context.font = this.fontSize + "px";
        this.context.fillStyle = this.color;
        this.context.fillText(this.text, this.x, this.y);
        // this.context.restore();
    }
}

// options = {
//     barrages: [{
//         date: "2018-09-24",
//         time: "11:02",
//         text: "我爱你！",
//         size: "12",
//         color: "red",
//         speed: "5"
//     }],  //弹幕集合
//     opacity: 1,  //全局变量 不透明度
//     range: 1,  //弹幕显示范围 [0-1]
// }
let BarrageUtil = function(myVideo, canvas, options) {
    this.myVideo = myVideo;
    this.canvas = canvas;
    this.context = this.getContext();
    this.datas = options.datas;
    this.params = {
        opacity: options.opacity || 1,
        range: options.range || 1,
    }
    this.initBarrage();
    this.barrages = this.getBarrages();
}

BarrageUtil.prototype = {
    //获取context上下文
    getContext: function() {
        let context = null;
        if (this.canvas.getContext) {
            context = this.canvas.getContext('2d');
        }
        return context;
    },
    //获取barrage实例
    getBarrages: function() {
        let barrages = [], me = this;
        if (this.datas) {
            this.datas.forEach((data, idx) => {
                barrages.push(new Barrage(me.canvas, me.context, data))
            });
        }
        return barrages;
    },

    //绘制弹幕到canvas上
    draw: function() {
        let me = this;
        this.barrages.forEach(barrage => {
            // barrage.x -= barrage.speed;
            if (parseFloat(barrage.time) > me.myVideo.currentTime || (barrage.x + barrage.width) < 0) {
                return;
            } else {
                barrage.draw();
                barrage.x -= barrage.speed;
            }
        });
    },

    //初始化弹幕并发送
    render: function() {
        this.context.clearRect(0,0, this.canvas.width, this.canvas.height);
        this.draw();
        this.animation = window.requestAnimationFrame(this.render.bind(this));
    },

    //初始化弹幕
    initBarrage: function() {
        this.context.clearRect(0,0, this.canvas.width, this.canvas.height);
        window.cancelAnimationFrame(this.animation);
        // this.canvas.style.width = myVideo.clientWidth + "px";
        // this.canvas.style.height = myVideo.clientHeight + "px";
        this.canvas.width = myVideo.clientWidth;
        this.canvas.height = myVideo.clientHeight;
        this.barrages = null;
    },

    //暂停弹幕运动
    stopBarrage: function() {
        window.cancelAnimationFrame(this.animation);
    },

    //弹幕开始运动
    runBarrage: function() {
        this.animation = window.requestAnimationFrame(this.render.bind(this));
    },

    //增加弹幕
    addBarrage: function(barrage) {
        this.barrages.push(new Barrage(this.canvas, this.context, barrage));
    },

    //重置弹幕
    resetBarrage: function() {
        this.initBarrage();
        this.barrages = null;
        this.render();
    }

    // move: function () {
    //     this.context.save();
    //     // this.context.clearRect(0,0, this.canvas.width, this.canvas.height);
    //     this.draw();
    //     this.x -= this.speed;
    //     if (this.x + this.width <= 0) {
    //         window.cancelAnimationFrame(this.animation);
    //         return;
    //     }
    //     this.context.restore();
    //     this.animation = window.requestAnimationFrame(this.move.bind(this));
    // },

    // stop: function() {
    //     window.cancelAnimationFrame(this.animation);
    // },

    // destroy: function() {
    //     return;
    //     // this.context.clearRect(0,0, this.canvas.width, this.canvas.height);
    // }
}


