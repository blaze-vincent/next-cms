import { useEffect, useState } from 'react'
import styles from './loginForm.module.css'

export default function LoginForm({ setToken }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [attemptFailed, setAttemptFailed] = useState(false);
  useEffect(_ => {
    if(document.cookie){
  
      fetch('/api/auth', {
        method: 'POST'
      }).then(async res => {
        console.log(res)
        const json = await res.json();
        if(json.token){
          setToken(json.token)
        }
      })
    }
  }, [])

  const submit = e => {
    e.preventDefault()

    const body = new FormData();
    body.append('password', password);
    body.append('username', username);

    fetch('/api/auth', {
      method: 'POST',
      body,
    }).then(async response => {
      const authorization = await response.json()
      if (authorization.token) {
        document.cookie = `auth=${authorization.token}; expires=${new Date(new Date().getTime() + 30 * 60000)}; SameSite=Strict`
        setToken(authorization.token)
      } else {
        setAttemptFailed(true);
      }
    })
  }

  useEffect(_ => {
    const effect = setTimeout(_ => {
      if (attemptFailed) { setAttemptFailed(false) }
    }, 500)
    return _ => {
      clearTimeout(effect)
    }
  }, [attemptFailed])

  return (<div className={styles.container}>
    <p>You must log in to view this content.</p>
    <form onSubmit={submit}>
      <label>username: </label>
      <input className={styles.input} type="text" value={username} onChange={e => setUsername(e.target.value)} />
      <label>password: </label>
      <input className={styles.input} type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <input className={`${styles.input} ${styles.submit} ${attemptFailed && styles.attemptFailed}`} type="submit" value="login" />
    </form>
  </div>)
}