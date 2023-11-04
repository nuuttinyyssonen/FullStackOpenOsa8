import { useMutation } from "@apollo/client"
import { useEffect, useState } from "react"
import { LOGIN } from "../query"

const Login = (props) => {

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    

    const [ loginUser, result ] = useMutation(LOGIN, {
        onError: (error) => {
            console.error(error.graphQLErrors[0].message)
        }
    })

    useEffect(() => {
        if(result.data) {
            const token = result.data.login.value
            props.setToken(token)
            localStorage.setItem('userToken', token)
        }
    }, [result.data])
 
    if (!props.show) {
        return null
    }


    const handleLogin = (event) => {
        event.preventDefault()

        loginUser({ variables: { username, password } })
        localStorage.setItem('username', username)

        setUsername("")
        setPassword("")
    }

    return(
        <form onSubmit={handleLogin}>
            name <input value={username} onChange={(e) => setUsername(e.target.value)}/>
            password <input value={password} onChange={(e) => setPassword(e.target.value)}/>
            <button>Login</button>
        </form>
    )
}

export default Login