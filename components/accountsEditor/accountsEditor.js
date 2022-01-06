import styles from './accountsEditor.module.css'
import {useState, useEffect} from 'react'

export default function AccountsEditor({token}){

  const [accounts, setAccounts] = useState({error: 'Attempting authorization.'})
  const [newAccountName, setNewAccountName] = useState('')

  useEffect(_ => {
    fetch('/api/account', {
      headers: new Headers({
        'authorization': token
      })
    }).then(async res => {
      const json = await res.json();
      setAccounts(json)
    })
  }, [token])
  return (<div className={styles.container}>
    {!accounts.error
    ? <>{accounts.accounts.map((acct, index) => {
      return (<div key={index} className={styles.row}>
        <p className={styles.p}>{acct.username}{acct.isSuperAdmin && ' (super admin)'}</p>
        {!acct.isSuperAdmin && <button 
          className={styles.delete}
          onClick={_ => {
            const body = new FormData()
            body.append('id', acct._id)
            fetch('/api/account', {
              method: 'DELETE',
              headers: new Headers({
                'authorization': token
              }),
              body
            }).then(async res => {
              if(res.ok){
                const json = await res.json()
                if(!json.error){
                  setAccounts({accounts: accounts.accounts.filter(account => account._id !== json._id)})
                }
              }
            })
          }}
        >
          delete
        </button>}
      </div>)
    })}
    <div className={styles.row}>
      <input 
        className={styles.input} 
        placeholder='account name'
        value={newAccountName}
        onChange={e => {setNewAccountName(e.target.value)}}
      />
      <button
        onClick={e => {
          if(newAccountName){
            const body = new FormData()
            body.append('username', newAccountName)
            fetch('/api/account', {
              method: 'POST',
              headers: new Headers({
                'authorization': token
              }),
              body
            }).then(async res => {
              if(res.ok){
                const json = await res.json()
                setAccounts({accounts: accounts.accounts.concat(json)})
              }
            })
          }
        }}
      >
        create new account
      </button>
    </div>
    </>
    : <p
      className={styles.p}
    >Unauthorized. {accounts.error}</p>
    }
  </div>)
}