function _updatePatientRecordUI() {
  if (!currentPatientAddress || !currentPatient) {
    return console.error("No current patient", currentPatient);
  }
  const patientRecord = currentPatient;
  const patientAddress = currentPatientAddress;
  content = `<div class="tab-content">
      <div id="view${patientAddress}">
              <div class="row">
                  <div class="col-sm-12">

                        <h3>Name: ${patientRecord.name}</h3>
                        <h3>Public Key: ${patientRecord.publicKey}</h3>

                        ${
                          patientRecord.records.length !== 0
                            ? patientRecord.records.reduce((acc, rec) => {
                                return (
                                  acc +
                                  `
                                    <div class="recordDiv" >
                            <h3>Diagnosed By : ${rec.diagnosedBy}</h3>
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
                              }, "")
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
                                      ${
                                        currentRecFiles.length !== 0
                                          ? `<h3>Files:

                                         ${currentRecFiles.map((file) => {
                                           return `<a target="_blank" href=${file.url} id="file-${file.name}-${file.hash}">${file.name}</a>`;
                                         })}
                                         </h3>
                                         `
                                          : ""
                                      }
                                      </div>
                              </div>
                          </div>
                          <div class="form-group col-sm-2">
                              <button class="btn btn-primary" onclick = "submitDiagnosis(this)">Submit</button>
  <button  class="btn btn-primary" onclick = "showFileModal()">Upload Doc</button>
                          </div>
                      </div>

                  </div>
              </div>
          </div>
      </div>`;

  // var row1 = table.insertRow(index + 1);
  // var cell1 = row1.insertCell(0);
  // cell1.colSpan = 3;

  // cell1.innerHTML = content;
  $("#patientRecords").html(content);
}
