const repoPath = 'ipfs-' + Math.random()
const report = 'Node status : ';
const OFF = 'offline';
const PREP = 'seeking peers';
const READY = 'online';

let status = OFF;
// Create an IPFS node
const ipfsNode = new Ipfs({
  init: false,
  start: false,
  repo: repoPath
})

// Init the node
ipfsNode.init(handleInit)
ipfsNode.on('start', () => console.log('Started'));
ipfsNode.on('ready', () => console.log('Ready'));
ipfsNode.on('error', () => console.log('Error'));
ipfsNode.on('init', () => console.log('Initialized'));
ipfsNode.on('stop', () => console.log('Stopped'));


function handleInit (err) {
  if (err) {
    throw err
  }

  ipfsNode.start(() => {
    status = ipfsNode.isOnline() ? PREP : OFF; 
    console.log(report + status);
    document.getElementById("status").innerHTML = report + status;

    // You can write more code here to use it. Use methods like
    // ipfsNode.files.add, ipfsNode.files.get. See the API docs here:
    // https://github.com/ipfs/interface-ipfs-core/tree/master/API

  })
};

const addrsList = (members) => {
  let peers = document.getElementById("peers");
  peers.innerHTML = '';
  document.getElementById("status").innerHTML = 'Connected peers are : ';
  console.log('Swarm members : ', members);
  let maddr = null;
  let txtMaddr = '';
  members.filter((member) => {
    maddr = member.addr;
    txtMaddr = maddr.toString();
    console.log('Swarm member : ', txtMaddr  );
    if ( txtMaddr.includes( '/wss/p2p-webrtc-star/ipfs/' ) ) {
      peers.innerHTML += '<li>' + txtMaddr + '</li>';
      ipfsNode.swarm.connect(maddr, (err) => {
        if (err) {
          console.log('Swarm connect error!', err);
          throw err;
        }
      });
    }
  });

}

const enough = 9;
( addrsCheck = () => {
   
  let countAddrs = 0;
  let addresses = null;
  if ( status === PREP ) {
    ipfsNode.swarm.peers( (err, addrs) => {

      if (err) {
        console.log('Swarm error!', err);
        throw err;
      }
      addresses = addrs;
      countAddrs = addresses.length;
  //    console.log('Found %s addresses', countAddrs);

    });
  }

//  console.log('Tick %s', countAddrs);
//  setTimeout(addrsCheck, 5000);
  if ( countAddrs < enough ) {
    setTimeout(addrsCheck, 5000);
    if ( document.getElementById("status") ) {
      document.getElementById("status").innerHTML = report + status
        + ' (' + countAddrs + '/' + enough + ')';
    }
  } else {
    status = 'linked in';
    console.log(report + status);
    document.getElementById("status").innerHTML = report + status;
    addrsList(addresses);
  }


})();
