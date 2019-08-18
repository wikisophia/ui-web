import React from 'react';
import Link from 'next/link';

export default () => (
  <nav className="menu">
    <ul className="nav-links">
      <li className="nav-link home"><Link href="/"><a>Wikisophia</a></Link></li>
      <li className="nav-link about"><Link href="/about"><a>About</a></Link></li>
    </ul>

    <style jsx="true">
      {`
      nav {
        width: 100%;
      }

      .nav-links {
        display: flex;
        justify-content: flex-end;
        list-style: none;
        margin: 0;
        padding: 0;
      }

      .nav-link {
        text-decoration: none;
        align-items: center;
      }

      .nav-link a {
        padding: 0 0.75rem;
      }

      .nav-link.about {
        background-color: #4056f4;
        border-radius: 0.25rem;
      }

      .nav-link.about a {
        color: #fff;
      }

      .nav-link a:hover {
        text-decoration: none;
      }

      .nav-link.home {
        margin-right: auto;
      }

      .nav-link.home a {
        color: #000;
      }
    `}
    </style>
  </nav>
);
