/**
 * Created by kingser on 2016/9/6.
 */
// enable or disable a particular button
function enable(name, ok) {
    var button = document.getElementById(name);
    if (button) button.disabled = !ok;
}

// enable or disable all context-sensitive command buttons
function enableAll() {
    var cmdhnd = myDiagram.commandHandler;
    enable("Rename", myDiagram.selection.count > 0);
    enable("Undo", cmdhnd.canUndo());
    enable("Redo", cmdhnd.canRedo());
    enable("Cut", cmdhnd.canCutSelection());
    enable("Copy", cmdhnd.canCopySelection());
    enable("Paste", cmdhnd.canPasteSelection());
    enable("Delete", cmdhnd.canDeleteSelection());
    enable("SelectAll", cmdhnd.canSelectAll());
    enable("AlignLeft", cmdhnd.canAlignSelection());
    enable("AlignRight", cmdhnd.canAlignSelection());
    enable("AlignTop", cmdhnd.canAlignSelection());
    enable("AlignBottom", cmdhnd.canAlignSelection());
    enable("AlignCenterX", cmdhnd.canAlignSelection());
    enable("AlignCenterY", cmdhnd.canAlignSelection());
    enable("AlignRow", cmdhnd.canAlignSelection());
    enable("AlignColumn", cmdhnd.canAlignSelection());
    enable("AlignGrid", cmdhnd.canAlignSelection());
    enable("Rotate45", cmdhnd.canRotate(45));
    enable("Rotate_45", cmdhnd.canRotate(-45));
    enable("Rotate90", cmdhnd.canRotate(90));
    enable("Rotate_90", cmdhnd.canRotate(-90));
    enable("Rotate180", cmdhnd.canRotate(180));
}

// Commands for this application

// changes the item of the object
function rename(obj) {
    if (!obj) obj = myDiagram.selection.first();
    if (!obj) return;
    myDiagram.startTransaction("rename");
    var newName = prompt("Rename " + obj.part.data.item + " to:", obj.part.data.item);
    myDiagram.model.setDataProperty(obj.part.data, "item", newName);
    myDiagram.commitTransaction("rename");
}

// shows/hides gridlines
// to be implemented onclick of a button
function updateGridOption() {
    myDiagram.startTransaction("grid");
    var grid = document.getElementById("grid");
    myDiagram.grid.visible = (grid.checked === true);
    myDiagram.commitTransaction("grid");
}

// enables/disables guidelines when dragging
function updateGuidelinesOption() {
    // no transaction needed, because we are modifying a tool for future use
    var guide = document.getElementById("guidelines")
    if (guide.checked === true) {
        myDiagram.toolManager.draggingTool.isGuidelineEnabled = true;
    } else {
        myDiagram.toolManager.draggingTool.isGuidelineEnabled = false;
    }
}

// enables/disables snapping tools, to be implemented by buttons
function updateSnapOption() {
    // no transaction needed, because we are modifying tools for future use
    var snap = document.getElementById("snap");
    if (snap.checked === true) {
        myDiagram.toolManager.draggingTool.isGridSnapEnabled = true;
        myDiagram.toolManager.resizingTool.isGridSnapEnabled = true;
    } else {
        myDiagram.toolManager.draggingTool.isGridSnapEnabled = false;
        myDiagram.toolManager.resizingTool.isGridSnapEnabled = false;
    }
}

// user specifies the amount of space between nodes when making rows and column
function askSpace() {
    var space = prompt("Desired space between nodes (in pixels):", "0");
    return space;
}

// update arrowkey function
function arrowMode() {
    // no transaction needed, because we are modifying the CommandHandler for future use
    var move = document.getElementById("move");
    var select = document.getElementById("select");
    var scroll = document.getElementById("scroll");
    if (move.checked === true) {
        myDiagram.commandHandler.arrowKeyBehavior = "move";
    } else if (select.checked === true) {
        myDiagram.commandHandler.arrowKeyBehavior = "select";
    } else if (scroll.checked === true) {
        myDiagram.commandHandler.arrowKeyBehavior = "scroll";
    }
}


var UnsavedFileName = "(Unsaved File)";

function getCurrentFileName() {
    var currentFile = document.getElementById("currentFile");
    var name = currentFile.textContent;
    if (name[name.length-1] === "*") return name.substr(0, name.length-1);
    return name;
}

function setCurrentFileName(name) {
    var currentFile = document.getElementById("currentFile");
    if (myDiagram.isModified) {
        name += "*";
    }
    currentFile.textContent = name;
}

