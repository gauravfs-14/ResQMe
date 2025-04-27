// components/Chatbot.tsx
'use client'

import { useState } from 'react'
import ChatboxShow from './chatboxShow'
// import Image from 'next/image'

export default function Chatbot() {
  const [showChatbox, setShowChatbox] = useState(false)

  const toggleChatbox = () => {
    setShowChatbox(!showChatbox)
  }

  return (
    <>
      {showChatbox ? (
        <ChatboxShow isOpen={showChatbox} onClose={toggleChatbox} onClick={toggleChatbox} />
      ) : (
        <div
          className="fixed bottom-16 right-4 md:right-16 lg:right-12 z-50 cursor-pointer flex items-center justify-center w-15 h-15 bg-red-500 rounded-full shadow-lg hover:bg-red-600 transition-colors"
          onClick={toggleChatbox}
        >
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </div>
      )}
    </>
  )
}