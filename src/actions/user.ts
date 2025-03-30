// user.ts
import sendApiReq from '@/app/api/utils/sendApiReq';
import endPoints from '@/app/api/utils/endPoints';

export type UpdateUserNameData = {
  name: string | null;
};

export type UpdateUserEmailData = {
  email: string;
};

export type UpdateUserPasswordData = {
  oldPassword?: string;
  newPassword: string;
};

export type UserResponse = {
  id: string;
  name: string | null;
  email: string;
  emailVerified: string | null;
  image: string | null;
  createdAt: string;
  updatedAt: string;
};

export function getCurrentUser(): Promise<
  Pick<UserResponse, 'name' | 'email'>
> {
  return sendApiReq<Pick<UserResponse, 'name' | 'email'>>({
    url: endPoints.profile,
    method: 'GET'
  });
}

export function updateUserName(
  data: UpdateUserNameData
): Promise<UserResponse> {
  return sendApiReq<UserResponse>({
    url: `${endPoints.profile}/name`,
    method: 'PUT',
    data
  });
}

export function updateUserEmail(
  data: UpdateUserEmailData
): Promise<UserResponse> {
  return sendApiReq<UserResponse>({
    url: `${endPoints.profile}/email`,
    method: 'PUT',
    data
  });
}

export function updateUserPassword(
  data: UpdateUserPasswordData
): Promise<void> {
  return sendApiReq<void>({
    url: `${endPoints.profile}/password`,
    method: 'PUT',
    data
  });
}