function newDocument() {
    // checks to see if all changes have been saved
    if (myDiagram.isModified) {
        var save = confirm("Would you like to save changes to " + getCurrentFileName() + "?");
        if (save) {
            saveDocument();
        }
    }
    setCurrentFileName(UnsavedFileName);
    // loads an empty diagram
    myDiagram.model = new go.GraphLinksModel();
    myDiagram.undoManager.isEnabled = true;
    //myDiagram.addModelChangedListener(function(e) {
    //    if (e.isTransactionFinished) enableAll();
    //});
    myDiagram.isModified = false;
}

function checkLocalStorage() {
    return (typeof (Storage) !== "undefined") && (window.localStorage !== undefined);
}

// saves the current floor plan to local storage
function saveDocument() {
    if (checkLocalStorage()) {
        var saveName = getCurrentFileName();
        if (saveName === UnsavedFileName) {
            saveDocumentAs();
        } else {
            saveDiagramProperties()
            window.localStorage.setItem(saveName, myDiagram.model.toJson());
            myDiagram.isModified = false;
        }
    }
}

// saves floor plan to local storage with a new name
function saveDocumentAs() {
    if (checkLocalStorage()) {
        var saveName = prompt("Save file as...", getCurrentFileName());
        if (saveName && saveName !== UnsavedFileName) {
            setCurrentFileName(saveName);
            saveDiagramProperties()
            window.localStorage.setItem(saveName, myDiagram.model.toJson());
            myDiagram.isModified = false;
        }
    }
}

// checks to see if all changes have been saved -> shows the open HTML element
function openDocument() {
    if (checkLocalStorage()) {
        if (myDiagram.isModified) {
            var save = confirm("Would you like to save changes to " + getCurrentFileName() + "?");
            if (save) {
                saveDocument();
            }
        }
        openElement("openDocument", "mySavedFiles");
    }
}

// shows the remove HTML element
function removeDocument() {
    if (checkLocalStorage()) {
        openElement("removeDocument", "mySavedFiles2");
    }
}

// these functions are called when panel buttons are clicked

function loadFile() {
    var listbox = document.getElementById("mySavedFiles");
    // get selected filename
    var fileName = undefined;
    for (var i = 0; i < listbox.options.length; i++) {
        if (listbox.options[i].selected) fileName = listbox.options[i].text; // selected file
    }
    if (fileName !== undefined) {
        // changes the text of "currentFile" to be the same as the floor plan now loaded
        setCurrentFileName(fileName);
        // actually load the model from the JSON format string
        var savedFile = window.localStorage.getItem(fileName);

        myDiagram.model = go.Model.fromJson(savedFile);
        loadDiagramProperties();
        myDiagram.undoManager.isEnabled = true;
        //myDiagram.addModelChangedListener(function(e) {
        //    if (e.isTransactionFinished) enableAll();
        //});
        myDiagram.isModified = false;
        // eventually loadDiagramProperties will be called to finish
        // restoring shared saved model/diagram properties
    }
    closeElement("openDocument");
}

// Store shared model state in the Model.modelData property
// (will be loaded by loadDiagramProperties)
function saveDiagramProperties() {
    myDiagram.model.modelData.position = go.Point.stringify(myDiagram.position);
}

// Called by loadFile.
function loadDiagramProperties(e) {
    // set Diagram.initialPosition, not Diagram.position, to handle initialization side-effects
    var pos = myDiagram.model.modelData.position;
    if (pos) myDiagram.initialPosition = go.Point.parse(pos);
}


// deletes the selected file from local storage
function removeFile() {
    var listbox = document.getElementById("mySavedFiles2");
    // get selected filename
    var fileName = undefined;
    for (var i = 0; i < listbox.options.length; i++) {
        if (listbox.options[i].selected) fileName = listbox.options[i].text; // selected file
    }
    if (fileName !== undefined) {
        // removes file from local storage
        window.localStorage.removeItem(fileName);
        // the current document remains open, even if its storage was deleted
    }
    closeElement("removeDocument");
}

function updateFileList(id) {
    // displays cached floor plan files in the listboxes
    var listbox = document.getElementById(id);
    // remove any old listing of files
    var last;
    while (last = listbox.lastChild) listbox.removeChild(last);
    // now add all saved files to the listbox
    for (key in window.localStorage) {
        var storedFile = window.localStorage.getItem(key);
        if (!storedFile) continue;
        var option = document.createElement("option");
        option.value = key;
        option.text = key;
        listbox.add(option, null)
    }
}

function openElement(id, listid) {
    var panel = document.getElementById(id);
    if (panel.style.visibility === "hidden") {
        updateFileList(listid);
        panel.style.visibility = "visible";
    }
}

// hides the open/remove elements when the "cancel" button is pressed
function closeElement(id) {
    var panel = document.getElementById(id);
    if (panel.style.visibility === "visible") {
        panel.style.visibility = "hidden";
    }
}
