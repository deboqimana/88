import React, { useContext } from 'react';
import VideoPlayer from './components/VideoPlayer';
import Playlist from './components/Playlist';
import Bookmarks from './components/Bookmarks'; // 可选
import { VideoProvider, VideoContext } from './contexts/VideoContext';
import ThemeToggle from './components/ThemeToggle'; // 如果你实现了主题切换

function App() {
  const { selectedVideo, setSelectedVideo } = useContext(VideoContext);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setSelectedVideo({
        id: 'custom',
        title: file.name,
        src: fileURL,
        poster: '',
        subtitles: '',
        qualityOptions: [],
      });
    }
  };

  return (
    <VideoProvider>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 dark:bg-gray-900">
        <div className="w-full max-w-4xl">
          {/* 可选：主题切换按钮 */}
          <div className="flex justify-end mb-4">
            <ThemeToggle />
          </div>
          <VideoPlayer selectedVideo={selectedVideo} />
          <div className="mt-4">
            <input type="file" accept="video/*" onChange={handleFileChange} />
          </div>
          <Bookmarks /> {/* 如果使用书签功能 */}
          <Playlist />
        </div>
      </div>
    </VideoProvider>
  );
}

export default App;