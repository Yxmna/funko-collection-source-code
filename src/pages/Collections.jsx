import React, { useState, useEffect } from "react";

import Pop from "../components/Pop";
import Collection from "../components/Collection";

function Collections() {
  const [collections, setCollections] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [list, setList] = useState([]);

  function fetchDb(database, functionVar, offset) {
    let url = "";
    if (offset) {
      url =
        "https://api.airtable.com/v0/appbYlCurPAAJp95Y/" +
        database +
        "?offset=" +
        offset;
    } else {
      url = "https://api.airtable.com/v0/appbYlCurPAAJp95Y/" + database;
    }
    fetch(url, {
      headers: {
        Authorization: "Bearer keylcqMaVYO2fQnQQ",
        "Content-Type": "application/json",
      },
    })
      .then(function (res) {
        return res.json();
      })
      .then(function (obj) {
        functionVar((currentArray) =>
          currentArray.concat(obj.records.map((item) => item.fields))
        );
        if (obj.offset) {
          fetchDb(database, functionVar, obj.offset);
        }
      });
  }

  useEffect(() => {
    fetchDb("Wishlist", setWishlist);
    fetchDb("Collections", setCollections);
    fetchDb("List", setList);
  }, []);

  function uniqueID(pop) {
    if (!pop) return;
    let id =
      convertToUrl(pop.series) +
      convertToUrl(pop.name) +
      convertToUrl(pop?.details) +
      pop?.number;
    if (pop.features && pop.features.length > 0) {
      let features_list = [
        "chase",
        "flocked",
        "special edition",
        "diamond",
        "exclusive",
        "glows in the dark",
        "event",
        "anniversary",
        "specialty series",
        "art series",
        "metallic",
        "supersized",
        "black light glow",
        "with purpose",
        "black and white",
      ];
      features_list.forEach((feature, i) => {
        if (pop.features.includes(feature)) {
          id = id + "-" + feature.split(" ").join("-");
        }
      });
      if (pop.features.includes("exclusive")) {
        id = id + "-" + pop.exclusive?.split(" ").join("-");
      }
      if (pop.features.includes("event")) {
        id = id + "-" + pop.event?.split(" ").join("-");
      }
    }
    return id;
  }

  function convertToUrl(text) {
    if (text) {
      let convertRules = [
        {
          replaceTo: "",
          target: [".", "(", ")", "&", ","],
        },
        {
          replaceTo: "-",
          target: ["'", " "],
        },
        {
          replaceTo: "e",
          target: ["é", "è", "ê", "ë"],
        },
      ];
      let result = text.toLowerCase();
      convertRules.forEach((rule, i) => {
        rule.target.forEach((target, i) => {
          result = result.split(target).join(rule.replaceTo);
        });
      });
      return result + "-";
    } else {
      return "";
    }
  }

  let id_list = list.map((pop) => uniqueID(pop));

  let wishlist_with_status = wishlist;

  wishlist_with_status.map((pop) => {
    if (id_list.includes(uniqueID(pop))) {
      pop["ok"] = true;
    } else {
      pop["ok"] = false;
    }
  });


  return (
    <>
      {" "}
      {collections
        .filter((element) => {
          if (Object.keys(element).length !== 0) return true;
        })
        .map((collection, i) => (
          <Collection
            id_list={id_list}
            collection={collection}
            key={collection.name + "-" + i}
            pops={wishlist_with_status.filter(
              (pop) => pop.collection == collection.name
            )}
          />
        ))}{" "}
    </>
  );
}

export default Collections;
