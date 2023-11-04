const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')
const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')
const { PubSub } = require('graphql-subscriptions')
const author = require('./models/author')
const pubsub = new PubSub()

const resolvers = {
    Query: {
      booksCount: async() => Book.collection.countDocuments(),
      authorCount: async() => Author.collection.countDocuments(),
      allBooks: async (root, args) => {
          if(args.author) {
              console.log(args)
              const author = await Author.find({ author: args.author })
              const id = author._id
              const booksFiltered = await Book.find({ author: id })
              return booksFiltered
          }
          if(args.genre) {
            console.log(args)
            const filteredBooks = await Book.find({ genres: args.genre })
            return filteredBooks
          }
  
          const books = await Book.find({}).populate('author')
          return books
      },
      allAuthors: async() => {
        const authors = await Author.find({})
        return authors
      },
      me: async(root, args, context) => {
        return context.currentUser
      },
      userData: async(root, args) => {
        const user = await User.findOne({ username:  args.username})
        return user
      }
      },
      Authors: {
        bookCount: async(root, args) => {
          const count = await Book.countDocuments({ author: root.id })
          return count
        }
      },
      Mutation: {
          addBook: async (root, args, context) => {
            const currentUser = context.currentUser
              if(!currentUser) {
                throw new GraphQLError('not authenticated', {
                  extensions: {
                    code: 'BAD_USER_INPUT'
                  }
                })
              }
              let author; 
              try {
                console.log(args.author)
                author = await Author.findOne({ name: args.author })
                console.log(author)
                if(!author) {
                  const newAuthor  = new Author({ name: args.author })
                  author = await newAuthor.save()
                }
                const book = new Book({ ...args, author: author._id })
                await book.save()
                const addedBook = await Book.findOne({ title: args.title }).populate('author')
                console.log(addedBook)
                pubsub.publish('BOOK_ADDED', { bookAdded: addedBook })
                return addedBook 
              } catch (error) {
                throw new GraphQLError('Saving book failed', {
                  extensions: {
                    code: 'BAD_USER_INPUT',
                    invalidArgs: args.title,
                    error
                  }
                })
              }
          },
          editAuthor: async(root, args, context) => {
              const author = await Author.findOne({ name: args.name })
              console.log(author)
              const currentUser = context.currentUser
              if(!currentUser) {
                throw new GraphQLError('not authenticated', {
                  extensions: {
                    code: 'BAD_USER_INPUT'
                  }
                })
              }
              if(!author) {
                  console.log("this")
                  return null
              }
              author.born = args.born
              try {
                await author.save()
              } catch (error) {
                throw new GraphQLError('Saving name failed', {
                  extensions: {
                    code: 'BAD_USER_INPUT',
                    invalidArgs: args.name,
                    error
                  }
                })
              }
              return author
          },
          createUser: async(root, args) => {
            const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre })
            return user.save()
              .catch(error => {
                throw new GraphQLError('Creating the user failed', {
                  extensions: {
                    code: 'BAD_USER_INPUT',
                    invalidArgs: args.username,
                    error
                  }
                })
              })
          },
          login: async(root, args) => {
            const user = await User.findOne({ username: args.username })
            if(!user || args.password !== 'secret') {
              throw new GraphQLError('wrong credentials', {
                extensions: {
                  code: 'BAD_USER_INPUT'
                }
              }) 
            }
            const userForToken = {
              username: user.username,
              id: user._id
            }
  
            return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
          }
      },
      Subscription: {
        bookAdded: {
            subscribe: () => pubsub.asyncIterator('BOOK_ADDED')
        }
      }
  
}

module.exports = resolvers