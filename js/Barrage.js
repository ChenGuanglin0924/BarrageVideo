// let Barrage = function(context, canvas, options) {
//     this.context = context;
//     this.canvas = canvas;
//     this.x = this.canvas.clientWidth;
//     this.y = Math.floor(Math.random() * this.canvas.clientHeight);
//     this.text = text || "";
//     this.width = this.context.measureText(text).width;
//     this.fontSize = fontSize || 12;
//     this.color = color || "#fff";
//     this.speed = speed || 4;
//     this.animation = null;
//     // this.position = "random";  //random, top, bottom, center
//     this.userInfo = {
//         userName: ""
//     }
//     this.draw = () => {
//         // this.context.save();
//         this.context.textBaseline = "top";
//         this.context.font = this.fontSize + "px";
//         this.context.fillStyle = this.color;
//         this.context.fillText(this.text, this.x, this.y);
//         // this.context.restore();
//     }
// }

// // options = {
// //     barrages: [{
// //         date: "2018-09-24",
// //         time: "11:02",
// //         text: "我爱你！",
// //         size: "12",
// //         color: "red",
// //         speed: "5"
// //     }],  //弹幕集合
// //     opacity: 1,  //全局变量 不透明度
// //     range: 1,  //弹幕显示范围 [0-1]
// // }
// let BarrageUtil = function(context, canvas, options) {
//     this.context = context;
//     this.canvas = canvas;
//     this.options = options || {};
//     this.datas = this.options.datas;
//     this.params = {
//         opacity: this.options.opacity || 1,
//         range: this.options.range || 1,
//     }
//     this.barrages = this.getBarrages();
// }

// BarrageUtil.prototype = {
//     //获取barrage实例
//     getBarrages: function() {
//         let barrages = [], me = this;
//         if (this.datas) {
//             this.datas.forEach((data, idx) => {
//                 barrages.push(new Barrage(me.context, me.canvas, data))
//             });
//         }
//         return barrages;
//     },

//     //绘制弹幕到canvas上
//     draw: function() {
//         this.barrages.forEach(barrage => {
//             barrage.draw();
//         });
//     },

//     move: function () {
//         this.context.save();
//         // this.context.clearRect(0,0, this.canvas.width, this.canvas.height);
//         this.draw();
//         this.x -= this.speed;
//         if (this.x + this.width <= 0) {
//             window.cancelAnimationFrame(this.animation);
//             return;
//         }
//         this.context.restore();
//         this.animation = window.requestAnimationFrame(this.move.bind(this));
//     },

//     stop: function() {
//         window.cancelAnimationFrame(this.animation);
//     },

//     destroy: function() {
//         return;
//         // this.context.clearRect(0,0, this.canvas.width, this.canvas.height);
//     }
// }