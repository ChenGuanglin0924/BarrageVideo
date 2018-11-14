let myVideo = document.getElementById("myVideo"),
    barrageCanvas = document.getElementById('barrageCanvas'),
    // videoBarrage = document.getElementsByClassName("video-barrage")[0],
    videoContainer = document.getElementsByClassName("video-container")[0],
    videoControl = document.getElementsByClassName("video-control")[0],
    playToolDIV = document.getElementsByClassName("play-tool")[0],
    reloadToolDIV = document.getElementsByClassName("reload-tool")[0],
    timeCurrentDIV = document.getElementsByClassName("time-current")[0],
    timeTotalDIV = document.getElementsByClassName("time-total")[0],
    barrageToolDIV = document.getElementsByClassName("barrage-tool")[0],
    volumeToolDIV = document.getElementsByClassName("volume-tool")[0],
    settingToolDIV = document.getElementsByClassName("setting-tool")[0],
    fullscreenToolDIV = document.getElementsByClassName("fullscreen-tool")[0];
    processContainerDIV = document.getElementsByClassName("process-container")[0],
    processBarDIV = document.getElementsByClassName("process-bar")[0],
    cacheBar = document.getElementsByClassName("cache-bar")[0],
    playBar = document.getElementsByClassName("play-bar")[0],
    adjustToolDIV = document.getElementsByClassName("adjust-tool")[0],
    processInfoDIV = document.getElementsByClassName("process-info")[0],
    volumeContainerDIV = document.getElementsByClassName("volume-container")[0],
    volumeValueDIV = document.getElementsByClassName("volume-value")[0],
    volumeSliderBgDIV = document.getElementsByClassName("volume-slider-bg")[0],
    volumeBgDIV = document.getElementsByClassName("volume-bg")[0],
    volumeSliderDIV = document.getElementsByClassName("volume-slider")[0];
    volumeContentDIV = document.getElementsByClassName("volume-content")[0];
    videoPoster = document.getElementsByClassName("video-poster")[0];
    videoWaitting = document.getElementsByClassName("video-waitting")[0];
    // posterClose = videoPoster.getElementsByClassName("close")[0];
    sendBarrageValue = document.getElementsByClassName("send-barrage-value")[0];
    sendBarrageBtn = document.getElementsByClassName("send-barrage-btn")[0];
    rateContent = document.getElementsByClassName("rate-content")[0];
    barrageTool = document.getElementsByClassName("barrage-tool")[0];
    barrageOpacityTool = document.getElementsByClassName("barrage-opacity")[0];
    barrageRangeTool = document.getElementsByClassName("barrage-range")[0];
    sendFontsizeTool = document.getElementsByClassName("send-fontsize")[0];
    sendSpeedTool = document.getElementsByClassName("send-speed")[0];
    sendColorTool = document.getElementsByClassName("send-color")[0];
    videoTopMenu = document.getElementsByClassName("video-top-menu")[0];
    videoSizeTool = document.getElementsByClassName("video-size")[0];
    
let opacityObj = {
    "无": 0.0,
    "低": 0.3,
    "中": 0.6,
    "高": 1.0
}
let rangeObj = {
    "全屏": [0, .9],
    "顶部": [0, .4],
    "底部": [.5, .9],
}
let barrageSizeObj = {
    "极小": 12,
    "小": 16,
    "正常": 20,
    "大":24,
    "极大": 28
}
let speedObj = {
    "慢速": 1,
    "正常": 3,
    "快速": 5
}

const VOLUME_SLIDER_BG_HEIGHT = 100;

let timeTotal = 0, 
    timeCurrent = 0, 
    timeCache = 0, 
    isFullScreen = false,
    isProcessMove = false,
    videoVolume = 50,
    videoMuted = false,
    videoControlTimer = null,
    isChangeProcess = false
    isChangeVolume = false,
    barrageUtil = null,
    isFullScreen = false,
    playbackRate = 1,
    isBarrageOn = true,
    barrageStyle = {
        opacity: 1,
        range: [0, .9]
    },
    sendStyle = {
        fontSize: 20,
        speed: 3,
        color: "#D9E3F0"
    },
    isSendingBarrage = false,
    firstClickTime = null;  //用来记录双击事件中第一次点击的时间

