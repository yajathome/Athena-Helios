import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from './leaflet-routing'
import type { LatLngExpression } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-routing-machine'
import './App.css'
import binImage from '../public/Dustbin.png'


// Bin phone 
const icon = L.icon({
  iconUrl: binImage,
  iconSize: [35, 35],
  iconAnchor: [17, 34],
  popupAnchor: [0, -30]
})

//defining values for location
interface Point {
  id: number
  lat: number
  lng: number
}


// calculates nearest dustbin form the user
function NearestPath({
  user,
  list,
  update
}: {
  user: LatLngExpression
  list: Point[]
  update: (p: Point) => void
}) {
  const map = useMap()

  useEffect(() => {
    let near = list[0]
    let dist = map.distance(user, [near.lat, near.lng])
    for (let i = 1; i < list.length; i++) {
      const curr = map.distance(user, [list[i].lat, list[i].lng])
      if (curr < dist) {
        near = list[i]
        dist = curr
      }
    }

    update(near)

//  for nearest path
    const control = L.Routing.control({
      waypoints: [L.latLng(user), L.latLng(near.lat, near.lng)],
      routeWhileDragging: false,
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      show: false,
      createMarker: () => null
    }).addTo(map)

    return () => {
      map.removeControl(control)
    }
  }, [map, user, list, update])

  return null
}


// predefined values of dustbin
const App: React.FC = () => {
  const [loc, setLoc] = useState<LatLngExpression | null>(null)
  const [screen, setScreen] = useState<'home' | 'map'>('home')
  const [err, setErr] = useState(false)
  const [closest, setClosest] = useState<Point | null>(null)

  const [data, setData] = useState<Point[]>([
    { id: 1, lat: 12.9716, lng: 77.5946 },
    { id: 2, lat: 12.9721, lng: 77.5932 },
    { id: 3, lat: 12.975, lng: 77.599 },
    { id: 4, lat: 12.993723, lng: 77.717016 },
    { id: 5, lat: 12.993756, lng: 77.748927 },
    { id: 6, lat: 12.993789, lng: 77.830838 },
    { id: 7, lat: 12.933822, lng: 77.932749 },
    { id: 8, lat: 12.643855, lng: 77.94346 },
    { id: 9, lat: 12.2493888, lng: 77.876571 },
    { id: 10, lat: 12.3493921, lng: 77.908482 },
    { id: 11, lat: 13.4493954, lng: 77.940393 },
    { id: 12, lat: 12.5493987, lng: 77.972304 },
    { id: 13, lat: 12.649402, lng: 76.004215 },
    { id: 14, lat: 12.7494053, lng: 76.036126 },
    { id: 15, lat: 12.8494086, lng: 78.468037 },
    { id: 16, lat: 12.793723, lng: 77.717016 },
    { id: 17, lat: 12.783723, lng: 77.087016 },
    { id: 18, lat: 12.983756, lng: 77.758927 },
    { id: 19, lat: 12.9816, lng: 77.6946 },
    { id: 20, lat: 12.9621, lng: 77.4932 }
  ])
// gets the location of the user
  const [lat, setLat] = useState('')
  const [lng, setLng] = useState('')

  const findBins = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLoc([pos.coords.latitude, pos.coords.longitude])
        setScreen('map')
        setErr(false)
      },
      () => setErr(true)
    )
  }



  const back = () => {
    setScreen('home')
    setLoc(null)
    setClosest(null)
    setErr(false)
  }
  
// function to add a new dustbin
  const addPoint = (e: React.FormEvent) => {
    e.preventDefault()
    const parsedLat = parseFloat(lat)
    const parsedLng = parseFloat(lng)
    if (!isFinite(parsedLat) || !isFinite(parsedLng)) {
      alert('Invalid input')
      return
    }
    setData([...data, { id: data.length + 1, lat: parsedLat, lng: parsedLng }])
    setLat('')
    setLng('')
  }

// html, css
  return (
    <div className="app-container">
      {screen === 'home' ? (
        <div className="home-container">
          <div className="overlay-content">
            <h1 className="heading">Dustbin Locator</h1>
            <p className="subtext">Tap below to get started</p>
            <button className="find-button" onClick={findBins}>
              Show Nearest Bin
            </button>
            {err && <div className="error-text">Turn on location and try again</div>}
          </div>
        </div>
      ) : (
        loc && (
          // gets map and location
          <> 
            <MapContainer center={loc} zoom={15} scrollWheelZoom className="map">
              <TileLayer
                attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              />

              <Marker position={loc}>
                <Popup>Your Location</Popup>
              </Marker>
{/* shows bin location */}
              {data.map((p) => (
                <Marker key={p.id} position={[p.lat, p.lng]} icon={icon}>
                  <Popup>Bin #{p.id}</Popup>
                </Marker>
              ))}
{/* shows nearest path */}
              <NearestPath user={loc} list={data} update={setClosest} />
            </MapContainer>

            <div className="top-right-buttons">
              <button className="back-button" onClick={back}>
                Go toHome
              </button>
              {closest && (
                // opens maps for location
                <button
                  className="back-button"
                  onClick={() =>
                    window.open(`https://www.google.com/maps?q=${closest.lat},${closest.lng}`, '_blank')
                  }
                >
                  Get Directions To the Bin
                </button>
              )}
            </div>
{/* inputs location for dustbin */}
            <form className="add-bin-form" onSubmit={addPoint}>
              <h4>Add Location</h4>
              <input
                type="text"
                placeholder="Latitude"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                className="input-field"
              />
              <input
                type="text"
                placeholder="Longitude"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                className="input-field"
              />
              <button type="submit" className="submit-button">
                Add
              </button>
            </form>
          </>
        )
      )}
    </div>
  )
}



export default App

