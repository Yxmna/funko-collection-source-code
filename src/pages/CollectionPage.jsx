import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

import Pop from "../components/Pop";

function CollectionPage(props) {

  const convertToUrlPls = window.$convertToUrlPls;
  const params = useParams();

  let selected_collection = props.collections.filter(
    (collection) => convertToUrlPls(collection.name) == params.collection_id
  );
  selected_collection = selected_collection[0];

  return (
    <div className="collection_page">
      <div className={"back"}>
        <Link to={"/funko-collection/collections/"}>🠜 Retour</Link>
      </div>
      <h1>{selected_collection?.name}</h1>
      <p>{selected_collection?.description}</p>
      <h2>Pops acquise</h2>
      <div className="selected_collection">
        <ul>
          {props.data
            .filter(
              (pop) => pop.collection == selected_collection?.name && pop.ok
            )
            .sort((pop1, pop2) => pop2.estimated - pop1.estimated)
            .map((pop, i) => (
              <li key={pop.name + "-" + i}>
                <Pop pop={pop} />
              </li>
            ))}
          <li>
            <div className="ghost_pop"></div>
          </li>
          <li>
            <div className="ghost_pop"></div>
          </li>
          <li>
            <div className="ghost_pop"></div>
          </li>
          <li>
            <div className="ghost_pop"></div>
          </li>
          <li>
            <div className="ghost_pop"></div>
          </li>
          <li>
            <div className="ghost_pop"></div>
          </li>
          <li>
            <div className="ghost_pop"></div>
          </li>
          <li>
            <div className="ghost_pop"></div>
          </li>
          <li>
            <div className="ghost_pop"></div>
          </li>
        </ul>
      </div>

      <h2>Pops non acquise</h2>
      <div className="selected_collection">
        <ul>
          {props.data
            .filter(
              (pop) => pop.collection == selected_collection?.name && !pop.ok
            )
            .sort((pop1, pop2) => pop2.estimated - pop1.estimated)
            .map((pop, i) => (
              <li key={pop.name + "-" + i}>
                <Pop pop={pop} />
              </li>
            ))}
          <li>
            <div className="ghost_pop"></div>
          </li>
          <li>
            <div className="ghost_pop"></div>
          </li>
          <li>
            <div className="ghost_pop"></div>
          </li>
          <li>
            <div className="ghost_pop"></div>
          </li>
          <li>
            <div className="ghost_pop"></div>
          </li>
          <li>
            <div className="ghost_pop"></div>
          </li>
          <li>
            <div className="ghost_pop"></div>
          </li>
          <li>
            <div className="ghost_pop"></div>
          </li>
          <li>
            <div className="ghost_pop"></div>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default CollectionPage;
