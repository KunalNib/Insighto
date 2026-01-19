import { useState } from 'react'
import './App.css'
import RAGNotebook from './RAGNotebook'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';

function App() {
  return (
    <>
    <SignedOut>
        <SignInButton />
      </SignedOut>
    <SignedIn>
      <RAGNotebook/>
    </SignedIn>
    </>
  )
}

export default App
