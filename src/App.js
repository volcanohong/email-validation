import React, {Component} from 'react';
import './App.css';
import './AppConstants'
import * as AppConstant from './AppConstants';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {email: '', error: ''};
        this.handleChange = this.handleChange.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    validation() {
        let email = this.state.email;
        if (!email) return this.error("email cannot be empty");
        if (typeof email !== "undefined") {
            let lastAtPos = email.lastIndexOf('@');
            if (lastAtPos < 0) return this.error("missing '@'");
            let domainPart = email.substr(lastAtPos + 1);
            let domainRegExp = new RegExp(AppConstant.PATTERN_DOMAIN);
            if (!domainRegExp.test(domainPart)) return this.error("invalid domain name");
            let namePart = email.substr(0, lastAtPos);
            let nameRegExp = new RegExp(AppConstant.PATTERN_NAME);
            if (!nameRegExp.test(namePart)) return this.error("is it a typo?");
        }
        return true;
    }

    error(msg) {
        console.log(msg);
        this.setState({error: "Invalid email: " + msg});
        return false;
    }

    handleSubmit(e) {
        e.preventDefault();
        if (this.validation()) {
            this.setState({error: ""});
        } else {

        }
    }

    handleChange(e) {
        this.setState({email: e.target.value});
    }

    handleKeyPress(e) {
        this.setState({email: e.target.value});
        let keyCode = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;
        if (AppConstant.KEYCODE_PROTECTED.indexOf(keyCode) >= 0) {
            return;
        }
        // e.preventDefault();

        console.log(String.fromCharCode(keyCode));
    }

    render() {
        return (
            <div className="app">
                <form id="form" onSubmit={this.handleSubmit}>
                    <div>
                        <label>Email</label>
                        <input name="email" type="text" id="email" value={this.state.email}
                               placeholder="Please input valid email"
                               onChange={this.handleChange} onKeyPress={this.handleKeyPress}/>
                        <span style={{color: "red"}}>{this.state.error}</span>
                    </div>
                </form>
            </div>
        );
    }
}

export default App;
