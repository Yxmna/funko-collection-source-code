import { NavLink } from "react-router-dom";

function Header(props) {
  return (
    <header>
      <h1>Funko Collection</h1>

      <ul>
        <li>
          <NavLink
            to="funko-collection/collections"
            className={({isActive}) => (isActive ? "selected" : "")}
          >
            Collections
          </NavLink>
        </li>
        <li>
          <NavLink
            to="funko-collection/graphique"
            className={({isActive}) => (isActive ? "selected" : "")}
          >
            Graphiques
          </NavLink>
        </li>
        <li>
          <NavLink
            to="funko-collection/tout"
            className={({isActive}) => (isActive ? "selected" : "")}
          >
            Toutes nos pops
          </NavLink>
        </li>
        <li>
          <a href="https://yxmna.github.io/funko-stickers">
            Liste des stickers
          </a>
        </li>
      </ul>
    </header>
  );
}

export default Header;
