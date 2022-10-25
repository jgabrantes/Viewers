export default async function queryResults(name, modality, weight, studyTime, studyDescription, result) {

  return new Promise((resolve, reject) => {
    const url = 'http://127.0.0.1:5000/results';
    var xhr = new XMLHttpRequest();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('modality', modality);
    formData.append('weight', weight);
    formData.append('date', studyTime);
    formData.append('description', studyDescription);
    formData.append("average", result);

    console.log(formData.get("average"));

    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        const res = new Uint16Array(this.response)
        resolve(res);
      }
    };
    //xhr.responseType = "arraybuffer";
    xhr.open('POST', url);
    xhr.responseType = 'arraybuffer';
    xhr.send(formData);

  });

}
