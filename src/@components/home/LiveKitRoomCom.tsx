import { ENV } from '.environments';
import ParticipantsPopup from '@components/room/ParticipantPopUp';
import LiveKitParticipantMonitor from '@components/room/RoomParticipantMonitor';
import { IMeetingSessionRequest } from '@lib/interface/meetingSession.interfaces';
import { formatChatMessageLinks, LiveKitRoom, VideoConference } from '@livekit/components-react';
import '@livekit/components-styles';
import { Room, RoomConnectOptions, RoomOptions, VideoCodec, VideoPresets } from 'livekit-client';
import { useRouter } from 'next/router';
import { useEffect, useMemo } from 'react';
import { localStorageSate } from 'src/@base/constants/storage';
import useLocalStorage from 'src/@base/hooks/useLocalStorage';

interface IProps {
  meetingSessionRequests: IMeetingSessionRequest[];
}

const LiveKitRoomCom: React.FC<IProps> = ({ meetingSessionRequests }) => {
  const router = useRouter();
  const [connectionDetails, setConnectionDetails] = useLocalStorage(localStorageSate?.connectionDetails);
  const [_, setAuthUserType] = useLocalStorage(localStorageSate?.userType);
  const [userChoice, __, loading] = useLocalStorage(localStorageSate.useChoice);

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

  const roomOptions = useMemo((): RoomOptions => {
    let videoCodec: VideoCodec | undefined = 'vp9';
    return {
      videoCaptureDefaults: {
        deviceId: userChoice?.videoDeviceId ?? undefined,
        resolution: VideoPresets.h720,
      },
      publishDefaults: {
        dtx: false,
        // videoSimulcastLayers: props.options.hq
        //   ? [VideoPresets.h1080, VideoPresets.h720]
        //   : [VideoPresets.h540, VideoPresets.h216],
        videoSimulcastLayers: [VideoPresets.h540, VideoPresets.h216],
        videoCodec,
      },
      audioCaptureDefaults: {
        deviceId: userChoice?.audioDeviceId ?? undefined,
        echoCancellation: true,
        noiseSuppression: true,
      },
      disconnectOnPageLeave: true,
      adaptiveStream: { pixelDensity: 'screen' },
      dynacast: true,
    };
  }, [loading]);

  const room = useMemo(() => new Room(roomOptions), []);

  return (
    <LiveKitRoom
      video={userChoice?.video ?? false}
      audio={userChoice?.audio ?? false}
      room={room}
      token={connectionDetails?.token}
      serverUrl={ENV.liveKitUrl}
      connectOptions={connectOptions}
      // Use the default LiveKit theme for nice styles.
      data-lk-theme="default"
      style={{ height: '100dvh' }}
      onDisconnected={() => {
        router.push('/');
        setConnectionDetails(null);
        setAuthUserType(null);
      }}
    >
      <VideoConference
        chatMessageFormatter={formatChatMessageLinks}
        // SettingsComponent={true ? SettingsMenu : undefined}
      />
      <ParticipantsPopup meetingSessionRequests={meetingSessionRequests} />
      <LiveKitParticipantMonitor />
    </LiveKitRoom>
  );
};

export default LiveKitRoomCom;
