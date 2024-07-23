import inq from "inquirer";
import fs, { rename } from "fs";
import path from "path";

const sleep = (time) => {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, time);
  });
};

let mainMenuQue = [
  {
    type: "list",
    name: "lisst",
    message: "select",
    choices: ["Rename single file", "Rename all files in a folder"],
  },
];
let renameFileQue = [
  {
    name: "filePath",
    message: "File Path",
  },
  {
    name: "newName",
    message: "New name",
  },
];
let renameBulkQue = [
  {
    name: "folderPath",
    message: "Folder Path",
  },
  {
    name: "newName",
    message: "New name",
  },
  {
    name: "newNameExe",
    message: "extension (with put period)",
  },
];

mainMenu(mainMenuQue);

function mainMenu(que) {
  inq.prompt(que).then((answers) => {
    checkAnswer(answers);
  });
}

async function askInput(que) {
  let x;
  await inq.prompt(que).then((answers) => {
    x = answers;
  });
  return x;
}

async function checkAnswer(answers) {
  if (answers.lisst === mainMenuQue[0].choices[0]) {
    let file = await askInput(renameFileQue);
    changeName(file);
  } else if (answers.lisst === mainMenuQue[0].choices[1]) {
    let folder = await askInput(renameBulkQue);
    renameAll(folder);
  }
}

async function changeName(answers) {
  if (fs.existsSync(answers.filePath)) {
    fs.renameSync(answers.filePath, answers.newName);
    mainMenu();
  } else {
    console.log("File doesnt exist");
    await sleep(2500);
    askInput(renameFileQue);
  }
}

async function renameAll(answers) {
  if (fs.existsSync(answers.folderPath)) {
    let filesArr = fs.readdirSync(answers.folderPath);
    filesArr.forEach((fileName, index) => {
      fs.renameSync(
        `${answers.folderPath}/${fileName}`,
        `${answers.folderPath}/${answers.newName}${index + 1}.${
          answers.newNameExe
        }`
      );
    });
    mainMenu(mainMenuQue);
  } else {
    console.log("folder doesnt exist");
    await sleep(2500);
    console.clear();
    mainMenu(mainMenuQue);
  }
}
