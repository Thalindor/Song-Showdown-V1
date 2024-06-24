import React, { useRef, useEffect, useState } from 'react';
import './Navbar.css';
import GitHubIcon from '@mui/icons-material/GitHub';
import SearchIcon from '@mui/icons-material/Search';
import Person2Icon from '@mui/icons-material/Person2';

export default function Navbar() {
  const navbarRef = useRef(null); // Navbar referansını oluşturun
  const [navbarHeight, setNavbarHeight] = useState(0); // Navbar yüksekliğini tutan state

  useEffect(() => {
    // Navbar yüksekliğini ölçmek için bir etkileşim başlatın
    if (navbarRef.current) {
      setNavbarHeight(navbarRef.current.offsetHeight);
    }
  }, []);

  return (
    <div ref={navbarRef} className="wwe-header-menu">
      <div className="wwe-header-navigation">
        <ul className="desktop-menu-left">
          <li className="wwePng">
            <img src="/images/wwe.png" alt="" />
          </li>
        </ul>

        <ul className="desktop-menu-center">
          <li className="desktop-menu-desc">
            <h3>Song Showdown is currently in Beta. Best played on 1920x1080 resolution.</h3>
          </li>
        </ul>

        <ul className="desktop-menu-right">
          <li className="gitHubIcon">
            <GitHubIcon className='Icon'/>
            <h3>Github</h3>
          </li>
          <li className="desktop-menu-hr">
            <hr className='hr' />
          </li>
          <li className="desktop-menu-Icons">
            <Person2Icon className='Icon' />
          </li>
          <li className="desktop-menu-Icons">
            <SearchIcon className='Icon'/>
          </li>
        </ul>
      </div>
    </div>
  );
}
