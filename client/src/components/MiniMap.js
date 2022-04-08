import "./../styles/MiniMap.scss";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import { de_dust2_map,de_ancient_map,de_mirage_map,de_nuke_map,de_nuke_lower_map,de_vertigo_lower_map,de_vertigo_map,de_overpass_map,de_inferno_map } from "../assets/MiniMapIcons";
import { LogoCT } from '../assets/Icons';
const socket = io("http://localhost:5001");

export function MiniMap() {
  const [map, setMap] = useState(null);
  useEffect(() => {
    socket.on("map", (map) => {
      setMap(map);
    });
  });


  if(map) {

      return(<div>
        <div className="map">
            <img className = "miniMap" src={de_dust2_map}></img>
            </div>
      </div>);
  } else {
    return <div></div>;
  }
}
export default MiniMap;
