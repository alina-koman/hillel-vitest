import {useEffect, useState} from "react"

interface UserInterface {
    id?: number
    name: string
    email: string
}

const UserProfile = () => {
    const [user, setUser] = useState<UserInterface | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let isMounted = true

        const fetchUser = async () => {
            try {
                setLoading(true)
                setError(null)

                const response = await fetch("https://jsonplaceholder.typicode.com/users/1")

                if (!response.ok) {
                    throw new Error(`Request failed with status ${response.status}`)
                }

                const data: UserInterface = await response.json()

                if (isMounted) {
                    setUser(data)
                }
            } catch (err) {
                if (isMounted) {
                    setError(err instanceof Error ? err.message : "Failed to load user")
                }
            } finally {
                if (isMounted) {
                    setLoading(false)
                }
            }
        }

        fetchUser()

        return () => {
            isMounted = false
        }
    }, [])

    if (loading) {
        return <p className="user-profile__status" role="status">Loading...</p>
    }

    if (error) {
        return <p className="user-profile__status user-profile__status--error" role="alert">Error: {error}</p>
    }

    if (!user) {
        return null
    }

    return (
        <main className="user-profile">
            <h1 className="user-profile__title">User Profile</h1>
            <section className="user-profile__card" aria-label="User details">
                <h2 className="user-profile__name">{user.name}</h2>
                <p className="user-profile__email">{user.email}</p>
            </section>
        </main>
    )
}

export default UserProfile