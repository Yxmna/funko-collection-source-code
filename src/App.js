import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useState, useEffect } from "react";

import CollectionsPage from "./pages/CollectionsPage";
import CollectionPage from "./pages/CollectionPage";
import Graphique from "./pages/Graphique";
import PopPage from "./pages/PopPage";
import PopsPage from "./pages/PopsPage";

import Header from "./components/Header";

function App(props) {
  const [wishlist, setWishlist] = useState([]);
  const [list, setList] = useState([]);
  const [collections, setCollections] = useState([]);
  const [rate, setRate] = useState(1);
  const [estimatedprices, setEstimatedprices] = useState([]);

  console.log("----------------------------");

  useEffect(() => {
    const wishlist_saved = JSON.parse(localStorage.getItem("wishlist"));
    if (wishlist_saved && wishlist_saved.length > 1) {
      console.log("wishlist finded");
      setWishlist(wishlist_saved);
    } else {
      console.log("wishlist download ...");
      fetchDb("wishlist", setWishlist);
    }

    const list_saved = JSON.parse(localStorage.getItem("list"));
    if (list_saved && list_saved.length > 1) {
      console.log("list finded");
      setList(list_saved);
    } else {
      console.log("list download ...");
      fetchDb("list", setList);
    }

    const collections_saved = JSON.parse(localStorage.getItem("collections"));
    if (collections_saved && collections_saved.length > 1) {
      console.log("collections finded");
      setCollections(collections_saved);
    } else {
      console.log("collections download ...");
      fetchDb("collections", setCollections);
    }

    const rate_saved = JSON.parse(localStorage.getItem("rate"));
    if (rate_saved) {
      console.log("rate finded");
      setRate(rate_saved);
    } else {
      console.log("rate download ...");
      let url =
        "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/eur.json";
      fetch(url)
        .then(function (res) {
          return res.json();
        })
        .then(function (obj) {
          setRate(obj.eur.usd);
        });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem("list", JSON.stringify(list));
  }, [list]);

  useEffect(() => {
    localStorage.setItem("collections", JSON.stringify(collections));
  }, [collections]);

  useEffect(() => {
    localStorage.setItem("rate", JSON.stringify(rate));
  }, [rate]);

  useEffect(() => {
    const estimatedprices_saved = JSON.parse(
      localStorage.getItem("estimatedprices")
    );
    if (estimatedprices_saved && estimatedprices_saved.length > 1) {
      console.log("estimatedprices finded");
      setEstimatedprices(estimatedprices_saved);
    } else if (wishlist.length>1) {
      console.log("estimatedprices download ...");
      wishlist
        // .filter((pop) => pop.collection == "Hunter x Hunter")
        .map((pop, i) => {
          let url =
            "https://www.hobbydb.com/api/historical_ci_values?catalog_item_id=" +
            pop.hdbid;
          fetch(url)
            .then(function (res) {
              return res.json();
            })
            .then(function (obj) {
              let temp = obj.data
                .filter((pop) => pop.attributes.dateEnd)
                .sort((pop1, pop2) => {
                  let date1 = new Date(pop1.attributes.dateEnd).valueOf();
                  let date2 = new Date(pop2.attributes.dateEnd).valueOf();
                  return date2 - date1;
                });
              let max = 0;
              if (temp.length >= 4) {
                max = 4;
              } else {
                max = temp.length;
              }
              let some = 0;
              for (var i = 0; i < max; i++) {
                some = Math.floor(some) + Math.floor(temp[i].attributes.value);
              }
              let value = Math.floor(some / max);
              setEstimatedprices((currentArray) =>
                currentArray.concat({ hdbid: pop.hdbid, value: value })
              );
            });
        });
    }
  }, [wishlist]);

  useEffect(() => {
    if (estimatedprices.length>1) {
      localStorage.setItem("estimatedprices", JSON.stringify(estimatedprices));
    }
  }, [estimatedprices]);

  window.$rate = rate;

  const convertToUrlPls = (text) => {
    if (!text) {
      return null;
    }
    let convertRules = [
      {
        replaceTo: "",
        target: [".", "(", ")"],
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
    return result;
  };
  window.$convertToUrlPls = convertToUrlPls;

  const convertPopToIdPls = (pop, without_series) => {
    if (!pop) {
      return null;
    }
    let convertToUrl = window.$convertToUrl;
    let pop_details = "";
    let pop_feature = "";
    if (pop.features) {
      pop.features
        .sort(function (a, b) {
          return a.localeCompare(b);
        })
        .forEach((feature, i) => {
          let features_ban = [
            "exclusive",
            "event",
            "special edition",
            "specialty series",
          ];
          if (!features_ban.includes(feature)) {
            pop_feature = pop_feature + "-" + convertToUrlPls(feature);
          }
        });
    }
    if (pop.details) {
      pop_details = convertToUrlPls(pop.details) + "-";
    }
    let number = pop.number;
    let series = "";
    if (!without_series) {
      series = convertToUrlPls(pop.series) + "-";
    }
    let name = convertToUrlPls(pop.name);
    return name + "-" + pop_details + series + number + pop_feature;
  };
  window.$convertPopToIdPls = convertPopToIdPls;

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
        Authorization: "Bearer keyTVjOQohMBgQBwK",
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

  let better_wishlist = wishlist;
  better_wishlist?.map((pop) => {
    let finded_pop = list.find((fpop) => {
      return convertPopToIdPls(fpop) == convertPopToIdPls(pop);
    });
    let finded_price = estimatedprices.find((price) => {
      return pop.hdbid == price.hdbid
    })
    if (finded_pop) {
      pop["ok"] = true;
      pop["info"] = finded_pop;
    } else {
      pop["ok"] = false;
    }
    if (finded_price) pop["estimated"] = finded_price.value
  });

  function updateData() {
    localStorage.clear();
    window.location.reload(false);
  }

  return (
    <BrowserRouter>
      <Header />
      <main>
        <Routes>
          <Route path="funko-collection/" element={<CollectionsPage />} />
          <Route
            path="funko-collection/collections"
            element={
              <CollectionsPage
                data={better_wishlist}
                collections={collections}
              />
            }
          />
          <Route
            path="funko-collection/collections/:collection_id"
            element={
              <CollectionPage
                data={better_wishlist}
                collections={collections}
              />
            }
          />
          <Route
            path="funko-collection/collections/:collection_id/:pop_id"
            element={
              <PopPage data={better_wishlist} collections={collections} />
            }
          />
          <Route
            path="funko-collection/tout"
            element={<PopsPage data={list} />}
          />
          <Route
            path="funko-collection/graphique"
            element={<Graphique data={list} better_data={better_wishlist} estimated={estimatedprices} />}
          />

          <Route
            path="funko-collection/options"
            element={
              <button onClick={updateData}>Mettre à jour les données</button>
            } />

        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