Util.addEvent(myVideo, "loadeddata", initVideo);
Util.addEvent(myVideo, "timeupdate", setCurrentTime);
Util.addEvent(myVideo, "progress", setCacheTime);
Util.addEvent(myVideo, "waiting", showLoading);
Util.addEvent(myVideo, "canplaythrough", hideLoading);
Util.addEvent(myVideo, "seeked", seeked);
Util.addEvent(playToolDIV, "click", changePlayStatus);
Util.addEvent(fullscreenToolDIV, "click", changeScreenStatus);
Util.addEvent(processContainerDIV, "mousedown", processMousedown);
Util.addEvent(processContainerDIV, "mousemove", showProcessInfo);
Util.addEvent(volumeSliderBgDIV, "mousedown", changeVideoVolume);
Util.addEvent(volumeToolDIV, "mousedown", changeVolumeMute);
Util.addEvent(videoContainer, "mouseenter", mouseOverVideo);
Util.addEvent(videoContainer, "mouseleave", mouseLeaveVideo);
Util.addEvent(videoContainer, "click", videoClicked);
Util.addEvent(videoContainer, "dblclick", videoDBClicked);
Util.addEvent(videoControl, "mouseover", showVideoControl);
Util.addEvent(videoTopMenu, "mouseover", showVideoControl);
Util.addEvent(videoPoster, "click", go2PosterUrl);
Util.addEvent(sendBarrageBtn, "click", sendBarrage);
Util.addEvent(reloadToolDIV, "click", reloadVideo);
Util.addEvent(rateContent, "click", changePlayRate);
Util.addEvent(barrageTool, "click", switchVideoBarrage);
Util.addEvent(barrageOpacityTool, "click", changeBarrageOpacity);
Util.addEvent(barrageRangeTool, "click", changeBarrageRange);
Util.addEvent(sendFontsizeTool, "click", setSendSize);
Util.addEvent(sendSpeedTool, "click", setSendSpeed);
Util.addEvent(sendColorTool, "click", setSendColor);
Util.addEvent(sendBarrageValue, "focus", () => {isSendingBarrage = true});
Util.addEvent(sendBarrageValue, "blur", () => {isSendingBarrage = false});
Util.addEvent(videoSizeTool, "click", changeVideoSize);

//全屏事件监听
Util.addEvent(document, "fullscreenchange", changeFullScreenStatus);
Util.addEvent(document, "webkitfullscreenchange", changeFullScreenStatus);
Util.addEvent(document, "mozfullscreenchange", changeFullScreenStatus);
Util.addEvent(document, "MSFullscreenChange", changeFullScreenStatus);
//监听键盘点击事件
Util.addEvent(videoContainer, "keyup", keyUpEvent);
Util.addEvent(myVideo, "error", videoError);

/**
 *全屏状态下改变video尺寸
 * @param {Event} e
 */
function changeVideoSize(e) {
    e.stopPropagation();
    let elm = e.target.tagName === "LI" ? e.target : e.target.parentNode;
    if (elm.tagName !== "LI") {
        return;
    }
    let size = elm.innerText.trim();
    if (size === "FillScreen") {
        myVideo.style.objectFit = "fill";
        myVideo.style.width = "100%";
        myVideo.style.height = "100%";
    } else {
        myVideo.style.objectFit = "contain";
        myVideo.style.width = size;
        // myVideo.style.height = size;
    }
    Util.removeClass(elm.parentNode.getElementsByClassName("active")[0], "active");
    Util.addClass(elm, "active");
}

/**
 * 视频错误
 */
function videoError() {
    Util.showMessage("视频错误", 5000);
}

/**
 *键盘事件
 * @param {Event} e
 */
