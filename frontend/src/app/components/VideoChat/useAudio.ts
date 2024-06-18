import { useState, useEffect } from 'react';

function useAudio(url: string, loop = false, abortCondition = () => false) {
  const [audio] = useState(new Audio(url));
  const [playing, setPlaying] = useState(false);

  const play = () => {
    if (!abortCondition()) {
      setPlaying(true);
      audio.play().catch((e) => console.warn('Audio playback failed:', e));
    }
  };

  const stop = () => {
    audio.pause();
    audio.currentTime = 0;
    setPlaying(false);
  };

  useEffect(() => {
    if (loop && playing) {
      const intervalId = setInterval(play, 5000);
      return () => clearInterval(intervalId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loop, playing]);

  useEffect(() => {
    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  return { play, stop };
}

export default useAudio;
