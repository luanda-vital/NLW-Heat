import { useContext } from 'react';
import styles from './App.module.scss';
import { LoginBox } from './components/LoginBox';
import { MessageList } from './components/MessageList';
import { SendMessageForm } from './components/SendMessageForm';
import { AuthContext } from './contexts/auth';

export function App() {
  const { user } = useContext(AuthContext);

  // se meu usuario não estiver nulo, mostra o SendMessageForm, se for nulo, mostra o LoginBox
  // !!user = Boolean(user)

  return (
    <main className={ `${styles.contentWrapper} ${!!user ? styles.contentSigned : ''}` }>
      <MessageList />
      { !!user ? <SendMessageForm /> : <LoginBox /> }
    </main>
  )
}