function keyUpEvent(e) {
    switch (e.keyCode) {
        //上
        case 38:
            videoVolume = videoMuted ? 0 : videoVolume;
            videoVolume = videoVolume >= 100 ? 100 : videoVolume + 5;
            videoMuted = videoMuted ? false : videoMuted;
            updateVolume(videoVolume, videoMuted);
            Util.showMessage("音量 " + videoVolume, 2000);
            break;
        //下
        case 40:
            if(!videoMuted) {
                videoVolume = videoVolume <= 0 ? 0 : videoVolume - 5;
                updateVolume(videoVolume, videoMuted);
                Util.showMessage("音量 " + videoVolume, 2000);
            } else{
                Util.showMessage("音量 " + 0, 2000);
            }
            break;
        //左
        case 37:
            timeCurrent = timeCurrent <= 0 ? 0 : timeCurrent - 10;
            updateCurrentProcess(timeCurrent);
            Util.showMessage("快退 10s", 2000);
        break;
        //右
        case 39:
            timeCurrent = timeCurrent >= timeTotal ? timeTotal : timeCurrent + 10;
            updateCurrentProcess(timeCurrent);
            Util.showMessage("快进 10s", 2000);
            break;
        //空格
        case 32:
            if (document.activeElement !== sendBarrageValue) {
                changePlayStatus();
            }
            break;  
        //回车
        case 13:
        case 108:
            if (document.activeElement === sendBarrageValue) {
                sendBarrage();
            }
            break;  
        default:
            break;
    }
    return false;
}

/**
 * 设置弹幕发送字体大小
 */
function setSendSize(e) {
    e.stopPropagation();
    if (e.target.tagName === "LI") {
        let key = e.target.innerText;
        if (key && Object.keys(barrageSizeObj).indexOf(key) > -1) {
            sendStyle.fontSize = barrageSizeObj[key];
            Util.removeClass(e.target.parentNode.getElementsByClassName("active")[0], "active");
            Util.addClass(e.target, "active");
        }
    }
}

/**
 * 设置弹幕发送移动速度
 */
function setSendSpeed(e) {
    e.stopPropagation();
    if (e.target.tagName === "LI") {
        let key = e.target.innerText;
        if (key && Object.keys(speedObj).indexOf(key) > -1) {
            sendStyle.speed = speedObj[key];
            Util.removeClass(e.target.parentNode.getElementsByClassName("active")[0], "active");
            Util.addClass(e.target, "active");
        }
    }
}

/**
 * 设置弹幕发送显示颜色
 */
function setSendColor(e) {
    e.stopPropagation();
    let elm = e.target.tagName === "LI" ? e.target : e.target.parentNode;
    let key = elm.style.backgroundColor;
    if (key) {
        sendStyle.color = key;
        Util.removeClass(elm.parentNode.getElementsByClassName("active")[0], "active");
        Util.addClass(elm, "active");
    }
}

/**
 * 手动改变播放时间时重置弹幕
 */
function seeked() {
    barrageUtil.resetBarrage();
}

/**
 * 改变弹幕显示区域
 */
function changeBarrageRange(e) {
    e.stopPropagation();
    let elm = e.target.tagName === "LI" ? e.target : e.target.parentNode;
    let key = elm.innerText;
    if (key && Object.keys(rangeObj).indexOf(key) > -1) {
        barrageStyle.range = rangeObj[key];
        Util.removeClass(elm.parentNode.getElementsByClassName("active")[0], "active");
        Util.addClass(elm, "active");
    }
    if (barrageUtil) {
        barrageUtil.setStyle(barrageStyle);
    }
}

/**
 * 改变弹幕不透明度
 */
function changeBarrageOpacity(e) {
    e.stopPropagation();
    if (e.target.tagName === "LI") {
        let key = e.target.innerText;
        let elm = e.target.parentNode.getElementsByClassName("active");
        if (elm) {
            Util.removeClass(e.target.parentNode.getElementsByClassName("active")[0], "active");
        }
        Util.addClass(e.target, "active");
        if (Object.keys(opacityObj).indexOf(key) > -1) {
            barrageStyle.opacity = opacityObj[key];
        }
        if (barrageUtil) {
            barrageUtil.setStyle(barrageStyle);
        }
    }
}

