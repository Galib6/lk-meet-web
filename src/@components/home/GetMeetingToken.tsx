import { getAuthSession } from '@components/auth/lib/utils';
import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { SOCKET_EVENT } from 'src/@base/constants/meetingSessionEvent';
import { localStorageSate } from 'src/@base/constants/storage';
import useLocalStorage from 'src/@base/hooks/useLocalStorage';

const GetMeetingToken = () => {
  const auth = getAuthSession();
  const [_connectionDetails, setConnectionDetails] = useLocalStorage(localStorageSate?.connectionDetails);

  useEffect(() => {
    const socketConnection = io(`http://localhost:4800/meeting-session?userId=${auth?.user?.id}`, {
      reconnection: true,
      transports: ['websocket'],
    });

    socketConnection.on(SOCKET_EVENT.CONNECTION_DETAILS, (data) => {
      setConnectionDetails({ roomName: data?.roomName, token: data?.participantToken });
    });
  }, [auth?.user?.id]);

  return <div></div>;
};

export default GetMeetingToken;
