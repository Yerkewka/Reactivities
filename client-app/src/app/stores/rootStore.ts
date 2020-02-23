import { createContext } from 'react';
import UserStore from './userStore';
import ActivityStore from './activityStore';
import { configure } from 'mobx';
import CommonStore from './commonStore';
import ModalStore from './modalStore';

configure({ enforceActions: 'always' });

export class RootStore {
  userStore: UserStore;
  activityStore: ActivityStore;
  commonStore: CommonStore;
  modalStore: ModalStore;

  constructor() {
    this.userStore = new UserStore(this);
    this.activityStore = new ActivityStore(this);
    this.commonStore = new CommonStore(this);
    this.modalStore = new ModalStore(this);
  }
}

export const RootStoreContext = createContext(new RootStore());
