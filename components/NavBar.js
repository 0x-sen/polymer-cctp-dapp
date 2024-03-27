import React from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'

import Link from 'next/link'

const NavBar = () => {
    return (
        <div className="navbar p-4 bg-purple-800">
            <div className="navbar-start">
                <a className="btn btn-ghost normal-case text-xl text-white">YYCZ</a>
            </div>
            <div className="navbar-end">
                <ConnectButton />
            </div>
        </div >

    )
}

export default NavBar