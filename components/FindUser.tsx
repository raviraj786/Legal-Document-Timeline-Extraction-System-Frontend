import { useAuthStore } from '@/store/authStore.'
import React from 'react'

function FindUser() {

    const user = useAuthStore(state => state.user)

    console.log(user?.email)



  return (
    <div>FindUser
        <h1>{user?.email}</h1>
    </div>
    
  )
}

export default FindUser