/**
 * 切换弹幕开关
 */
function switchVideoBarrage(e) {
    e.stopPropagation();
    if (e.currentTarget.className.indexOf("on") > -1) {
        Util.removeClass(e.currentTarget, "on");
        isBarrageOn = false;
        if (barrageUtil) {
            barrageUtil.destroy();
            barrageUtil = null;
        }
    } else {
        Util.addClass(e.currentTarget, "on");
        isBarrageOn = true;
        if (barrageUtil) {
            barrageUtil.render();
        } else {
            barrageUtil = new BarrageUtil(
                myVideo, barrageCanvas, {
                    data: barrages, 
                    style: barrageStyle
                });
            barrageUtil.render();
        }
    }
}

/**
 * 全屏和非全屏状态改变事件
 */
function changeFullScreenStatus() {
    let fullscreenElement = document.fullscreenElement 
        || document.mozFullScreenElement 
        || document.webkitFullscreenElement;
    if (fullscreenElement) {
        Util.removeClass(fullscreenToolDIV, "h5-video-fullscreen");
        Util.addClass(fullscreenToolDIV, "h5-video-mini-screen");
        Util.toggleClass(videoTopMenu, true, "flex");
        isFullScreen = true;
    } else {
        Util.removeClass(fullscreenToolDIV, "h5-video-mini-screen");
        Util.addClass(fullscreenToolDIV, "h5-video-fullscreen");
        Util.toggleClass(videoTopMenu, false, "flex");
        myVideo.style = "";
        //暂时先这样处理
        Util.removeClass(videoSizeTool.getElementsByClassName("active")[0], "active");
        Util.addClass(videoSizeTool.getElementsByTagName("li")[2], "active");
        isFullScreen = false;
    }
    if (barrageUtil) {
        barrageUtil.resetBarrage();
    }
}

/**
 * 改变播放速率
 */
function changePlayRate(e) {
    e.stopPropagation();
    if (e.target.tagName === "LI") {
        playbackRate =  parseFloat(e.target.innerText.split(" ")[1]);
        myVideo.playbackRate = playbackRate;
        let elm = e.target.parentNode.getElementsByClassName("active");
        if (elm) {
            Util.removeClass(e.target.parentNode.getElementsByClassName("active")[0], "active");
        }
        Util.addClass(e.target, "active");
    }
}

/**
 * 视频重加载
 */
function reloadVideo(e) {
    e.stopPropagation();
    pauseVideo();
    myVideo.load();
    if (barrageUtil) {
        barrageUtil.initBarrage();
        barrageUtil = null;
    }
}

/**
 *发送弹幕
 */
function sendBarrage() {
    let val = sendBarrageValue.value;
    if (sendBarrageBtn.className.indexOf("disable") > -1 || timeCurrent <= 0) {
        return;
    }
    if (val.length > 25) {
        Util.showMessage("弹幕不能贪多，最多25个字哦~", 2000);
        return;
    }
    if (!val || val.trim() === "") {
        Util.showMessage("不能发送空弹幕哦~", 2000);
        return;
    }
    sendBarrageValue.value = "";
    barrageUtil && barrageUtil.addBarrage({
        time: timeCurrent + 1,  //时间+1保证弹幕能够发出
        text: val,
        fontSize: sendStyle.fontSize,
        color: sendStyle.color,
        speed: sendStyle.speed
    });
    //弹幕发送间隔为3秒
    Util.timeCountdown(3, (result)=>{
        sendBarrageBtn.innerText = result + "";
        Util.addClass(sendBarrageBtn, "disable");
    }, ()=>{
        sendBarrageBtn.innerText = "发送";
        Util.removeClass(sendBarrageBtn, "disable");
    });
}

/**
 * 显示loading
 */
function showLoading() {
    Util.toggleClass(videoWaitting, true);
}

/**
 * 隐藏loading
 */
