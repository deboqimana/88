// src/components/VideoPlayer.jsx
import React, { useContext, useRef, useEffect } from 'react';
import { VideoContext } from '../contexts/VideoContext';
import Controls from './Controls';
import Hls from 'hls.js';

const VideoPlayer = () => {
  const {
    playlist,
    currentVideo,
    isPlaying,
    setIsPlaying,
    volume,
    isMuted,
    playbackRate,
    setCurrentTime,
    setDuration,
    setCurrentVideo,
    setIsFullScreen,
  } = useContext(VideoContext);

  const videoRef = useRef(null);

  // 使用 HLS.js 支持 HLS 流
  useEffect(() => {
    const video = videoRef.current;
    let hls;

    if (Hls.isSupported() && currentVideo.src.endsWith('.m3u8')) {
      hls = new Hls();
      hls.loadSource(currentVideo.src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (isPlaying) video.play();
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = currentVideo.src;
      video.addEventListener('loadedmetadata', () => {
        if (isPlaying) video.play();
      });
    } else {
      video.src = currentVideo.src;
    }

    return () => {
      if (hls) hls.destroy();
      video.src = '';
    };
  }, [currentVideo, isPlaying]);

  // 控制播放与暂停
  useEffect(() => {
    const video = videoRef.current;
    if (isPlaying) {
      video.play();
    } else {
      video.pause();
    }
  }, [isPlaying]);

  // 控制音量和静音
  useEffect(() => {
    const video = videoRef.current;
    video.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  // 控制播放速度
  useEffect(() => {
    const video = videoRef.current;
    video.playbackRate = playbackRate;
  }, [playbackRate]);

  // 监听时间更新和加载元数据
  useEffect(() => {
    const video = videoRef.current;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      // 恢复播放位置
      const history = localStorage.getItem(`video-${currentVideo.id}-history`);
      if (history) {
        video.currentTime = parseFloat(history);
      }
    };

    const handleEnded = () => {
      // 自动播放下一个视频
      const currentIndex = playlist.findIndex(v => v.id === currentVideo.id);
      const nextIndex = (currentIndex + 1) % playlist.length;
      setCurrentVideo(playlist[nextIndex]);
      setIsPlaying(true);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('ended', handleEnded);
    };
  }, [currentVideo, playlist, setCurrentTime, setDuration, setIsPlaying, setCurrentVideo]);

  return (
    <div className="relative">
      <video
        ref={videoRef}
        poster={currentVideo.poster}
        className="w-full rounded-lg shadow-lg"
        onClick={() => setIsPlaying(!isPlaying)} // 点击视频播放/暂停
        preload="metadata"
      >
        {currentVideo.subtitles && (
          <track
            label="English"
            kind="subtitles"
            srcLang="en"
            src={currentVideo.subtitles}
            default
          />
        )}
        {/* 可以在这里添加更多 <track> 用于多语言字幕 */}
      </video>
      <Controls videoRef={videoRef} />
    </div>
  );
};

export default VideoPlayer;