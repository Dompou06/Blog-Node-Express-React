import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Footer() {
 let navigate = useNavigate()
 const openInNewTab = (url) => {
  const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
  if (newWindow) newWindow.opener = null
 }
 return (
  <div className="footer d-flex justify-content-between ps-4 pe-2 pt-1 bg-fonce text-light fw-mbold">
   <div
    className="text-decoration-none text-light"
    onClick={() => {
     navigate('/blog/help', { state: 'En construction' })
    }}
   >
    Aide
   </div>
   <div
    className="text-decoration-none text-light"
    onClick={() => {
     navigate('/blog/contact', { state: 'En construction' })
    }}
   >
    Contact
   </div>
   <div
    className="text-decoration-none text-light"
    onClick={() => {
     navigate('/blog/about', { state: 'En construction' })
    }}
   >
    A propos
   </div>
   <div
    className="text-decoration-none text-light"
    onClick={() => {
     navigate('/blog/legalnotice', { state: 'En construction' })
    }}
   >
    Mentions légales
   </div>
   <div>
    <Link
     href="https://dpstudio.fr/"
     className="link text-light"
     onClick={() => openInNewTab('https://dpstudio.fr/')}
    >
     © DPStudio 2023
    </Link>
   </div>
  </div>
 )
}

export default Footer
