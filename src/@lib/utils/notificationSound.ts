export const playSound = (name) => {
  const audio = new Audio(`/sounds/${name}.mp3`); // Add your sound file to public/sounds/
  audio.volume = 0.5; // Set volume to 50%

  try {
    audio.play().catch((error) => {
      console.warn('Audio playback failed:', error);
    });
  } catch (error) {
    console.warn('Audio creation failed:', error);
  }
};
