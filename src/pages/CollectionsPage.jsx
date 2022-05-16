import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import Collection from "../components/Collection";

function CollectionsPage(props) {

  if (props.collections?.length>1) {
    return (
      <>
        {props.collections
          .filter((element) => {
            if (Object.keys(element).length !== 0) return true;
          })
          .map((collection, i) => (
            <Collection
              collection={collection}
              key={collection.name + "-" + i}
              pops={props.data.filter(
                (pop) => pop.collection == collection.name
              )}
            />
          ))}
      </>
    );
  }
}

export default CollectionsPage;
