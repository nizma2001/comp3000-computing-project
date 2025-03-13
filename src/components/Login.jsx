import { useRef, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthProvider";
import axios from "../API/axios";


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
                navigate("/userdashboard");
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
      
            <p ref={errorRef} className={errorMsg ? "errormsg" :
                "offscreen"} aria-live="assertive">{errorMsg} </p>
            
            <h1>Sign In</h1>
            <form onSubmit={verifyLogin}>
                <label htmlFor="username"> Username:</label>
                <input
                type="text"
                id="username"
                ref={userRef}
                autoComplete="off"
                onChange={(e) => setUser(e.target.value)}
                value={user}
                required
                />

                <label htmlFor="password"> Password:</label>
                <input
                type="password"
                id="password"
                onChange={(e) => setPwd(e.target.value)}
                value={pwd}
                required
                />

                <button> Sign In</button>
            </form>
            <p>
                Forgot Password <br/>
                <span className="line">
                    {/*redirect page later*/}
                    <a href="#">Click here</a>
                </span>
            </p>

        
     
        
    
        </>
    )
}

export default Login