import React, { useState, useEffect } from "react";
import Pop from "../components/Pop";

function Collection(props) {
  let pops = props.pops;

  pops.sort(function (a, b) {
    return b.value - a.value;
  });

  return (
    <article className="collection">
      <h1>{props.collection.name}</h1>
      <p>{props.collection.description}</p>
      <ul className="pop_achieved">
        {pops
          .filter((pop) => pop.ok)
          .map((pop) => (
            <li
              key={pop.name + "-" + pop.number + "-" + pop.features?.join("-")}
              className={pop.ok ? "" : "wanted"}
            >
              {" "}
              <Pop pop={pop} />{" "}
            </li>
          ))}
      </ul>
      <ul className="pop_missing">
        {pops
          .filter((pop) => !pop.ok)
          .map((pop) => (
            <li
              key={pop.name + "-" + pop.number + "-" + pop.features?.join("-")}
              className={pop.ok ? "" : "wanted"}
            >
              {" "}
              <Pop pop={pop} />{" "}
            </li>
          ))}
      </ul>
    </article>
  );
}

export default Collection;
