import { $$ } from '@lib/utils/functions';
import { LiveKitRoom, RoomAudioRenderer, VideoConference, formatChatMessageLinks } from '@livekit/components-react';
import '@livekit/components-styles';
import { RoomConnectOptions } from 'livekit-client';
import { useRouter } from 'next/router';
import { useEffect, useMemo } from 'react';

export default function Index() {
  const router = useRouter();
  const query = $$.parseQueryParams(router.asPath);
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

  if (query?.token === '') {
    return <div>Getting token...</div>;
  }

  return (
    <LiveKitRoom
      video={true}
      audio={true}
      token={query?.token}
      serverUrl={query?.serverUrl}
      connectOptions={connectOptions}
      // Use the default LiveKit theme for nice styles.
      data-lk-theme="default"
      style={{ height: '100dvh' }}
      onDisconnected={() => window.close()}
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