function hideLoading() {
    Util.toggleClass(videoWaitting, false);
}

/**
 * 暂停海报点击事件
 */
function go2PosterUrl(e) {
    e = e || window.event;
    if (e.target.className.indexOf("close") > -1) {
        Util.toggleClass(videoPoster, false);
    }
    else {
        window.open("https://www.baidu.com");
    }
}

/**
 * 视频点击事件
 * @param {Event} e 
 */
function videoClicked(e) {
    if (e.target === barrageCanvas) {
        clearTimeout(firstClickTime);
        firstClickTime = setTimeout(() => {
            changePlayStatus(); 
        }, 300);
    }
}

/**
 * 视频双击事件
 * @param {Event} e 
 */
function videoDBClicked(e) {
    if (e.target === barrageCanvas) {
        clearTimeout(firstClickTime);
        changeScreenStatus();
    }
}

/**
 * 鼠标移动
 */
function mouseOverVideo() {
    Util.toggleClass(videoControl, true);
    isFullScreen && Util.toggleClass(videoTopMenu, true, "flex");
    Util.addEvent(videoContainer, "mousemove", mouseInVideo);
}

/**
 * 鼠标移动或静止
 */
function mouseInVideo(e) {
    Util.toggleClass(videoControl, true);
    isFullScreen && Util.toggleClass(videoTopMenu, true, "flex");
    if (videoControlTimer) {
        clearTimeout(videoControlTimer);
    }
    if (e.target === barrageCanvas && !isChangeVolume && !isChangeProcess && !isSendingBarrage) {
        videoControlTimer = setTimeout(function () {
            Util.toggleClass(videoControl, false);
            isFullScreen && Util.toggleClass(videoTopMenu, false, "flex");
        }, 3000);
    }
}

/**
 * 鼠标移出video
 */
function mouseLeaveVideo() {
    if (videoControlTimer) {
        clearTimeout(videoControlTimer);
    }
    if (!isChangeProcess && !isChangeVolume && !isSendingBarrage) {
        videoControlTimer = setTimeout(function () {
            Util.toggleClass(videoControl, false);
            isFullScreen && Util.toggleClass(videoTopMenu, false, "flex");
        }, 3000);
    }
}

/**
 * 鼠标在工具栏上
 */
function showVideoControl() {
    Util.toggleClass(videoControl, true);
    isFullScreen && Util.toggleClass(videoTopMenu, true, "flex");
    
    if (videoControlTimer) {
        clearTimeout(videoControlTimer);
    }
    Util.addEvent(videoControl, "mouseleave", hideVideoControl);
    isFullScreen && Util.addEvent(videoTopMenu, "mouseleave", hideVideoControl);
}

/**
 * 鼠标移出工具栏，隐藏工具栏
 */
function hideVideoControl() {
    if (videoControlTimer) {
        clearTimeout(videoControlTimer);
    }
    videoControlTimer = setTimeout(function () {
        Util.toggleClass(videoControl, false);
        isFullScreen && Util.toggleClass(videoTopMenu, false, "flex");
        Util.addEvent(videoControl, "mouseleave", hideVideoControl);
        isFullScreen && Util.addEvent(videoTopMenu, "mouseleave", hideVideoControl);
    }, 3000);
}


/**
 * 切换静音和非静音状态
 */
function changeVolumeMute() {
    videoMuted = videoVolume === 0 ? false : !videoMuted;
    videoVolume = videoVolume === 0 ? 50 : videoVolume;
    updateVolume(videoVolume, videoMuted);
    // videoMuted = !videoMuted;
    // myVideo.muted = videoMuted;
    // if (videoMuted) {
    //     updateVolume(0, videoMuted);
    // }
    // else {
    //     if (videoVolume === 0) {
    //         videoVolume = 50;
    //     }
    //     updateVolume(videoVolume, videoMuted);
    // }
}

/**
 * 更新音量大小和状态
 * @param {Number} volume 音量大小
 * @param {Boolean} muted 是否静音
 */
