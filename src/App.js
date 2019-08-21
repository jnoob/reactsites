import React, { Component } from 'react';
import './App.css';
import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.headers.post['Content-Type'] = 'application/json';
const server = 'http://127.0.0.1:8000';

class App extends Component {
  constructor (props) {
    super(props);
    this.state = {
      content: '',
      link: '-',
      expire_at: {date: new Date()}.toLocaleString()
    };
    this.change = this.change.bind(this);
    this.generate = this.generate.bind(this);
    this.load = this.load.bind(this);
  }

  change (key, e) {
    this.setState({
      [key]: e.target.value
    });
  }

  async generate() {
    let data = {...this.state};
    let res = await axios.post( server + '/pastebin/', data);
    if (res.status === 200 && res.data !== undefined && res.data.link !== undefined) {
      this.setState({ 'link': res.data.link });
    }
    else  {
      this.setState({ 'link': '--' })
    }
  }

  async load() {
    let res = await axios.get(server + '/pastebin/', {
      params: {
        link: window.encodeURI(this.state.link)
      }
    });

    if (res.status === 200 && res.data !== undefined){
      this.setState({
        'content': res.data.content,
        'expire_at': res.data.expire_at
      })
    }
    else  {
      this.setState({
        'content': '--error--',
        'expire_at': {date: new Date()}
      })
    }
  }

  render() {
    return (
      <div className="App">
        <input onChange={(e) => (this.change('content', e))}/>
        <br/>
        <input type="datetime" onChange={(e) => (this.change('expire_at', e))}/>
        <br/>
        <button onClick={this.generate}>generate</button>
        <br/>
        <input onChange={(e) => (this.change('link', e))}/>
        <br/>
        <button onClick={this.load}>load</button>
      </div>
    );
  }
}

export default App;
