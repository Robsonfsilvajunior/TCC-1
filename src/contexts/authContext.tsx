import { ReactNode, createContext, useState, useEffect } from "react";

interface AuthProviderProps {
  children: ReactNode;
}

type AuthContextData = {
  signed: boolean;
  loadingAuth: boolean;
  handleInfoUser: ({ name, email, uid }: userProps) => void;
  user: userProps | null;
  signOut: () => void;
};

interface userProps {
  uid: string;
  name: string | null;
  email: string | null;
}

export const AuthContext = createContext({} as AuthContextData);

function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<userProps | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    // Verificar se há usuário salvo no localStorage
    const savedUser = localStorage.getItem('Easysis_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        console.error('Erro ao carregar usuário do localStorage:', error);
        localStorage.removeItem('Easysis_user');
      }
    }
    setLoadingAuth(false);
  }, []);

  function handleInfoUser({ name, email, uid }: userProps) {
    const userData = { name, email, uid };
    setUser(userData);
    localStorage.setItem('Easysis_user', JSON.stringify(userData));
  }

  function signOut() {
    setUser(null);
    localStorage.removeItem('Easysis_user');
  }

  return (
    <AuthContext.Provider
      value={{
        signed: !!user,
        loadingAuth,
        handleInfoUser,
        user,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
