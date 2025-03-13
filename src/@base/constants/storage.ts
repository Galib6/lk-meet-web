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
      isAdmin?: boolean;
    };
  };
}

export const localStorageSate: ILocalStorageState = {
  connectionDetails: {
    key: '_jhzsgfcsd',
    initialValue: {
      token: null,
      roomName: null,
      isAdmin: false,
    },
  },
};
