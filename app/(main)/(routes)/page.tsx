import { UserButton } from '@clerk/nextjs'
import React from 'react'

const Home = () => {
  return (
    <section>
        <UserButton afterSignOutUrl='/'/>
    </section>
  )
}

export default Home
