import { getAuthSession } from '@components/auth/lib/utils';
import LiveKitRoomCom from '@components/home/LiveKitRoomCom';
import WaitingRoom from '@components/home/WaitingRoom';
import '@livekit/components-styles';
import { localStorageSate } from 'src/@base/constants/storage';
import useLocalStorage from 'src/@base/hooks/useLocalStorage';

export default function Index() {
  const auth = getAuthSession();
  const [connectionDetails] = useLocalStorage(localStorageSate?.connectionDetails);

  const renderContent = () => {
    switch (true) {
      case connectionDetails?.token && !connectionDetails?.own:
        return (
          <>
            <LiveKitRoomCom />
          </>
        );
      case connectionDetails?.token && connectionDetails?.own:
        return <LiveKitRoomCom />;
      case !connectionDetails?.token && !connectionDetails?.own:
        return <WaitingRoom userName={auth?.user?.name} />;
      default:
        return;
    }
  };

  return <div>{renderContent()}</div>;
}
