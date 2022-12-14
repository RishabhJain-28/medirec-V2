var web3;
const agentContractAddress = contractAddress;

var ipfs;
let patientRecord = null;
let Buffer;

var ailmentsDict = {};
ailmentsDict[0] = "Common Flu";
ailmentsDict[1] = "Viral Infection";
ailmentsDict[2] = "Cancer";
ailmentsDict[3] = "Tumor";
ailmentsDict[4] = "Covid-19";
ailmentsDict[5] = "Heart-Disorder";
ailmentsDict[6] = "Other";
var url_string;
var url;
var key;
var docName = "";
let currentRecFiles = [];
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

function showRecords(element) {
  var table = document.getElementById("viewPatient");
  var index = element.parentNode.parentNode.rowIndex;
  var patientAddress = table.rows[index].cells[1].innerHTML;

  if (toggleRecordsButton % 2 == 0) {
    contractInstance.get_hash(
      patientAddress,
      { gas: 1000000 },
      function (error, result) {
        if (!error) {
          $.get("http://localhost:8080/ipfs/" + result, function (data) {
            console.log({ data, hash: result });
            // patientRecord = JSON.parse(data);
            patientRecord = data;
            console.log({ patientRecord });
            if (!patientRecord) {
              console.error("No patientRecord");
              return;
            }
            // <pre style="margin: 20px 0;" id="records${patientAddress}">
            // </pre>
            content =
              `<div class="tab-content">
                  <div id="view${patientAddress}">
                          <div class="row">
                              <div class="col-sm-12">
                          

                                    <h3>Name: ${patientRecord.name}</h3> 
                                    <h3>Public Key: ${
                                      patientRecord.publicKey
                                    }</h3> 
                                    
                                   
                                    ${
                                      patientRecord.records.length !== 0
                                        ? patientRecord.records.reduce(
                                            (acc, rec) => {
                                              return (
                                                acc +
                                                `
                                                <div class="recordDiv" >
                                        <h3>Diagnosed By : ${
                                          rec.diagnosedBy
                                        }</h3>
                                        <h3>Diagnoses Time:${rec.time}</h3>
                                        <h3>Diagnosis : ${rec.diagnosis}</h3>
                                        <h3>Details : ${rec.comments}</h3>
                                        ${
                                          rec?.files.length !== 0
                                            ? `<h3>Files:
                                            
                                           ${rec.files.map((file) => {
                                             return `<a target="_blank" href=${file.url} id="file-${file.name}-${file.hash}">${file.name}</a>`;
                                           })}
                                           </h3>
                                           `
                                            : ""
                                        }
                                          </div>
                                        
                                      `
                                              );
                                            },
                                            ""
                                          )
                                        : ""
                                    }
                                  


                              </div>
                          </div>
                          <div class="row">
                              <div class="col-sm-12">
                                  <div class="row">
                                      <div class="form-group col-sm-10">
                                          <div class="row">
                                              <div class="col-sm-2"><label for="ailmentsList" class="control-label">Diagnosis:</label></div>
                                              <div class="col-sm-10">
                                                  <select class="form-control" id="ailmentsList${patientAddress}" style="width:inherit;" required>
                                                      <option selected disabled>-- Please Select --</option>
                                                      <option value = "0">Common Flu</option>
                                                      <option value = "1">Viral Infection</option>
                                                      <option value = "2">Cancer</option>
                                                      <option value = "3">Tumor</option>
                                                      <option value = "4">Covid-19</option>
                                                      <option value = "5">Heart-Disorder</option>
                                                      <option value = "6">Other</option>
                                                  </select>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                                  <div class="row">
                                      <div class="form-group col-sm-10">
                                          <div class="row">
                                              <div class="col-sm-2">
                                                  <label class="control-label" for="details">Details:</label>
                                              </div>
                                              <div class="col-sm-10">
                                                  <textarea class="form-control" rows="5" id="details" placeholder="Enter details to be added" name = "Details" style="width: inherit" required autofocus></textarea>
                                                  <!-- <input type="text" class="form-control" id="details" placeholder="Enter details to be added" name = "Details" style="width: inherit" required autofocus> -->
                                              </div>
                                          </div>
                                      </div>
                                      <div class="form-group col-sm-2">
                                          <button class="btn btn-primary" onclick = "submitDiagnosis(this,` +
              index +
              `)">Submit</button>
              <button  class="btn btn-primary" onclick = "showFileModal()">Upload Doc</button>
                                      </div>
                                  </div>

                              </div>
                          </div>
                      </div>
                  </div>`;

            var row1 = table.insertRow(index + 1);
            var cell1 = row1.insertCell(0);
            cell1.colSpan = 3;

            cell1.innerHTML = content;
          }).error(console.log);
        } else {
          console.log(error);
        }
      }
    );

    toggleRecordsButton += 1;
    element.value = "Hide Records";
    element.className = "btn btn-danger";
  } else {
    row = table.rows[index + 1];
    $(row).hide();
    toggleRecordsButton -= 1;
    element.value = "View Records";
    element.className = "btn btn-success";
  }
}

function getDateTime() {
  function AddZero(num) {
    return num >= 0 && num < 10 ? "0" + num : num + "";
  }
  var now = new Date();
  var strDateTime = [
    [
      AddZero(now.getDate()),
      AddZero(now.getMonth() + 1),
      now.getFullYear(),
    ].join("/"),
    [AddZero(now.getHours()), AddZero(now.getMinutes())].join(":"),
    now.getHours() >= 12 ? "PM" : "AM",
  ].join(" ");
  return strDateTime;
}