function updateVolume(volume = 50, muted = false) {
    let delta = volumeSliderDIV.offsetHeight / 2;
    if (volume === 0 || muted) {
        Util.removeClass(volumeToolDIV, "h5-video-volume-on");
        Util.addClass(volumeToolDIV, "h5-video-volume-off");
        volumeSliderDIV.style.top = 100 - delta + "%";
        volumeBgDIV.style.height = 0 + "%";
        volumeValueDIV.innerText = 0 + "%";
    }
    else {
        Util.removeClass(volumeToolDIV, "h5-video-volume-off");
        Util.addClass(volumeToolDIV, "h5-video-volume-on");
        volumeSliderDIV.style.top = 100 - volume - delta + "%";
        volumeBgDIV.style.height = volume + "%";
        volumeValueDIV.innerText = volume + "%";
    }
    // videoVolume = volume;
    myVideo.volume = volume / VOLUME_SLIDER_BG_HEIGHT;
    // videoMuted = muted;
    myVideo.muted = muted;
}

/**
 * 改变音量大小
 * @param {Event} e 
 */
function changeVideoVolume(e) {
    e = e || window.event;
    if (e.button !== 0) {
        return;
    }
    // let delta = volumeSliderDIV.offsetHeight / 2;
    if (e.target === volumeSliderBgDIV || e.target === volumeBgDIV) {
        let top = e.target === volumeSliderBgDIV ? e.offsetY : e.offsetY + e.target.offsetTop; 
        top = top < 0 ? 0 : top;
        top = top > VOLUME_SLIDER_BG_HEIGHT ? VOLUME_SLIDER_BG_HEIGHT : top;

        videoVolume = 100 - top;
        updateVolume(videoVolume, videoMuted);
    } else if(e.target === volumeSliderDIV) {
        isChangeVolume = true;
        Util.addClass(volumeContentDIV, "show");
        Util.addClass(videoControl, "show");
        let top = e.clientY - volumeSliderDIV.offsetTop;
        document.onmousemove = VolumeBarDragging.bind(e, top);
        document.onmouseup = VolumeBarUp;
    }
}

/**
 * 音量拖动事件
 * @param {*} e 
 */
function VolumeBarDragging(top, e) {
    e = e || window.event;
    if (e.button !== 0) {
        return;
    }
    let yTop = e.clientY - top;
    if (yTop <= 0) {
        yTop = 0;
    };
    if (yTop >= volumeSliderBgDIV.clientHeight) {
        yTop = volumeSliderBgDIV.clientHeight;
    };
    videoVolume = 100 - yTop;
    updateVolume(videoVolume, videoMuted);
}

/**
 * 停止音量拖动
 */
function VolumeBarUp(e) {
    isChangeVolume = false;
    // Util.removeClass(videoControl, "show");
    Util.removeClass(volumeContentDIV, "show");
    document.onmousemove = null;
    document.onmouseup = null;
}

/**
 * 进度条鼠标按下事件
 * @param {Event} e 
 */
function processMousedown(e) {
    if (e.button !== 0) {
        return;
    }
    let left = getProcessLeft(e);
    let percentLeft = left / processContainerDIV.offsetWidth;
    timeCurrent = percentLeft * timeTotal;
    // myVideo.currentTime = timeCurrent
    // adjustToolDIV.style.left = percentLeft * 100 + "%";
    updateCurrentProcess(timeCurrent);
    //拖动时一直显示进度条
    isChangeProcess = true;
    Util.addClass(processContainerDIV, "process-active");
    Util.addEvent(document, "mousemove", processMousemove);
    Util.addEvent(document, "mouseup", processMouseup);
    // document.onmousemove = processMousemove;
    // document.onmouseup = processMouseup;
    // document.addEventListener("mousemove", processMousemove);
    // document.addEventListener("mouseup", processMouseup);
}

/**
 * 进度条拖动事件
 * @param {Event} e 
 */
