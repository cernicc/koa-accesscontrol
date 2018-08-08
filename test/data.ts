export enum Header {
  USER_ROLE = 'x-test-role',
  USER_UUID = 'x-test-uuid',
}

export const user1 = {
  uuid: 'U1',
  firstname: 'Sherry',
  lastname: 'Rodriguez',
  email: 'sherry.rodriguez71@example.com',
  phone: '(705)-880-4045',
};

export const user2 = {
  uuid: 'U2',
  firstname: 'Walter',
  lastname: 'Castro',
  email: 'walter.castro66@example.com',
  phone: '(607)-849-4332',
};

export const user3 = {
  uuid: 'U3',
  firstname: 'Walter',
  lastname: 'Henry',
  email: 'walter.henry47@example.com',
  phone: '(516)-460-5456',
};

export const users = [user1, user2, user3];
