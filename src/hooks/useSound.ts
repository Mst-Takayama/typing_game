import { useRef, useEffect } from 'react';

export const useSound = () => {
  const bgmRef = useRef<HTMLAudioElement | null>(null);
  const shotSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    bgmRef.current = new Audio('/bgm.mp3');
    shotSoundRef.current = new Audio('/shot.mp3');
  }, []);

  const playBgm = () => bgmRef.current?.play();
  const stopBgm = () => bgmRef.current?.pause();
  const playShotSound = () => {
    if (shotSoundRef.current) {
      shotSoundRef.current.currentTime = 0;
      shotSoundRef.current.play();
    }
  };

  return { playBgm, stopBgm, playShotSound };
}; 