function processMousemove(e) {
    e = e || window.event;
    let processBarWidth = processBarDIV.offsetWidth,
        delta = processInfoDIV.clientWidth / 2;
    let left = e.clientX - videoContainer.offsetLeft;
    if (left <= 0) {
        left = 0;
    }
    if (left >= processBarWidth) {
        left = processBarWidth;
    }
    let infoLeft = left - delta;
    infoLeft = infoLeft < 0 ? 0 : infoLeft;
    infoLeft = infoLeft > left + delta ? left + delta : infoLeft;
    
    let percentLeft = left / processBarWidth;
    timeCurrent = percentLeft * timeTotal;
    // adjustToolDIV.style.left = percentLeft * 100 + "%";
    // myVideo.currentTime = timeCurrent;

    updateCurrentProcess(timeCurrent);

    processInfoDIV.style.left = infoLeft / processBarWidth * 100 + "%";
    processInfoDIV.innerText = Util.formatTime(percentLeft * timeTotal);
    Util.removeEvent(processContainerDIV, "mousemove", showProcessInfo);
}

/**
 * 鼠标移出进度条
 * @param {Event} e 
 */
function processMouseup() {
    isChangeProcss = false;
    Util.removeClass(processContainerDIV, "process-active");
    // document.onmousemove = null;
    // document.onmouseup = null;
    Util.removeEvent(document, "mousemove", processMousemove);
    Util.removeEvent(document, "mousemove", processMouseup);
    Util.addEvent(processContainerDIV, "mousemove", showProcessInfo);
}

/**
 * 鼠标移入进度条显示当前时间
 * @param {Event} e 
 */
function showProcessInfo(e) {
    e = e || window.event;
    let processBarWidth = processContainerDIV.offsetWidth,
        infoWidth = processInfoDIV.clientWidth,
        left = getProcessLeft(e),
        infoLeft = (left - infoWidth / 2) / processBarWidth,
        info = Util.formatTime(left / processBarWidth * timeTotal);
    if (left < infoWidth / 2) {
        infoLeft = 0;
    }
    if (left > processBarWidth - infoWidth / 2) {
        infoLeft = (processBarWidth - infoWidth) / processBarWidth;
    }
    processInfoDIV.style.left = infoLeft * 100 + "%";
    processInfoDIV.innerText = info;
}

/**
 * 获取进度条点击位置长度
 * @param {Object} e 事件源对象
 */
function getProcessLeft(e) {
    e = e || window.event;
    let left = e.offsetX, processContainerWidth = processContainerDIV.offsetWidth;
    if (e.target.className === "adjust-tool") {
        let innerLeft = e.target.style.left || 0;
        left = parseFloat(innerLeft) / 100 * processContainerWidth + e.offsetX;
    };
    left = left < 0 ? 0 : left;
    left = left > processContainerWidth ? processContainerWidth : left;
    
    return left;
}

/**
 * 设置视频缓存进度条长度
 */
function setCacheTime() {
    try {
        let length = myVideo.buffered ? myVideo.buffered.length : 0
        let end = myVideo.buffered.end(length - 1);
        console.log(end);
        if (length && end <= timeTotal) {
            //调整播放位置后，length可能有多段，这里始终取最后一段
            timeCache = end;
            cacheBar.style.width = 100 * (timeCache / timeTotal) + "%";
        }
        // 在视频播放期间每500毫秒进行一次递归，重新获取缓存值;
        // if (timeCache <= timeTotal) {
        //     setInterval(setCacheTime, 1000);
        // }
    } catch (error) {}
}

/**
 * 获取视频播放进度条长度
 * @param {Number} 播放时间
 */
function updateCurrentProcess(currentTime) {
    let width = 100 * (timeCurrent / timeTotal);
    playBar.style.width = width + "%";
    adjustToolDIV.style.left = width + "%";
    if (currentTime) {
        myVideo.currentTime = currentTime;
    }
}

