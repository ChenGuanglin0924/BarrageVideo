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
let sizeObj = {
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

let timeTotal = 0, 
    timeCurrent = 0, 
    timeCache = 0, 
    isFullScreen = false,
    isProcessMove = false,
    volume = 50,
    muted = false,
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
    isSendingBarrage = false;

myVideo.addEventListener("loadeddata", initVideo); 
myVideo.addEventListener("timeupdate", setCurrentTime);
// myVideo.addEventListener("waiting", videoWaitting);
myVideo.addEventListener("seeked", seeked);
playToolDIV.addEventListener("click", changePlayStatus);
fullscreenToolDIV.addEventListener("click", changeScreenStatus);
processContainerDIV.addEventListener("mousedown", processMousedown);
processContainerDIV.addEventListener("mousemove", showProcessInfo);
volumeSliderBgDIV.addEventListener("mousedown", changeVideoVolume);
volumeToolDIV.addEventListener("mousedown", changeVolumeMute);
videoContainer.addEventListener("mouseenter", mouseOverVideo);
videoContainer.addEventListener("mouseleave", mouseLeaveVideo);
videoContainer.addEventListener("click", videoClicked);
videoControl.addEventListener("mouseover", showVideoControl);
videoPoster.addEventListener("click", go2PosterUrl);
sendBarrageBtn.addEventListener("click", sendBarrage);
reloadToolDIV.addEventListener("click", reloadVideo);
rateContent.addEventListener('click', changePlayRate);
barrageTool.addEventListener('click', switchVideoBarrage);
barrageOpacityTool.addEventListener('click', changeBarrageOpacity);
barrageRangeTool.addEventListener('click', changeBarrageRange);
sendFontsizeTool.addEventListener('click', setSendSize);
sendSpeedTool.addEventListener('click', setSendSpeed);
sendColorTool.addEventListener('click', setSendColor);
sendBarrageValue.addEventListener('focus', () => {isSendingBarrage = true});
sendBarrageValue.addEventListener('blur', () => {isSendingBarrage = false});

//全屏事件监听
document.addEventListener('fullscreenchange', changeFullScreenStatus);
document.addEventListener('webkitfullscreenchange', changeFullScreenStatus);
document.addEventListener('mozfullscreenchange', changeFullScreenStatus);
document.addEventListener('MSFullscreenChange', changeFullScreenStatus);

/**
 * 设置弹幕发送字体大小
 */
function setSendSize(e) {
    e.stopPropagation();
    if (e.target.tagName === "LI") {
        let key = e.target.innerText;
        if (key && Object.keys(sizeObj).indexOf(key) > -1) {
            sendStyle.fontSize = sizeObj[key];
            removeClass(e.target.parentNode.getElementsByClassName("active")[0], "active");
            addClass(e.target, "active");
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
            removeClass(e.target.parentNode.getElementsByClassName("active")[0], "active");
            addClass(e.target, "active");
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
        removeClass(elm.parentNode.getElementsByClassName("active")[0], "active");
        addClass(elm, "active");
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
        removeClass(elm.parentNode.getElementsByClassName("active")[0], "active");
        addClass(elm, "active");
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
            removeClass(e.target.parentNode.getElementsByClassName("active")[0], "active");
        }
        addClass(e.target, "active");
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
        removeClass(e.currentTarget, "on");
        isBarrageOn = false;
        if (barrageUtil) {
            barrageUtil.destroy();
            barrageUtil = null;
        }
    } else {
        addClass(e.currentTarget, "on");
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
        removeClass(fullscreenToolDIV, "h5-video-fullscreen");
        addClass(fullscreenToolDIV, "h5-video-mini-screen");
        isFullScreen = true;
    } else {
        removeClass(fullscreenToolDIV, "h5-video-mini-screen");
        addClass(fullscreenToolDIV, "h5-video-fullscreen");
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
            removeClass(e.target.parentNode.getElementsByClassName("active")[0], "active");
        }
        addClass(e.target, "active");
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
    if (!val || val.trim() === "" || sendBarrageBtn.className.indexOf("disable") > -1) {
        return;
    }
    barrageUtil && barrageUtil.addBarrage({
        time: timeCurrent,
        text: val,
        fontSize: sendStyle.fontSize,
        color: sendStyle.color,
        speed: sendStyle.speed
    });
    //弹幕发送间隔为5秒
    timeCountdown(5, (result)=>{
        sendBarrageBtn.innerText = result + "";
        addClass(sendBarrageBtn, "disable");
    }, ()=>{
        sendBarrageBtn.innerText = "发送";
        removeClass(sendBarrageBtn, "disable");
    });
}

/**
 * 缓冲中...
 */
myVideo.onwaiting = () => {
    toggleClass(videoWaitting, true);
}

/**
 * 缓冲完成
 */
myVideo.oncanplay = () => {
    toggleClass(videoWaitting, false);
}

/**
 * 暂停海报点击事件
 */
function go2PosterUrl(e) {
    e = e || window.event;
    if (e.target.className.indexOf("close") > -1) {
        toggleClass(videoPoster, false);
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
        changePlayStatus();
    }
}

/**
 * 鼠标移动
 */
function mouseOverVideo() {
    toggleClass(videoControl, true);
    videoContainer.addEventListener("mousemove", mouseInVideo);
}

/**
 * 鼠标移动或静止
 */
function mouseInVideo(e) {
    toggleClass(videoControl, true);
    if (videoControlTimer) {
        clearTimeout(videoControlTimer);
    }
    if (e.target === barrageCanvas && !isChangeVolume && !isChangeProcess && !isSendingBarrage) {
        videoControlTimer = setTimeout(function () {
            toggleClass(videoControl, false);
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
            toggleClass(videoControl, false);
        }, 3000);
    }
}

/**
 * 鼠标在工具栏上
 */
function showVideoControl() {
    toggleClass(videoControl, true);
    if (videoControlTimer) {
        clearTimeout(videoControlTimer);
    }
    videoControl.addEventListener("mouseleave", hideVideoControl);
}

/**
 * 鼠标移出工具栏，隐藏工具栏
 */
function hideVideoControl() {
    if (videoControlTimer) {
        clearTimeout(videoControlTimer);
    }
    videoControlTimer = setTimeout(function () {
        toggleClass(videoControl, false);
    }, 3000);
}


/**
 * 切换静音和非静音状态
 */
function changeVolumeMute() {
    muted = !muted;
    myVideo.muted = muted;
    if (muted) {
        updateVolume(0, muted);
    }
    else {
        if (volume === 0) {
            volume = 50;
        }
        updateVolume(volume, muted);
    }
}

/**
 * 更新音量大小和状态
 * @param {Number} volume 音量大小
 * @param {Boolean} muted 是否静音
 */
function updateVolume(volume, muted) {
    let delta = volumeSliderDIV.offsetHeight / 2;
    if (volume === 0 || muted) {
        removeClass(volumeToolDIV, "h5-video-volume-on");
        addClass(volumeToolDIV, "h5-video-volume-off");
        volumeSliderDIV.style.top = 100 - delta + "%";
        volumeBgDIV.style.height = 0 + "%";
        volumeValueDIV.innerText = 0 + "%";
    }
    else {
        removeClass(volumeToolDIV, "h5-video-volume-off");
        addClass(volumeToolDIV, "h5-video-volume-on");
        volumeSliderDIV.style.top = 100 - volume - delta + "%";
        volumeBgDIV.style.height = volume + "%";
        volumeValueDIV.innerText = volume + "%";
    }
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
    let volumeSliderBgHeight = volumeSliderBgDIV.offsetHeight;
    // let delta = volumeSliderDIV.offsetHeight / 2;
    if (e.target === volumeSliderBgDIV || e.target === volumeBgDIV) {
        let top = e.target === volumeSliderBgDIV ? e.offsetY : e.offsetY + e.target.offsetTop; 
        top = top < 0 ? 0 : top;
        top = top > volumeSliderBgHeight ? volumeSliderBgHeight : top;

        volume = 100 - top;
        myVideo.volume = volume / volumeSliderBgHeight;
        if (muted && volume > 0) {
            muted = !muted;
            myVideo.muted = muted;
        }
        if (volume === 0) {
            muted = true;
            myVideo.muted = muted;
        }
        updateVolume(volume, muted);
    } else if(e.target === volumeSliderDIV) {
        isChangeVolume = true;
        addClass(volumeContentDIV, "show");
        addClass(videoControl, "show");
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
    volume = 100 - yTop;
    myVideo.volume = volume / volumeSliderBgDIV.clientHeight;
    if (muted && volume > 0) {
        muted = !muted;
        myVideo.muted = muted;
    }
    if (volume === 0) {
        muted = true;
        myVideo.muted = muted;
    }
    updateVolume(volume, muted);
}

/**
 * 停止音量拖动
 */
function VolumeBarUp(e) {
    isChangeVolume = false;
    // removeClass(videoControl, "show");
    removeClass(volumeContentDIV, "show");
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
    myVideo.currentTime = percentLeft * timeTotal;
    adjustToolDIV.style.left = percentLeft * 100 + "%";

    //拖动时一直显示进度条
    isChangeProcess = true;
    addClass(processContainerDIV, "process-active");
    document.onmousemove = processMousemove;
    document.onmouseup = processMouseup;
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
    adjustToolDIV.style.left = percentLeft * 100 + "%";
    myVideo.currentTime = percentLeft * timeTotal;

    processInfoDIV.style.left = infoLeft / processBarWidth * 100 + "%";
    processInfoDIV.innerText = formatTime(percentLeft * timeTotal);
    processContainerDIV.removeEventListener("mousemove", showProcessInfo);
}

/**
 * 鼠标移出进度条
 * @param {Event} e 
 */
function processMouseup() {
    isChangeProcss = false;
    removeClass(processContainerDIV, "process-active");
    document.onmousemove = null;
    document.onmouseup = null;
    processContainerDIV.addEventListener("mousemove", showProcessInfo);
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
        info = formatTime(left / processBarWidth * timeTotal);
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
// function setCacheTime() {
//     if (myVideo.buffered.length > 0) {
//         timeCache = myVideo.buffered.end(0);
//     }
//     cacheBar.style.width = 100 * (timeCache / timeTotal) + "%";
//     //是否加载中...
//     // if (timeCache < timeCurrent) {
//     //     toggleClass(videoWaitting, true);
//     // }
//     // else {
//     //     toggleClass(videoWaitting, false);
//     // }
//     // 在视频播放期间每500毫秒进行一次递归，重新获取缓存值;
//     if (timeCache <= timeTotal) {
//         setInterval(setCacheTime, 500);
//     }
// }
// setCacheTime();

/**
 * 获取视频播放进度条长度
 */
function updateCurrentProcess() {
    let width = 100 * (timeCurrent / timeTotal);
    playBar.style.width = width + "%";
    adjustToolDIV.style.left = width + "%";
}

/**
 * 更新弹幕幕布尺寸
 * @param {Boolean} isFullScreen  是否全屏
 */
// function resetCanvasSize(isFullScreen) {
//     if (isFullScreen !== undefined && isFullScreen !== null) {
//         isFullScreen = !isFullScreen;
//     }
//     // barrageCanvas.width = myVideo.clientWidth;
//     // barrageCanvas.height = myVideo.clientHeight - 60;
//     if (barrageUtil) {
//         barrageUtil.resetBarrage();
//     } else {
//         barrageUtil = new BarrageUtil(myVideo, barrageCanvas, {datas: barrages});
//         barrageUtil.render();
//     }
// }

/**
 * 全屏
 * @param {Element} element  需要全屏的元素
 */
function fullScreen(element) {
    var el = element instanceof HTMLElement ? element : document.documentElement;
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
}
// function fullScreen(element) {
//     if (element.requestFullscreen) {
//         element.requestFullscreen();
//     } else if (element.mozRequestFullScreen) {
//         element.mozRequestFullScreen();
//     } else if (element.webkitRequestFullscreen) {
//         element.webkitRequestFullscreen();
//     } else if (element.msRequestFullscreen) {
//         element.msRequestFullscreen();
//     }
//     resetCanvasSize(true);
// }

/**
 * 退出全屏
 */
function exitFullscreen(){
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
}
// function exitFullscreen() {
//     if (document.exitFullscreen) {
//         document.exitFullscreen();
//     } else if (document.mozCancelFullScreen) {
//         document.mozCancelFullScreen();
//     } else if (document.webkitExitFullscreen) {
//         document.webkitExitFullscreen();
//     } else if (document.msExitFullscreen) {
//         document.msExitFullscreen();
//     }
//     resetCanvasSize(false);
// }

/**
 * 全屏或非全屏
 * @param {Element} element  需要全屏的元素
 */
function changeScreenStatus() {
    if (isFullScreen) {
        exitFullscreen();
        // removeClass(fullscreenToolDIV, "h5-video-mini-screen");
        // addClass(fullscreenToolDIV, "h5-video-fullscreen");
        // isFullScreen = false;
    } else {
        fullScreen(videoContainer);
        // removeClass(fullscreenToolDIV, "h5-video-fullscreen");
        // addClass(fullscreenToolDIV, "h5-video-mini-screen");
        // isFullScreen = true;
    }
}

/**v 
 * 将ms转换成min:seconds格式
 */
function formatTime(ms) {
    let mins = Math.floor(ms / 3600.0) * 60.0 + Math.floor(ms % 3600.0 / 60.0),
        seconds = Math.floor(ms % 60.0);
    
    mins = mins < 10 ? "0" + mins : mins;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    return mins + ":" + seconds;
}

/**
 * 获取播放视频当前时长
 */
function setCurrentTime() {
    timeCurrent = myVideo.currentTime;
    timeCurrentDIV.innerText = formatTime(myVideo.currentTime);
    //更新进度条
    updateCurrentProcess();
}

/**
 * 设置视频总时长
 */
function initVideo() {
    //初始化音量大小
    myVideo.volume = volume / 100;
    volumeValueDIV.innerText = volume + "%";
    volumeBgDIV.style.height = volume + "%";
    volumeSliderDIV.style.top = 100 - volume - volumeSliderDIV.offsetHeight / 2 + "%";
    //初始化视频总时长
    timeTotal = myVideo.duration;
    timeTotalDIV.innerText = formatTime(timeTotal);
}

/**
 * 播放或暂停
 */
function changePlayStatus() {
    if (myVideo.paused || myVideo.ended) {
        playVideo();
    } else {
        pauseVideo();
    }
}

/**
 * 播放视频
 */
function playVideo() {
    myVideo.play();
    removeClass(playToolDIV, "h5-video-play");
    addClass(playToolDIV, "h5-video-pause");
    toggleClass(videoPoster, false);
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
    removeClass(playToolDIV, "h5-video-pause");
    addClass(playToolDIV, "h5-video-play");
    toggleClass(videoPoster, true);
    toggleClass(videoWaitting, false);
    if (barrageUtil) {
        barrageUtil.stopBarrage();
    }
}

/**
 * 切换show和hide样式
 * @param {Element} element element
 * @param {Boolean} flag 是否显示
 */
function toggleClass(element, flag) {
    if (!element) {
        return;
    }
    let elmClass = element.getAttribute("class") || "";
    if (flag) {
        if (elmClass.indexOf("hide") > -1) {
            elmClass = elmClass.replace("hide", "");
            elmClass = elmClass.trim();
        }
        if (elmClass.indexOf("show") < 0) {
            elmClass += ` show`;
        }
    }
    else {
        if (elmClass.indexOf("show") > -1) {
            elmClass = elmClass.replace("show", "").trim();
        }
        if (elmClass.indexOf("hide") < 0) {
            elmClass += ` hide`;
        }
    }
    element.setAttribute("class", elmClass);
}

/**
 * 添加样式
 * @param {Element} element element
 * @param {String} 样式名
 */
function addClass(element, className) {
    if (!element) {
        return;
    }
    let elmClass = element.getAttribute("class") || "";
    elmClass = elmClass.trim();
    if (className && elmClass.indexOf(className) < 0) {
        elmClass += ` ${className}`;
    }
    element.setAttribute("class", elmClass);
}

/**
 * 移除样式
 * @param {Element} element element
 * @param {String} 样式名
 */
function removeClass(element, className) {
    if (!element) {
        return;
    }
    let elmClass = element.getAttribute("class") || "";
    if (className && elmClass.indexOf(className) > -1) {
        elmClass = elmClass.replace(className, "").trim();
    }
    element.setAttribute("class", elmClass);
}

/**
 * 发送弹幕倒计时函数
 *
 * @param {Number} seconds 倒计时秒数
 * @param {Function} onCallBack 倒计时执行的方法
 * @param {Function} endCallBack 倒计结束执行的方法
 */
function timeCountdown(interval, onCallBack, endCallBack) {
    if (interval == 0) {
        endCallBack();
        clearTimeout(timeOut);
    } else { 
        onCallBack(interval);
        interval --;
        timeOut = setTimeout(function() { 
            timeCountdown(interval, onCallBack, endCallBack);
        }, 1000)
    } 
} 
