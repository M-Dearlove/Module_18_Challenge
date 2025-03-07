import { GraphQLError } from 'graphql';
import User from '../models/User';
import { signToken } from '../services/auth';

interface addUserArgs {
    userInput: {
        username: string;
        email: string;
        password: string;
    };
}

const resolvers = {
    Query: {
      me: async (_: any, args: { id?: string, username?: string }, context: any) => {
        // Ensure user is authenticated or provide sufficient parameters
        if (!context.user && !args.id && !args.username) {
          throw new GraphQLError('Unauthorized or insufficient parameters', {
            extensions: {
              code: 'UNAUTHORIZED',
              http: { status: 401 }
            }
          });
        }
  
        try {
          const foundUser = await User.findOne({
            $or: [
              { _id: context.user?._id || args.id }, 
              { username: args.username }
            ]
          });
  
          if (!foundUser) {
            throw new GraphQLError('Cannot find a user with this id or username', {
              extensions: {
                code: 'NOT_FOUND',
                http: { status: 404 }
              }
            });
          }
  
          return foundUser;
        } catch (error) {
          throw new GraphQLError('Error fetching user', {
            extensions: {
              code: 'INTERNAL_SERVER_ERROR',
              http: { status: 500 }
            }
          });
        }
      }
    },
  
    Mutation: {
      addUser: async (_: any, { userInput }: addUserArgs) => {
          // Create user
          const user = await User.create(userInput);
  
          // Generate token
          const token = signToken(user.username, user.password, user._id);
  
          return { token, user }; 
      },
  
      login: async (_: any, args: { email?: string, password: string }) => {
        // Validate input
        if (!args.email) {
          throw new GraphQLError('Email must be provided', {
            extensions: {
              code: 'BAD_USER_INPUT',
              http: { status: 400 }
            }
          });
        }
  
        try {
          // Find user by email
          const user = await User.findOne({ 
            $or: [
              { email: args.email }
            ] 
          });
  
          // Check if user exists
          if (!user) {
            throw new GraphQLError("Can't find this user", {
              extensions: {
                code: 'NOT_FOUND',
                http: { status: 404 }
              }
            });
          }
  
          // Verify password
          const correctPw = await user.isCorrectPassword(args.password);
  
          if (!correctPw) {
            throw new GraphQLError('Wrong password!', {
              extensions: {
                code: 'UNAUTHORIZED',
                http: { status: 401 }
              }
            });
          }
  
          // Generate token
          const token = signToken(user.username, user.password, user._id);
  
          return { token, user };
        } catch (error) {
          throw new GraphQLError('Login failed', {
            extensions: {
              code: 'INTERNAL_SERVER_ERROR',
              http: { status: 500 }
            }
          });
        }
      },
  
      saveBook: async (_: any, { input }: { input: any }, context: any) => {
        // Ensure user is authenticated
        if (!context.user) {
          throw new GraphQLError('Unauthorized', {
            extensions: {
              code: 'UNAUTHORIZED',
              http: { status: 401 }
            }
          });
        }
  
        try {
          const updatedUser = await User.findOneAndUpdate(
            { _id: context.user._id },
            { $addToSet: { savedBooks: input } },
            { new: true, runValidators: true }
          );
  
          if (!updatedUser) {
            throw new GraphQLError("Couldn't find user", {
              extensions: {
                code: 'NOT_FOUND',
                http: { status: 404 }
              }
            });
          }
  
          return updatedUser;
        } catch (error) {
          throw new GraphQLError('Failed to save book', {
            extensions: {
              code: 'INTERNAL_SERVER_ERROR',
              http: { status: 500 }
            }
          });
        }
      },
  
      removeBook: async (_: any, { bookId }: { bookId: string }, context: any) => {
        // Ensure user is authenticated
        if (!context.user) {
          throw new GraphQLError('Unauthorized', {
            extensions: {
              code: 'UNAUTHORIZED',
              http: { status: 401 }
            }
          });
        }
  
        try {
          const updatedUser = await User.findOneAndUpdate(
            { _id: context.user._id },
            { $pull: { savedBooks: { bookId } } },
            { new: true }
          );
  
          if (!updatedUser) {
            throw new GraphQLError("Couldn't find user with this id!", {
              extensions: {
                code: 'NOT_FOUND',
                http: { status: 404 }
              }
            });
          }
  
          return updatedUser;
        } catch (error) {
          throw new GraphQLError('Failed to delete book', {
            extensions: {
              code: 'INTERNAL_SERVER_ERROR',
              http: { status: 500 }
            }
          });
        }
      }
    }
  };

  export default resolvers;