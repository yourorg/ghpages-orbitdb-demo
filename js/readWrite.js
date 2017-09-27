let msg = '';
const txtResponse = document.getElementById("txt_response");
const strHashField = document.getElementById("str_hash");
const btnRetrieve = document.getElementById("btn_retrieve");

const retrieveDoc = () => {
  btnRetrieve.disabled = true;

  const hashDocument = strHashField.value;
  txtResponse.innerHTML = hashDocument;

  ipfsNode.files.cat(hashDocument, function (err, stream) {
    var res = ''

    stream.on('data', function (chunk) {
      res += chunk.toString()
    })

    stream.on('error', function (err) {
      msg = 'Error - ipfs files cat ';
      txtResponse.innerHTML = msg;
      console.error(msg, err)
    })

    stream.on('end', function () {
      msg = 'IPFS returns : ';
      txtResponse.innerHTML = msg + res;
      console.log(msg, res)
    })
  });
}

btnRetrieve.addEventListener('click', retrieveDoc);



const txtStatus = document.getElementById("txt_status");
const strSampleField = document.getElementById("strSample");
const btnCommit = document.getElementById("btn_commit");

const submitDoc = () => {
  btnCommit.disabled = true;

  const strSample = strSampleField.value
  txtStatus.innerHTML = strSample;

  msg = 'IPFS -- text successfully stored : ';
  ipfsNode.files.add(new ipfsNode.types.Buffer( strSample ), (err, res) => {
    if (err || !res) {
      msg = 'Error - ipfs files add';
      txtStatus.innerHTML = msg;
      return console.error(msg, err, res)
    }

    res.forEach((file) => {
      txtStatus.innerHTML = msg + file.hash;
      console.log(msg, file);
    })
  })


  ipfsNode.swarm.addrs(function (err, addrs) {
    if (err) {
      throw err;
    }
    console.log('Found addresses :');
    console.log(addrs[2]);
    console.log(addrs[2].multiaddrs);
    console.log(addrs[2].multiaddrs._multiaddrs);
    console.log(addrs[2].multiaddrs._multiaddrs[0]);
    console.log(addrs[2].multiaddrs._multiaddrs[0].toString());
  })

}

btnCommit.addEventListener('click', submitDoc);
