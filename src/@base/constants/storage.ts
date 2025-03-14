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
}

export const localStorageSate: ILocalStorageState = {
  connectionDetails: {
    key: '_jhzsgfcsd_',
    initialValue: {
      token: null,
      roomName: null,
    },
  },
  userType: {
    key: '_jhzzxc_',
    initialValue: null,
  },
};
