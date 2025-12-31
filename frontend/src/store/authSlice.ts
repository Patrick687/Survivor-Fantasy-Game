import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
  type SerializedError,
} from '@reduxjs/toolkit';
import {
  type LoginMutation,
  type LoginInput,
  type SignupInput,
  type SignupMutation,
  type User,
} from '../graphql/generated';
import { SessionStorage } from './sessionStorage';
import apolloClient from '../graphql/apolloClient';
import {
  LOGIN_MUTATION,
  SIGNUP_MUTATION,
} from '../graphql/mutations/auth.mutations';
import { getGraphQLErrorMessage } from '../utils/getGraphQLErrorMessage';

interface AuthState {
  token: string | null;
  user: User | null;
  isAutheticated: boolean;
  loading: boolean;
  error: SerializedError | null;
}

const initialState: AuthState = {
  token: null,
  user: null,
  isAutheticated: false,
  loading: false,
  error: null,
};

export const signup = createAsyncThunk<SignupMutation, SignupInput>(
  'auth/signup',
  async (args, thunkAPI) => {
    try {
      const response = await apolloClient.mutate({
        mutation: SIGNUP_MUTATION,
        variables: { input: args },
      });
      if (!response.data) {
        return thunkAPI.rejectWithValue(response.error ?? 'Unknown error');
      }
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getGraphQLErrorMessage(error) ?? 'Unknown error'
      );
    }
  }
);

export const login = createAsyncThunk<LoginMutation, LoginInput>(
  'auth/login',
  async (args, thunkAPI) => {
    try {
      const response = await apolloClient.mutate({
        mutation: LOGIN_MUTATION,
        variables: { input: args },
      });
      if (!response.data) {
        return thunkAPI.rejectWithValue(response.error ?? 'Unknown error');
      }
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getGraphQLErrorMessage(error) ?? 'Unknown error'
      );
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth(state, action: PayloadAction<{ token: string; user: User }>) {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAutheticated = false;
      SessionStorage.saveToken(action.payload.token);
    },
    clearAuth(state) {
      state.token = null;
      state.user = null;
      state.isAutheticated = false;
      state.error = null;
      state.loading = false;
      SessionStorage.clearToken();
    },
    logout(state) {
      state.token = null;
      state.user = null;
      state.isAutheticated = false;
      state.error = null;
      state.loading = false;
      SessionStorage.clearToken();
    },
  },
  extraReducers: (b) => {
    b
      // Signup
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.token = action.payload.signup.token;
        state.user = action.payload.signup.me;
        state.isAutheticated = true;
        SessionStorage.saveToken(action.payload.signup.token);
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error;
        state.token = null;
        state.user = null;
        state.isAutheticated = false;
      })
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.token = action.payload.login.token;
        state.user = action.payload.login.me;
        state.isAutheticated = true;
        SessionStorage.saveToken(action.payload.login.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error;
        state.token = null;
        state.user = null;
        state.isAutheticated = false;
      });
  },
});

export const { setAuth, clearAuth, logout } = authSlice.actions;
export default authSlice.reducer;
