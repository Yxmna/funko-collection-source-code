// import React, { useState, useEffect } from "react";

import Pop from "../components/Pop";

function PopsPage(props) {

  return(

    <div className="pops">
    {
      props.data.filter(item => item.series && item.name).map(pop => (
        <Pop key={pop.name+"-"+pop.number+"-"+pop.features?.join("-")} pop={pop} ok={true} />
      ))
    }

    </div>

  )

}

export default PopsPage;
