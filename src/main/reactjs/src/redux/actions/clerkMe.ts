import { ClerkMe } from 'interfaces/clerkMe';
import {
  CLERK_ME_LOAD,
  CLERK_ME_RECEIVED,
  CLERK_ME_MOCK_LOAD,
  CLERK_ME_MOCK_RECEIVED,
} from 'redux/actionTypes/clerkMe';

export const loadClerkMe = {
  type: CLERK_ME_LOAD,
};

export const setClerkMe = (clerkMe: ClerkMe) => ({
  type: CLERK_ME_RECEIVED,
  clerkInfo: clerkMe,
});

export const loadClerkMeMock = {
  type: CLERK_ME_MOCK_LOAD,
};

export const setMockClerkMe = {
  type: CLERK_ME_MOCK_RECEIVED,
};
