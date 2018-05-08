import React, {Component} from 'react';
import './App.css';
import './AppConstants'
import {Trie} from './trie';
import * as AppConstant from './AppConstants';
import {EMAIL_PROVIDERS} from "./AppConstants";

class App extends Component {

    dict = new Trie();

    constructor(props) {
        super(props);
        this.state = {email: '', error: ''};
        this.handleChange = this.handleChange.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        EMAIL_PROVIDERS.forEach(email => this.dict.add(email));
    }

    validation() {
        let email = this.state.email;
        if (!email) return this.error("email cannot be empty");
        if (typeof email !== "undefined") {
            let lastAtPos = email.lastIndexOf('@');
            let lastDotPos = email.lastIndexOf('.');
            if (lastAtPos < 0) return this.error("missing '@'");
            let domainPart = email.substr(lastAtPos + 1);
            let domainRegExp = new RegExp(AppConstant.PATTERN_DOMAIN);
            if (!domainRegExp.test(domainPart)) return this.error("invalid domain name");
            if (lastDotPos < lastAtPos) return this.error("missing '.' in domain");
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
        }
    }

    handleChange(e) {
        this.setState({email: e.target.value});
    }

    handleKeyPress(e) {
        // this.setState({email: e.target.value});
        let keyCode = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;
        if (AppConstant.KEYCODE_PROTECTED.indexOf(keyCode) >= 0) return;

        let atPos = e.target.value.indexOf('@');
        if (atPos < 0) return;
        let input = document.getElementById('email');
        let start = e.target.selectionStart;
        let name = e.target.value.substring(0, atPos + 1);
        let prefix = e.target.value.substring(atPos + 1, start) + String.fromCharCode(keyCode);
        let words = this.dict.getWordsByPrefix(prefix);

        e.preventDefault();

        if (words.length > 0) {
            if (prefix.length === words[0].length) return;
            input.value = name + words[0];
            setTimeout(function () {
                input.setSelectionRange(start + 1, start + words[0].length);
            }, 0);
        } else {
            input.value = name + prefix;
        }
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
