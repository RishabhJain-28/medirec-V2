let accountType = null;
const patient = "patient";
const doctor = "doctor";

var web3;

const agentContractAddress = contractAddress;

function connect() {
  web3 = new Web3(window.ethereum);
  window.ethereum.enable().catch((error) => {
    console.log(error);
  });
  abi = JSON.parse(
    '[{"constant":true,"inputs":[{"name":"addr","type":"address"}],"name":"get_accessed_doctorlist_for_patient","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"paddr","type":"address"},{"name":"daddr","type":"address"}],"name":"remove_patient","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"doctorList","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"paddr","type":"address"},{"name":"daddr","type":"address"}],"name":"get_patient_doctor_name","outputs":[{"name":"","type":"string"},{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"daddr","type":"address"}],"name":"revoke_access","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"addr","type":"address"}],"name":"get_patient","outputs":[{"name":"","type":"string"},{"name":"","type":"uint256"},{"name":"","type":"uint256[]"},{"name":"","type":"address"},{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"addr","type":"address"}],"name":"get_doctor","outputs":[{"name":"","type":"string"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"insurerList","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"paddr","type":"address"}],"name":"get_hash","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"addr","type":"address"}],"name":"get_insurer","outputs":[{"name":"","type":"string"},{"name":"","type":"uint256"},{"name":"","type":"address[]"},{"name":"","type":"address[]"},{"name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"paddr","type":"address"}],"name":"accept_claim","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"patientList","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"addr","type":"address"}],"name":"permit_access","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"get_doctor_list","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"iaddr","type":"address"},{"name":"_diagnosis","type":"uint256[]"}],"name":"select_insurer","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"addr","type":"address"}],"name":"get_accessed_patientlist_for_doctor","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"get_patient_list","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"get_insurer_list","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"string"},{"name":"_age","type":"uint256"},{"name":"_designation","type":"uint256"},{"name":"_hash","type":"string"}],"name":"add_agent","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"paddr","type":"address"},{"name":"_diagnosis","type":"uint256"},{"name":"_hash","type":"string"}],"name":"insurance_claim","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]'
  );
  AgentContract = web3.eth.contract(abi);
  contractInstance = AgentContract.at(agentContractAddress);
  web3.eth.defaultAccount = web3.currentProvider.selectedAddress;
  console.log("Web3 Connected:" + web3.eth.defaultAccount);
  return web3.currentProvider.selectedAddress;
}

function checkAccount() {
  const currentAccount = web3.currentProvider.selectedAddress.toLowerCase();
  updateAccountUI(null);
  contractInstance.get_patient_list(function (error, result) {
    if (!error) {
      var PatientList = result;
      for (var i = 0; i < PatientList.length; i++) {
        if (currentAccount == PatientList[i]) {
          accountType = patient;
          updateAccountUI(patient);
          return;
          // location.href = "./patient.html?key=" + publicKey;
        }
      }
    } else {
      console.log(error);
      console.log("Invalid User!");
      $(".alert-warning").show();
    }
  });

  contractInstance.get_doctor_list(function (error, result) {
    if (!error) {
      var DoctorList = result;
      for (var i = 0; i < DoctorList.length; i++) {
        if (currentAccount == DoctorList[i]) {
          // location.href = "./doctor.html?key=" + publicKey;
          accountType = doctor;
          updateAccountUI(doctor);
          return;
        }
      }
    } else {
      console.log(error);
      $(".alert-warning").show();
    }
  });
}

function updateAccountUI(accountType) {
  const selectedAddress = web3.currentProvider.selectedAddress;

  if (accountType == null) {
    $("#registerBtn").show();
    $("#loginBtn").hide();
  } else if (accountType == doctor) {
    $("#loginText").html(`Doctor Account id : ${selectedAddress}`);
    $("#registerBtn").hide();
    $("#loginBtn").show();
  } else if (accountType == patient) {
    $("#loginText").html(`Patient Account id : ${selectedAddress}`);
    $("#registerBtn").hide();
    $("#loginBtn").show();
  } else {
    console.error("Invalid accountType value", accountType);
  }
}

function goToRegister() {
  location.href = "./register.html";
}

function login() {
  console.log({ accountType });
  const selectedAddress = web3.currentProvider.selectedAddress;

  if (accountType === doctor) {
    location.href = "./doctor.html?key=" + selectedAddress;
  } else if (accountType === patient) {
    location.href = "./patient.html?key=" + selectedAddress;
  }
}

window.addEventListener("load", async () => {
  connect();
  checkAccount();
  console.log("Externally Loaded!");
});

window.ethereum.on("accountsChanged", function (accounts) {
  checkAccount();
});
