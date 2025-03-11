import { $$ } from '@lib/utils/functions';
import { LiveKitRoom, RoomAudioRenderer, VideoConference, formatChatMessageLinks } from '@livekit/components-react';
import '@livekit/components-styles';
import { RoomConnectOptions } from 'livekit-client';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';

export default function Index() {
  const router = useRouter();
  const query = $$.parseQueryParams(router.asPath);
  const [connectionDetails, setConnectionDetails] = useState<any>(null);
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

  useEffect(() => {
    const fetchConnectionDetails = async () => {
      try {
        const response = await fetch(
          'https://vt-bangladesh.uniclienttechnologies.com/api/v1/internal/livekit/connection-details',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjo4MywiZW1haWwiOiJnYWxpYkBnbWFpbC5jb20iLCJuYW1lIjoiQWwgR2FsaWIiLCJyb2xlcyI6WyJyb2xlLWdhbGliIl0sImlzQjJiVXNlciI6ZmFsc2UsImlzQ29ycG9yYXRlVXNlciI6ZmFsc2V9LCJpYXQiOjE3NDE3MzY3NDUsImV4cCI6MTc0MTczNjg2NX0.Tr3X8ngEYG9br76HxN8VBBScQNdATXnkidJ-k8cy1Al1CXDXykuBv5HlCyjHLalcFxeunkijscoCgx1z9f8rTg`,
            },
            body: JSON.stringify({
              ttl: '5m',
              participantName: 'Participant Name',
              identity: 'Participant Identity',
              metadata: 'Participant Metadata',
              attributes: {},
              roomName: query?.roomName,
            }),
          },
        );

        if (!response.ok) {
          throw new Error('Failed to fetch connection details');
        }

        const data = await response.json();
        setConnectionDetails(data);
      } catch (error) {
        console.error('Error fetching connection details:', error);
      }
    };

    if (query?.roomName) {
      fetchConnectionDetails();
    }
  }, [query?.roomName]);

  if (connectionDetails?.token === '') {
    return <div>Getting token...</div>;
  }

  return (
    <LiveKitRoom
      video={true}
      audio={true}
      token={connectionDetails?.participantToken}
      serverUrl={connectionDetails?.serverUrl}
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
