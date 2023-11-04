import { useQuery } from "@apollo/client"
import { USER_DATA } from "../query"
import { useEffect, useState } from "react"

const Recommendations = (props) => { 

    const [recommendedBooks, setRecommendedBooks] = useState([])

    const {loading, error, data} = useQuery(USER_DATA, {
        variables: { username: localStorage.getItem('username') }

    })
    const books = props.books 
   
    useEffect(() => {
        if (loading) {
            return;
        }

        if (error) {
            console.error(error);
            return;
        }

        if (data && data.userData && data.userData.favoriteGenre) {
            const filteredBooks = books.filter((book) => book.genres.includes(data.userData.favoriteGenre));
            setRecommendedBooks(filteredBooks);
        }
    }, [loading, error, data, books])

    if(!props.show) {
        return null
    }

    return(
        <div>
            <h2>Recommendations</h2>
            {data && data.userData && data.userData.favoriteGenre && <h3>Books in your favorite genre {data.userData.favoriteGenre}</h3>}
            <table>
                <tbody>
                <tr>
                    <th></th>
                    <th>author</th>
                    <th>published</th>
                </tr>
                {recommendedBooks.map((a) => (
                <tr key={a.title}>
                    <td>{a.title}</td>
                    <td>{a.author.name}</td>
                    <td>{a.published}</td>
                </tr>
                ))}
                </tbody>
        </table>
        </div>
    )
}

export default Recommendations