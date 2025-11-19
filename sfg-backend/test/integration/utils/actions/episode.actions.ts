import {
  CreateEpisodeDto,
  UpdateEpisodeDto,
} from '../../../../generated/graphql';
import { createEpisodeMutation, updateEpisodeMutation } from '../mutations';
import { TestApp } from '../setup-nest-app';

export class EpisodeActions {
  constructor(private app: TestApp) {}

  async createEpisode(data: CreateEpisodeDto) {
    return this.app.mutation<'createEpisode'>(createEpisodeMutation, {
      data: data,
    });
  }

  async updateEpisode(data: UpdateEpisodeDto) {
    return this.app.mutation<'updateEpisode'>(updateEpisodeMutation, {
      data: data,
    });
  }
}
