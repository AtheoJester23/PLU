import { useSelector } from 'react-redux'
import styles from './Profile.module.css'
import type { RootState } from '../../state/store'
import { useState } from 'react';

const Profile = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [edit, setEdit] = useState(false)

  return (
    <main className={styles.mainCont}>
      <form action="" className={styles.formCont}>
        <h1 className='p-0 m-0 text-nav'>Profile</h1>

        <ul>
            <li><strong>Store Name:</strong> {!edit ? user.storeName : <input type='text' className='border border-gray-200 px-5 py-3 rounded' defaultValue={`${user.storeName}`}></input>}</li>
            {!edit &&
              <li><strong>Theme:</strong> {user.storeName}</li>
            }
        </ul>

        <div className='flex gap-1 justify-end'>
          {!edit ? (
            <>
              <button type='button' className='-translate-y-0.25 hover:translate-none duration-200 cursor-pointer active:cursor-default rounded bg-red-500 text-white px-5 py-2'>Delete Account</button>
              <button type="button" onClick={() => setEdit(true)} className='hover:cursor-pointer active:cursor-default -translate-y-0.25 hover:translate-none active:-translate-y-0.25 duration-200 rounded bg-orange-500 text-white px-5 py-2'>Edit</button>
            </>
          ):(
            <>
              <button onClick={() => setEdit(false)} type="button" className='hover:cursor-pointer active:cursor-default -translate-y-0.25 hover:translate-none active:-translate-y-0.25 duration-200 rounded bg-red-500 text-white px-5 py-2'>Cancel</button>
              <button type="button" className='hover:cursor-pointer active:cursor-default -translate-y-0.25 hover:translate-none active:-translate-y-0.25 rounded bg-blue-500 text-white px-5 py-2 duration-200'>Save</button>
            </>
          )}
        </div>
      </form>
    </main>
  )
}

export default Profile
