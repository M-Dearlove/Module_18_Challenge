const typeDefs = `#graphql
  type User {
    _id: ID!
    username: String!
    email: String!
    savedBooks: [Book!]
    bookCount: Int
  }

  type Book {
    bookId: String!
    title: String!
    authors: [String!]
    description: String
    image: String
    link: String
  }

  type Auth {
    token: String!
    user: User!
  }

  input UserInput {
    username: String!
    email: String!
    password: String!
  }

  input BookInput {
    bookId: String!
    title: String!
    authors: [String!]
    description: String
    image: String
    link: String
  }

  type Query {
    me(id: ID, username: String): User
  }

  type Mutation {
    addUser(userInput: UserInput!): Auth
    login(email: String, password: String!): Auth
    saveBook(input: BookInput!): User
    removeBook(bookId: String!): User
  }
`;

export default typeDefs;