
let Barrage = function(canvas, context, options) {
    this.context = context;
    this.canvas = canvas;
    // this.options = options || {};
    this.random = Math.random();
    this.x = this.canvas.clientWidth;
    this.y = this.canvas.clientHeight * this.random;
    this.text = options.text || "";
    this.width = context.measureText(this.text).width;
    this.fontSize = options.fontSize || 20;
    this.color = options.color || "#D9E3F0";
    this.speed = options.speed || 3;
    this.time = options.time || "";
    // this.animation = null;
    // this.position = "random";  //random, top, bottom, center
    // this.userInfo = {
    //     userName: ""
    // }
    this.draw = (options) => {
        // this.context.save();
        if (options && typeof options.opacity === 'number') {
            this.context.globalAlpha  = options.opacity;
        }
        if (options && options.range instanceof Array) {
            this.y = 
            this.canvas.clientHeight * options.range[0] + Math.floor((options.range[1] - options.range[0]) * this.canvas.clientHeight * this.random);
        }
        this.context.textBaseline = "top";
        this.context.font = "bold " + this.fontSize + "px sans-serif";
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
//     range: [0-.9],  //弹幕显示范围 [0-.9]
// }
let BarrageUtil = function(myVideo, canvas, options) {
    this.myVideo = myVideo;
    this.canvas = canvas;
    // this.canvasWidth = this.canvas.clientWidth;
    // this.canvasHeight = this.canvas.clientHeight;
    this.context = this.getContext();
    this.data = options.data;
    this.params = {
        opacity: options.style.opacity || 1,
        range: options.style.range || [0, .9],
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
        if (this.data) {
            this.data.forEach((data, idx) => {
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
            if (parseInt(barrage.time) === parseInt(me.myVideo.currentTime) || 
                ((barrage.x + barrage.width) > 0 && barrage.x < me.canvas.clientWidth))  {
                    barrage.draw(this.params);
                    barrage.x -= barrage.speed;
            }
        });
    },

    //初始化弹幕并发送
    render: function() {
        this.context.clearRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);
        this.draw();
        this.animation = window.requestAnimationFrame(this.render.bind(this));
    },

    //初始化弹幕
    initBarrage: function() {
        this.context.clearRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);
        window.cancelAnimationFrame(this.animation);
        // let scaleX = this.canvasWidth / this.myVideo.clientWidth;
        // let scaleY = this.canvasHeight / this.myVideo.clientHeight;
        this.canvas.width = this.myVideo.clientWidth;
        this.canvas.height = this.myVideo.clientHeight;
        // this.context.scale(scaleX, scaleY);
        // this.barrages = null;
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
        let me = this;
        this.initBarrage();
        this.barrages.forEach(barrage => {
            if (barrage.time < this.myVideo.currentTime) {
                barrage.x = -1 * barrage.width;
            } else {
                barrage.x = me.canvas.clientWidth;
            }
        });
        this.render();
    },

    //销毁弹幕
    destroy: function() {
        this.initBarrage();
    },

    //设置弹幕显示样式
    setStyle: function(style = {}) {
        for (const key in style) {
            this.params[key] = style[key];
        }
    },
}


