import {
  createAsyncThunk,
  createSlice,
  type SerializedError,
} from '@reduxjs/toolkit';
import {
  type CreateLeagueInput,
  type CreateLeagueMutation,
  type GetMyLeaguesQuery,
  type LeagueFieldsFragment,
} from '../graphql/generated';
import { CREATE_LEAGUE_MUTATION } from './league.mutations';
import apolloClient from '../graphql/apolloClient';
import { GET_MY_LEAGUES_QUERY } from './league.queries';

interface LeagueState {
  userLeagues: LeagueFieldsFragment[];
  currentLeague: LeagueFieldsFragment | null;
  loading: boolean;
  error: SerializedError | null;
}

const initialState: LeagueState = {
  userLeagues: [],
  currentLeague: null,
  loading: false,
  error: null,
};

export const createLeague = createAsyncThunk<
  CreateLeagueMutation,
  CreateLeagueInput
>('league/createLeague', async (args, thunkAPI) => {
  try {
    const response = await apolloClient.mutate({
      mutation: CREATE_LEAGUE_MUTATION,
      variables: { input: args },
    });
    if (!response.data) {
      return thunkAPI.rejectWithValue(response.error ?? 'Unknown error');
    }
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(
      'An error occurred while creating the league'
    );
  }
});

export const getMyLeagues = createAsyncThunk<GetMyLeaguesQuery, void>(
  'league/getMyLeagues',
  async (_, thunkAPI) => {
    try {
      const response = await apolloClient.query({
        query: GET_MY_LEAGUES_QUERY,
        fetchPolicy: 'network-only',
      });
      if (!response.data) {
        return thunkAPI.rejectWithValue(response.error ?? 'Unknown error');
      }
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        'An error occurred while fetching leagues'
      );
    }
  }
);

const leagueSlice = createSlice({
  name: 'league',
  initialState,
  reducers: {},
  extraReducers: (b) => {
    b.addCase(createLeague.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
      .addCase(createLeague.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.userLeagues.push(action.payload.createLeague);
        state.currentLeague = action.payload.createLeague;
      })
      .addCase(createLeague.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(getMyLeagues.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyLeagues.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.userLeagues = action.payload.getMyLeagues;
      })
      .addCase(getMyLeagues.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      });
  },
});

export default leagueSlice.reducer;
