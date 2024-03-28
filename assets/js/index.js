const screens = document.querySelectorAll(".screen");
const steps = document.querySelectorAll(".md-step");
const btnSubjectSave = document.getElementById("btnSubjectSave");
const txtSubjectName = document.getElementById("txtSubjectName");
const hfSubjectId = document.getElementById("hfSubjectId");
const btnSubjectClose = document.getElementById("btnSubjectClose");
const tblSubject = document.getElementById("tblSubject");
const tblSubjectBody = tblSubject.getElementsByTagName("tbody")[0];
const btnSubjectAdd = document.getElementById("btnSubjectAdd");
const searchSubject = document.getElementById("searchSubject");
var generateUUID = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};
let subjectData = [];
const DISPLAY_PROPS = {
  NONE: "none",
  BLOCK: "block",
};

const MODE = {
  Insert: 1,
  Edit: 2,
};
let pageMode;

const hideAllScreens = () => {
  Array.from(screens).forEach(
    (item) => (item.style.display = DISPLAY_PROPS.NONE)
  );
  Array.from(steps).forEach((step) => step.classList.remove("active"));
};

const addScreenChangeEventListener = () => {
  Array.from(steps).forEach((item) => {
    item.addEventListener("click", (e) => {
      let screenId = e.target
        .closest(".md-step")
        .querySelector(".md-step-circle span").textContent;
      changeScreen(screenId);
    });
  });
};

const tryConvertSubjectModel = () => {
  return {
    id: hfSubjectId.value == -1 ? generateUUID() : hfSubjectId.value,
    name: txtSubjectName.value,
  };
};

const clearSubjectField = () => {
  txtSubjectName.value = "";
  hfSubjectId.value = -1;
};

const checkDublicateSubject = (subject) => {
  return subjectData.filter((item) => item.name == subject.name).length > 0;
};

const insertSubject = (subject) => {
  if (checkDublicateSubject(subject)) {
    errorMessage("Subject", `${subject.name} is exist`);
  } else {
    successMessage("Subject", `${subject.name} added successfully`);
  }

  subjectData.push(subject);
};

const updateSubject = (subject) => {
  let updatedSubject = subjectData.find((item) => item.id == subject.id);

  if (updatedSubject) {
    updatedSubject.name = subject.name;
  }

  subjectData = subjectData.filter((s) => s.id != updatedSubject.id);
  console.log(subjectData);
  subjectData.push(updatedSubject);
};

const saveSubject = () => {
  let subject = tryConvertSubjectModel();
  if (subject.name.trim().length > 0) {
    if (pageMode == MODE.Insert) {
      insertSubject(subject);
    } else {
      updateSubject(subject);
    }
    clearSubjectField();
    btnSubjectClose.click();
    bindSubjectTable(subjectData);
  } else {
    warningMessage("Warning!", "Subject cannot be empty");
  }
};

const addSubjectsEventListener = () => {
  btnSubjectSave.addEventListener("click", saveSubject);
  document.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
      saveSubject();
    }
  });
  btnSubjectAdd.addEventListener("click", () => {
    pageMode = MODE.Insert;
  });
  searchSubject.addEventListener("input", searchSubjectAction);
};
const adddAllEventListeners = () => {
  addScreenChangeEventListener();
  addSubjectsEventListener();
};

const changeScreen = (screenId) => {
  hideAllScreens();

  const selectedScreen = document.getElementById(`screen-${screenId}`);
  if (!selectedScreen) {
    throw new Error("this screen is not exist");
  }
  selectedScreen.style.display = DISPLAY_PROPS.BLOCK;
  document.getElementById(`step-${screenId}`).classList.add("active");
};

const onload = () => {
  changeScreen("1");
  adddAllEventListeners();
  pageMode = MODE.Insert;
  hfSubjectId.value = -1;
  bindSubjectTable(subjectData);
};

var bindSubjectTable = function (datas) {
  tblSubjectBody.innerHTML = "";
  datas.forEach((data) => {
    let tr = createRowSubject(data);
    tblSubjectBody.appendChild(tr);
  });
  tblSubject.appendChild(tblSubjectBody);
};

var createRowSubject = function (data) {
  let tr = document.createElement("tr");
  let tdEdit = document.createElement("td");
  let tdRemove = document.createElement("td");

  let tdId = document.createElement("td");
  tdId.textContent = data.id;

  let tdName = document.createElement("td");
  tdName.textContent = data.name;

  let iconEdit = document.createElement("i");
  iconEdit.className = "fa-solid fa-edit text-warning";
  let iconRemove = document.createElement("i");
  iconRemove.className = "fa-solid fa-trash-alt text-warning";

  iconEdit.addEventListener("click", prepareSubjectUpdateAction);
  iconRemove.addEventListener("click", removeSubjectAction);

  iconEdit.setAttribute("data-row-id", data.id);

  iconRemove.setAttribute("data-row-id", data.id);
  iconEdit.setAttribute("data-bs-toggle", "modal");
  iconEdit.setAttribute("data-bs-target", "#subjectAddEditModal");
  tdEdit.appendChild(iconEdit);
  tdRemove.appendChild(iconRemove);

  tr.appendChild(tdEdit);
  tr.appendChild(tdRemove);
  tr.appendChild(tdId);
  tr.appendChild(tdName);
  return tr;
};
var removeSubjectAction = function (e) {
  let removeElementId = e.target.dataset.rowId;
  subjectData = subjectData.filter((item) => item.id != removeElementId);
  bindSubjectTable(subjectData);
};

var prepareSubjectUpdateAction = function (e) {
  const rowId = e.target.dataset.rowId;
  const subject = subjectData.find((item) => item.id == rowId);
  txtSubjectName.value = subject.name;
  hfSubjectId.value = rowId;
  pageMode = MODE.Edit;
};

const searchSubjectAction = (e) => {
  let searchResult = subjectData.filter((item) =>
    item.name.includes(e.target.value)
  );
  return bindSubjectTable(searchResult);
};
//sweat Alert message

var successMessage = function (title, message) {
  swal(title, message, "success");
};
var errorMessage = function (title, message) {
  swal(title, message, "error");
};
var warningMessage = function (title, message) {
  swal(title, message, "warning");
};
document.addEventListener("DOMContentLoaded", onload);
