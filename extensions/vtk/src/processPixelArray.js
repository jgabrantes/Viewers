

export default async function processPixelArray(pixelArray) {

  return new Promise((resolve, reject) => {
    const url = 'http://127.0.0.1:5000/filterImage';
    var xhr = new XMLHttpRequest();

    const data = JSON.stringify(pixelArray);

    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        const res = new Uint16Array(this.response)
        console.log(res)
        resolve(res);
      }
    };
    //xhr.responseType = "arraybuffer";
    xhr.open('POST', url);
    xhr.responseType = 'arraybuffer';
    xhr.send(data);

  });

}
