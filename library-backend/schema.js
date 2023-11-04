const typeDefs = `
  type Books {
    title: String!
    published: Int!
    author: Authors!
    genres: [String!]!
    id: ID!
  }

  type Authors {
    name: String
    born: String
    bookCount: Int!
  }

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Query {
    booksCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Books!]!
    allAuthors: [Authors!]!
    me: User
    userData(username: String): User
  }

  type Mutation {
    addBook(
        title: String!
        author: String!
        published: Int!
        genres: [String!]!
    ): Books

    editAuthor(
        name: String!
        born: Int!
    ): Authors

    createUser(
      username: String!
      favoriteGenre: String!
    ): User

    login(
      username: String!
      password: String!
    ): Token
  }

  type Subscription {
    bookAdded: Books!
  }
`

module.exports = typeDefs