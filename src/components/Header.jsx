import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

function Header(props) {

  const path = useLocation().pathname;

  return(

    <header>
      <h1>Funko Collection</h1>

      <ul>
        <li><Link to="funko-collection/collection" className={path=="/collection"?"selected":""} >Collection</Link></li>
        <li><Link to="funko-collection/graphique" className={path=="/graphique"?"selected":""} >Graphique</Link></li>
        <li><Link to="funko-collection/tout" className={path=="/tout"?"selected":""} >Toutes nos pops</Link></li>
        <li><a href="https://yxmna.github.io/funko-stickers" >Guide des stickers</a></li>
      </ul>
    </header>

  )

}

export default Header;
