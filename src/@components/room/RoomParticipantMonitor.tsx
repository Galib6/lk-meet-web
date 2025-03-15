import { playSound } from '@lib/utils/notificationSound';
import { useRoomContext } from '@livekit/components-react';
import { RoomEvent } from 'livekit-client';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

const LiveKitParticipantMonitor = () => {
  const room = useRoomContext();

  useEffect(() => {
    if (!room) return;

    const handleParticipantJoined = (participant: any) => {
      playSound('joined');
      toast.success(`${participant?.name} has joined the meeting.`, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: true,
      });
    };

    const handleParticipantLeft = (participant: any) => {
      playSound('left');
      toast.info(`${participant?.name} has left the meeting.`, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: true,
      });
    };

    room.on(RoomEvent.ParticipantConnected, handleParticipantJoined);
    room.on(RoomEvent.ParticipantDisconnected, handleParticipantLeft);

    return () => {
      room.off(RoomEvent.ParticipantConnected, handleParticipantJoined);
      room.off(RoomEvent.ParticipantDisconnected, handleParticipantLeft);
    };
  }, [room]);

  return <></>;
};

export default LiveKitParticipantMonitor;
