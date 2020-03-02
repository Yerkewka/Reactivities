import { RootStore } from './rootStore';
import { IProfile, IPhoto } from '../models/profile';
import { observable, action, runInAction, computed } from 'mobx';
import agent from '../api/agent';
import { toast } from 'react-toastify';

export default class ProfileStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @observable profile: IProfile | null = null;
  @observable profileLoading = true;
  @observable uploadingPhoto = false;
  @observable loading = false;

  @computed get isCurrentUser() {
    if (this.rootStore.userStore.user && this.profile) {
      return this.rootStore.userStore.user.username === this.profile.username;
    } else {
      return false;
    }
  }

  @action getProfile = async (username: string) => {
    this.profileLoading = true;
    try {
      const profile = await agent.Profiles.get(username);
      runInAction(() => {
        this.profile = profile;
        this.profileLoading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.profileLoading = false;
      });
      console.log(error);
    }
  };

  @action uploadPhoto = async (file: Blob, key: string) => {
    this.uploadingPhoto = true;

    try {
      const photo = await agent.Profiles.uploadPhoto(file, key);
      runInAction(() => {
        if (this.profile) {
          this.profile.photos.push(photo);
          if (photo.isMain && this.rootStore.userStore.user) {
            this.rootStore.userStore.user.image = photo.url;
            this.profile.image = photo.url;
          }
        }

        this.uploadingPhoto = false;
      });
    } catch (error) {
      runInAction(() => {
        this.uploadingPhoto = false;
      });
      toast.error('Problem uploading photo');
    }
  };

  @action setMainPhoto = async (photo: IPhoto) => {
    this.loading = true;

    try {
      await agent.Profiles.setMainPhoto(photo.id);

      runInAction(() => {
        this.rootStore.userStore.user!.image = photo.url;
        this.profile!.photos.find(p => p.isMain)!.isMain = false;
        this.profile!.photos.find(p => p.id === photo.id)!.isMain = true;
        this.profile!.image = photo.url;
        this.loading = false;
      });
    } catch (error) {
      toast.error('Problem setting photo as main');
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  @action deletePhoto = async (photo: IPhoto) => {
    this.loading = true;

    try {
      await agent.Profiles.deletePhoto(photo.id);
      runInAction(() => {
        this.profile!.photos = this.profile!.photos.filter(
          p => p.id !== photo.id
        );
        this.loading = false;
      });
    } catch (error) {
      toast.error('Problem deleting photo');
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  @action editProfile = async (profile: Partial<IProfile>) => {
    this.loading = true;

    try {
      await agent.Profiles.editProfile(profile);
      runInAction(() => {
        if (
          profile.displayName !== this.rootStore.userStore.user!.displayName
        ) {
          this.rootStore.userStore.user!.displayName = profile.displayName!;
        }
        this.profile = { ...this.profile!, ...profile };

        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      throw error;
    }
  };

  @action follow = async (username: string) => {
    this.loading = true;
    try {
      await agent.Profiles.follow(username);
      runInAction(() => {
        this.profile!.following = true;
        this.profile!.followersCount++;
        this.loading = false;
      });
    } catch (error) {
      toast.error('Problem following user');
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  @action unfollow = async (username: string) => {
    this.loading = true;
    try {
      await agent.Profiles.unfollow(username);
      runInAction(() => {
        this.profile!.following = false;
        this.profile!.followersCount--;
        this.loading = false;
      });
    } catch (error) {
      toast.error('Problem unfollowing user');
      runInAction(() => {
        this.loading = false;
      });
    }
  };
}
