import React from 'react';

import {
  Button,
  Col,
  Form,
  Row,
  Table,
} from 'react-bootstrap';

import {
  readFileAsString,
  downloadFile,
} from './helper';

export default class FullVigenere extends React.PureComponent {
  constructor(props) {
    super(props);
    this.action = null;
    this.state={
      alphabets: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", 
                  "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T",
                  "U", "V", "W", "X", "Y", "Z"],
      rows: null,
      table: null,
      numOfChar: 26,
      result: null,
    }
  }

  componentDidMount() {
    this.generateRow(26);
    this.generatePermutationTable(this.state.alphabets);
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

  permute(charList) {
    let array = charList.slice(0); //copy array
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  generatePermutationTable(alphabets) {
    const { numOfChar } = this.state;
    const charList = alphabets.slice(0); //copy array
    let array = [];
    for (let i = 0; i < numOfChar; i++) {
      array.push(this.permute(charList));
    }
    this.setState({
      table: array,
    });
  }

  encrypt(plainText, key, resultOption) {
    const { alphabets, table } = this.state;
    let result = "";
    for (let i = 0; i < plainText.length; i++) {
      let row = alphabets.indexOf(key[i]);
      let col = alphabets.indexOf(plainText[i]);
      result += table[row][col];
      if (resultOption === "secondOption") if (i % 5 === 4) result += " ";
    }
    this.setState({
      result: result,
    });
    this.resultText.value = result;
  }

  decrypt(cipherText, key, resultOption) {
    const { alphabets, table } = this.state;
    let result = "";
    for (let i = 0; i < cipherText.length; i++) {
      let row = alphabets.indexOf(key[i]);
      let col = table[row].indexOf(cipherText[i]);
      result += alphabets[col];
      if (resultOption === "secondOption") if (i % 5 === 4) result += " ";
    }
    this.setState({
      result: result,
    });
    this.resultText.value = result.toLowerCase();
  }

  handleSubmit = (event) => {
    event.preventDefault();
    let key = event.target.key.value.toUpperCase();
    let autoKey = event.target.autoKey.checked;
    let resultOption = event.target.resultOption.value;

    if (event.target.inputFile.files.length > 0) {
      let file = event.target.inputFile.files[0];
      let result = readFileAsString(file);
      event.target.inputFile.value = "";
      result.then(res => {
        let text = res.replace(/[^A-Za-z]/g, "").toUpperCase();
        if (autoKey) {
          if (key.length < text.length) {
            const diff = text.length - key.length;
            const trailer = text.substr(0, diff);
            key += trailer;
          } else {
            key = key.substr(0, text.length);
          }
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
          this.encrypt(text, key, resultOption);
        } else {
          this.decrypt(text, key, resultOption);
        }
      });
    } else {
      let text = event.target.inputText.value.replace(/[^A-Za-z]/g, "").toUpperCase();
      if (autoKey) {
        if (key.length < text.length) {
          const diff = text.length - key.length;
          const trailer = text.substr(0, diff);
          key += trailer;
        } else {
          key = key.substr(0, text.length);
        }
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
        this.encrypt(text, key, resultOption);
      } else {
        this.decrypt(text, key, resultOption);
      }
    }
  }

  render() {
    const { alphabets, rows, table, numOfChar, result } = this.state;
    return (
      <React.Fragment>
        <Row className="margin-bottom-md">
          <Col xs={6} className="content-start">
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

              <Form.Group controlId="resultOption">
                <Form.Label>Result Option</Form.Label>
                <Form.Control as="select">
                  <option value="firstOption">No Spaces</option>
                  <option value="secondOption">5-word Group</option>
                </Form.Control>
              </Form.Group>
              
              <Form.Group controlId="resultText">
                <Form.Label>Result</Form.Label>
                <Form.Control as="textarea" rows="6" ref={(ref)=>{this.resultText=ref}}/>
              </Form.Group>

              <Button 
                variant="success"
                type="button"
                className="margin-bottom-xs margin-right-sm"
                onClick={() => downloadFile("result", result)}
              > Download Result
              </Button>
              
              <Button 
                variant="warning"
                type="button"
                className="margin-bottom-xs"
                onClick={() => this.generatePermutationTable(alphabets)}
              > Randomize Vigenere Square
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
          <Col xs={6} className="content-end">
          { rows ? 
            numOfChar === 26 ? (
              <Table striped hover responsive="xl" size="sm">
                <thead>
                  <tr>
                    <th></th>
                    { alphabets.map((char, idx) => {
                      return (
                        <th key={idx}>{char}</th>
                      )
                    })}
                  </tr>
                </thead>
                <tbody>
                  { alphabets.map((char, idx) => {
                    return (
                      <tr key={idx}>
                        <td>{char}</td>
                        { rows.map(itr => {
                          return (
                            <td key={itr}>{table[idx][itr]}</td>
                          )
                        })}
                      </tr>
                    )
                  })}
                </tbody>
              </Table>
            )
            : ""
          : ""}
          </Col>
        </Row>
      </React.Fragment>
    )
  }
}