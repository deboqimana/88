// src/components/Bookmarks.jsx
import React, { useContext } from 'react';
import { VideoContext } from '../contexts/VideoContext';

const Bookmarks = () => {
  const { bookmarks, currentVideo, setCurrentTime } = useContext(VideoContext);

  const handleJumpTo = (time) => {
    setCurrentTime(time);
    const video = document.querySelector('video');
    video.currentTime = time;
    video.play();
  };

  const currentBookmarks = bookmarks[currentVideo.id] || [];

  return (
    <div className="mt-4">
      <h2 className="text-xl font-semibold mb-2">书签</h2>
      {currentBookmarks.length === 0 ? (
        <p className="text-gray-600">当前视频没有书签。</p>
      ) : (
        <ul className="space-y-2">
          {currentBookmarks.map((time, index) => (
            <li
              key={index}
              className="flex items-center space-x-2 p-2 bg-white rounded shadow cursor-pointer hover:bg-gray-200"
              onClick={() => handleJumpTo(time)}
            >
              <span>Bookmark {index + 1}</span>
              <span className="text-gray-500">{formatTime(time)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// 时间格式化函数
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

export default Bookmarks;