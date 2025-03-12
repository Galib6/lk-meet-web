export interface IB2bRequestState {
  information: any;
  documents?: any;
  step: 'basic-information' | 'document-upload' | 'final-review';
}

interface ILocalStorageState {
  connectionDetails: {
    key: string;
    initialValue: {
      token: string;
    };
  };
}

export const localStorageSate: ILocalStorageState = {
  connectionDetails: {
    key: '_jhzsgfcsd',
    initialValue: null,
  },
};
