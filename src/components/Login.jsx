import { useRef, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthProvider";
import axios from "../API/axios";
import "../CSS/table-styling.css";

const URL = 'http://localhost:7001/api/auth/login';

const Login = () => {
    const { setAuthState } = useContext(AuthContext); //store authstate in global context upon successful login by user
    const navigate = useNavigate();

    const userRef = useRef();
    const errorRef = useRef();

    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [success, setSuccess] = useState(false);

    //useEffect for later

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect (() => {
        setErrorMsg('');
    }, [user, pwd])

    //interacts with the express server 

    const verifyLogin = async (e) => {
        e.preventDefault();
       
        try {
            const response = await axios.post(URL,
                JSON.stringify({ username: user, password: pwd }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            console.log(JSON.stringify(response?.data));
        
            const accessToken = response?.data?.accessToken; // Get the token
            const roles = response?.data?.roles; // Get the role
        
            setAuthState({ user, pwd, roles, accessToken }); // Set authentication state
            console.log("Updated Auth State:", { user, roles, accessToken });
            setUser('');
            setPwd('');
            setSuccess(true);

            //redirect based on user role

           
            if (roles === "admin") {
                navigate("/upload");
            } else if (roles === "user") {
                navigate("/search");
            }

        } catch (err) {
            if (!err?.response) {
                setErrorMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrorMsg('Missing Username or Password');
            } else if (err.response?.status === 401) {
                setErrorMsg('Unauthorized');
            } else {
                setErrorMsg('Login Failed');
            }
            errorRef.current.focus();
        }
    } 

    return (
        <>
      
      <div className="container mt-5">
      <p ref={errorRef} className={errorMsg ? "errormsg" : "offscreen"} aria-live="assertive">
        {errorMsg}
      </p>

      <div className="login-box d-flex shadow-lg rounded overflow-hidden">
        {/* Left Form Section */}
        <div className="col-md-6 p-5 bg-white">
          <h4 className="mb-4 fw-bold">Sign In</h4>

          <div className="mb-3 d-flex gap-2">
            <button className="btn social-btn"><i className="fab fa-facebook-f"></i></button>
            <button className="btn social-btn"><i className="fab fa-twitter"></i></button>
          </div>

          <form onSubmit={verifyLogin}>
            <div className="mb-3">
              <label className="form-label small text-uppercase fw-bold">Username</label>
              <input
                type="text"
                id="username"
                className="form-control rounded-pill bg-light border-0 px-4"
                ref={userRef}
                autoComplete="off"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label small text-uppercase fw-bold">Password</label>
              <input
                type="password"
                id="password"
                className="form-control rounded-pill bg-light border-0 px-4"
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                required
              />
            </div>

            <div className="d-grid mb-3">
              <button type="submit" className="btn btn-gradient rounded-pill py-2 fw-semibold text-white">
                Sign In
              </button>
            </div>

            <div className="d-flex justify-content-between align-items-center small">
              <div className="form-check">
                <input type="checkbox" className="form-check-input" id="rememberMe" defaultChecked />
                <label className="form-check-label text-pink" htmlFor="rememberMe">Remember Me</label>
              </div>
              <a href="#" className="text-muted">Forgot Password</a>
            </div>
          </form>
        </div>

        {/* Right Info Section */}
        <div className="col-md-6 d-flex flex-column justify-content-center align-items-center text-white bg-gradient-custom p-5">
          <h3 className="fw-bold">Welcome User!</h3>
          <p>New User?</p>
          <button className="btn btn-outline-light rounded-pill px-4 mt-2">Sign Up Here</button>
        </div>
      </div>
    </div>
</>
        
    )
}

export default Login

