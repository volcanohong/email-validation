import React, {Component} from 'react';
import './app.css';
import './constants'
import {Trie} from './trie';
import * as AppConstant from './constants';
import {EMAIL_PROVIDERS} from "./constants";

class App extends Component {

    dict = new Trie(); //auto-complete emails dict. trie
    len = null; //input string length

    constructor(props) {
        console.log('app init...');
        super(props);
        this.state = {email: '', error: ''};
        this.handleChange = this.handleChange.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        EMAIL_PROVIDERS.forEach(email => this.dict.add(email));
    }

    handleChange(e) {
        console.log('input change...');
        this.setState({email: e.target.value});
    }

    handleSubmit(e) {
        console.log('submit...');
        e.preventDefault();
        this.setState({email: e.target.value}); //for test
        if (this.validation() && this.deliverable()) this.setState({error: ""});
    }

    handleKeyPress(e) {
        let keyCode = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;
        console.log('key press... ' + keyCode);
        if (AppConstant.KEYCODE_PROTECTED.indexOf(keyCode) >= 0) return;
        let target = e.target;
        this.len = target.value.length;
        let start = target.selectionStart;
        let end = target.selectionEnd;
        let atPos = target.value.indexOf('@');
        if (atPos < 0 && keyCode !== 64) return; //@=64
        let prefix = target.value.substring(atPos + 1, start) + String.fromCharCode(keyCode);
        if (keyCode === 64) prefix = '';
        e.preventDefault();
        //keycode for end
        if (/^(13|44|59)$/.test("" + keyCode)) {
            e.target.selectionStart = end + (target.value.length - this.len);
            e.target.selectionEnd = end + (target.value.length - this.len);
            if (this.validation() && this.deliverable()) this.setState({error: ""});
            return;
        }
        //replace selection with input
        e.target.value = target.value.substr(0, start) + String.fromCharCode(keyCode) + target.value.substr(end, target.value.length);
        this.len = target.value.length - this.len;
        //move selection
        e.target.selectionStart = ++start;
        e.target.selectionEnd = end + this.len;
        //matched domain
        let words = [];
        if (keyCode === 64) words = this.dict.getWords();
        else words = this.dict.getWordsByPrefix(prefix);
        //auto complete
        if (words.length > 0) {
            let subStr = words[0].substr(prefix.length, words[0].length);
            e.target.value = target.value.substr(0, start) + subStr + target.value.substr(start, target.value.length);
            //highlight
            e.target.selectionStart = start;
            e.target.selectionEnd = start + subStr.length;
        }
        this.setState({email: e.target.value});
    }

    validation() {
        let email = this.state.email;
        console.log('validate: ' + email);
        if (!email) return this.error(AppConstant.ERR_NOT_EMPTY);
        if (typeof email !== undefined) {
            let lastAtPos = email.lastIndexOf('@');
            let lastDotPos = email.lastIndexOf('.');
            if (lastAtPos < 0) return this.error(AppConstant.ERR_MISSING_AT);
            let domainPart = email.substr(lastAtPos + 1);
            let domainRegExp = new RegExp(AppConstant.PATTERN_DOMAIN);
            if (!domainRegExp.test(domainPart)) return this.error(AppConstant.INVALID_DOMAIN);
            if (lastDotPos < lastAtPos) return this.error(AppConstant.ERR_MISSING_DOT);
            let namePart = email.substr(0, lastAtPos);
            let nameRegExp = new RegExp(AppConstant.PATTERN_NAME);
            if (namePart.length === 0) return this.error(AppConstant.ERR_MISSING_NAME);
            if (!nameRegExp.test(namePart)) return this.error(AppConstant.ERR_IS_TYPO);
        }
        return true;
    }

    deliverable() {
        console.log('deliverable: ' + this.state.email);
        let url = AppConstant.EMAIL_VERIFY_API_URL + "?email=" + encodeURI(this.state.email) + "&apikey=" + AppConstant.EMAIL_VERIFY_API_KEY;
        //using mode: "no-cors" will get an opaque response, which doesn't seem to return data in the body.
        fetch(url, {method: 'GET', mode: "no-cors", headers: { Accept: 'application/json'}})
            .then(res => {
                console.log(res);
                if(res.status === 200) return res.json();
            })
            .then(json => {
                /**do something**/
                console.log('You are using Kickbox\'s sandbox API: all email => "result":"deliverable"');
            })
            .catch(error => console.error('Error:', error));
        return true;
    }

    error(msg) {
        console.log(msg);
        this.setState({error: AppConstant.INVALID_EMAIL + ": " + msg});
        return false;
    }

    render() {
        return (
            <div className="app">
                <form id="form" onSubmit={this.handleSubmit}>
                    <div>
                        <label>Email</label>
                        <input name="email" type="text" id="email" value={this.state.email}
                               onChange={this.handleChange} onKeyPress={this.handleKeyPress}/>
                        <span id="error" style={{color: "red"}}>{this.state.error}</span>
                    </div>
                </form>
            </div>
        );
    }
}

export default App;
