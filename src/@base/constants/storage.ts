export interface IB2bRequestState {
  information: any;
  documents?: any;
  step: 'basic-information' | 'document-upload' | 'final-review';
}

interface ILocalStorageState {
  connectionDetails: {
    key: string;
    initialValue: {
      token?: string;
      roomName?: string;
    };
  };
  userType: {
    key: string;
    initialValue: 'admin' | 'participant';
  };
  useChoice: {
    key: string;
    initialValue: {
      audio: boolean;
      video: boolean;
      audioDeviceId: string;
      videoDeviceId: string;
    };
  };
}

export const localStorageSate: ILocalStorageState = {
  connectionDetails: {
    key: '_jh52d_',
    initialValue: {
      token: null,
      roomName: null,
    },
  },
  userType: {
    key: '_jh65f_',
    initialValue: null,
  },

  useChoice: {
    key: '_df65c',
    initialValue: {
      audio: false,
      video: false,
      audioDeviceId: null,
      videoDeviceId: null,
    },
  },
};
