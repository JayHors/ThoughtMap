const helper = require('./helper.js');
const mapboxgl = require('mapbox-gl');
const { useEffect, useRef, useState } = React;

let pubLng, pubLat;


mapboxgl.accessToken = 'pk.eyJ1IjoiamF5aG9ycyIsImEiOiJjbDJjN3JnOWgwbHgzM2lvMmh2ajAweTl0In0.JiFUK6k1FE5FPQfexqrfKg';

const handleThought = (e) => {
    e.preventDefault();

    const lat = pubLat;
    const lng = pubLng;
    const postContent = e.target.querySelector('#postContent').value;
    const pubBool = e.target.querySelector('#pubBool').checked ? true : false;
    const _csrf = e.target.querySelector('#_csrf').value;
    if (!postContent) {
        helper.handleError('No thoughts?');
        return false;
    };

    helper.sendPost('/postThought', { lat, lng, pubBool, postContent, _csrf }, loadPoint('/getOwnerThoughts'));
    return false;
}

const ThoughtForm = (props) => {

    return (
        <form
            action="/newThought"
            id="thoughtForm"
            className="thoughtForm"
            name="thoughtForm"
            method="POST"
            onSubmit={handleThought}
        >
            <textarea rows="5" cols="60" name="postContent" id="postContent" placeholder="Enter text"></textarea>
            <label htmlFor="pubBool">Public thought?</label>
            <input type="checkbox" name="pubBool" id="pubBool" />
            <input type="hidden" name="_csrf" id="_csrf" value={props.csrf} />
            <input type="submit" value="Submit" className="thoughtSubmit"/>
        </form>
    );
}

const ThoughtMap = (props) => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(-70.9);
    pubLng = lng;
    const [lat, setLat] = useState(42.35);
    pubLat = lat;
    const [zoom, setZoom] = useState(9);

    useEffect(() => {
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [lng, lat],
            zoom: zoom
        });
    });

    useEffect(() => {
        if (!map.current) return; // wait for map to initialize
        map.current.on('move', () => {
            setLng(map.current.getCenter().lng.toFixed(4));
            setLat(map.current.getCenter().lat.toFixed(4));
            setZoom(map.current.getZoom().toFixed(2));
            pubLat = lat;
            pubLng = lng;
        });
    });
    if(props.thoughts.length > 0){
        for(thought of props.thoughts){
            const marker = new mapboxgl.Marker()
            .setLngLat([thought.longitude, thought.latitude])
            .addTo(map);
        }
    }
    return (
        <div className="map-stuff">
            <div className="sidebar">
                Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
            </div>
            <div className="crosshair">+</div>
            <div ref={mapContainer} className="map-container" />
        </div>
    );
}

const loadPoint = async (path) => {
    const response = await fetch(path);
    const data = await response.json();
    ReactDOM.render(
        <div>
            <ThoughtForm csrf={data.csrfToken} />
            <ThoughtMap csrf={data.csrfToken} thoughts={data.thoughts}/>
        </div>,
        document.getElementById('content'));
}

const init = async () => {
    const response = await fetch('/getToken');
    const data = await response.json();

    await ReactDOM.render(
        <div>
            <ThoughtForm csrf={data.csrfToken} />
            <ThoughtMap csrf={data.csrfToken} thoughts={[]}/>
        </div>,
        document.getElementById('content'));
    loadPoint('/getOwnerThoughts');
}

window.onload = init;