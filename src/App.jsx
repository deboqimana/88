// src/App.jsx
import React from 'react';
import VideoPlayer from './components/VideoPlayer';
import Playlist from './components/Playlist';
import Bookmarks from './components/Bookmarks'; // 可选
import { VideoProvider } from './contexts/VideoContext';
import ThemeToggle from './components/ThemeToggle'; // 如果你实现了主题切换

function App() {
  return (
    <VideoProvider>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 dark:bg-gray-900">
        <div className="w-full max-w-4xl">
          {/* 可选：主题切换按钮 */}
          <div className="flex justify-end mb-4">
            <ThemeToggle />
          </div>
          <VideoPlayer />
          <Bookmarks /> {/* 如果使用书签功能 */}
          <Playlist />
        </div>
      </div>
    </VideoProvider>
  );
}

export default App;