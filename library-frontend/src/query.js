import { gql } from "@apollo/client";

export const ALL_AUTHORS = gql`
    query {
        allAuthors {
            name,
            born
            bookCount
        }
    }
`

export const ALL_BOOKS = gql`
    query bookByGenre($genre: String) {
        allBooks(genre: $genre) {
            title,
            published,
            genres,
            author {
                name
                born
            }
        }
    }
`

export const BOOK_BY_GENRE = gql`
    query bookByGenre($genre: String){
        allBooks(genre: $genre) {
            title
            published
            genres
            author {
                name
                born
            }
        }
    }
`

export const ME = gql`
    query {
        me {
            username
            favoriteGenre
        }
    }
`

export const USER_DATA = gql`
    query queryUser($username: String){
        userData(username: $username) {
            username
            favoriteGenre
        }
    }
`

export const CREATE_BOOK = gql`
    mutation createBook($title: String!, $author: String!, $published: Int!, $genres: [String!]!) {
        addBook(
            title: $title,
            author: $author,
            published: $published,
            genres: $genres
        ) {
            title
            author {
                name
            }
            published
            genres
        }
    }
`

export const UPDATE_AUTHOR = gql`
    mutation updateAuthor($name: String!, $born: Int!) {
        editAuthor(
            name: $name
            born: $born
        ) {
            name
            born
        }
    }
`

export const LOGIN = gql`
    mutation loginUser($username: String!, $password: String!) {
        login(
            username: $username,
            password: $password
        ) {
            value
        }
    }
`

export const BOOK_ADDED = gql`
    subscription {
        bookAdded {
            title
            author {
                name
                born
            }
            published
            genres
        }
    }
`