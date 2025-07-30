import { useEffect, useState } from 'react';
import "./static/css/App.css"
import { Link, Outlet } from 'react-router-dom';

function App() {
  const developmentBackendLink = "http://localhost:7700"
  const productionBackendLink = ""

  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    var loggedInSession = sessionStorage.getItem("user")
    if (loggedInSession == null) {
      setLoggedIn(false)
    } else {
      setLoggedIn(true)
    }
  }, loggedIn)

  return (
    <div className="App">
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container-fluid">
          <Link class="navbar-brand" to="#">HomeScrap</Link>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav">
              <li class="nav-item">
                <Link class="nav-link active" to="/">Home</Link>
              </li>
              <li class="nav-item">
                <Link class="nav-link active" to="/apartment-leaderboard">Apartment Leaderboard</Link>
              </li>

              {loggedIn === false ?
                <>
                  <li class="nav-item dropdown">
                    <Link class="nav-link active dropdown-toggle" to="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                      Apartment Admins
                    </Link>
                    <ul class="dropdown-menu">
                      <li><Link class="dropdown-item" to="/apartment-login">Login</Link></li>
                      <li><Link class="dropdown-item" to="/apartment-register">Register</Link></li>
                    </ul>
                  </li>

                  <li class="nav-item dropdown">
                    <Link class="nav-link active dropdown-toggle" to="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                      Residents
                    </Link>
                    <ul class="dropdown-menu">
                      <li><Link class="dropdown-item" to="/resident-login">Login</Link></li>
                      <li><Link class="dropdown-item" to="/resident-register">Register</Link></li>
                    </ul>
                  </li>
                </>
              : 
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/logout">Logout</Link>
                  </li>
                </>
              }
                
            </ul>
          </div>
        </div>
      </nav>

      <div className="content">
        <Outlet className="content" context={{
            developmentBackendLink,
            productionBackendLink
          }}        
        />
      </div>
    </div>
  );
}

export default App;
