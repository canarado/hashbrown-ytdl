import { FileMode, QPushButton, QMainWindow, QWidget, QLabel, FlexLayout, QFileDialog, QLineEdit } from "@nodegui/nodegui";
import { ButtonRole, QMessageBox } from "@nodegui/nodegui/dist/lib/QtWidgets/QMessageBox";
import ytdl = require("ytdl-core");
import { createWriteStream } from "fs";

const win = new QMainWindow();
win.setWindowTitle("Hashbrown Time");
win.resize(600, 400);

// root
const rootView = new QWidget();
const rootLayout = new FlexLayout();
rootView.setObjectName("rootView");
rootView.setLayout(rootLayout);

// input area
const urlRow = new QWidget();
const urlLayout = new FlexLayout();
urlRow.setObjectName("urlRow");
urlRow.setLayout(urlLayout);

const urlLabel = new QLabel();
urlLabel.setObjectName("urlLabel")
urlLabel.setText("Youtube URL to download: ");

const urlInput = new QLineEdit();

// file dialog
const downloadButton = new QPushButton();
downloadButton.setText("Download Video");
downloadButton.setObjectName("downloadButton");

downloadButton.addEventListener("clicked", (c) => {
  let fileDialog = new QFileDialog();
  fileDialog.setFileMode(FileMode.AnyFile);

  let currentUrl = urlInput.text();
  if(currentUrl == "") {
    const messageBox = new QMessageBox();
    messageBox.setText("Please input a youtube url");
    const accept = new QPushButton();
    accept.setText("OK");
    messageBox.addButton(accept, ButtonRole.AcceptRole);
    messageBox.exec();
  } else {
    fileDialog.exec();

    const selectedFiles = fileDialog.selectedFiles();
    let writeStream = ytdl(currentUrl, {
      quality: 'highest',
      filter: 'videoandaudio'
    }).pipe(createWriteStream(`${selectedFiles[0]}.mp4`));

    const messageBox = new QMessageBox();
    messageBox.setText("Downloading video");
    messageBox.show();
    writeStream.on("finish", () => {
      messageBox.close();
      messageBox.delete();
      const downloadedBox = new QMessageBox();
      downloadedBox.setText("Video succesfully downloaded");
      const accept = new QPushButton();
      accept.setText("Yay!!");
      downloadedBox.addButton(accept, ButtonRole.AcceptRole);
      downloadedBox.exec();
    });


    urlInput.clear();
  }
});


// add shit to view
urlLayout.addWidget(urlLabel);
urlLayout.addWidget(urlInput);

rootLayout.addWidget(urlRow);
rootLayout.addWidget(downloadButton);

win.setCentralWidget(rootView);
win.show();

(global as any).win = win;

// import { QMainWindow, QWidget, QLabel, FlexLayout, QPushButton, QIcon } from '@nodegui/nodegui';
// import logo from '../assets/logox200.png';

// const win = new QMainWindow();
// win.setWindowTitle("Hello World");

// const centralWidget = new QWidget();
// centralWidget.setObjectName("myroot");
// const rootLayout = new FlexLayout();
// centralWidget.setLayout(rootLayout);

// const label = new QLabel();
// label.setObjectName("mylabel");
// label.setText("Hello");

// const button = new QPushButton();
// button.setIcon(new QIcon(logo));

// const label2 = new QLabel();
// label2.setText("World");
// label2.setInlineStyle(`
//   color: red;
// `);

// rootLayout.addWidget(label);
// rootLayout.addWidget(button);
// rootLayout.addWidget(label2);
// win.setCentralWidget(centralWidget);
// win.setStyleSheet(
//   `
//     #myroot {
//       background-color: #009688;
//       height: '100%';
//       align-items: 'center';
//       justify-content: 'center';
//     }
//     #mylabel {
//       font-size: 16px;
//       font-weight: bold;
//       padding: 1;
//     }
//   `
// );
// win.show();

// (global as any).win = win;
