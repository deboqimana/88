// src/components/Controls.jsx
import React, { useContext, useState, useEffect } from 'react';
import { VideoContext } from '../contexts/VideoContext';
import {
  FaPlay,
  FaPause,
  FaVolumeUp,
  FaVolumeMute,
  FaExpand,
  FaCompress,
  FaCamera,
  FaRecordVinyl,
  FaBookmark,
  FaPictureInPicture,
} from 'react-icons/fa';
import Hls from 'hls.js';

const Controls = ({ videoRef }) => {
  const {
    isPlaying,
    setIsPlaying,
    volume,
    setVolume,
    isMuted,
    setIsMuted,
    isFullScreen,
    setIsFullScreen,
    playbackRate,
    setPlaybackRate,
    currentTime,
    duration,
    setCurrentTime,
    bookmarks,
    setBookmarks,
    currentVideo,
    selectedSubtitle,
    setSelectedSubtitle,
  } = useContext(VideoContext);

  const [isRecording, setIsRecording] = useState(false);
  const [recorder, setRecorder] = useState(null);

  // 切换播放/暂停
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  // 改变音量
  const handleVolumeChange = (e) => {
    setVolume(parseFloat(e.target.value));
    if (parseFloat(e.target.value) > 0) {
      setIsMuted(false);
    }
  };

  // 切换静音
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  // 改变进度
  const handleProgressChange = (e) => {
    const time = parseFloat(e.target.value);
    videoRef.current.currentTime = time;
    setCurrentTime(time);
  };

  // 切换全屏
  const toggleFullScreen = () => {
    const videoContainer = videoRef.current.parentElement;
    if (!isFullScreen) {
      if (videoContainer.requestFullscreen) {
        videoContainer.requestFullscreen();
      } else if (videoContainer.webkitRequestFullscreen) { // Safari
        videoContainer.webkitRequestFullscreen();
      } else if (videoContainer.msRequestFullscreen) { // IE11
        videoContainer.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullScreen(!isFullScreen);
  };

  // 改变播放速度
  const handlePlaybackRateChange = (e) => {
    setPlaybackRate(parseFloat(e.target.value));
  };

  // 格式化时间
  const formatTime = (time) => {
    if (isNaN(time)) return '00:00';
    const minutes = Math.floor(time / 60)
      .toString()
      .padStart(2, '0');
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  // 截图
  const takeScreenshot = () => {
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'screenshot.png';
    link.click();
  };

  // 录制视频
  const toggleRecording = () => {
    if (isRecording) {
      recorder.stop();
      setIsRecording(false);
    } else {
      const stream = videoRef.current.captureStream();
      const mediaRecorder = new MediaRecorder(stream);
      const chunks = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'recorded.webm';
        a.click();
      };

      mediaRecorder.start();
      setRecorder(mediaRecorder);
      setIsRecording(true);
    }
  };

  // 切换字幕
  const handleSubtitleChange = (e) => {
    const value = e.target.value;
    setSelectedSubtitle(value);
    const tracks = videoRef.current.textTracks;
    for (let i = 0; i < tracks.length; i++) {
      if (tracks[i].language === value) {
        tracks[i].mode = 'showing';
      } else {
        tracks[i].mode = 'disabled';
      }
    }
  };

  // 添加书签
  const addBookmark = () => {
    const time = videoRef.current.currentTime;
    const newBookmarks = {
      ...bookmarks,
      [currentVideo.id]: [...(bookmarks[currentVideo.id] || []), time],
    };
    setBookmarks(newBookmarks);
  };

  // 切换画中画模式
  const togglePIP = () => {
    if (document.pictureInPictureElement) {
      document.exitPictureInPicture();
    } else {
      videoRef.current.requestPictureInPicture();
    }
  };

  // 快捷键支持
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case ' ':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowRight':
          videoRef.current.currentTime += 5;
          break;
        case 'ArrowLeft':
          videoRef.current.currentTime -= 5;
          break;
        case 'f':
        case 'F':
          toggleFullScreen();
          break;
        case 'm':
        case 'M':
          toggleMute();
          break;
        // 你可以在这里添加更多快捷键
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // 清理事件监听
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPlaying, togglePlay, toggleFullScreen, toggleMute]);

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-transparent to-transparent p-4 flex flex-col">
      {/* 进度条 */}
      <input
        type="range"
        min="0"
        max={duration}
        value={currentTime}
        onChange={handleProgressChange}
        className="w-full"
      />
      <div className="flex items-center justify-between mt-2">
        {/* 左侧控件 */}
        <div className="flex items-center space-x-4">
          <button onClick={togglePlay} className="text-white text-xl focus:outline-none">
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>
          <div className="flex items-center space-x-2">
            <button onClick={toggleMute} className="text-white focus:outline-none">
              {isMuted || volume === 0 ? <FaVolumeMute /> : <FaVolumeUp />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-24"
            />
          </div>
          <span className="text-white">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>
        {/* 右侧控件 */}
        <div className="flex items-center space-x-4">
          {/* 播放速度 */}
          <select
            value={playbackRate}
            onChange={handlePlaybackRateChange}
            className="bg-gray-800 text-white rounded focus:outline-none"
          >
            <option value="0.5">0.5x</option>
            <option value="1">1x</option>
            <option value="1.5">1.5x</option>
            <option value="2">2x</option>
          </select>
          {/* 字幕选择 */}
          <div className="flex items-center space-x-2">
            <label htmlFor="subtitles" className="text-white">字幕:</label>
            <select
              id="subtitles"
              onChange={handleSubtitleChange}
              className="bg-gray-800 text-white rounded focus:outline-none"
              value={selectedSubtitle}
            >
              <option value="off">关闭</option>
              <option value="en">英文</option>
              <option value="zh">中文</option>
              {/* 根据需要添加更多字幕选项 */}
            </select>
          </div>
          {/* 截图 */}
          <button onClick={takeScreenshot} className="text-white text-xl focus:outline-none">
            <FaCamera />
          </button>
          {/* 录制 */}
          <button onClick={toggleRecording} className="text-white text-xl focus:outline-none">
            <FaRecordVinyl className={isRecording ? 'text-red-500' : ''} />
          </button>
          {/* 书签 */}
          <button onClick={addBookmark} className="text-white text-xl focus:outline-none">
            <FaBookmark />
          </button>
          {/* 画中画 */}
          <button onClick={togglePIP} className="text-white text-xl focus:outline-none">
            <FaPictureInPicture />
          </button>
          {/* 全屏 */}
          <button onClick={toggleFullScreen} className="text-white text-xl focus:outline-none">
            {isFullScreen ? <FaCompress /> : <FaExpand />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Controls;