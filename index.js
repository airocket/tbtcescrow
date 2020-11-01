// Source code to interact with smart contract


// contractAddress and abi are setted after contract deploy
var contractAddress = '0x9B46c81AD315469c1F49a2946e28cd3629026Fc7';
var abi = JSON.parse( '[{"constant":false,"inputs":[{"name":"_token1","type":"address"},{"name":"_amount1","type":"uint256"},{"name":"_token2","type":"address"},{"name":"_owner2","type":"address"},{"name":"_amount2","type":"uint256"}],"name":"createEscriow",\
"outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},\
{"constant":true,"inputs":[{"name":"_owner2","type":"address"}],"name":"getEscriowFromAdress",\
"outputs":[{"name":"token1","type":"address"},{"name":"owner1","type":"address"},{"name":"amount1","type":"uint256"},{"name":"token2","type":"address"},{"name":"owner2","type":"address"},{"name":"amount2","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},\
{"constant":false,"inputs":[],"name":"runEscriow",\
"outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},\
{"constant":false,"inputs":[],"name":"delEscriow",\
"outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},\
{"constant":false,"inputs":[],"name":"runEscriow",\
"outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]' );
var account;
var statusMetamask = false

if (window.ethereum) {
  window.web3 = new Web3(window.ethereum);
  checkAcc()
}

async function checkAcc(){
  var acc_list = await window.web3.eth.getAccounts()
  if (acc_list.length > 0) {
    connectInstance();
  }
}

function connectInstance(){

  web3.eth.getAccounts(function(err, accounts) {
    if (err != null) {
      alert("Error retrieving accounts.");
      return;
    }
    if (accounts.length == 0) {
      alert("No account found! Make sure the Ethereum client is configured properly.");
      return;
    }
    account = accounts[0];
    console.log('Account: ' + account);
    web3.eth.defaultAccount = account;
  });
  contract = new web3.eth.Contract(abi, contractAddress);
  statusMetamask = true
  getMyEscrow()
}

async function connectMetamsk() {
  
  if (!statusMetamask){
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      try {  
          await ethereum.enable()
      } catch (error) {
          console.log('user rejected permission')
      }
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
    console.log (window.web3.currentProvider)
    connectInstance()
  }
}
//Smart contract functions
function registerSetInfo() {
  info = $("#newInfo").val();
  contract.methods.setInfo (info).send( {from: account}).then( function(tx) { 
    console.log("Transaction: ", tx); 
  });
  $("#newInfo").val('');
}

function registerGetInfo() {
  contract.methods.getInfo().call().then( function( info ) { 
    console.log("info: ", info);
    document.getElementById('lastInfo').innerHTML = info;
  });    
}

async function approve() {
  token1 = $("#token1").val();
  amount1 = $("#amount1").val();

  console.log(token1,amount1)
  var _abi = JSON.parse('[{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"amount","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"}]')
  _contract = new web3.eth.Contract(_abi,token1);

  _contract.methods.approve(contractAddress, amount1).send( {from: account}).then( function(tx) {

  });

  await createEscriow();

}


function getEscrow() {
  _owner1 = $("#owner2").val();
  console.log(_owner1);
  try {
    contract.methods.getEscriowFromAdress (_owner1).call().then( function(_return )  {
      console.log("Return: ",_return.owner1,_return.owner2,_return.amount1,_return.amount2,_return.token1,_return.token2);

      document.getElementById('_token1').innerHTML = _return.token1;
      document.getElementById('_token2').innerHTML = _return.token2;
      document.getElementById('_owner1').innerHTML = _return.owner1;
      document.getElementById('_owner2').innerHTML = _return.owner2;
      document.getElementById('_amount1').innerHTML = _return.amount1;
      document.getElementById('_amount2').innerHTML = _return.amount2;
    });
  } catch (error) {
    window.alert(error)
  }

}

function getMyEscrow() {

  try {
    contract.methods.getEscriowFromAdress (window.ethereum.selectedAddress).call().then( function(_return )  {
      console.log("Return: ",_return.owner1,_return.owner2,_return.amount1,_return.amount2,_return.token1,_return.token2);
      document.getElementById('token1').value = _return.token1;
      document.getElementById('token2').value = _return.token2;
      document.getElementById('owner2').value = _return.owner2;
      document.getElementById('amount1').value = _return.amount1;
      document.getElementById('amount2').value = _return.amount2;
    });
  } catch (error) {
    window.alert(error)
  }

}

function delEscriow()
{
  contract.methods.delEscriow ().send({from: account}).then( function(tx) {
    console.log("Transaction: ", tx);
  });
}
async function createEscriow() {
  _token1 = $("#token1").val();
  _token2 = $("#token2").val();
  _amount1 = parseInt($("#amount1").val());
  _amount2 = parseInt($("#amount2").val());
  _owner2 = $("#owner2").val();

  contract.methods.createEscriow (_token1, _amount1, _token2, _owner2, _amount2).send({from: account}).then( function(tx) {
    console.log("Transaction: ", tx); 
  });
  

}

async function runEscriow() {
  contract.methods.runEscriow ().send({from: account}).then( function(tx) {
    console.log("Transaction: ", tx);
  });


}