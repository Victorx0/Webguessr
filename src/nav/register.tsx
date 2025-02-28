import { useState } from "react"
import supabase from "../Supabase/supabaseClient"
import { Link } from "react-router-dom"

function Register() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [displayName, setDisplayName] = useState("")
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        setMessage("")
        setLoading(true)

        try {
            // First create the auth user
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        display_name: displayName
                    }
                  }
            })

            if (authError) {
                setMessage(authError.message)
                return
            }

            if (authData && authData.user) {
                setMessage("User account created successfully")
            }

            setEmail("")
            setPassword("")
            setDisplayName("")
        } catch (error) {
            setMessage("An unexpected error occurred")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-5">
                    <div className="card shadow">
                        <div className="card-body p-5">
                            <h2 className="text-center mb-4">Create an Account</h2>
                            
                            {message && (
                                <div className={`alert ${message.includes("error") ? "alert-danger" : "alert-success"}`} role="alert">
                                    {message}
                                </div>
                            )}
                            
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email address</label>
                                    <input
                                        id="email"
                                        required
                                        onChange={(e) => setEmail(e.target.value)}
                                        value={email}
                                        type="email"
                                        className="form-control"
                                        placeholder="Enter your email"
                                    />
                                </div>
                                
                                <div className="mb-3">
                                    <label htmlFor="displayName" className="form-label">Display Name</label>
                                    <input
                                        id="displayName"
                                        required
                                        onChange={(e) => setDisplayName(e.target.value)}
                                        value={displayName}
                                        type="text"
                                        className="form-control"
                                        placeholder="Choose a display name"
                                    />
                                </div>
                                
                                <div className="mb-4">
                                    <label htmlFor="password" className="form-label">Password</label>
                                    <input
                                        id="password"
                                        required
                                        onChange={(e) => setPassword(e.target.value)}
                                        value={password}
                                        type="password"
                                        className="form-control"
                                        placeholder="Create a password"
                                    />
                                </div>
                                
                                <div className="d-grid">
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Creating Account...
                                            </>
                                        ) : "Create Account"}
                                    </button>
                                </div>
                            </form>
                            
                            <div className="text-center mt-4">
                                <span>Already have an account? </span>
                                <Link to="/login" className="text-decoration-none">Log in</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register