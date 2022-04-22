const helper = require('./helper.js');

const handleLogin = (e) => {
    e.preventDefault();
    helper.hideError();

    const username = e.target.querySelector('#user').value;
    const pass = e.target.querySelector('#pass').value;
    const _csrf = e.target.querySelector('#_csrf').value;

    if (!username || !pass) {
        helper.handleError('Username or password is empty!');
        return false;
    }

    helper.sendPost(e.target.action, { username, pass, _csrf });

    return false;
}

const handleSignup = (e) => {
    e.preventDefault();
    helper.hideError();

    const username = e.target.querySelector('#user').value;
    const pass = e.target.querySelector('#pass').value;
    const pass2 = e.target.querySelector('#pass2').value;
    const _csrf = e.target.querySelector('#_csrf').value;

    if (!username || !pass || !pass2) {
        helper.handleError('Username or password is empty!');
        return false;
    }

    if (pass !== pass2) {
        helper.handleError('Passwords do not match!');
        return false;
    }

    helper.sendPost(e.target.action, { username, pass, pass2, _csrf });

    return false;
}

const LoginWindow = (props) => {
    return (
        <form action="/login" id="loginForm"
            name='loginForm'
            onSubmit={handleLogin}
            method="POST"
            className="mainForm"
        >
            <label htmlFor="username">Username: </label>
            <input type="text" name="username" id="user" placeholder="username" />
            <label htmlFor="pass">Password: </label>
            <input type="password" name="pass" id="pass" placeholder="password" />
            <input type="hidden" name="_csrf" id="_csrf" value={props.csrf} />
            <input type="submit" value="Sign In" className="formSubmit" />
        </form>
    );
}

const SignupWindow = (props) => {
    return (
        <form action="/signup" id="signupForm"
            name='signupForm'
            onSubmit={handleSignup}
            method="POST"
            className="mainForm"
        >
            <label htmlFor="username">Username: </label>
            <input type="text" name="username" id="user" placeholder="username" />
            <label htmlFor="pass">Password: </label>
            <input type="password" name="pass" id="pass" placeholder="password" />
            <label htmlFor="pass2">Retype Password: </label>
            <input type="password" name="pass2" id="pass2" placeholder="retype password" />
            <input type="hidden" name="_csrf" id="_csrf" value={props.csrf} />
            <input type="submit" value="Sign Up" className="formSubmit" />
        </form>
    );
}

const init = async () => {
    const response = await fetch('/getToken');
    const data = await response.json();

    const loginButton = document.getElementById('login');
    const signupButton = document.getElementById('signup');

    loginButton.addEventListener('click', (e) => {
        e.preventDefault();
        ReactDOM.render(<LoginWindow csrf={data.csrfToken} />,
            document.getElementById('content'));
        return false;
    });
    signupButton.addEventListener('click', (e) => {
        e.preventDefault();
        ReactDOM.render(<SignupWindow csrf={data.csrfToken} />,
            document.getElementById('content'));
        return false;
    });

    ReactDOM.render(<LoginWindow csrf={data.csrfToken} />,
        document.getElementById('content'));
};

window.onload = init;