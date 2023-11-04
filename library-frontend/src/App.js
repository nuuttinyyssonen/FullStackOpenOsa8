import { useEffect, useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Login from './components/Login'
import Recommendations from './components/Recommendations'
import { useApolloClient, useMutation, useQuery, useSubscription } from '@apollo/client'
import { ALL_AUTHORS, ME, ALL_BOOKS, UPDATE_AUTHOR, BOOK_ADDED } from './query'
import { updateCache } from './updateCache'

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  const client = useApolloClient()

  const authors = useQuery(ALL_AUTHORS)
  const books = useQuery(ALL_BOOKS)

  console.log(authors)

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const addedBook = data.data.bookAdded
      console.log(addedBook)
      window.alert("a new book " + addedBook.title + " has been added")
      updateCache(client.cache, { query: ALL_BOOKS }, addedBook)
    }
  })


  if(authors.loading || books.loading) {
    return <div>Loading...</div>
  }

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }


  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token && <button onClick={() => setPage('add')}>add book</button>}
        {token && <button onClick={() => setPage('recommendations')}>Recommendations</button>}
        {!token && <button onClick={() => setPage('login')}>Login</button>}
        {token && <button onClick={logout}>logout</button>}
      </div>

      <Authors show={page === 'authors'} authors={authors.data.allAuthors} />

      <Books show={page === 'books' } books={books.data.allBooks} />

      <NewBook show={page === 'add'} />

      <Login show={page === 'login'} setToken={setToken} />

      <Recommendations show={page === 'recommendations'} books={books.data.allBooks}/>
    </div>
  )
}

export default App
