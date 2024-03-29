function convertArrayBufferToString(array) {
  let text = "";
  for (let i = 0; i < array.length; i++) {
    text += String.fromCharCode(array[i]);
  }
  return text;
}

function readFile(file) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.onload = function(e) {
      resolve(e.target.result);
    }
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

function readFileAsString(file) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.onload = function(e) {
      resolve(e.target.result);
    }
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

function downloadFile(filename, data) {
  if (data) {
    let blob = new Blob([data], {type: 'text/plain'});
    if (window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveBlob(blob, filename);
    } else {
      let elem = window.document.createElement('a');
      elem.href = window.URL.createObjectURL(blob);
      elem.download = filename;        
      document.body.appendChild(elem);
      elem.click();        
      document.body.removeChild(elem);
    }
  } else {
    alert("No result yet!");
  }
}

function downloadBinaryFile(filename, extension, buffer) {
  if (buffer) {
    let blob = new Blob([buffer], {type: 'application/octet-stream'});
    if (window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveBlob(blob, filename + '.' + extension);
    } else {
      let elem = window.document.createElement('a');
      elem.href = window.URL.createObjectURL(blob);
      elem.download = filename + '.' + extension;
      document.body.appendChild(elem);
      elem.click();        
      document.body.removeChild(elem);
    }
  } else {
    alert("No result yet!");
  }
}

function mod(n, m) {
  return ((n % m) + m) % m;
}

function modInverse(a, b) {
  a %= b;
  for (let x = 1; x < b; x++) {
    if ((a*x)%b === 1) {
      return x;
    }
  }
}

function gcd(a, b) {
  if (a === 0 || b === 0) return 0;
  if (a === b) return a;
  if (a > b) return gcd(a-b, b);
  return gcd(a, b-a);
}

function coprime(a, b) {
  return (gcd(a,b) === 1);
}

export {
  convertArrayBufferToString,
  readFile,
  readFileAsString,
  downloadFile,
  downloadBinaryFile,
  mod,
  modInverse,
  coprime,
};