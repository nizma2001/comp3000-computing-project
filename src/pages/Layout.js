import { Outlet, Link } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <nav className="navbar navbar-dark bg-dark fixed-top">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">File Storage & Verification</Link>
          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="offcanvas" 
            data-bs-target="#offcanvasDarkNavbar" 
            aria-controls="offcanvasDarkNavbar" 
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div 
            className="offcanvas offcanvas-end text-bg-dark" 
            tabIndex="-1" 
            id="offcanvasDarkNavbar" 
            aria-labelledby="offcanvasDarkNavbarLabel"
          >
            <div className="offcanvas-header">
              <h5 className="offcanvas-title" id="offcanvasDarkNavbarLabel">Menu</h5>
              <button 
                type="button" 
                className="btn-close btn-close-white" 
                data-bs-dismiss="offcanvas" 
                aria-label="Close"
              ></button>
            </div>
            <div className="offcanvas-body">
              <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
                <li className="nav-item">
                  <Link className="nav-link active" to="/">Logout</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/upload">Upload File</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/search">Search</Link>
                </li>
              </ul>
              {/* Optional search form */}
              <form className="d-flex mt-3" role="search">
                <input 
                  className="form-control me-2" 
                  type="search" 
                  placeholder="Search" 
                  aria-label="Search"
                />
                <button className="btn btn-success" type="submit">Search</button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      <div style={{ marginTop: '80px' }}>
        <Outlet />
      </div>
    </>
  );
};

export default Layout;
