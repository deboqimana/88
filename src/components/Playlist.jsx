// src/components/Playlist.jsx
import React, { useContext } from 'react';
import { VideoContext } from '../contexts/VideoContext';

const Playlist = () => {
  const { playlist, setCurrentVideo, currentVideo } = useContext(VideoContext);

  return (
    <div className="mt-4">
      <h2 className="text-xl font-semibold mb-2">播放列表</h2>
      <ul className="space-y-2">
        {playlist.map((video) => (
          <li
            key={video.id}
            className={`flex items-center space-x-4 p-2 bg-white rounded shadow cursor-pointer hover:bg-gray-200 ${
              currentVideo.id === video.id ? 'bg-gray-300' : ''
            }`}
            onClick={() => setCurrentVideo(video)}
          >
            <img src={video.poster} alt={video.title} className="w-16 h-9 object-cover rounded" />
            <span>{video.title}</span>
            {/* 如果需要，你可以在这里显示书签等其他信息 */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Playlist;