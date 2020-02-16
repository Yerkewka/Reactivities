import { observable, action, computed, configure, runInAction } from 'mobx';
import { createContext, SyntheticEvent } from 'react';
import { IActivity } from '../models/activity';
import agent from '../api/agent';
import { history } from '../..';

configure({ enforceActions: 'always' });

class ActivityStore {
  @observable activityRegistry = new Map();
  @observable loadingInitial = false;
  @observable selectedActivity: IActivity | null = null;
  @observable submitting = false;
  @observable target = '';

  @computed get activitiesByDate() {
    return this.groupActivitiesByDate(
      Array.from(this.activityRegistry.values())
    );
  }

  groupActivitiesByDate = (activities: IActivity[]) => {
    const sortedActivities = activities.sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    );

    return Object.entries(
      sortedActivities.reduce((activities, activity) => {
        const date = activity.date.toISOString().split('T')[0];
        activities[date] = activities[date]
          ? [...activities[date], activity]
          : [activity];
        return activities;
      }, {} as { [key: string]: IActivity[] })
    );
  };

  @action loadActivities = async () => {
    this.loadingInitial = true;

    try {
      const activities = await agent.Activities.list();
      runInAction('loading activities', () => {
        activities.forEach(activity => {
          activity.date = new Date(activity.date);
          this.activityRegistry.set(activity.id, activity);
        });

        this.loadingInitial = false;
      });
    } catch (error) {
      console.error(error);
      runInAction('load activities error', () => {
        this.loadingInitial = false;
      });
    }
  };

  @action loadActivity = async (id: string) => {
    let activity = this.getActivity(id);
    if (activity) {
      this.selectedActivity = activity;
      return activity;
    } else {
      this.loadingInitial = true;
      try {
        let activity = await agent.Activities.details(id);
        runInAction('getting activity details', () => {
          activity.date = new Date(activity.date);
          this.selectedActivity = activity;
          this.activityRegistry.set(activity.id, activity);
          this.loadingInitial = false;
        });

        return activity;
      } catch (error) {
        runInAction('get activity details error', () => {
          this.loadingInitial = false;
        });
        console.error(error);
      }
    }
  };

  getActivity = (id: string): IActivity | undefined => {
    return this.activityRegistry.get(id);
  };

  @action clearSelectedActivity = () => {
    this.selectedActivity = null;
  };

  @action createActivity = async (activity: IActivity) => {
    this.submitting = true;

    try {
      await agent.Activities.create(activity);
      runInAction('creating activity', () => {
        this.activityRegistry.set(activity.id, activity);
        this.submitting = false;
      });
      history.push(`/activities/${activity.id}`);
    } catch (error) {
      console.error(error);
      runInAction('create activity error', () => {
        this.submitting = false;
      });
    }
  };

  @action editActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.update(activity);
      runInAction('editing activity', () => {
        this.activityRegistry.set(activity.id, activity);
        this.selectedActivity = activity;
        this.submitting = false;
      });
      history.push(`/activities/${activity.id}`);
    } catch (error) {
      console.error(error);
      runInAction('edit activity error', () => {
        this.submitting = false;
      });
    }
  };

  @action deleteActivity = async (
    event: SyntheticEvent<HTMLButtonElement>,
    id: string
  ) => {
    this.submitting = true;
    this.target = event.currentTarget.name;
    try {
      await agent.Activities.delete(id);
      runInAction('deleting activity', () => {
        this.activityRegistry.delete(id);
        this.target = '';
        this.submitting = false;
      });
    } catch (error) {
      console.error(error);
      runInAction('delete activity error', () => {
        this.target = '';
        this.submitting = false;
      });
    }
  };
}

export default createContext(new ActivityStore());
