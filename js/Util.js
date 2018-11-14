let Util = {
    bottomMessageTimer: null, //底部提示信息计时器

    /**
     *获取当前系统时间
     * @returns {String}
     */
    getLocalTime() {
        let date = new Date(),
            hours = date.getHours();
            minutes = date.getMinutes();
        hours = hours < 10 ? `0${hours}` : hours;
        minutes = minutes < 10 ? `0${minutes}` : minutes;
        return `${hours}:${minutes}`;
    },

    /**
     * 全屏
     * @param {Element} elm  需要全屏的元素
     */
    fullScreen(elm) {
        var el = elm instanceof HTMLElement ? elm : document.documentElement;
        var rfs = el.requestFullscreen       || 
                el.webkitRequestFullscreen || 
                el.mozRequestFullScreen    || 
                el.msRequestFullscreen;
        if (rfs) {
            rfs.call(el);
        } else if (window.ActiveXObject) {
            var ws = new ActiveXObject("WScript.Shell");
            ws && ws.SendKeys("{F11}");
        }
    },

    /**
     * 退出全屏
     */
    exitFullscreen(){
        var efs = document.exitFullscreen       || 
                document.webkitExitFullscreen || 
                document.mozCancelFullScreen  || 
                document.msExitFullscreen;
        if (efs) {
            efs.call(document);
        } else if (window.ActiveXObject) {
            var ws = new ActiveXObject("WScript.Shell");
            ws && ws.SendKeys("{F11}");
        }
    },

    /**
     * 将ms转换成min:seconds格式
     */
    formatTime(ms) {
        let mins = Math.floor(ms / 3600.0) * 60.0 + Math.floor(ms % 3600.0 / 60.0),
            seconds = Math.floor(ms % 60.0);
        
        mins = mins < 10 ? "0" + mins : mins;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        return mins + ":" + seconds;
    },

    /**
     * 底部提示信息
     */
    showMessage(text, interval = 2000) {
        this.bottomMessageTimer && clearTimeout(this.bottomMessageTimer);
        let messageBottom = document.getElementsByClassName("message-bottom")[0];
        messageBottom.innerText = text;
        this.removeClass(messageBottom, "hide");

        this.bottomMessageTimer = setTimeout(() => {
            this.addClass(messageBottom, "hide");
        }, interval);
    },

    /**
     * 事件绑定
     *
     * @param {Element} elm
     * @param {String} eventType
     * @param {Function} handle
     * @param {Boolean} useCapture
     */
    addEvent(elm, eventType, handle, useCapture) {
        useCapture = useCapture || false;
        if(elm.addEventListener){           
            //如果支持addEventListener
            elm.addEventListener(eventType, handle, useCapture);
        }else if(elm.attachEvent){         
            //如果支持attachEvent
            elm.attachEvent("on" + eventType, handle);
        }else{                                 
            //否则使用兼容的onclick绑定
            elm["on" + eventType] = handle;
        }
    },

    /**
     * 事件解绑
     *
     * @param {Element} elm
     * @param {String} eventType
     * @param {Function} handle
     * @param {Boolean} useCapture
     */
    removeEvent(elm, eventType, handle, useCapture) {
        useCapture = useCapture || false;
        if(elm.addEventListener){
            elm.removeEventListener(eventType, handle, useCapture);
        }else if(elm.attachEvent){
            elm.detachEvent("on" + eventType, handle);
        }else{
            elm["on" + eventType] = null;
        }
    },

    /**
     * 切换show和hide样式
     * @param {Element} element element
     * @param {Boolean} flag 是否显示
     */
    toggleClass(element, flag, displayName) {
        if (!element) {
            return;
        }
        let cls = displayName || "show";
        let elmClass = element.getAttribute("class") || "";
        if (flag) {
            if (elmClass.indexOf("hide") > -1) {
                elmClass = elmClass.replace("hide", "");
                elmClass = elmClass.trim();
            }
            if (elmClass.indexOf(cls) < 0) {
                elmClass += ` ${cls}`;
            }
        }
        else {
            if (elmClass.indexOf(cls) > -1) {
                elmClass = elmClass.replace(cls, "").trim();
            }
            if (elmClass.indexOf("hide") < 0) {
                elmClass += ` hide`;
            }
        }
        element.setAttribute("class", elmClass);
    },

    /**
     * 添加样式
     * @param {Element} element element
     * @param {String} 样式名
     */
    addClass(element, className) {
        if (!element) {
            return;
        }
        let elmClass = element.getAttribute("class") || "";
        elmClass = elmClass.trim();
        if (className && elmClass.indexOf(className) < 0) {
            elmClass += ` ${className}`;
        }
        element.setAttribute("class", elmClass);
    },

    /**
     * 移除样式
     * @param {Element} element element
     * @param {String} 样式名
     */
    removeClass(element, className) {
        if (!element) {
            return;
        }
        let elmClass = element.getAttribute("class") || "";
        if (className && elmClass.indexOf(className) > -1) {
            elmClass = elmClass.replace(className, "").trim();
        }
        element.setAttribute("class", elmClass);
    },

    /**
     * 发送弹幕倒计时函数
     *
     * @param {Number} seconds 倒计时秒数
     * @param {Function} onCallBack 倒计时执行的方法
     * @param {Function} endCallBack 倒计结束执行的方法
     */
    timeCountdown(seconds, onCallBack, endCallBack) {
        let _this = this;
        if (seconds == 0) {
            endCallBack();
        } else { 
            onCallBack(seconds);
            seconds --;
            setTimeout(function() { 
                _this.timeCountdown(seconds, onCallBack, endCallBack);
            }, 1000)
        } 
    }
}