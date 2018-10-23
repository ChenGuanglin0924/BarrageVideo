let myVideo = document.getElementById("myVideo"),
    barrageCanvas = document.getElementById('barrageCanvas'),
    // videoBarrage = document.getElementsByClassName("video-barrage")[0],
    videoContainer = document.getElementsByClassName("video-container")[0],
    videoControl = document.getElementsByClassName("video-control")[0],
    playToolDIV = document.getElementsByClassName("play-tool")[0],
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
    
    

let timeTotal = 0, 
    timeCurrent = 0, 
    timeCache = 0, 
    isFullScreen = false,
    isProcessMove = false,
    volume = 50,
    muted = false,
    videoControlTimer = null,
    isChangeProcess = false
    isChangeVolume = false;

myVideo.addEventListener("loadeddata", initVideo); 
myVideo.addEventListener("timeupdate", setCurrentTime);
myVideo.addEventListener("waiting", videoWaitting);
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
// posterClose.addEventListener("click", closePoster);

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
    clearInterval(videoControlTimer);
    if (e.target === myVideo && !isChangeVolume && !isChangeProcess) {
        videoControlTimer = setTimeout(function () {
            toggleClass(videoControl, false);
        }, 3000);
    }
}

/**
 * 鼠标移出video
 */
function mouseLeaveVideo() {
    clearInterval(videoControlTimer);
    if (!isChangeProcess && !isChangeVolume) {
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
    clearInterval(videoControlTimer);
    videoControl.addEventListener("mouseleave", hideVideoControl);
}

/**
 * 鼠标移出工具栏，隐藏工具栏
 */
function hideVideoControl() {
    clearInterval(videoControlTimer);
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
    // if (condition) {
        
    // }
    
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
function setCacheTime() {
    if (myVideo.buffered.length > 0) {
        timeCache = myVideo.buffered.end(0);
    }
    cacheBar.style.width = 100 * (timeCache / timeTotal) + "%";
    //是否加载中...
    // if (timeCache < timeCurrent) {
    //     toggleClass(videoWaitting, true);
    // }
    // else {
    //     toggleClass(videoWaitting, false);
    // }
    // 在视频播放期间每500毫秒进行一次递归，重新获取缓存值;
    if (timeCache <= timeTotal) {
        setInterval(setCacheTime, 500);
    }
}
setCacheTime();

/**
 * 获取视频播放进度条长度
 */
function updateCurrentProcess() {
    let width = 100 * (timeCurrent / timeTotal);
    playBar.style.width = width + "%";
    adjustToolDIV.style.left = width + "%";
}

/**
 * 全屏
 *
 * @param {Element} element  需要全屏的元素
 */
function fullScreen(element) {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }
}

/**
 * 退出全屏
 */
function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
}

/**
 * 全屏或非全屏
 * @param {Element} element  需要全屏的元素
 */
function changeScreenStatus() {
    if (isFullScreen) {
        exitFullscreen();
        removeClass(fullscreenToolDIV, "h5-video-mini-screen");
        addClass(fullscreenToolDIV, "h5-video-fullscreen");
        isFullScreen = false;
    } else {
        fullScreen(videoContainer);
        removeClass(fullscreenToolDIV, "h5-video-fullscreen");
        addClass(fullscreenToolDIV, "h5-video-mini-screen");
        isFullScreen = true;
    }
}

/**
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
        myVideo.play();
        removeClass(playToolDIV, "h5-video-play");
        addClass(playToolDIV, "h5-video-pause");
        toggleClass(videoPoster, false);
    } else {
        myVideo.pause();
        removeClass(playToolDIV, "h5-video-pause");
        addClass(playToolDIV, "h5-video-play");
        toggleClass(videoPoster, true);
        toggleClass(videoWaitting, false);
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
