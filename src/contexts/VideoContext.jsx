// src/contexts/VideoContext.jsx
import React, { createContext, useState, useEffect } from 'react';

export const VideoContext = createContext();

export const VideoProvider = ({ children }) => {
  const [playlist, setPlaylist] = useState([
    {
      id: 1,
      title: 'Sample Video 1',
      src: '/videos/sample1.mp4', // 确保这些文件存在于 public/videos/
      poster: '/images/poster1.jpg', // 确保这些文件存在于 public/images/
      subtitles: '/subtitles/sample1.vtt', // 确保这些文件存在于 public/subtitles/
      qualityOptions: ['480p', '720p', '1080p'],
    },
    {
      id: 2,
      title: 'Sample Video 2',
      src: '/videos/sample2.mp4',
      poster: '/images/poster2.jpg',
      subtitles: '/subtitles/sample2.vtt',
      qualityOptions: ['480p', '720p', '1080p'],
    },
    // 你可以在这里添加更多视频
  ]);

  const [currentVideo, setCurrentVideo] = useState(playlist[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1); // 0.0 - 1.0
  const [isMuted, setIsMuted] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackHistory, setPlaybackHistory] = useState({});
  const [bookmarks, setBookmarks] = useState({});
  const [selectedSubtitle, setSelectedSubtitle] = useState('off');

  // 播放历史从 LocalStorage 加载
  useEffect(() => {
    const history = localStorage.getItem(`video-${currentVideo.id}-history`);
    if (history) {
      setCurrentTime(parseFloat(history));
    }
    const storedBookmarks = localStorage.getItem(`video-${currentVideo.id}-bookmarks`);
    if (storedBookmarks) {
      setBookmarks(JSON.parse(storedBookmarks));
    }
  }, [currentVideo.id]);

  // 监听播放时间变化并保存到 LocalStorage
  useEffect(() => {
    if (currentTime > 0 && currentTime < duration) {
      localStorage.setItem(`video-${currentVideo.id}-history`, currentTime);
    }
  }, [currentTime, duration, currentVideo.id]);

  // 监听书签变化并保存到 LocalStorage
  useEffect(() => {
    localStorage.setItem(`video-${currentVideo.id}-bookmarks`, JSON.stringify(bookmarks));
  }, [bookmarks, currentVideo.id]);

  return (
    <VideoContext.Provider
      value={{
        playlist,
        setPlaylist,
        currentVideo,
        setCurrentVideo,
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
        setCurrentTime,
        duration,
        setDuration,
        playbackHistory,
        setPlaybackHistory,
        bookmarks,
        setBookmarks,
        selectedSubtitle,
        setSelectedSubtitle,
      }}
    >
      {children}
    </VideoContext.Provider>
  );
};