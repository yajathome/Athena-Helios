import L from 'leaflet';
import 'leaflet-routing-machine';


declare module 'leaflet' {
  namespace Routing {
    function control(options: any): any;
  }
}


export default L;
