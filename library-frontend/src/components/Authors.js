import { useState } from "react"
import { useMutation } from "@apollo/client"
import { UPDATE_AUTHOR, ALL_AUTHORS } from "../query"

const Authors = (props) => {
  const [name, setName] = useState("")
  const [born, setBorn] = useState("")
  const [ updateAuthor ] = useMutation(UPDATE_AUTHOR, {
    refetchQueries: [ { query: ALL_AUTHORS } ],
    onError: (error) => {
      console.error(error)
    }
  })

  if (!props.show) {
    return null
  }
  const authors = props.authors

  const handleUpdate = () => {
    const parsedBorn = parseInt(born)
    updateAuthor({ variables: { name, born: parsedBorn } })
    setBorn("")
    setName("")
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
          <h2>Set birthyear</h2>
          name <input value={name} onChange={(e) => setName(e.target.value)}/>
          born <input value={born} onChange={(e) => setBorn(e.target.value)}/>
          <button onClick={handleUpdate}>update author</button>
      </div>
    </div>
  )
}

export default Authors
