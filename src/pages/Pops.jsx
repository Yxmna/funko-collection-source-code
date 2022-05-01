import React, { useState, useEffect } from "react";

import Pop from "../components/Pop";

function Pops() {


  const [data, setData] = useState([])

  useEffect(() => {
    fetch("https://api.airtable.com/v0/appbYlCurPAAJp95Y/List", {
      headers: {
        "Authorization": "Bearer keylcqMaVYO2fQnQQ",
        "Content-Type": "application/json",
      }
    })
    .then(function(res) {
      return res.json();
    })
    .then(function(obj) {
      let temp = obj.records;
      temp = temp.map(item => item.fields);
      setData(temp);
    });
  }, [])

  return(

    <div className="pops">
    {
      data.filter(item => item.series && item.name).map(pop => (
        <Pop key={pop.name+"-"+pop.number+"-"+pop.features?.join("-")} pop={pop} />
      ))
    }

    </div>

  )

}

export default Pops;
