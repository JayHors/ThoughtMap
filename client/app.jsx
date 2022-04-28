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

const changePassword = (e) => {
    e.preventDefault();
    helper.hideError();

    
    const oldpass = e.target.querySelector('#oldpass').value;
    const newpass = e.target.querySelector('#newpass').value;
    const newpass2 = e.target.querySelector('#newpass2').value;
    const _csrf = e.target.querySelector('#_csrf').value;

    if (!oldpass || !newpass || !newpass2) {
        helper.handleError('All fields are required!');
        return false;
    }

    helper.sendPost(e.target.action, { oldpass, newpass, newpass2, _csrf });

    return false;
}

const ChangePassForm = (props) => {
    return (
        <form action="/changePassword" id="changePassForm"
            name='changePassForm'
            onSubmit={changePassword}
            method="POST"
            className="changePassForm"
            hidden
        >
            <label htmlFor="oldpass">Current Password: </label>
            <input type="password" name="oldpass" id="oldpass" placeholder="old password" />
            <label htmlFor="newpass">New Password: </label>
            <input type="password" name="newpass" id="newpass" placeholder="new password" />
            <label htmlFor="newpass2">Retype New Password: </label>
            <input type="password" name="newpass2" id="newpass2" placeholder="retype new password" />
            <input type="hidden" name="_csrf" id="_csrf" value={props.csrf} />
            <input type="submit" value="Change Password" className="formSubmit" />
        </form>
    );
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
            <textarea rows="5" cols="60" name="postContent" id="postContent" placeholder="Enter thoughts" ></textarea> <br />
            <label htmlFor="pubBool">Public thought? </label>
            <input type="checkbox" name="pubBool" id="pubBool" /> <br />
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
        const ldAds = async () => { await loadAds(map.current); }
        ldAds().catch(console.log);
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
        if (props.thoughts.length > 0) {
            for (marker of currentMarkers) {
                marker.remove();
            }
            currentMarkers = [];
            if (!map.current) return;
            for (thought of props.thoughts) {
                const marker = new mapboxgl.Marker()
                    .setLngLat([thought.longitude, thought.latitude])
                    .setPopup(new mapboxgl.Popup().setHTML(`<h2>${thought.username}</h2><p>${thought.text}</p><h6>${thought.pubBool ? 'Public Thought' : 'Private Thought'}</h6>`))
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

const loadAds = async (map) => {
    const response = await fetch('/getAds');
    const adThoughts = await response.json();

    for (thought of adThoughts.thoughts) {
        const marker = new mapboxgl.Marker({ color: '#236723' })
            .setLngLat([thought.longitude, thought.latitude])
            .setPopup(new mapboxgl.Popup().setHTML(`<h2>Ad</h2><p>${thought.text}</p><h6>Ad</h6>`))
            .addTo(map);
    }
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
    const changePass = document.querySelector('#changepass');
    changePass.addEventListener('click', (e) => {
        e.preventDefault();
        const form = document.querySelector('#changePassForm');
        form.hidden = !form.hidden;
    });

    renderApp(data.csrfToken, []);
    loadPoints('/getOwnerThoughts');
}

const renderApp = (csrfToken, thoughts) => {
    ReactDOM.render(
        <div>
            <ThoughtForm csrf={csrfToken} />
            <ThoughtMap csrf={csrfToken} thoughts={thoughts} />
        </div>,
        document.getElementById('content'));
}
window.onload = init;


