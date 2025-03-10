import { createContext, useState } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({children}) => {
    const [auth, setAuthState] = useState( {} );  //store users login state
    
    return (
        <AuthContext.Provider value={{auth, setAuthState}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;