import { useQuery } from '@apollo/client'
import {useEffect, useState} from 'react'
import { ALL_BOOKS, BOOK_BY_GENRE } from '../query'

const Books = (props) => {

  const [genres, setGenres] = useState([])
  const [genre, setGenre] = useState("")
  const [books, setBooks] = useState(props.books)
  const [booksSecond, setBooksSecond] = useState(props.books)

  console.log(props.books)

  const {loading, error, data} = useQuery(ALL_BOOKS, {
    variables: { genre: genre }
  })

  useEffect(() => {
    setBooksSecond(props.books);
  }, [props.books]);

  useEffect(() => {
    if (loading) {
      return;
  }
  
  if (error) {
      console.error(error);
      return;
  }

  if (data && data.allBooks) {
    setBooksSecond(data.allBooks)
  }
  }, [loading, error, data])


  useEffect(() => {
    let temp = []
    for(let i = 0; i < books.length; i++) {
      const innerGenres = books[i].genres
      for(let j = 0; j < innerGenres.length; j++) {
        if(!temp.includes(innerGenres[j])) {
          temp.push(innerGenres[j])
        }
      }
    }
    setGenres(temp)
  }, [books])

  if (!props.show) {
    return null
  }

  const handleRemoveFilter = () => {
    setBooksSecond(props.books)
  }

  const genresMap = genres.map((a, key) => {
    return(
      <div key={key}>
        <button onClick={() => setGenre(a)}>{a}</button>
      </div>
    )
  })

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {booksSecond.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {genresMap}
      <button onClick={handleRemoveFilter}>All genres</button>
    </div>
  )
}

export default Books
