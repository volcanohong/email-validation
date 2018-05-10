import React, {Component} from 'react';
import './app.css';
import './constants'
import {Trie} from './trie';
import * as AppConstant from './constants';
import {EMAIL_PROVIDERS} from "./constants";

class App extends Component {

    dict = new Trie();
    len = null;

    constructor(props) {
        super(props);
        this.state = {email: '', error: ''};
        this.handleChange = this.handleChange.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        EMAIL_PROVIDERS.forEach(email => this.dict.add(email));
    }

    handleChange(e) {
        this.setState({email: e.target.value});
    }

    handleSubmit(e) {
        e.preventDefault();
        if (this.validation()) {
            this.setState({error: ""});
        }
    }

    handleKeyPress(e) {
        let keyCode = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;
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
            if (this.validation()) this.setState({error: ""});
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