function submitDiagnosis(element, index) {
  var table = document.getElementById("viewPatient");
  var patientAddress = table.rows[index].cells[1].innerHTML;

  console.log(patientAddress);

  var diagnosis = $("#ailmentsList" + patientAddress).val();
  diagnosis = parseInt(diagnosis);
  var diagnosed = ailmentsDict[diagnosis];
  var comments = document.getElementById("details").value;

  const updatedRecords = {
    ...patientRecord,
    records: [
      ...patientRecord?.records,
      {
        id: patientRecord?.records ? patientRecord.records.length + 1 : 1,
        diagnosedBy: docName,
        time: getDateTime(),
        diagnosis: diagnosed,
        comments,
        files: currentRecFiles,
      },
    ],
  };

  if (!isNaN(diagnosis)) {
    var buffer = Buffer(JSON.stringify(updatedRecords));

    ipfs.files.add(buffer, (error, result) => {
      if (error) {
        console.log(error);
      } else {
        ipfshash = result[0].hash;
        contractInstance.insurance_claim(
          patientAddress,
          diagnosis,
          ipfshash,
          { gas: 1000000 },
          function (error, result) {
            if (!error) {
              alert("Your diagnosis has been submitted.");
              // delete content row
              table.deleteRow(index + 1);

              // delete main row of corresponding content row
              table.deleteRow(index);
            } else {
              $(".alert-danger").show();
              console.log(error);
            }
          }
        );
      }
    });
  } else {
    alert("Select a diagnosis");
  }
}

function htmlEncode(value) {
  return $("<div/>").text(value).html();
}
//QR
$(function () {
  // Specify an onclick function
  // for the generate button
  $("#generateQR").click(function () {
    // Generate the link that would be
    // used to generate the QR Code
    // with the given data
    let finalURL =
      "https://chart.googleapis.com/chart?cht=qr&chl=" +
      htmlEncode(
        JSON.stringify({
          doctorKey: key,
          timestamp: Date.now(),
        })
      ) +
      "&chs=160x160&chld=L|0";

    // Replace the src of the image with
    // the QR code image
    $(".qr-code").attr("src", finalURL);
  });

  setTimeout(() => {
    $(".qr-code").attr("src", "");
  }, 15 * 1000);
});

function uploadFile() {
  const reader = new FileReader();

  reader.onloadend = function () {
    const buf = Buffer(reader.result); // Convert data into buffer
    ipfs.files.add(buf, (err, result) => {
      // Upload buffer to IPFS
      var modal = document.getElementById("fileModal");
      modal.style.display = "none";
      if (err) {
        console.error(err);
        return;
      }
      let url = `http://localhost:8080/ipfs/${result[0].hash}`;
      console.log(`Url --> ${url}`);
      document.getElementById("url").innerHTML = url;
      document.getElementById("url").href = url;
      currentRecFiles.push({
        url,
        hash: result[0].hash,
        type: $("#fileType").val(),
        name: $("#fileName").val(),
      });
      alert("File uploaded");
    });
  };
  const fileName = $("#fileName").val();
  if (!fileName) {
    return alert("File name cannot be empty");
  }

  const file = document.getElementById("file");
  if (!file.files[0]) {
    return alert("Select a file to upload");
  }
  $("#fileType").val(file.files[0].type);
  reader.readAsArrayBuffer(file.files[0]);
}

function showFileModal() {
  $("#fileName").val("");
  $("#fileType").val("");
  var modal = document.getElementById("fileModal");
  var span = document.getElementsByClassName("close")[0];
  modal.style.display = "block";
  span.onclick = function () {
    modal.style.display = "none";
  };
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
}

function main() {
  ipfs = window.IpfsApi("localhost", "5001");
  patientRecord = null;
  Buffer = window.IpfsApi().Buffer;

  ailmentsDict = {};
  ailmentsDict[0] = "Common Flu";
  ailmentsDict[1] = "Viral Infection";
  ailmentsDict[2] = "Cancer";
  ailmentsDict[3] = "Tumor";
  ailmentsDict[4] = "Covid-19";
  ailmentsDict[5] = "Heart-Disorder";
  ailmentsDict[6] = "Other";
  url_string = window.location.href;
  url = new URL(url_string);
  key;
  docName = "";

  toggleRecordsButton = 0;

  connect();
  $(".alert-danger").hide();

  key = web3.currentProvider.selectedAddress;
  key = key.toLocaleLowerCase();

  var a = 0;
  var b = 0;
  contractInstance.get_doctor.call(
    key,
    { gas: 1000000 },
    function (error, result) {
      if (!error) {
        a = result[0];
        b = result[1];
        docName = a;
        $("#name").html(a);
        $("#age").html(b.c[0]);
      } else console.error(error);
    }
  );
  var patientAddressList = 0;

  contractInstance.get_accessed_patientlist_for_doctor(
    key,
    { gas: 1000000 },
    function (error, result) {
      if (!error) {
        patientAddressList = result;
        console.log(result);

        patientAddressList.forEach(function (patientAddress, index) {
          contractInstance.get_patient.call(
            patientAddress,
            { gas: 1000000 },
            function (error, result) {
              var table = document.getElementById("viewPatient");
              if (!error) {
                [a, b] = result;
                console.log(a);

                var row = table.insertRow(index + 1);
                var cell1 = row.insertCell(0);
                var cell2 = row.insertCell(1);
                var cell3 = row.insertCell(2);
                cell2.className = "publicKeyPatient";
                cell1.innerHTML = a;
                cell2.innerHTML = patientAddress;
                cell3.innerHTML =
                  '<input class="btn btn-success" onclick="showRecords(this)" id="viewRecordsButton" type="button" value="View records"></input>';
              } else console.error(error);
            }
          );
        });
      } else console.error(error);
    }
  );

  // $(window).load();
}
window.addEventListener("load", async () => {
  connect();
  console.log("Externally Loaded!");
  main();
});
