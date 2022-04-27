const helper = require('./helper.js');
const mapboxgl = require('mapbox-gl');

const { useEffect, useRef, useState } = React;

let pubLng, pubLat; //allows communication between ThoughtForm and ThoughtMap

let currentPointData = [], currentMarkers = []; //current points loaded in Thought format and mapbox-gl markers, respectively

mapboxgl.accessToken = 'pk.eyJ1IjoiamF5aG9ycyIsImEiOiJjbDJjN3JnOWgwbHgzM2lvMmh2ajAweTl0In0.JiFUK6k1FE5FPQfexqrfKg';

const handleThought = async (e) => {
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

    await helper.sendPost('/postThought', { lat, lng, pubBool, postContent, _csrf }, loadNewPoint);
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
            <textarea rows="5" cols="60" name="postContent" id="postContent" placeholder="Enter thoughts"></textarea>
            <label htmlFor="pubBool">Public thought?</label>
            <input type="checkbox" name="pubBool" id="pubBool" />
            <input type="hidden" name="_csrf" id="_csrf" value={props.csrf} />
            <input type="submit" value="Submit" className="thoughtSubmit" />
        </form>
    );
}

const ThoughtMap = (props) => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(-75);
    pubLng = lng;
    const [lat, setLat] = useState(45);
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


    useEffect(() => {
        console.log('map update effect fired');
        if (props.thoughts.length > 0) {
            for (marker of currentMarkers) {
                marker.remove();
            }
            currentMarkers = [];
            if (!map.current) return;
            for (thought of props.thoughts) {
                const marker = new mapboxgl.Marker()
                    .setLngLat([thought.longitude, thought.latitude])
                    .setPopup(new mapboxgl.Popup().setHTML(`<h2>${thought.username}</h2><p>${thought.text}</p><h6>${thought.pubBool ? 'Public Thought':'Private Thought'}</h6>`))
                    .addTo(map.current);
                currentMarkers.push(marker);
            }
        }
    }, [props]);

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

const loadPoints = async (path) => {
    const response = await fetch(path);
    const data = await response.json();
    currentPointData = data.thoughts;
    renderApp(data.csrfToken, currentPointData);
}

const loadNewPoint = async (result) => {
    currentPointData.push(result);
    renderApp(result.csrfToken, currentPointData);
}

const init = async () => {
    const response = await fetch('/getToken');
    const data = await response.json();

    const pubClick = document.querySelector('#public');
    pubClick.addEventListener('click', (e) => {
        e.preventDefault();
        loadPoints('/publicThoughts');
    });
    const privClick = document.querySelector('#private');
    privClick.addEventListener('click', (e) => {
        e.preventDefault();
        loadPoints('/getOwnerThoughts');
    });

    renderApp(data.csrfToken, []);
    loadPoints('/getOwnerThoughts');
}

const renderApp = (csrfToken, thoughts) => {
    console.log('renderApp fired');
    ReactDOM.render(
        <div>
            <ThoughtForm csrf={csrfToken} />
            <ThoughtMap csrf={csrfToken} thoughts={thoughts} />
        </div>,
        document.getElementById('content'));
}
window.onload = init;


