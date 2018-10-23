let Barrage = function(context) {
    this.context = context;
    this.x = 0;
    this.y = 0;
    this.text = "";
    this.width = this.context.measureText(text);
    this.fontSize = 12;
    this.color = "#fff";
    this.speed = 5;
    this.position = "random";  //random, top, bottom, center
    this.userInfo = {
        userName: ""
    }
}

Barrage.prototype = {
    draw: () => {
        this.context.save();
        this.context.font = fontSize + "px";
        this.context.fillStyle = color;
        this.context.fillText(text, x, y);
        this.context.restore();
    }
}