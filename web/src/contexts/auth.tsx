// contexto facilita o compartilhamento de várias informações entre os componentes

import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from "../services/api";

type User = {
  id: string
  name: string
  login: string
  avatar_url: string
}

type AuthContextData = {
  user: User | null
  signInUrl: string
  signOut: () => void // não tem retorno
}

export const AuthContext = createContext({} as AuthContextData)

// o Provider faz com que todos os componentes que estejam dentro dele tenham acesso a informação do contexto
// Propriedade (no React): informação que passa de um componente para outro

type AuthProvider = {
  children: ReactNode
}

// ReactNode: qualquer coisa aceitável pelo React

type AuthResponse = {
  token: string
  user: {
    id: string
    avatar_url: string
    name: string
    login: string
  }
}

export function AuthProvider(props: AuthProvider) {

  const [ user, setUser ] = useState<User | null>(null)

  const signInUrl = `https://github.com/login/oauth/authorize?scope=user&client_id=58a1b2996c2250c1ce4e`

  async function signIn(githubCode: string){
    const response = await api.post<AuthResponse>('authenticate', {
      code: githubCode,
    })

    const { token, user } = response.data;

    localStorage.setItem('@dowhile:token', token)

    api.defaults.headers.common.authorization = `Bearer ${token}`
    
    setUser(user)
  }

  function signOut(){
    setUser(null)
    localStorage.removeItem('@dowhile:token')
  }

  useEffect(() => {
    const token = localStorage.getItem('@dowhile:token')

    if (token) {
      api.defaults.headers.common.authorization = `Bearer ${token}`

      api.get<User>('profile').then(response => {
        setUser(response.data)
      })
    }
  }, [])

  useEffect(() => {
    const url = window.location.href
    const hasGithubCode = url.includes('?code=')
    
    if (hasGithubCode) {
      const [urlWithoutCode, githubCode] = url.split('?code=')
      
      window.history.pushState({}, '', urlWithoutCode)

      signIn(githubCode)
    }
  }, [])
  
  return (
    <AuthContext.Provider value={{ signInUrl, user, signOut }}>
      {props.children}
    </AuthContext.Provider>
  )
}