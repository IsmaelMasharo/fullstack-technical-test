import { createContext, useState, ReactNode } from "react"

export type Role = "admin" | "volunteer" | "adopter"

export type AccessTokensType = {
  accessToken?: string
  role?: Role
}

export interface CurrentUserContextType {
  auth: AccessTokensType
  setAuth: React.Dispatch<React.SetStateAction<AccessTokensType>>
}

interface Props {
  children: ReactNode
}

const AuthContext = createContext<CurrentUserContextType>(
  {} as CurrentUserContextType
)

export const AuthProvider: React.FC<Props> = ({ children }) => {
  const [auth, setAuth] = useState<AccessTokensType>({})

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
