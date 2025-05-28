import React from 'react'
import LOGO from '../assets/react.svg'
function Header() {
  return (
    <header className='flex justify-between items-center h-20 '>
        <img src = {LOGO} className='w-8 h-8'></img>
        <nav className='flex items-center'>
            <a href='#'>登录</a>
            <a href='#' className='ml-8 bg-gray-800 px-4 py-2 rounded text-blue-400'>
                注册
                </a>
        </nav>
    </header>
  )
}

export default Header