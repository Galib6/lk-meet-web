import { ENV } from '.environments';
import { LiveKitRoom, RoomAudioRenderer, VideoConference, formatChatMessageLinks } from '@livekit/components-react';
import '@livekit/components-styles';
import { RoomConnectOptions } from 'livekit-client';
import { useEffect, useMemo } from 'react';
import { localStorageSate } from 'src/@base/constants/storage';
import useLocalStorage from 'src/@base/hooks/useLocalStorage';

export default function Index() {
  const [connectionDetails] = useLocalStorage(localStorageSate?.connectionDetails);

  useEffect(() => {
    (async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ video: true });
      } catch (e) {
        console.error('Error accessing video:', e);
      }
    })();
  }, []);

  const connectOptions = useMemo((): RoomConnectOptions => {
    return {
      autoSubscribe: true,
    };
  }, []);

  if (connectionDetails?.token === '') {
    return <div>Getting token...</div>;
  }

  return (
    <LiveKitRoom
      video={true}
      audio={true}
      token={connectionDetails?.token}
      serverUrl={ENV.liveKitUrl}
      connectOptions={connectOptions}
      // Use the default LiveKit theme for nice styles.
      data-lk-theme="default"
      style={{ height: '100dvh' }}
      onDisconnected={() => window.location.replace('/')}
    >
      <VideoConference chatMessageFormatter={formatChatMessageLinks} />
      {/* The RoomAudioRenderer takes care of room-wide audio for you. */}
      <RoomAudioRenderer />
      {/* Controls for the user to start/stop audio, video, and screen
        share tracks and to leave the room. */}
      {/* <ControlBar /> */}
    </LiveKitRoom>
  );
}
