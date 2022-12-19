var web3;
const agentContractAddress = contractAddress;

var ipfs;
let patientRecord = null;
let Buffer;

const TAB_KEY = "TAB_KEY";
const quickActionsTab = "quickActionsTab";
const addPatientTab = "addPatientTab";
const profileTab = "profileTab";
const viewHistoryTab = "viewHistoryTab";
const viewPatientRecordTab = "viewPatientRecordTab";

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
const quillToolbarOptions = [
  // [{ size: ["huge", "large", false, "small"] }], // custom dropdown
  [{ header: [1, 2, 3, false] }],
  ["bold", "italic", "underline"], // toggled buttons

  [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: "ordered" }, { list: "bullet" }],
  [{ indent: "-1" }, { indent: "+1" }], // outdent/indent

  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ align: [] }],
];

let currentRecFiles = [];
let currentPatient = null;
let currentPatientAddress = null;
// let recordsSearchObj = [];
let doctor = null;
let searchText = "";
let quill;
function clearCurrentPatient() {
  currentRecFiles = [];
  currentPatient = null;
  currentPatientAddress = null;
  // recordsSearchObj = [];
  searchText = "";
  changeTab(quickActionsTab);
}

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

function submitDiagnosis() {
  // var table = document.getElementById("viewPatient");
  const patientAddress = currentPatientAddress;
  console.log(patientAddress);

  // const diagnosis = parseInt($("#ailmentsList" + patientAddress).val());
  // var diagnosed = ailmentsDict[diagnosis];
  const comment = JSON.stringify(quill.getContents());
  const rawText = quill.getText();
  console.log({
    comment,
    rawText,
  });
  // var comments = document.getElementById("details").value;
  const updatedRecords = {
    ...patientRecord,
    records: [
      ...patientRecord?.records,
      {
        id: patientRecord?.records ? patientRecord.records.length + 1 : 1,
        diagnosedBy: docName,
        time: getDateTime(),
        diagnosis: "",
        comment,
        rawText,
        files: currentRecFiles,
      },
    ],
  };

  console.table(updatedRecords.records);
  if (true) {
    //!
    var buffer = Buffer(JSON.stringify(updatedRecords));

    ipfs.files.add(buffer, (error, result) => {
      if (error) {
        console.log(error);
      } else {
        ipfshash = result[0].hash;
        contractInstance.insurance_claim(
          patientAddress,
          0,
          ipfshash,
          { gas: 1000000 },
          function (error, result) {
            if (!error) {
              alert("Your diagnosis has been submitted.");
              clearCurrentPatient();
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

function setUpQR() {
  console.log("here", $("#generateQR").html());
  $("#generateQR").click(function () {
    $("#generateQR").text("Generating");
    let finalURL =
      "https://chart.googleapis.com/chart?cht=qr&chl=" +
      htmlEncode(
        JSON.stringify({
          doctorKey: key,
          timestamp: Date.now(),
        })
      ) +
      "&chs=160x160&chld=L|0";

    $(".qr-code").attr("src", finalURL);
    $("#generateQR").text("Generate");
  });

  setTimeout(() => {
    $(".qr-code").attr("src", "");
  }, 15 * 1000);
}
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
      // console.log(`Url --> ${url}`);
      // document.getElementById("url").innerHTML = url;
      // document.getElementById("url").href = url;
      currentRecFiles.push({
        url,
        hash: result[0].hash,
        type: $("#fileType").val(),
        name: $("#fileName").val(),
      });
      updatePatientRecordUI();
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

function fetchCurrentPatientRecords() {
  console.log(10);
  var patientAddressList = 0;
  return new Promise((resolve, reject) => {
    contractInstance.get_accessed_patientlist_for_doctor(
      key,
      { gas: 1000000 },
      function (error, result) {
        if (!error) {
          patientAddressList = result;

          if (patientAddressList.length > 0) {
            const patientAddress =
              patientAddressList[patientAddressList.length - 1];
            currentPatientAddress = patientAddress;

            contractInstance.get_hash(
              patientAddress,
              { gas: 1000000 },
              function (error, result) {
                if (!error) {
                  $.get(
                    "http://localhost:8080/ipfs/" + result,
                    function (data) {
                      console.log({ data, hash: result });

                      patientRecord = data;
                      console.log({ patientRecord });
                      if (!patientRecord) {
                        console.error("No patientRecord");
                        reject(null);
                        return;
                      }
                      currentPatient = patientRecord;
                      // recordsSearchObj = currentPatient.records.map(
                      //   (acc, rec) => [...acc , {
                      //   text:  rec.rawText,
                      //   id: rec.id}],
                      //   []
                      // );

                      resolve(patientRecord);
                    }
                  ).error((err) => {
                    console.log(err);
                    reject(null);
                  });
                } else {
                  reject(null);
                  console.log(error);
                }
              }
            );
          } else {
            resolve();
          }
        } else {
          console.error(error);
          reject(error);
        }
      }
    );
  });
}

function updatePatientRecordUI() {
  if (!currentPatientAddress || !currentPatient) {
    return console.error("No current patient", currentPatient);
  }

  $("#p_name").text(currentPatient.name);
  $("#p_addr").text(currentPatient.publicKey);
  $("#p_age").text(currentPatient.age);
  $("#p_img").attr("src", currentPatient.profilePic);

  const fields = [
    "gender",
    "bloodType",
    "phone",
    "email",
    "height",
    "weight",
    "dob",
  ];
  const data = fields.reduce((acc, field) => {
    return (
      acc +
      `
    <h1>
    ${
      field === "bloodType"
        ? "Blood Type"
        : field[0].toUpperCase() + field.substring(1)
    } :
    <span id="p_${field}" class="font-normal">${patientRecord[field]}</span>
  </h1>
    `
    );
  }, "");
  $("#patientInfo").append(data);

  $("#current-files").html(
    `
${
  currentRecFiles.length === 0
    ? `<h1 class="italic mx-2" >No files added </h1>`
    : `
${currentRecFiles.reduce(
  (acc, file) =>
    acc +
    ` <div class="flex ">
<h1 class="mr-5">${file.name}:</h1>
<a target="_blank" href=${file.url} id="file-${file.name}-${file.hash}"><i class="fa-solid fa-link"></i></a>
</div>`,
  ""
)}
`
}
`
  );
  const records = currentPatient.records.filter((rec) =>
    rec.rawText.toLowerCase().includes(searchText.toLowerCase())
  );
  $("#reports").html(
    `
  ${records.reduce((acc, rec) => {
    return (
      acc +
      `
      <div class="my-2 rounded-xl p-10 gap-5 flex flex-col text-3xl border-[1px] border-black">
            <div class="gap-5 flex flex-col">
              <h1><span class="font-bold">Doctor Name :</span> ${
                rec.diagnosedBy
              }</h1>
              <h1><span class="font-bold">Time :</span> ${rec.time}</h1>
            </div>
            <div>
              <h1 class="my-5 font-bold text-3xl">Details :</h1>
              <div id="details">
                <div id="editor-${rec.id}"></div>
              </div>
              <!-- Table -->
           <!--   <div class="">
                <h1 class="my-5 font-bold text-3xl">Medications :</h1>

                <div class="flex flex-col">
                  <div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div class="py-2 inline-block min-w-full sm:px-6 lg:px-8">
                      <div class="overflow-hidden">
                        <table class="min-w-full border text-center">
                          <thead class="border-b">
                            <tr>
                              <th
                                scope="col"
                                class="font-medium text-gray-900 px-6 py-4 border-r"
                              >
                                #
                              </th>
                              <th
                                scope="col"
                                class="font-medium text-gray-900 px-6 py-4 border-r"
                              >
                                Name
                              </th>
                              <th
                                scope="col"
                                class="font-medium text-gray-900 px-6 py-4 border-r"
                              >
                                Dose
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr class="border-b">
                              <td
                                class="px-6 py-4 whitespace-nowrap font-medium text-gray-900 border-r"
                              >
                                1
                              </td>
                              <td
                                class="text-gray-900 font-light px-6 py-4 whitespace-nowrap border-r"
                              >
                                Crocin
                              </td>
                              <td
                                class="text-gray-900 font-light px-6 py-4 whitespace-nowrap border-r"
                              >
                                twice a day
                              </td>
                            </tr>
                            <tr class="border-b">
                              <td
                                class="px-6 py-4 whitespace-nowrap font-medium text-gray-900 border-r"
                              >
                                1
                              </td>
                              <td
                                class="text-gray-900 font-light px-6 py-4 whitespace-nowrap border-r"
                              >
                                Crocin
                              </td>
                              <td
                                class="text-gray-900 font-light px-6 py-4 whitespace-nowrap border-r"
                              >
                                twice a day
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              -->
           ${
             rec.files.length === 0
               ? ""
               : `   <div id="files-section" class="w-2/3 flex gap-2 my-2">
            <div>
              <h1 class="font-bold text-3xl">Files:</h1>
            </div>
            <div id="files" class="flex flex-col gap-2 px-4">
            ${rec.files.reduce(
              (acc, file) =>
                acc +
                ` <div class="flex ">
            <h1 class="mr-5">${file.name}:</h1>
            <a target="_blank" href=${file.url} id="file-${file.name}-${file.hash}"><i class="fa-solid fa-link"></i></a>
            </div>`,
              ""
            )}
            </div>`
           }
            </div>
            </div>
          </div>
      `
    );
  }, "")}
  
  `
  );

  records.forEach((rec) => {
    const reportQuill = new Quill(`#editor-${rec.id}`, {
      modules: {
        toolbar: null,
      },
      readOnly: true,
      theme: "snow",
      bounds: document.getElementById("details"),
      placeholder: "Write report here...",
    });
    reportQuill.setContents(JSON.parse(rec.comment));
  });
}

function updateViewRecordsBtn() {
  if (!currentPatientAddress || !currentPatient) {
    return;
  }
  $("#viewRecords").html(`
  
    <h3>Name: ${patientRecord.name}</h3> 
    <h3>Public Key: ${patientRecord.publicKey}</h3> 
  
    <button class="btn btn-primary" onClick="changeTab(viewPatientRecordTab)" > 
    View Records
    </button> 
    `);
}

function updateProfileUI() {
  if (!doctor) {
    return console.error("No doctor found", null);
  }
  $("#profile").html(`
    <div>
      <h1>
      Name : ${doctor.name}
      </h1>
      <h1>
      Address : ${doctor.address}
      </h1>

    </div>
  `);
}
function updateQuickActions() {
  console.log(currentPatient);
  console.log(doctor);
  // $("#quickActionDoctorContainer").html(``);
  $("#d_name").html(doctor.name);
  $("#d_img").attr("src", doctor.profilePic);

  // $("#quickActionPatientContainer").html(`

  // <h1 class="font-bold text-8xl py-10">Patient</h1>
  // <div class="flex gap-3 justify-between">
  //   <div class="flex gap-3">
  //     <img
  //       class="rounded-full w-[150px] h-[150px]"
  //       src="/public/test80.jpg"
  //     />
  //     <div class="p-10 gap-5 flex flex-col text-3xl">
  //       <div class="max-w-[200px] gap-5 flex flex-col">
  //         <h1><span class="font-bold">Name :</span> ${currentPatient.name}</h1>
  //         <h1><span class="font-bold">Age : </span> ${currentPatient.age}</h1>
  //         <button
  //         onclick="changeTab(viewPatientRecordTab)"
  //           class="bg-primrary p-4 text-3xl rounded-full text-white text-center"
  //         >
  //           View records

  //           <i class="fa-solid fa-arrow-right"></i>
  //         </button>
  //       </div>
  //     </div>
  //   </div>
  // </div>

  // `);

  //   $("#quickActions").append(`
  //   <button     onclick="changeTab(viewPatientRecordTab)" class="btn h-20 m-5 text-3xl bg-green-400 text-white">
  //   View Current Patient : ${currentPatient.name}
  // </button>
  //   `);
}

const init = {
  addPatient: function () {
    setUpQR();
    updateViewRecordsBtn();
  },
  quickActions: function () {
    $("#back").css("display", "none");
    updateQuickActions();
    if (currentPatient) {
    }
  },

  viewPatientRecords: function () {
    if (!currentPatient) {
      changeTab(quickActionsTab);
    }
    updatePatientRecordUI();
    quill = new Quill("#editor", {
      modules: {
        toolbar: quillToolbarOptions,
      },
      theme: "snow",
      bounds: document.getElementById("details"),
      placeholder: "Write report here...",
    });
    document.getElementById("searchDiv").addEventListener("input", (e) => {
      //!
      console.log(e.target.value);
      searchText = e.target.value;
      updatePatientRecordUI();
    });
  },
  profile: function () {
    updateProfileUI();
  },
};

function changeTab(tab) {
  console.log(tab);
  localStorage.setItem(TAB_KEY, tab);
  if (tab == addPatientTab) {
    $("#container").load("/components/doctor/addPatient.html", init.addPatient);
  }
  if (tab == viewPatientRecordTab) {
    $("#container").load(
      "/components/doctor/viewPatientRecords.html",
      init.viewPatientRecords
    );
  }
  if (tab == profileTab) {
    $("#container").load("/components/doctor/profile.html", init.profile);
  }
  if (tab == quickActionsTab) {
    $("#container").load(
      "/components/doctor/quickActions.html",
      init.quickActions
    );
  } else {
    $("#back").css("display", "block");
  }
}

async function main() {
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
        doctor = {
          name: a,
          address: key,
        };

        // $("#name").html(a);
        // $("#age").html(b.c[0]);
      } else console.error(error);
    }
  );

  //Routing
  // $("#container").load(
  //   "/components/doctor/quickActions.html",
  //   init.quickActions
  // );
  const tab = localStorage.getItem(TAB_KEY);
  if (!tab) changeTab(quickActionsTab);
  else changeTab(tab);
  const currentPatient = await fetchCurrentPatientRecords();
  if (currentPatient) {
    // updatePatientRecordUI();
    updateQuickActions();
  }
}

window.addEventListener("load", async () => {
  // connect();
  // console.log("Externally Loaded!");
  main();
});
