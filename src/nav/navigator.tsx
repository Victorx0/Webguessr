import { Link } from "react-router-dom"
import 'bootstrap/dist/css/bootstrap.min.css';

function Navigator(){
    return (
        <>
          <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
          <Link className="navbar-brand" to="/">Webguessr</Link>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
          </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav">
          <li className="nav-item active">
            <Link className="nav-link" to="/">Home</Link>
          </li>
          <li className="nav-item active">
            <Link className="nav-link" to="/dashboard">Dashboard</Link>
          </li>
          <li className="nav-item active">
            <Link className="nav-link" to="/create">Create & Edit</Link>
          </li>
        </ul>
      </div>
      <ul className="navbar-nav">
        <li className="btn btn-outline-success my-2 my-sm-0">
          <Link className="nav-link" to="/login">Login</Link>
        </li>
        <li className="btn btn-outline-success my-2 my-sm-0">
          <Link className="nav-link" to="/register">Register</Link>
        </li>
      </ul>
    </nav>
        </>
        )
}

export default Navigator