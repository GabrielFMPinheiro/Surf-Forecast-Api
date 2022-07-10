import { User } from '@src/models/user';

describe('Users functional tests', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('When creating a user', () => {
    it('should create a user with success', async () => {
      const newUser = {
        name: 'John Doe',
        email: 'john@gmail.com',
        password: '1234',
      };
      const response = await global.testRequest.post('/users').send(newUser);
      expect(response.status).toBe(201);
      expect(response.body).toEqual(expect.objectContaining(newUser));
    });

    it('Should return a validation error when a field is missing', async () => {
      const newUser = {
        email: 'john@mail.com',
        password: '1234',
      };
      const response = await global.testRequest.post('/users').send(newUser);

      expect(response.status).toBe(422);
      expect(response.body).toEqual({
        code: 422,
        message: 'User validation failed: name: Path `name` is required.',
      });
    });

    it('Should return 409 when the email already exists', async () => {
      const newUser = {
        name: 'John Doe',
        email: 'john@mail.com',
        password: '1234',
      };
      await global.testRequest.post('/users').send(newUser);
      const response = await global.testRequest.post('/users').send(newUser);

      expect(response.status).toBe(409);
      expect(response.body).toEqual({
        code: 409,
        message:
          'User validation failed: email: already exists in the database.',
      });
    });
  });
});