// /**
//  * 全屏
//  * @param {Element} element  需要全屏的元素
//  */
// function Util.fullScreen(element) {
//     var el = element instanceof HTMLElement ? element : document.documentElement;
//     var rfs = el.requestFullscreen       || 
//               el.webkitRequestFullscreen || 
//               el.mozRequestFullScreen    || 
//               el.msRequestFullscreen;
//     if (rfs) {
//         rfs.call(el);
//     } else if (window.ActiveXObject) {
//         var ws = new ActiveXObject("WScript.Shell");
//         ws && ws.SendKeys("{F11}");
//     }
// }

// /**
//  * 退出全屏
//  */
// function Util.exitFullscreen(){
//     var efs = document.Util.exitFullscreen       || 
//               document.webkitExitFullscreen || 
//               document.mozCancelFullScreen  || 
//               document.msExitFullscreen;
//     if (efs) {
//         efs.call(document);
//     } else if (window.ActiveXObject) {
//         var ws = new ActiveXObject("WScript.Shell");
//         ws && ws.SendKeys("{F11}");
//     }
// }

/**
 * 全屏或非全屏
 * @param {Element} element  需要全屏的元素
 */
function changeScreenStatus() {
    if (isFullScreen) {
        Util.exitFullscreen();
        // Util.removeClass(fullscreenToolDIV, "h5-video-mini-screen");
        // Util.addClass(fullscreenToolDIV, "h5-video-fullscreen");
        // isFullScreen = false;
    } else {
        Util.fullScreen(videoContainer);
        // Util.removeClass(fullscreenToolDIV, "h5-video-fullscreen");
        // Util.addClass(fullscreenToolDIV, "h5-video-mini-screen");
        // isFullScreen = true;
    }
}

// /**
//  * 将ms转换成min:seconds格式
//  */
// function Util.formatTime(ms) {
//     let mins = Math.floor(ms / 3600.0) * 60.0 + Math.floor(ms % 3600.0 / 60.0),
//         seconds = Math.floor(ms % 60.0);
    
//     mins = mins < 10 ? "0" + mins : mins;
//     seconds = seconds < 10 ? "0" + seconds : seconds;
//     return mins + ":" + seconds;
// }

/**
 * 获取播放视频当前时长
 */
function setCurrentTime() {
    timeCurrent = myVideo.currentTime;
    timeCurrentDIV.innerText = Util.formatTime(myVideo.currentTime);
    //更新进度条
    updateCurrentProcess();
}

/**
 * 设置视频总时长
 */
function initVideo() {
    //初始化音量大小
    myVideo.volume = videoVolume / 100;
    volumeValueDIV.innerText = videoVolume + "%";
    volumeBgDIV.style.height = videoVolume + "%";
    volumeSliderDIV.style.top = 100 - videoVolume - volumeSliderDIV.offsetHeight / 2 + "%";
    //初始化视频总时长
    timeTotal = myVideo.duration;
    timeTotalDIV.innerText = Util.formatTime(timeTotal);
}

/**
 * 播放或暂停
 */
function changePlayStatus() {
    if (myVideo.paused || myVideo.ended) {
        playVideo();
        Util.showMessage("播放", 2000);
    } else {
        pauseVideo();
        Util.showMessage("暂停", 2000);
    }
}

/**
 * 播放视频
 */
function playVideo() {
    myVideo.play();
    Util.removeClass(playToolDIV, "h5-video-play");
    Util.addClass(playToolDIV, "h5-video-pause");
    Util.toggleClass(videoPoster, false);
    if (isBarrageOn) {
        if (!barrageUtil) {
            barrageUtil = new BarrageUtil(
                myVideo, barrageCanvas, {
                    data: barrages,
                    style: barrageStyle
                });
            barrageUtil.render();
        } else {
            barrageUtil.runBarrage();
        }
    }
}

/**
 * 暂停视频
 */
function pauseVideo() {
    myVideo.pause();
    Util.removeClass(playToolDIV, "h5-video-pause");
    Util.addClass(playToolDIV, "h5-video-play");
    Util.toggleClass(videoPoster, true);
    Util.toggleClass(videoWaitting, false);
    if (barrageUtil) {
        barrageUtil.stopBarrage();
    }
}