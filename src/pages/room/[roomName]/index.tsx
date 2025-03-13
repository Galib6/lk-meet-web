import { getAuthSession } from '@components/auth/lib/utils';
import LiveKitRoomCom from '@components/home/LiveKitRoomCom';
import WaitingRoom from '@components/home/WaitingRoom';
import { useGetMeetingSessionRequests } from '@lib/hooks/hooks';
import { Services } from '@lib/services/service';
import { socketService } from '@lib/services/socket';
import '@livekit/components-styles';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Spinner from 'src/@base/components/Spinner';
import { queryClient } from 'src/@base/config';
import { SOCKET_EVENT } from 'src/@base/constants/meetingSessionEvent';
import { localStorageSate } from 'src/@base/constants/storage';
import useLocalStorage from 'src/@base/hooks/useLocalStorage';

export default function Index() {
  const router = useRouter();
  const { roomName } = router?.query;
  const auth = getAuthSession();
  const [loading, setLoading] = useState(false);
  const [connectionDetails, setConnectionDetails, isLoading] = useLocalStorage(localStorageSate?.connectionDetails);
  const meetingSessionRequests = useGetMeetingSessionRequests({ options: { roomName: roomName?.toString() } });

  useEffect(() => {
    if (isLoading ||  !roomName) return;
    const createSessionRequest = async () => {
      setLoading(true);
      const res = await Services.createSessionRequest({ roomName: roomName?.toString() });
      if (!res?.success) {
        router.push('/');
        return;
      }
      setLoading(false);
    };
    createSessionRequest();
  }, [roomName]);

  useEffect(() => {
    if (!auth?.user?.id) return;
    socketService.connect(auth?.user?.id.toString());
    const handleConnectionDetails = (data: any) => {
      setConnectionDetails({
        roomName: data?.roomName,
        token: data?.participantToken,
        isAdmin: data?.isAdmin,
      });
    };

    const handleNewRequest = (data: any) => {
      queryClient.invalidateQueries({
        queryKey: [Services.getMeetingRequestList.name],
      });

      toast.info(`${data?.name} requested to join the meeting`, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    };

    const handleOnRejection = () => {
      toast.error(`Host rejected your request!`, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      router.push('/');
    };

    // Add event listeners
    socketService.on(SOCKET_EVENT.CONNECTION_DETAILS, handleConnectionDetails);
    socketService.on(SOCKET_EVENT.NEW_REQUEST, handleNewRequest);
    socketService.on(SOCKET_EVENT.REQ_REJECTED, handleOnRejection);

    // Cleanup function to remove event listeners
    return () => {
      socketService.off(SOCKET_EVENT.CONNECTION_DETAILS, handleConnectionDetails);
      socketService.off(SOCKET_EVENT.NEW_REQUEST, handleNewRequest);
      socketService.off(SOCKET_EVENT.REQ_REJECTED, handleOnRejection);
    };
  }, [auth?.user?.id]);

  return (
    <div>
      {loading ? (
        <Spinner />
      ) : (
        <>
          {connectionDetails?.token ? (
            <LiveKitRoomCom meetingSessionRequests={meetingSessionRequests?.data?.data} />
          ) : (
            <WaitingRoom userName={auth?.user?.name} />
          )}
        </>
      )}
    </div>
  );
}
