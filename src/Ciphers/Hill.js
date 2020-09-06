import React from 'react';

import {
  Button,
  Col,
  Form,
  Row,
} from 'react-bootstrap';

import {
  readFile,
  downloadFile,
} from './helper';

export default class Hill extends React.PureComponent {
  constructor(props) {
    super(props);
    this.action = null;
    this.state={
      alphabets: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", 
                  "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T",
                  "U", "V", "W", "X", "Y", "Z"],
      rows: null,
      numOfChar: 26,
      result: null,
    }
  }

  componentDidMount() {
    this.generateRow(26);
  }

  generateRow(numOfChar) {
    let rows = [];

    for (let i = 0; i < numOfChar; i++) {
      rows[i] = i;
    }

    this.setState({
      rows: rows,
    });
  }

  mod(n, m) {
    return ((n % m) + m) % m;
  }

  encrypt(plainText, key) {
    const { alphabets, numOfChar } = this.state;
    let result = "";
    for (let i = 0; i < plainText.length; i++) {
      let row = alphabets.indexOf(key[i]);
      let col = alphabets.indexOf(plainText[i]);
      result += alphabets[(col+row)%numOfChar];
      if (i % 5 === 4) result += " ";
    }
    this.setState({
      result: result,
    });
    this.resultText.value = result;
  }

  decrypt(cipherText, key) {
    const { alphabets, numOfChar } = this.state;
    let result = "";
    for (let i = 0; i < cipherText.length; i++) {
      let row = alphabets.indexOf(key[i]);
      let col = alphabets.indexOf(cipherText[i]);
      result += alphabets[this.mod(col-row, numOfChar)];
      if (i % 5 === 4) result += " ";
    }
    result = result.toLowerCase();
    this.setState({
      result: result,
    });
    this.resultText.value = result;
  }

  handleSubmit = (event) => {
    event.preventDefault();
    let key = event.target.key.value.toUpperCase();
    let autoKey = event.target.autoKey.checked;

    if (event.target.inputFile.files.length > 0) {
      let file = event.target.inputFile.files[0];
      let result = readFile(file);
      event.target.inputFile.value = "";
      result.then(res => {
        let text = res.replace(/[^A-Za-z]/g, "").toUpperCase();
        if (autoKey) {
          key += text;
          key = key.substr(0, text.length);
        } else {
          if (key.length < text.length) {
            let numOfRepeat = Math.ceil((text.length-key.length)/key.length)+1;
            key = key.repeat(numOfRepeat).substr(0, text.length);
          } else {
            key = key.substr(0, text.length);
          }
        }
        
        this.fullKey.value = key;
        
        if (this.action === "encrypt") {
          this.encrypt(text, key);
        } else {
          this.decrypt(text, key);
        }
      });
    } else {
      let text = event.target.inputText.value.replace(/[^A-Za-z]/g, "").toUpperCase();
      if (autoKey) {
        key += text;
        key = key.substr(0, text.length);
      } else {
        if (key.length < text.length) {
          let numOfRepeat = Math.ceil((text.length-key.length)/key.length)+1;
          key = key.repeat(numOfRepeat).substr(0, text.length);
        } else {
          key = key.substr(0, text.length);
        }
      }
      
      this.fullKey.value = key;
      
      if (this.action === "encrypt") {
        this.encrypt(text, key);
      } else {
        this.decrypt(text, key);
      }
    }
  }

  render() {
    const { result } = this.state;
    return (
      <React.Fragment>
        <Row>
          <Col xs={12} className="content-start">
            <Form onSubmit={this.handleSubmit}>

              <Form.Group controlId="inputText">
                <Form.Label>Text</Form.Label>
                <Form.Control as="textarea" rows="6"/>
              </Form.Group>

              <Form.Group>
                <Form.File id="inputFile" label="or upload file" />
              </Form.Group>

              <Form.Group controlId="key">
                <Form.Label>Key</Form.Label> 
                <Form.Control type="text" required/>
              </Form.Group>

              <Form.Group controlId="autoKey">
                <Form.Check type="checkbox" label="Use Auto-Key Vigenere Cipher"/>
              </Form.Group>

              <Form.Group controlId="fullKey">
                <Form.Label>Full Key</Form.Label> 
                <Form.Control type="text" readOnly ref={(ref)=>{this.fullKey=ref}}/>
              </Form.Group>

              <Form.Group controlId="resultText">
                <Form.Label>Result</Form.Label>
                <Form.Control as="textarea" rows="6" ref={(ref)=>{this.resultText=ref}}/>
              </Form.Group>

              <Button 
                variant="success"
                type="button"
                className="margin-bottom-xs"
                onClick={() => downloadFile("result", result)}
              > Download Result
              </Button>
              
              <Button 
                variant="primary"
                type="submit"
                className="full-width margin-bottom-xs"
                onClick={() => this.action="encrypt"}
              > Encrypt
              </Button>

              <Button
                variant="secondary"
                type="submit"
                className="full-width"
                onClick={() => this.action="decrypt"}
              > Decrypt
              </Button>
            </Form>
          </Col>
        </Row>
      </React.Fragment>
    )
  }
}