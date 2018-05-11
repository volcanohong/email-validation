import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import Enzyme, {shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import * as AppConstant from './constants';

Enzyme.configure({adapter: new Adapter()});

describe('<App />', () => {

    let props, wrapper;

    beforeEach(() => {
        props = {
            handleSubmit: () => {
            },
            handleChange: () => {
            },
            handleKeyPress: () => {
            }
        };
        wrapper = shallow(<App {...props} />);
        window.fetch = jest.fn().mockImplementation(() => Promise.resolve({
            json: () => Promise.resolve({
                status: 200
            })
        }))
    });

    it('renders without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(<App/>, div);
        ReactDOM.unmountComponentAtNode(div);
    });

    it("should have form, input and span", () => {
        expect(wrapper.find('form').length).toEqual(1);
        expect(wrapper.find('input').length).toEqual(1);
        expect(wrapper.find('span').length).toEqual(1);
    });

    it("should start with empty email and error", () => {
        const email = wrapper.state().email;
        expect(email).toEqual("");
        const error = wrapper.state().error;
        expect(error).toEqual("");
    });

    it('`<input>` element should have an onChange, onKeyPress attribute', () => {
        expect(wrapper.find('input').props().onChange).toBeDefined();
        expect(wrapper.find('input').props().onKeyPress).toBeDefined();
    });

    it('onChange: should update state input is changed', () => {
        const email = 'any@gmail.com';
        const input = wrapper.find('input');
        input.simulate('change', {
            target: {
                name: 'email',
                value: email,
            }
        });
        expect(wrapper.state().email).toBe(email);
    });

    it('onKeyPress: should show an error when email is not correct', () => {
        const email = 'any@';
        const input = wrapper.find('input');
        input.simulate('keypress', { preventDefault(){}, key: 'enter', keyCode: 13, which: 13, target: {
            name: 'email',
            value: email,
        }});
        expect(wrapper.state().error).toContain(AppConstant.INVALID_EMAIL);
    });

    it('onSubmit: should show an error when email is not correct', () => {
        const email = 'any@';
        const form = wrapper.find('form');
        form.simulate('submit', { preventDefault(){},  target: {
            name: 'email',
            value: email,
        }});
        expect(wrapper.state().error).toContain(AppConstant.INVALID_EMAIL);
    });

    it('deliverable should be called', () => {
        const email = 'any@gmail.com';
        const url = AppConstant.EMAIL_VERIFY_API_URL + "?email=" + encodeURI(email) + "&apikey=" + AppConstant.EMAIL_VERIFY_API_KEY;
        wrapper.setState({email: email});
        wrapper.instance().deliverable();
        expect(window.fetch).toHaveBeenCalledWith(url,  {"headers": {"Accept": "application/json"}, "method": "GET", "mode": "no-cors"});
    });
});
