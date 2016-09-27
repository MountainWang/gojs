/**
 * Created by kingser on 2016/8/30.
 */
var $AJ = go.GraphObject.make;  // for more concise visual tree definitions
var myDiagram,myPalette;


/*
*  Copyright (C) 1998-2016 by Northwoods Software Corporation. All Rights Reserved.
*/

/**
* @constructor
* @extends CommandHandler
* @class 
* This CommandHandler class allows the user to position selected Parts in a diagram
* relative to the first part selected, in addition to overriding the doKeyDown method
* of the CommandHandler for handling the arrow keys in additional manners.
* <p>
* Typical usage:
* <pre>
*   $(go.Diagram, "myDiagramDiv",
*     {
*       commandHandler: $(DrawCommandHandler),
*       . . .
*     }
*   )
* </pre>
* or:
* <pre>
*    myDiagram.commandHandler = new DrawCommandHandler();
* </pre>*/
function DrawCommandHandler() {
  go.CommandHandler.call(this);
  this._arrowKeyBehavior = "move";
  this._pasteOffset = new go.Point(10, 10);
  this._lastPasteOffset = new go.Point(0, 0);
}
go.Diagram.inherit(DrawCommandHandler, go.CommandHandler);

/**
* This controls whether or not the user can invoke the {@link #alignLeft}, {@link #alignRight}, 
* {@link #alignTop}, {@link #alignBottom}, {@link #alignCenterX}, {@link #alignCenterY} commands.
* @this {DrawCommandHandler}
* @return {boolean}
* This returns true:
* if the diagram is not {@link Diagram#isReadOnly},
* if the model is not {@link Model#isReadOnly}, and
* if there are at least two selected {@link Part}s.
*/
DrawCommandHandler.prototype.canAlignSelection = function() {
  var diagram = this.diagram;
  if (diagram === null || diagram.isReadOnly || diagram.isModelReadOnly) return false;
  if (diagram.selection.count < 2) return false;
  return true;
};

/**
* Aligns selected parts along the left-most edge of the left-most part.
* @this {DrawCommandHandler}
*/
DrawCommandHandler.prototype.alignLeft = function() {
  var diagram = this.diagram;
  diagram.startTransaction("aligning left");
  var minPosition = Infinity;
  diagram.selection.each(function(current) {
    if (current instanceof go.Link) return; // skips over go.Link
    minPosition = Math.min(current.position.x, minPosition);
  });
  diagram.selection.each(function(current) {
    if (current instanceof go.Link) return; // skips over go.Link
    current.move(new go.Point(minPosition, current.position.y));
  });
  diagram.commitTransaction("aligning left");
};

/**
* Aligns selected parts at the right-most edge of the right-most part.
* @this {DrawCommandHandler}
*/
DrawCommandHandler.prototype.alignRight = function() {
  var diagram = this.diagram;
  diagram.startTransaction("aligning right");
  var maxPosition = -Infinity;
  diagram.selection.each(function(current) {
    if (current instanceof go.Link) return; // skips over go.Link
    var rightSideLoc = current.actualBounds.x + current.actualBounds.width;
    maxPosition = Math.max(rightSideLoc, maxPosition);
  });
  diagram.selection.each(function(current) {
    if (current instanceof go.Link) return; // skips over go.Link
    current.move(new go.Point(maxPosition - current.actualBounds.width, current.position.y));
  });
  diagram.commitTransaction("aligning right");
};

/**
* Aligns selected parts at the top-most edge of the top-most part.
* @this {DrawCommandHandler}
*/
DrawCommandHandler.prototype.alignTop = function() {
  var diagram = this.diagram;
  diagram.startTransaction("alignTop");
  var minPosition = Infinity;
  diagram.selection.each(function(current) {
    if (current instanceof go.Link) return; // skips over go.Link
    minPosition = Math.min(current.position.y, minPosition);
  });
  diagram.selection.each(function(current) {
    if (current instanceof go.Link) return; // skips over go.Link
    current.move(new go.Point(current.position.x, minPosition));
  });
  diagram.commitTransaction("alignTop");
};

/**
* Aligns selected parts at the bottom-most edge of the bottom-most part.
* @this {DrawCommandHandler}
*/
DrawCommandHandler.prototype.alignBottom = function() {
  var diagram = this.diagram;
  diagram.startTransaction("aligning bottom");
  var maxPosition = -Infinity;
  diagram.selection.each(function(current) {
    if (current instanceof go.Link) return; // skips over go.Link
    var bottomSideLoc = current.actualBounds.y + current.actualBounds.height;
    maxPosition = Math.max(bottomSideLoc, maxPosition);
  });
  diagram.selection.each(function(current) {
    if (current instanceof go.Link) return; // skips over go.Link
    current.move(new go.Point(current.actualBounds.x, maxPosition - current.actualBounds.height));
  });
  diagram.commitTransaction("aligning bottom");
};

/**
* Aligns selected parts at the x-value of the center point of the first selected part. 
* @this {DrawCommandHandler}
*/
DrawCommandHandler.prototype.alignCenterX = function() {
  var diagram = this.diagram;
  var firstSelection = diagram.selection.first();
  if (!firstSelection) return;
  diagram.startTransaction("aligning Center X");
  var centerX = firstSelection.actualBounds.x + firstSelection.actualBounds.width / 2;
  diagram.selection.each(function(current) {
    if (current instanceof go.Link) return; // skips over go.Link
    current.move(new go.Point(centerX - current.actualBounds.width / 2, current.actualBounds.y));
  });
  diagram.commitTransaction("aligning Center X");
};


/**
* Aligns selected parts at the y-value of the center point of the first selected part. 
* @this {DrawCommandHandler}
*/
DrawCommandHandler.prototype.alignCenterY = function() {
  var diagram = this.diagram;
  var firstSelection = diagram.selection.first();
  if (!firstSelection) return;
  diagram.startTransaction("aligning Center Y");
  var centerY = firstSelection.actualBounds.y + firstSelection.actualBounds.height / 2;
  diagram.selection.each(function(current) {
    if (current instanceof go.Link) return; // skips over go.Link
    current.move(new go.Point(current.actualBounds.x, centerY - current.actualBounds.height / 2));
  });
  diagram.commitTransaction("aligning Center Y");
};


/**
* Aligns selected parts top-to-bottom in order of the order selected.
* Distance between parts can be specified. Default distance is 0.
* @this {DrawCommandHandler}
* @param {number} distance 
*/
DrawCommandHandler.prototype.alignColumn = function(distance) {
  var diagram = this.diagram;
  diagram.startTransaction("align Column");
  if (distance === undefined) distance = 0; // for aligning edge to edge
  distance = parseFloat(distance);
  var selectedParts = new Array();
  diagram.selection.each(function(current) {
    if (current instanceof go.Link) return; // skips over go.Link
    selectedParts.push(current);
  });
  for (var i = 0; i < selectedParts.length - 1; i++) {
    var current = selectedParts[i];
    // adds distance specified between parts
    var curBottomSideLoc = current.actualBounds.y + current.actualBounds.height + distance;
    var next = selectedParts[i + 1];
    next.move(new go.Point(current.actualBounds.x, curBottomSideLoc));
  }
  diagram.commitTransaction("align Column");
};

/**
* Aligns selected parts left-to-right in order of the order selected.
* Distance between parts can be specified. Default distance is 0.
* @this {DrawCommandHandler}
* @param {number} distance 
*/
DrawCommandHandler.prototype.alignRow = function(distance) {
  if (distance === undefined) distance = 0; // for aligning edge to edge
  distance = parseFloat(distance);
  var diagram = this.diagram;
  diagram.startTransaction("align Row");
  var selectedParts = new Array();
  diagram.selection.each(function(current) {
    if (current instanceof go.Link) return; // skips over go.Link
    selectedParts.push(current);
  });
  for (var i = 0; i < selectedParts.length - 1; i++) {
    var current = selectedParts[i];
    // adds distance specified between parts
    var curRightSideLoc = current.actualBounds.x + current.actualBounds.width + distance;
    var next = selectedParts[i + 1];
    next.move(new go.Point(curRightSideLoc, current.actualBounds.y));
  }
  diagram.commitTransaction("align Row");
};


/**
* This controls whether or not the user can invoke the {@link #rotate} command.
* @this {DrawCommandHandler}
* @param {number=} angle the positive (clockwise) or negative (counter-clockwise) change in the rotation angle of each Part, in degrees.
* @return {boolean}
* This returns true:
* if the diagram is not {@link Diagram#isReadOnly},
* if the model is not {@link Model#isReadOnly}, and
* if there is at least one selected {@link Part}.
*/
DrawCommandHandler.prototype.canRotate = function(number) {
  var diagram = this.diagram;
  if (diagram === null || diagram.isReadOnly || diagram.isModelReadOnly) return false;
  if (diagram.selection.count < 1) return false;
  return true;
};

/**
* Change the angle of the parts connected with the given part. This is in the command handler
* so it can be easily accessed for the purpose of creating commands that change the rotation of a part. 
* @this {DrawCommandHandler}
* @param {number=} angle the positive (clockwise) or negative (counter-clockwise) change in the rotation angle of each Part, in degrees.
*/
DrawCommandHandler.prototype.rotate = function(angle) {
  if (angle === undefined) angle = 90;
  var diagram = this.diagram;
  diagram.startTransaction("rotate " + angle.toString());
  var diagram = this.diagram;
  diagram.selection.each(function(current) {
    if (current instanceof go.Link || current instanceof go.Group) return; // skips over Links and Groups
    current.angle += angle;
  });
  diagram.commitTransaction("rotate " + angle.toString());
};


/**
* This implements custom behaviors for arrow key keyboard events.
* Set {@link #arrowKeyBehavior} to "select", "move" (the default), "scroll" (the standard behavior), or "none"
* to affect the behavior when the user types an arrow key.
* @this {DrawCommandHandler}*/
DrawCommandHandler.prototype.doKeyDown = function() {
  var diagram = this.diagram;
  if (diagram === null) return;
  var e = diagram.lastInput;

  // determines the function of the arrow keys
  if (e.key === "Up" || e.key === "Down" || e.key === "Left" || e.key === "Right") {
    var behavior = this.arrowKeyBehavior;
    if (behavior === "none") {
      // no-op
      return;
    } else if (behavior === "select") {
      this._arrowKeySelect();
      return;
    } else if (behavior === "move") {
      this._arrowKeyMove();
      return;
    }
    // otherwise drop through to get the default scrolling behavior
  }

  // otherwise still does all standard commands
  go.CommandHandler.prototype.doKeyDown.call(this);
};

/**
* Collects in an Array all of the non-Link Parts currently in the Diagram.
* @this {DrawCommandHandler}
* @return {Array}
*/
DrawCommandHandler.prototype._getAllParts = function() {
  var allParts = new Array();
  this.diagram.nodes.each(function(node) { allParts.push(node); });
  this.diagram.parts.each(function(part) { allParts.push(part); });
  // note that this ignores Links
  return allParts;
};

/**
* To be called when arrow keys should move the Diagram.selection.
* @this {DrawCommandHandler}
*/
DrawCommandHandler.prototype._arrowKeyMove = function() {
  var diagram = this.diagram;
  var e = diagram.lastInput;
  // moves all selected parts in the specified direction
  var vdistance = 0;
  var hdistance = 0;
  // if control is being held down, move pixel by pixel. Else, moves by grid cell size    
  if (e.control || e.meta) {
    vdistance = 1;
    hdistance = 1;
  } else if (diagram.grid !== null) {
    var cellsize = diagram.grid.gridCellSize;
    hdistance = cellsize.width;
    vdistance = cellsize.height;
  }
  diagram.startTransaction("arrowKeyMove");
  diagram.selection.each(function(part) {
    if (e.key === "Up") {
      part.move(new go.Point(part.actualBounds.x, part.actualBounds.y - vdistance));
    } else if (e.key === "Down") {
      part.move(new go.Point(part.actualBounds.x, part.actualBounds.y + vdistance));
    } else if (e.key === "Left") {
      part.move(new go.Point(part.actualBounds.x - hdistance, part.actualBounds.y));
    } else if (e.key === "Right") {
      part.move(new go.Point(part.actualBounds.x + hdistance, part.actualBounds.y));
    }
  });
  diagram.commitTransaction("arrowKeyMove");
};

/**
* To be called when arrow keys should change selection.
* @this {DrawCommandHandler}
*/
DrawCommandHandler.prototype._arrowKeySelect = function() {
  var diagram = this.diagram;
  var e = diagram.lastInput;
  // with a part selected, arrow keys change the selection
  // arrow keys + shift selects the additional part in the specified direction
  // arrow keys + control toggles the selection of the additional part
  var nextPart = null;
  if (e.key === "Up") {
    nextPart = this._findNearestPartTowards(270);
  } else if (e.key === "Down") {
    nextPart = this._findNearestPartTowards(90);
  } else if (e.key === "Left") {
    nextPart = this._findNearestPartTowards(180);
  } else if (e.key === "Right") {
    nextPart = this._findNearestPartTowards(0);
  }
  if (nextPart !== null) {
    if (e.shift) {
      nextPart.isSelected = true;
    } else if (e.control || e.meta) {
      nextPart.isSelected = !nextPart.isSelected;
    } else {
      diagram.select(nextPart);
    }
  }
};

/**
* Finds the nearest Part in the specified direction, based on their center points.
* if it doesn't find anything, it just returns the current Part.
* @this {DrawCommandHandler}
* @param {number} dir the direction, in degrees
* @return {Part} the closest Part found in the given direction
*/
DrawCommandHandler.prototype._findNearestPartTowards = function(dir) {
  var originalPart = this.diagram.selection.first();
  if (originalPart === null) return null;
  var originalPoint = originalPart.actualBounds.center;
  var allParts = this._getAllParts();
  var closestDistance = Infinity;
  var closest = originalPart;  // if no parts meet the criteria, the same part remains selected

  for (var i = 0; i < allParts.length; i++) {
    var nextPart = allParts[i];
    if (nextPart === originalPart) continue;  // skips over currently selected part
    var nextPoint = nextPart.actualBounds.center;
    var angle = originalPoint.directionPoint(nextPoint);
    var anglediff = this._angleCloseness(angle, dir);
    if (anglediff <= 45) {  // if this part's center is within the desired direction's sector,
      var distance = originalPoint.distanceSquaredPoint(nextPoint);
      distance *= 1+Math.sin(anglediff*Math.PI/180);  // the more different from the intended angle, the further it is
      if (distance < closestDistance) {  // and if it's closer than any other part,
        closestDistance = distance;      // remember it as a better choice
        closest = nextPart;
      }
    }
  }
  return closest;
};

/**
* @this {DrawCommandHandler}
* @param {number} a
* @param {number} dir
* @return {number}
*/
DrawCommandHandler.prototype._angleCloseness = function(a, dir) {
  return Math.min(Math.abs(dir - a), Math.min(Math.abs(dir + 360 - a), Math.abs(dir - 360 - a)));
};

/**
* Reset the last offset for pasting.
* @override
* @this {DrawCommandHandler}
* @param {Iterable.<Part>} coll a collection of {@link Part}s.
*/
DrawCommandHandler.prototype.copyToClipboard = function(coll) {
  go.CommandHandler.prototype.copyToClipboard.call(this, coll);
  this._lastPasteOffset.set(this.pasteOffset);
};

/**
* Paste from the clipboard with an offset incremented on each paste, and reset when copied.
* @override
* @this {DrawCommandHandler}
* @return {Set.<Part>} a collection of newly pasted {@link Part}s
*/
DrawCommandHandler.prototype.pasteFromClipboard = function() {
  var coll = go.CommandHandler.prototype.pasteFromClipboard.call(this);
  this.diagram.moveParts(coll, this._lastPasteOffset);
  this._lastPasteOffset.add(this.pasteOffset);
  return coll;
};

/**
* Gets or sets the arrow key behavior. Possible values are "move", "select", and "scroll".  
* The default value is "move".
* @name DrawCommandHandler#arrowKeyBehavior
* @function.
* @return {string}
*/
Object.defineProperty(DrawCommandHandler.prototype, "arrowKeyBehavior", {
  get: function() { return this._arrowKeyBehavior; },
  set: function(val) {
    if (val !== "move" && val !== "select" && val !== "scroll" && val !== "none") {
      throw new Error("DrawCommandHandler.arrowKeyBehavior must be either \"move\", \"select\", \"scroll\", or \"none\", not: " + val);
    }
    this._arrowKeyBehavior = val;
  }
});

/**
* Gets or sets the offset at which each repeated pasteSelection() puts the new copied parts from the clipboard.
* @name DrawCommandHandler#pasteOffset
* @function.
* @return {Point}
*/
Object.defineProperty(DrawCommandHandler.prototype, "pasteOffset", {
  get: function() { return this._pasteOffset; },
  set: function(val) {
    if (!(val instanceof go.Point)) throw new Error("DrawCommandHandler.pasteOffset must be a Point, not: " + val);
    this._pasteOffset.set(val);
  }
});

/*
*  Copyright (C) 1998-2016 by Northwoods Software Corporation. All Rights Reserved.
*/

/**
* @constructor
* @extends RotatingTool
* @class
* A custom tool for rotating multiple objects at a time. When more than one
* part is selected, rotates all parts, revolving them about their collective center.
* If the control key is held down during rotation, rotates all parts individually.
*/
function RotateMultipleTool() {
  go.RotatingTool.call(this);
  this.name = "RotateMultiple";
  // holds references to all selected non-Link Parts and their offset & angles
  this.initialInfo = null;
  // initial angle when rotating as a whole
  this.initialAngle = 0;
  // rotation point of selection
  this.centerPoint = null;
 }
go.Diagram.inherit(RotateMultipleTool, go.RotatingTool);

/**
* Calls RotatingTool.doActivate, and then remembers the center point of the collection,
* and the initial distances and angles of selected parts to the center.
* @this {RotateMultipleTool}
*/
RotateMultipleTool.prototype.doActivate = function() {
  go.RotatingTool.prototype.doActivate.call(this);
  var diagram = this.diagram;
  // center point of the collection
  this.centerPoint = diagram.computePartsBounds(diagram.selection).center;

  // remember the angle relative to the center point when rotating the whole collection
  this.initialAngle = this.centerPoint.directionPoint(diagram.lastInput.documentPoint);

  // remember initial angle and distance for each Part
  var infos = new go.Map(go.Part, PartInfo);
  var tool = this;
  diagram.selection.each(function(part) {
    if (part instanceof go.Link || part instanceof go.Group) return;  // only Nodes and simple Parts
    // distance from centerPoint to locationSpot of part
    var dist = Math.sqrt(tool.centerPoint.distanceSquaredPoint(part.location));
    // calculate initial relative angle
    var dir = tool.centerPoint.directionPoint(part.location);
    // saves part-angle combination in array
    infos.add(part, new PartInfo(dir, dist, part.rotateObject.angle));
  });
  this.initialInfo = infos;
}

/**
* @ignore
* Internal class that remembers a Part's offset & angle.
*/
function PartInfo(placementAngle, distance, rotationAngle) {
  this.placementAngle = placementAngle * (Math.PI / 180);  // in radians
  this.distance = distance;
  this.rotationAngle = rotationAngle;  // in degrees
}

/**
* Clean up any references to Parts.
* @this {RotateMultipleTool}
*/
RotateMultipleTool.prototype.doDeactivate = function() {
  this.initialInfo = null;
  go.RotatingTool.prototype.doDeactivate.call(this);
};

/**
* Overrides rotatingTool.rotate to rotate all selected objects about their collective center.
* When the control key is held down while rotating, all selected objects are rotated individually.
* @this {RotateMultipleTool}
* @param {number} newangle
*/
RotateMultipleTool.prototype.rotate = function(newangle) {
  var diagram = this.diagram;
  var e = diagram.lastInput;
  // when rotating individual parts, remember the original angle difference
  var angleDiff = newangle - this.adornedObject.part.rotateObject.angle;
  var tool = this;
  diagram.selection.each(function(part) {
    if (part instanceof go.Link || part instanceof go.Group) return; // only Nodes and simple Parts
    // rotate every selected non-Link Part
    // find information about the part set in RotateMultipleTool.initialInformation
    var partInfo = tool.initialInfo.getValue(part);
    if (e.control || e.meta) {
      if (tool.adornedObject.part === part) {
        part.rotateObject.angle = newangle;
      } else {
        part.rotateObject.angle += angleDiff;
      }
    } else {
      var radAngle = newangle * (Math.PI / 180); // converts the angle traveled from degrees to radians
      // calculate the part's x-y location relative to the central rotation point
      var offsetX = partInfo.distance * Math.cos(radAngle + partInfo.placementAngle);
      var offsetY = partInfo.distance * Math.sin(radAngle + partInfo.placementAngle);
      // move part
      part.location = new go.Point(tool.centerPoint.x + offsetX, tool.centerPoint.y + offsetY);
      // rotate part
      part.rotateObject.angle = partInfo.rotationAngle + newangle;
    }
  });
}

/**
* This override needs to calculate the desired angle with different rotation points,
* depending on whether we are rotating the whole selection as one, or Parts individually.
* @this {RotateMultipleTool}
* @param {Point} newPoint in document coordinates
*/
RotateMultipleTool.prototype.computeRotate = function(newPoint) {
  var diagram = this.diagram;
  var angle;
  var e = diagram.lastInput;
  if (e.control || e.meta) {  // relative to the center of the Node whose handle we are rotating
    var part = this.adornedObject.part;
    var rotationPoint = part.getDocumentPoint(part.locationSpot);
    angle = rotationPoint.directionPoint(newPoint);
  } else {  // relative to the center of the whole selection
    angle = this.centerPoint.directionPoint(newPoint) - this.initialAngle;
  }
  if (angle >= 360) angle -= 360;
  else if (angle < 0) angle += 360;
  var interval = Math.min(Math.abs(this.snapAngleMultiple), 180);
  var epsilon = Math.min(Math.abs(this.snapAngleEpsilon), interval / 2);
  // if it's close to a multiple of INTERVAL degrees, make it exactly so
  if (!diagram.lastInput.shift && interval > 0 && epsilon > 0) {
    if (angle % interval < epsilon) {
      angle = Math.floor(angle / interval) * interval;
    } else if (angle % interval > interval - epsilon) {
      angle = (Math.floor(angle / interval) + 1) * interval;
    }
    if (angle >= 360) angle -= 360;
    else if (angle < 0) angle += 360;
  }
  return angle;
};

/*
*  Copyright (C) 1998-2016 by Northwoods Software Corporation. All Rights Reserved.
*/

/**
* @constructor
* @extends ResizingTool
* @class 
* A custom tool for resizing multiple objects at once.
*/
function ResizeMultipleTool() {
  go.ResizingTool.call(this);
  this.name = "ResizeMultiple";
}
go.Diagram.inherit(ResizeMultipleTool, go.ResizingTool);

/**
* Overrides ResizingTool.resize to resize all selected objects to the same size.
* @this {ResizeMultipleTool}
* @param {Rect} newr the intended new rectangular bounds for each Part's {@link Part#resizeObject}.
*/
ResizeMultipleTool.prototype.resize = function(newr) {
  var diagram = this.diagram;
  if (diagram === null) return;
  diagram.selection.each(function(part) {
    if (part instanceof go.Link || part instanceof go.Group) return; // only Nodes and simple Parts
    var obj = part.resizeObject;

    // calculate new location
    var pos = part.position.copy();
    var angle = obj.getDocumentAngle();
    var sc = obj.getDocumentScale();

    var radAngle = Math.PI * angle / 180;
    var angleCos = Math.cos(radAngle);
    var angleSin = Math.sin(radAngle);

    var deltaWidth = newr.width - obj.naturalBounds.width;
    var deltaHeight = newr.height - obj.naturalBounds.height;

    var angleRight = (angle > 270 || angle < 90) ? 1 : 0;
    var angleBottom = (angle > 0 && angle < 180) ? 1 : 0;
    var angleLeft = (angle > 90 && angle < 270) ? 1 : 0;
    var angleTop = (angle > 180 && angle < 360) ? 1 : 0;

    pos.x += sc * ((newr.x + deltaWidth * angleLeft) * angleCos - (newr.y + deltaHeight * angleBottom) * angleSin);
    pos.y += sc * ((newr.x + deltaWidth * angleTop) * angleSin + (newr.y + deltaHeight * angleLeft) * angleCos);

    obj.desiredSize = newr.size;
    part.position = pos;
  });
}

/*
*  Copyright (C) 1998-2016 by Northwoods Software Corporation. All Rights Reserved.
*/

/**
* @constructor
* @extends DraggingTool
* @class
* This draggingTool class makes guidelines visible as the parts are dragged around a diagram
* when the selected part is nearly aligned with another part.
*/
function GuidedDraggingTool() {
  go.DraggingTool.call(this);

  // temporary parts for horizonal guidelines
  var $ = go.GraphObject.make;
  var partProperties = { layerName: "Tool", isInDocumentBounds: false };
  var shapeProperties = { stroke: "gray", isGeometryPositioned: true };
  /** @ignore */
  this.guidelineHtop =
      $(go.Part, partProperties,
          $(go.Shape, shapeProperties, { geometryString: "M0 0 100 0" }));
  /** @ignore */
  this.guidelineHbottom =
      $(go.Part, partProperties,
          $(go.Shape, shapeProperties, { geometryString: "M0 0 100 0" }));
  /** @ignore */
  this.guidelineHcenter =
      $(go.Part, partProperties,
          $(go.Shape, shapeProperties, { geometryString: "M0 0 100 0" }));
  // temporary parts for vertical guidelines
  /** @ignore */
  this.guidelineVleft =
      $(go.Part, partProperties,
          $(go.Shape, shapeProperties, { geometryString: "M0 0 0 100" }));
  /** @ignore */
  this.guidelineVright =
      $(go.Part, partProperties,
          $(go.Shape, shapeProperties, { geometryString: "M0 0 0 100" }));
  /** @ignore */
  this.guidelineVcenter =
      $(go.Part, partProperties,
          $(go.Shape, shapeProperties, { geometryString: "M0 0 0 100" }));

  // properties that the programmer can modify
  /** @type {number} */
  this._guidelineSnapDistance = 6;
  /** @type {boolean} */
  this._isGuidelineEnabled = true;
  /** @type {string} */
  this._horizontalGuidelineColor = "gray";
  /** @type {string} */
  this._verticalGuidelineColor = "gray";
  /** @type {string} */
  this._centerGuidelineColor = "gray";
  /** @type {number} */
  this._guidelineWidth = 1;
  /** @type {number} */
  this._searchDistance = 1000;
  /** @type {boolean} */
  this._isGuidelineSnapEnabled = true;
}
go.Diagram.inherit(GuidedDraggingTool, go.DraggingTool);

/**
* Removes all of the guidelines from the grid.
* @this {GuidedDraggingTool}
*/
GuidedDraggingTool.prototype.clearGuidelines = function() {
  this.diagram.remove(this.guidelineHbottom);
  this.diagram.remove(this.guidelineHcenter);
  this.diagram.remove(this.guidelineHtop);
  this.diagram.remove(this.guidelineVleft);
  this.diagram.remove(this.guidelineVright);
  this.diagram.remove(this.guidelineVcenter);
}

/**
* Calls the base method from {@link DraggingTool#doDeactivate}
* and removes the guidelines from the graph.
* @this {GuidedDraggingTool}
*/
GuidedDraggingTool.prototype.doDeactivate = function() {
  go.DraggingTool.prototype.doDeactivate.call(this);
  // clear any guidelines when dragging is done
  this.clearGuidelines();
};

GuidedDraggingTool.prototype.doDragOver = function(pt, obj) {
  // clear all existing guidelines in case either show... method decides to show a guideline
  this.clearGuidelines();

  // gets the selected part
  var partItr = (this.copiedParts || this.draggedParts).iterator;
  partItr.next();
  var part = partItr.key;

  this.showHorizontalMatches(part, this.isGuidelineEnabled, false);
  this.showVerticalMatches(part, this.isGuidelineEnabled, false);
}

/**
* On a mouse-up, snaps the selected part to the nearest guideline.
* If no guidelines are showing, the part remains at its position.
* This calls {@link #guidelineSnap}.
* @this {GuidedDraggingTool}
*/
GuidedDraggingTool.prototype.doDropOnto = function(pt, obj) {
  // gets the selected (perhaps copied) Part
  var partItr = (this.copiedParts || this.draggedParts).iterator;
  partItr.next();
  var part = partItr.key;

  // snaps only when the mouse is released without shift modifier
  var e = this.diagram.lastInput;
  var snap = this.isGuidelineSnapEnabled && !e.shift;

  this.showHorizontalMatches(part, this.isGuidelineEnabled, snap);
  this.showVerticalMatches(part, this.isGuidelineEnabled, snap);
}

/**
* This finds parts that are aligned near the selected part along horizontal lines. It compares the selected
* part to all parts within a rectangle approximately twice the {@link #searchDistance} wide.
* The guidelines appear when a part is aligned within a margin-of-error equal to {@link #guidelineSnapDistance}.
* The parameters used for {@link #guidelineSnap} are also set here.
* @this {GuidedDraggingTool}
* @param {Part} part
* @param {boolean} guideline if true, show guideline
* @param {boolean} snap if true, snap the part to where the guideline would be
*/
GuidedDraggingTool.prototype.showHorizontalMatches = function(part, guideline, snap) {
  var partBounds = part.actualBounds;
  var p0 = partBounds.y;
  var p1 = partBounds.y + partBounds.height/2;
  var p2 = partBounds.y + partBounds.height;

  var marginOfError = this.guidelineSnapDistance;
  var distance = this.searchDistance;
  // compares with parts within narrow vertical area
  var area = partBounds.copy();
  area.inflate(distance, marginOfError + 1);
  var otherParts = this.diagram.findObjectsIn(area,
      function(obj) { return obj.part; },
      function(part) { return part instanceof go.Part && !(part instanceof go.Link) && part.isTopLevel && !part.layer.isTemporary; },
      true);

  var bestDiff = marginOfError;
  var bestPart = null;
  var bestSpot;
  var bestOtherSpot;
  // horizontal line -- comparing y-values
  otherParts.each(function(other) {
    if (other === part) return; // ignore itself

    var otherBounds = other.actualBounds;
    var q0 = otherBounds.y;
    var q1 = otherBounds.y + otherBounds.height/2;
    var q2 = otherBounds.y + otherBounds.height;

    // compare center with center of OTHER part
    if (Math.abs(p1 - q1) < bestDiff) { bestDiff = Math.abs(p1 - q1); bestPart = other; bestSpot = go.Spot.Center; bestOtherSpot = go.Spot.Center; }

    // compare top side with top and bottom sides of OTHER part
    if (Math.abs(p0-q0) < bestDiff) { bestDiff = Math.abs(p0-q0); bestPart = other; bestSpot = go.Spot.Top; bestOtherSpot = go.Spot.Top; }
    else if (Math.abs(p0-q2) < bestDiff) { bestDiff = Math.abs(p0-q2); bestPart = other; bestSpot = go.Spot.Top; bestOtherSpot = go.Spot.Bottom; }

    // compare bottom side with top and bottom sides of OTHER part
    if (Math.abs(p2-q0) < bestDiff) { bestDiff = Math.abs(p2-q0); bestPart = other; bestSpot = go.Spot.Bottom; bestOtherSpot = go.Spot.Top; }
    else if (Math.abs(p2-q2) < bestDiff) { bestDiff = Math.abs(p2-q2); bestPart = other; bestSpot = go.Spot.Bottom; bestOtherSpot = go.Spot.Bottom; }
  });

  if (bestPart !== null) {
    var bestBounds = bestPart.actualBounds;
    // line extends from x0 to x2
    var x0 = Math.min(partBounds.x, bestBounds.x) - 10;
    var x2 = Math.max(partBounds.x + partBounds.width, bestBounds.x + bestBounds.width) + 10;
    // find bestPart's desired Y
    var bestPoint = new go.Point().setRectSpot(bestBounds, bestOtherSpot);
    if (bestSpot === go.Spot.Center) {
      if (snap) {
        // call Part.move in order to automatically move member Parts of Groups
        part.move(new go.Point(partBounds.x, bestPoint.y - partBounds.height / 2));
      }
      if (guideline) {
        this.guidelineHcenter.position = new go.Point(x0, bestPoint.y);
        this.guidelineHcenter.elt(0).width = x2 - x0;
        this.diagram.add(this.guidelineHcenter);
      }
    } else if (bestSpot === go.Spot.Top) {
      if (snap) {
        part.move(new go.Point(partBounds.x, bestPoint.y));
      }
      if (guideline) {
        this.guidelineHtop.position = new go.Point(x0, bestPoint.y);
        this.guidelineHtop.elt(0).width = x2 - x0;
        this.diagram.add(this.guidelineHtop);
      }
    } else if (bestSpot === go.Spot.Bottom) {
      if (snap) {
        part.move(new go.Point(partBounds.x, bestPoint.y - partBounds.height));
      }
      if (guideline) {
        this.guidelineHbottom.position = new go.Point(x0, bestPoint.y);
        this.guidelineHbottom.elt(0).width = x2 - x0;
        this.diagram.add(this.guidelineHbottom);
      }
    }
  }
}

/**
* This finds parts that are aligned near the selected part along vertical lines. It compares the selected
* part to all parts within a rectangle approximately twice the {@link #searchDistance} tall.
* The guidelines appear when a part is aligned within a margin-of-error equal to {@link #guidelineSnapDistance}.
* The parameters used for {@link #guidelineSnap} are also set here.
* @this {GuidedDraggingTool}
* @param {Part} part
* @param {boolean} guideline if true, show guideline
* @param {boolean} snap if true, don't show guidelines but just snap the part to where the guideline would be
*/
GuidedDraggingTool.prototype.showVerticalMatches = function(part, guideline, snap) {
  var partBounds = part.actualBounds;
  var p0 = partBounds.x;
  var p1 = partBounds.x + partBounds.width/2;
  var p2 = partBounds.x + partBounds.width;

  var marginOfError = this.guidelineSnapDistance;
  var distance = this.searchDistance;
  // compares with parts within narrow vertical area
  var area = partBounds.copy();
  area.inflate(marginOfError + 1, distance);
  var otherParts = this.diagram.findObjectsIn(area,
      function(obj) { return obj.part; },
      function(part) { return part instanceof go.Part && !(part instanceof go.Link) && part.isTopLevel && !part.layer.isTemporary; },
      true);

  var bestDiff = marginOfError;
  var bestPart = null;
  var bestSpot;
  var bestOtherSpot;
  // vertical line -- comparing x-values
  otherParts.each(function(other) {
    if (other === part) return; // ignore itself

    var otherBounds = other.actualBounds;
    var q0 = otherBounds.x;
    var q1 = otherBounds.x + otherBounds.width/2;
    var q2 = otherBounds.x + otherBounds.width;

    // compare center with center of OTHER part
    if (Math.abs(p1 - q1) < bestDiff) { bestDiff = Math.abs(p1 - q1); bestPart = other; bestSpot = go.Spot.Center; bestOtherSpot = go.Spot.Center; }

    // compare left side with left and right sides of OTHER part
    if (Math.abs(p0-q0) < bestDiff) { bestDiff = Math.abs(p0-q0); bestPart = other; bestSpot = go.Spot.Left; bestOtherSpot = go.Spot.Left; }
    else if (Math.abs(p0-q2) < bestDiff) { bestDiff = Math.abs(p0-q2); bestPart = other; bestSpot = go.Spot.Left; bestOtherSpot = go.Spot.Right; }

    // compare right side with left and right sides of OTHER part
    if (Math.abs(p2-q0) < bestDiff) { bestDiff = Math.abs(p2-q0); bestPart = other; bestSpot = go.Spot.Right; bestOtherSpot = go.Spot.Left; }
    else if (Math.abs(p2-q2) < bestDiff) { bestDiff = Math.abs(p2-q2); bestPart = other; bestSpot = go.Spot.Right; bestOtherSpot = go.Spot.Right; }
  });

  if (bestPart !== null) {
    var bestBounds = bestPart.actualBounds;
    // line extends from y0 to y2
    var y0 = Math.min(partBounds.y, bestBounds.y) - 10;
    var y2 = Math.max(partBounds.y + partBounds.height, bestBounds.y + bestBounds.height) + 10;
    // find bestPart's desired X
    var bestPoint = new go.Point().setRectSpot(bestBounds, bestOtherSpot);
    if (bestSpot === go.Spot.Center) {
      if (snap) {
        // call Part.move in order to automatically move member Parts of Groups
        part.move(new go.Point(bestPoint.x - partBounds.width / 2, partBounds.y));
      }
      if (guideline) {
        this.guidelineVcenter.position = new go.Point(bestPoint.x, y0);
        this.guidelineVcenter.elt(0).height = y2 - y0;
        this.diagram.add(this.guidelineVcenter);
      }
    } else if (bestSpot === go.Spot.Left) {
      if (snap) {
        part.move(new go.Point(bestPoint.x, partBounds.y));
      }
      if (guideline) {
        this.guidelineVleft.position = new go.Point(bestPoint.x, y0);
        this.guidelineVleft.elt(0).height = y2 - y0;
        this.diagram.add(this.guidelineVleft);
      }
    } else if (bestSpot === go.Spot.Right) {
      if (snap) {
        part.move(new go.Point(bestPoint.x - partBounds.width, partBounds.y));
      }
      if (guideline) {
        this.guidelineVright.position = new go.Point(bestPoint.x, y0);
        this.guidelineVright.elt(0).height = y2 - y0;
        this.diagram.add(this.guidelineVright);
      }
    }
  }
}

/**
* Gets or sets the margin of error for which guidelines show up.
* The default value is 6.
* Guidelines will show up when the aligned nods are ± 6px away from perfect alignment.
* @name GuidedDraggingTool#guidelineSnapDistance
* @function.
* @return {number}
*/
Object.defineProperty(GuidedDraggingTool.prototype, "guidelineSnapDistance", {
    get: function() { return this._guidelineSnapDistance; },
    set: function(val) {
        if (typeof val !== "number" || isNaN(val) || val < 0) throw new Error("new value for GuidedDraggingTool.guidelineSnapDistance must be a non-negative number.");
        if (this._guidelineSnapDistance !== val) {
          this._guidelineSnapDistance = val;
        }
    }
});

/**
* Gets or sets whether the guidelines are enabled or disable.
* The default value is true.
* @name GuidedDraggingTool#isGuidelineEnabled
* @function.
* @return {boolean}
*/
Object.defineProperty(GuidedDraggingTool.prototype, "isGuidelineEnabled", {
    get: function() { return this._isGuidelineEnabled; },
    set: function(val) {
        if (typeof val !== "boolean") throw new Error("new value for GuidedDraggingTool.isGuidelineEnabled must be a boolean value.");
        if (this._isGuidelineEnabled !== val) {
          this._isGuidelineEnabled = val;
        }
    }
});

/**
* Gets or sets the color of horizontal guidelines.
* The default value is "gray".
* @name GuidedDraggingTool#horizontalGuidelineColor
* @function.
* @return {string}
*/
Object.defineProperty(GuidedDraggingTool.prototype, "horizontalGuidelineColor", {
    get: function() { return this._horizontalGuidelineColor; },
    set: function(val) {
        if (this._horizontalGuidelineColor !== val) {
          this._horizontalGuidelineColor = val;
          this.guidelineHbottom.elements.first().stroke = this._horizontalGuidelineColor;
          this.guidelineHtop.elements.first().stroke = this._horizontalGuidelineColor;
        }
    }
});

/**
* Gets or sets the color of vertical guidelines.
* The default value is "gray".
* @name GuidedDraggingTool#verticalGuidelineColor
* @function.
* @return {string}
*/
Object.defineProperty(GuidedDraggingTool.prototype, "verticalGuidelineColor", {
    get: function() { return this._verticalGuidelineColor; },
    set: function(val) {
        if (this._verticalGuidelineColor !== val) {
          this._verticalGuidelineColor = val;
          this.guidelineVleft.elements.first().stroke = this._verticalGuidelineColor;
          this.guidelineVright.elements.first().stroke = this._verticalGuidelineColor;
        }
    }
});

/**
* Gets or sets the color of center guidelines.
* The default value is "gray".
* @name GuidedDraggingTool#centerGuidelineColor
* @function.
* @return {string}
*/
Object.defineProperty(GuidedDraggingTool.prototype, "centerGuidelineColor", {
    get: function() { return this._centerGuidelineColor; },
    set: function(val) {
        if (this._centerGuidelineColor !== val) {
          this._centerGuidelineColor = val;
          this.guidelineVcenter.elements.first().stroke = this._centerGuidelineColor;
          this.guidelineHcenter.elements.first().stroke = this._centerGuidelineColor;
        }
    }
});

/**
* Gets or sets the width guidelines.
* The default value is 1.
* @name GuidedDraggingTool#guidelineWidth
* @function.
* @return {number}
*/
Object.defineProperty(GuidedDraggingTool.prototype, "guidelineWidth", {
    get: function() { return this._guidelineWidth; },
    set: function(val) {
        if (typeof val !== "number" || isNaN(val) || val < 0) throw new Error("New value for GuidedDraggingTool.guidelineWidth must be a non-negative number.");
        if (this._guidelineWidth !== val) {
          this._guidelineWidth = val;
          this.guidelineVcenter.elements.first().strokeWidth = val;
          this.guidelineHcenter.elements.first().strokeWidth = val;
          this.guidelineVleft.elements.first().strokeWidth = val;
          this.guidelineVright.elements.first().strokeWidth = val;
          this.guidelineHbottom.elements.first().strokeWidth = val;
          this.guidelineHtop.elements.first().strokeWidth = val;
        }
    }
});
/**
* Gets or sets the distance around the selected part to search for aligned parts.
* The default value is 1000.
* Set this to Infinity if you want to search the entire diagram no matter how far away.
* @name GuidedDraggingTool#searchDistance
* @function.
* @return {number}
*/
Object.defineProperty(GuidedDraggingTool.prototype, "searchDistance", {
    get: function() { return this._searchDistance; },
    set: function(val) {
        if (typeof val !== "number" || isNaN(val) || val <= 0) throw new Error("new value for GuidedDraggingTool.searchDistance must be a positive number.");
        if (this._searchDistance !== val) {
          this._searchDistance = val;
        }
    }
});

/**
* Gets or sets whether snapping to guidelines is enabled.
* The default value is true.
* @name GuidedDraggingTool#isGuidelineSnapEnabled
* @function.
* @return {Boolean}
*/
Object.defineProperty(GuidedDraggingTool.prototype, "isGuidelineSnapEnabled", {
    get: function() { return this._isGuidelineSnapEnabled; },
    set: function(val) {
        if (typeof val !== "boolean") throw new Error("new value for GuidedDraggingTool.isGuidelineSnapEnabled must be a boolean.");
        if (this._isGuidelineSnapEnabled !== val) {
          this._isGuidelineSnapEnabled = val;
        }
    }
});

/**
 * Created by kingser on 2016/9/6.
 */

function PrefixInteger(num, n) {
    return (Array(n).join(0) + num).slice(-n);
}
// Change the angle of the parts connected with the given node
function rotate(node, angle) {
    var tool = myDiagram.toolManager.draggingTool;  // should be a SnappingTool
    myDiagram.startTransaction("rotate " + angle.toString());
    var sel = new go.Set(go.Node);
    sel.add(node);
    var coll = tool.computeEffectiveCollection(sel).toKeySet();
    var bounds = myDiagram.computePartsBounds(coll);
    var center = bounds.center;
    coll.each(function(n) {
        n.angle += angle;
        n.location = n.location.copy().subtract(center).rotate(angle).add(center);
    });
    myDiagram.commitTransaction("rotate " + angle.toString());
}

function chkjo(num){
    //return num?num%2?"奇数":"偶数":"0"
    return num?num%2?"s":"d":"0"
}
/*
判断是否选择整bay 返回整bay
 */
function getBay(){

    Array.prototype.contains = function(item){
        return RegExp(item).test(this);
    };
    var narr = new Array();
    var akey = new Array();
    var cntrs = new Array();
    var row = 0;
    myDiagram.selection.each(function(part) {
        var cat = part.data.category
        if (cat == "yardShape"){
            var key = part.data.key;
            if (row == 0) row = myDiagram.findNodeForKey(part.data.group).data.row;
            akey.push(key);
                var grp = key.substring(2,4);
                if (!narr.contains(grp)) {
                    narr.push(grp);
                }
        }else if(cat == "cntr"){
            cntrs.push(part.data);
        }
    })
    var rarr = new Array();
    narr.forEach(function(i){
        var nrow = 0;
        akey.forEach(function(j){
            if (i== j.substring(2,4)){
                nrow ++;
            }
        })
        if(row == nrow){
            rarr.push(i);
        }
    })

var ret = {
    bayno : rarr,
    cntr:cntrs
}
    //console.log(rarr);
return ret;
}

/**
 * Created by kingser on 2016/9/6.
 */

// Change the angle of the parts connected with the given node
function rotate(node, angle) {
    var tool = myDiagram.toolManager.draggingTool;  // should be a SnappingTool
    myDiagram.startTransaction("rotate " + angle.toString());
    var sel = new go.Set(go.Node);
    sel.add(node);
    var coll = tool.computeEffectiveCollection(sel).toKeySet();
    var bounds = myDiagram.computePartsBounds(coll);
    var center = bounds.center;
    coll.each(function(n) {
        n.angle += angle;
        n.location = n.location.copy().subtract(center).rotate(angle).add(center);
    });
    myDiagram.commitTransaction("rotate " + angle.toString());
}


/*
判断是否选择整bay 返回整bay
 */
function getBay(){

    Array.prototype.contains = function(item){
        return RegExp(item).test(this);
    };
    var narr = new Array();
    var akey = new Array();
    var cntrs = new Array();
    var row = 0;
    myDiagram.selection.each(function(part) {
        var cat = part.data.category
        if (cat == "yardShape"){
            var key = part.data.key;
            if (row == 0) row = myDiagram.findNodeForKey(part.data.group).data.row;
            akey.push(key);
                var grp = key.substring(2,4);
                if (!narr.contains(grp)) {
                    narr.push(grp);
                }
        }else if(cat == "cntr"){
            cntrs.push(part.data);
        }
    })
    var rarr = new Array();
    narr.forEach(function(i){
        var nrow = 0;
        akey.forEach(function(j){
            if (i== j.substring(2,4)){
                nrow ++;
            }
        })
        if(row == nrow){
            rarr.push(i);
        }
    })

var ret = {
    bayno : rarr,
    cntr:cntrs
}
    //console.log(rarr);
return ret;
}
//删除影子箱位
function deleteShadowCntr(e) {
    //var node = e.subject.first();
    e.subject.each(function(n) {
        var nod = myDiagram.findNodeForKey(n.data.key+"s");
        //console.log(n.data);
        myDiagram.remove(nod);
    });
};

//影子箱位的控制
function toLocation(data, node) {
    return new go.Point(data.x, data.y);
};
function fromLocation(loc, data) {
    data.x = loc.x;
    data.y = loc.y;
    var nod =  myDiagram.findNodeForKey(data.key+"s");
    nod.position=new go.Point(data.x,data.y-264);
};

/**
 * Created by kingser on 2016/9/6.
 * 放置Layer，可以对图元层进行显示隐藏操作
 */
var yardlay = $AJ(go.Layer, { name: "yard" });
var cntrlay = $AJ(go.Layer, { name: "cntr" });
//var forelayer = myDiagram.findLayer("Foreground");
//myDiagram.addLayerBefore($AJ(go.Layer, { name: "yard" }), forelayer);
//myDiagram.addLayerBefore($AJ(go.Layer, { name: "cntr" }), forelayer);

/**
 * Created by kingser on 2016/8/30.
 * 放置所有的数据对象
 */
   function createObj(){}
//堆场加载
   createObj.prototype.yard = function(ops){
       var yardDataArray = [];
       yardDataArray.push( { key: ops.name,  isGroup: true,layerName:"yard",zOrder:1,category:"yardGroup",row:ops.row,bay:ops.bay,tile:ops.tile});
       yardDataArray.push( { text: ops.text, layerName:"yard",zOrder:1,category:"yardTitle",loc:"0 -10",group:ops.name});

       for (var row= 1;row<=ops.row;row++){
           var txr = {};
           txr.text=PrefixInteger(row,2);
           if (ops.rowSeq=='D') txr.text=PrefixInteger(ops.row-row,2);
           txr.loc = -20 + " " + (10*row+2);
           txr.category = "yardText";
           txr.group = ops.name;
           yardDataArray.push(txr);

           for (var bay= 0;bay<ops.bay;bay++){
               var xy = {};
               var bayno = PrefixInteger(2*bay+1,2);
               if (ops.baySeq=='R') bayno = PrefixInteger( 2*(ops.bay -bay-1)+1,2);
               xy.key = ops.name+bayno+ txr.text;
               xy.loc = bay*20 + " " + 10*row;
               xy.category = "yardShape";
               xy.group = ops.name;
               xy.zOrder = 1;
               yardDataArray.push(xy);
               if (row==1){
                   var txr = {};
                   txr.text=bayno;
                   txr.loc = 20*bay + " " + 0;
                   txr.category = "yardText";
                   txr.group = ops.name;
                   yardDataArray.push(txr);
               }
           }
       }
       myDiagram.model.addNodeDataCollection(yardDataArray);
   }
//堆场箱加载
createObj.prototype.cntr = function(ops){
    var cntr={};
    cntr.key = ops.key;
    //var keylen = ops.key.length;
    //-----
    var bayno = eval(ops.key.substring(2,4));
    var loc;
   //d--double  四十尺箱
    if (chkjo(bayno)=='d'){
        var last = myDiagram.findNodeForKey(ops.key.substring(0,2)+PrefixInteger(bayno + 1,2)+ops.key.substring(4,6));
        var front = myDiagram.findNodeForKey(ops.key.substring(0,2)+PrefixInteger(bayno - 1,2)+ops.key.substring(4,6));
        var lx  = (go.Point.parse(front.data.loc).x + go.Point.parse(last.data.loc).x) / 2;
        var ly  = (go.Point.parse(front.data.loc).y + go.Point.parse(last.data.loc).y) / 2;
        loc = go.Point.stringify(new go.Point(lx,ly));
    }else
        loc = myDiagram.findNodeForKey(ops.key).data.loc;

    //-----
    cntr.loc = loc;
    cntr.category = "cntr";
    cntr.item = ops.key;
    cntr.layer = "cntr";
    cntr.zOrder = ops.key.substring(4,6);
    cntr.angle = myDiagram.findNodeForKey(ops.key.substring(0,2)).data.angle;
    cntr.width = ops.width;
    myDiagram.model.addNodeData(cntr);
}

//贝位
createObj.prototype.bay = function(ops){
    var bayDataArray = [];
    //{"key":1, "text":"01", "isGroup":true, "category":"bayTpGp"},---贝
    var bay = {key:ops.bayno,text:ops.bayno,isGroup:true,category:"bayTpGp"};
    bayDataArray.push(bay);
    // {"key":3, "text":"1", "isGroup":true, "category":"rowTpGp", "group":1},---排
    for (var i=0;i<=ops.row;i++){
        var br = {};
        br.key = bay.key+i;
        br.text = i;
        if (i==0)  br.text = "";
        br.isGroup = true;
        br.category = "rowTpGp";
        br.group = bay.key;
        bayDataArray.push(br);
        //{category:"bayrowTp", "group":3, "key":-7},---层
        for (var j=ops.tile;j>0;j--){
            var brt = {};
            brt.key = bay.key+i+j;
            brt.group = br.key;
            brt.category = "bayrowTp";
            brt.tile = j;
            if (i==0) brt.category = "tileTextTp"

            bayDataArray.push(brt);
        }
    }
    myDiagram.model.addNodeDataCollection(bayDataArray);

}
    //myDiagram.addDiagramListener("ChangedSelection",
    //    function(e) {
    //        var sel = myDiagram.selection.toArray();
    //        for (var i = 0; i < sel.length; i++) {
    //            var part = sel[i];
    //            // don't have any members of Groups be selected or selectable
    //            console.log(part);
    //        }
    //    }
    //);

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

//function setCurrentFileName(name) {
//    var currentFile = document.getElementById("currentFile");
//    if (myDiagram.isModified) {
//        name += "*";
//    }
//    currentFile.textContent = name;
//}

//function newDocument() {
//    // checks to see if all changes have been saved
//    if (myDiagram.isModified) {
//        var save = confirm("Would you like to save changes to " + getCurrentFileName() + "?");
//        if (save) {
//            saveDocument();
//        }
//    }
//    setCurrentFileName(UnsavedFileName);
//    // loads an empty diagram
//    myDiagram.model = new go.GraphLinksModel();
//    myDiagram.undoManager.isEnabled = true;
//    //myDiagram.addModelChangedListener(function(e) {
//    //    if (e.isTransactionFinished) enableAll();
//    //});
//    myDiagram.isModified = false;
//}

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

/**
 * Created by kingser on 2016/9/6.
 * ����õ��ĸ���ģ��
 */
// sets the qualities of the tooltip
var tooltiptemplate =
    $AJ(go.Adornment, go.Panel.Auto,
        $AJ(go.Shape, "RoundedRectangle",
            { fill: "whitesmoke", stroke: "gray" }),
        $AJ(go.TextBlock,
            { margin: 3, editable: true },
            // converts data about the part into a string
            new go.Binding("text", "", function(data) {
                if (data.item != undefined) return data.item;
                return "(unnamed item)";
            }))
    );

//�ѳ�����
    var groupTp=
    $AJ(go.Group, "Auto",
        new go.Binding("layerName"),
        new go.Binding("zOrder"),new go.Binding("angle").makeTwoWay()
    );
// Define the generic furniture and structure Nodes.
// The Shape gets it Geometry from a geometry path string in the bound data.
//�ѳ�����--���ܸ������һ�飬λ�ò��ÿ���
var nodeTpYardTitle=
    $AJ(go.Node, "Spot",
        {
            locationSpot: go.Spot.BottomLeft,
            selectable:false
        },
        new go.Binding("angle").makeTwoWay(),
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
        $AJ(go.TextBlock,
            {
                font: "bold 20px sans-serif",
                stroke:"green"
            },
            new go.Binding("text"))
    );
//�ѳ���λ
   var nodeTpYardShape=
    $AJ(go.Node, "Spot",
        {
            locationSpot: go.Spot.Center,
            movable:false,
            deletable:false,
            mouseDrop: function(e, node) {

                var target = myDiagram.selection.first();
                target.location = node.location;
                if (target.category == "cntr"&&target.data.width==40)
                {
                    var locx = node.location.x - 10;
                    target.location = new go.Point(locx,node.location.y);
                }
            }
        },
        new go.Binding("zOrder"),new go.Binding("angle").makeTwoWay(),
        //new go.Binding("name", "xxx"),
        // remember the location of this Node
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
        // can be resided according to the user's desires
        $AJ(go.Shape,
            {
                figure: "Rectangle",
                fill: "white",
                width:20,
                height:10
            }
        )
    );
//�ѳ�����
var nodeTpYardText=
    $AJ(go.Node, "Spot",
        {
            locationSpot: go.Spot.Center,
            selectable:false
        },
        //new go.Binding("name", "xxx"),
        new go.Binding("angle").makeTwoWay(),
        // remember the location of this Node
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
        // can be resided according to the user's desires
        $AJ(go.TextBlock,
            {
                //background: "lightgreen",
                font: "10px sans-serif",
                stroke:"black"
            },
            new go.Binding("text"))
    );

var nodeTpCntr =  $AJ(go.Node, "Auto",
    {locationSpot: go.Spot.Center,
        toolTip: tooltiptemplate,
        click: function(e, node) {
            //myDiagram.startTransaction('toggle ');
            //var layer = myDiagram.findLayer("yard");
            //console.log(layer);
            //layer.visible = false;
            //myDiagram.commitTransaction('toggle ');
            alert("fuck"+node.data.key);
            //var nox = myDiagram.findNodeForKey('01');
            //rotate(nox,45);
            //var no1 = myDiagram.findNodeForKey('010101');
            //rotate(no1,45);
        }
    },
    new go.Binding("layerName"),
    new go.Binding("item"),
    new go.Binding("zOrder"),
    new go.Binding("angle"),
    new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
    $AJ(go.Shape, "Rectangle",
        {
            fill: "red", // the default fill, if there is no data-binding,
            height:10
        },
        new go.Binding("figure", "fig"),
        // this determines the actual shape of the Shape
        new go.Binding("geometryString", "geo"),
        new go.Binding("fill", "color"),
    new go.Binding("width"))

);


myPaletteTp =
    $AJ(go.Node, "Spot",{
        toolTip: tooltiptemplate},
        $AJ(go.Shape,
            {
                name: "SHAPE",
                fill: "rgb(130, 130, 256)"
            },

            new go.Binding("figure", "fig"),
            // this determines the actual shape of the Shape
            new go.Binding("geometryString", "geo"),
            // allows the color to be determined by the node data
            new go.Binding("fill", "color")
        )
    );
//�Ҽ��˵�
    var contextTp =
    $AJ(go.Adornment, "Vertical",
        $AJ("ContextMenuButton",
            $AJ(go.TextBlock, "Rename", { margin: 3 }),
            { click: function(e, obj) { rename(obj); } }),
        $AJ("ContextMenuButton",
            $AJ(go.TextBlock, "Cut", { margin: 3 }),
            { click: function(e, obj) { myDiagram.commandHandler.cutSelection(); } }),
        $AJ("ContextMenuButton",
            $AJ(go.TextBlock, "Copy", { margin: 3 }),
            { click: function(e, obj) { myDiagram.commandHandler.copySelection(); } }),
        $AJ("ContextMenuButton",
            $AJ(go.TextBlock, "Rotate +45", { margin: 3 }),
            { click: function(e, obj) { myDiagram.commandHandler.rotate(45); } }),
        $AJ("ContextMenuButton",
            $AJ(go.TextBlock, "Rotate -45", { margin: 3 }),
            { click: function(e, obj) { myDiagram.commandHandler.rotate(-45); } }),
        $AJ("ContextMenuButton",
            $AJ(go.TextBlock, "Rotate +90", { margin: 3 }),
            { click: function(e, obj) { myDiagram.commandHandler.rotate(90); } }),
        $AJ("ContextMenuButton",
            $AJ(go.TextBlock, "Rotate -90", { margin: 3 }),
            { click: function(e, obj) { myDiagram.commandHandler.rotate(-90); } }),
        $AJ("ContextMenuButton",
            $AJ(go.TextBlock, "Rotate 180", { margin: 3 }),
            { click: function(e, obj) { myDiagram.commandHandler.rotate(180); } })
    );
//��λͼ
var bayTpGp = $AJ(go.Group, "Auto",
    {
        layout:
            $AJ(go.GridLayout,
                { wrappingWidth: Infinity, alignment: go.GridLayout.Position,
                    cellSize: new go.Size(1, 1), spacing: new go.Size(1, 1) }),
        movable:false,
        deletable:false
    },
    $AJ(go.Panel, "Vertical",  // title above Placeholder
        $AJ(go.Panel, "Horizontal",  // button next to TextBlock
            $AJ(go.TextBlock,
                {
                    alignment: go.Spot.Center,
                    margin: 5,
                    stroke: "#404040"
                },
                new go.Binding("text"))
        ),  // end Horizontal Panel
        $AJ(go.Placeholder)
    )  // end Vertical Panel
)

//��
var rowTpGp = $AJ(go.Group, "Auto",
    {
        layout:
            $AJ(go.GridLayout,
                { wrappingColumn: 1, alignment: go.GridLayout.Position,
                    cellSize: new go.Size(1, 1), spacing: new go.Size(0, 0) }),
        movable:false,
        deletable:false
    },
    $AJ(go.Shape, "Rectangle",
        { fill: null, stroke: "gray", strokeWidth: 1 }),
    $AJ(go.Panel, "Vertical",  // title above Placeholder
        $AJ(go.Panel, "Horizontal",  // button next to TextBlock
            $AJ(go.TextBlock,
                {
                    alignment: go.Spot.Center,
                    margin: 5,
                    stroke: "#404040"
                },
                new go.Binding("text"))
        ),  // end Horizontal Panel
        $AJ(go.Placeholder)
    )
)
//��-��λ40
var cntrTp20 = $AJ(go.Node, "Auto",
    {movable:false,alignment: go.Spot.Center
    },
    new go.Binding("movable"),
    new go.Binding("location").makeTwoWay(),
    $AJ(go.Shape, "Rectangle",
        { fill: "#ACE600", stroke: null,width:40,height:40 },
        new go.Binding("fill", "color")),
    $AJ(go.TextBlock,
        // TextBlock.text is bound to Node.data.key
        new go.Binding("text", "order"))
)
//��-��λ40
var cntrTp40 = $AJ(go.Node, "Auto",
    {movable:false,alignment: go.Spot.Center
    },

    new go.Binding("movable"),
    new go.Binding("location","location" ,toLocation).makeTwoWay(fromLocation),
    $AJ(go.Shape, "Rectangle",
        { fill: "#ACE600", stroke: null,width:40,height:40 },
        new go.Binding("fill", "color")),
    $AJ(go.TextBlock,
        // TextBlock.text is bound to Node.data.key
        new go.Binding("text", "order"))
)

//Ӱ����λ

var shadowTp =  $AJ(go.Node, "Auto",{movable:false,selectable:false},
        new go.Binding("location","loc"),
        $AJ(go.Shape, "XLine", { fill: "slateblue" ,width:40,height:40})
    )

//��-��λ
var bayrowTp = $AJ(go.Node, "Auto",
    {movable:false,
        deletable:false,alignment: go.Spot.Center,
        contextClick: function(e, node) {//40���� ������Ӱ����λ
            myDiagram.layout.isOngoing = false;
            var loc = node.location;
            var cntr = {color:"lightgray",key:node.data.key+"ct",category:"cntrTp40",movable:true,location:loc,order:"40"};
            myDiagram.model.addNodeData(cntr);
            var nodeDataArray = [
                { key: cntr.key+"s", loc: new go.Point(loc.x,loc.y-264) ,category:"shadowTp" }
            ];
            myDiagram.model.addNodeDataCollection(nodeDataArray);
        },
        click: function(e, node) {
            myDiagram.layout.isOngoing = false;
            var loc = node.location;
            //var cntr = {color:"red",key:node.data.key+"ct",category:"cntrTp20",movable:true,location:loc,order:"20"};
            //myDiagram.model.addNodeData(cntr);
            var t = { key: 211, text: "20", ribbon: "DANGER" ,category:"cntrStyleTp",location:loc};
            myDiagram.model.addNodeData(t);
        },
        mouseDrop: function(e, node) {

                var target = myDiagram.selection.first();
            if (target.data.category == "bayrowTp") return;
                target.location = node.data.location;
            //console.log(node.data);
        }},

    new go.Binding("movable"),
    new go.Binding("location").makeTwoWay(),
    $AJ(go.Shape, "Rectangle",
        { fill: "#ACE600", stroke: null,width:40,height:40 },
        new go.Binding("fill", "color")),
    $AJ(go.TextBlock,
        // TextBlock.text is bound to Node.data.key
        new go.Binding("text", "order"))
)

cntrStyleTp =
    $AJ(go.Node, "Spot",
        {  locationObjectName: "BODY" },
        { selectionObjectName: "BODY" },
        new go.Binding("location"),
        $AJ(go.Panel, "Auto",
            { name: "BODY", width: 40, height: 40 },
            { portId: "" },
            $AJ(go.Shape,
                { fill: "lightgray", stroke: null, strokeWidth: 0 }),
            $AJ(go.TextBlock,
                new go.Binding("text"))
        ),
        $AJ(go.Panel, "Spot",
            new go.Binding("opacity", "ribbon", function(t) { return t ? 1 : 0; }),
            { opacity: 0,
                alignment: new go.Spot(1, 0, 4, -4),
                alignmentFocus: go.Spot.TopRight },
            $AJ(go.Shape,  // the ribbon itself
                { geometryString: "F1 M0 0 L15 0 35 20 35 35z",
                    fill: "red", stroke: null, strokeWidth: 0 }),
            $AJ(go.TextBlock,
                new go.Binding("text", "ribbon"),
                {alignment: new go.Spot(1, 0, -15, 15),
                    angle: 45,
                    stroke: "white", font: "bold 5px sans-serif", textAlign: "center" })
        )
    );

//��-��λ
var tileTextTp = $AJ(go.Node, "Auto",
    {movable:false,
        deletable:false,alignment: go.Spot.Center},
    new go.Binding("movable"),
    new go.Binding("location").makeTwoWay(),
    $AJ(go.Shape, "Rectangle",
        { fill: "white", stroke: null,width:20,height:40 }),
    $AJ(go.TextBlock,
        {  stroke: "black", font: "9px sans-serif", textAlign: "center" },
        // TextBlock.text is bound to Node.data.key
        new go.Binding("text", "tile"))
)

/**
 * Created by kingser on 2016/8/31.
 */
// hides remove HTML Element
// hides open HTML Element
function init() {
    
 
//    
//    if (!checkLocalStorage()) {
//        var currentFile = document.getElementById("currentFile");
//        currentFile.textContent = "Sorry! No web storage support. \n If you're using Internet Explorer, you must load the page from a server for local storage to work.";
//    }
//    var openDocument = document.getElementById("openDocument");
//    openDocument.style.visibility = "hidden";
//    var removeDocument = document.getElementById("removeDocument");
//
//    removeDocument.style.visibility = "hidden";

    myDiagram =
        $AJ(go.Diagram, "myDiagramDiv",
            {
                //"grid.visible": true,
                allowDrop: true,  // accept drops from palette
                allowLink: false,  // no user-drawn links
                commandHandler: new DrawCommandHandler(),  // defined in DrawCommandHandler.js
                // default to having arrow keys move selected nodes
                "commandHandler.arrowKeyBehavior": "move",
                "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom , // mouse wheel zooms instead of scrolls
                // allow Ctrl-G to call groupSelection()
                "commandHandler.archetypeGroupData": { text: "Group", isGroup: true },

                rotatingTool: new RotateMultipleTool(),  // defined in RotateMultipleTool.js

                resizingTool: new ResizeMultipleTool(),  // defined in ResizeMultipleTool.js

                //draggingTool: new GuidedDraggingTool(),  // defined in GuidedDraggingTool.js
                //"draggingTool.horizontalGuidelineColor": "blue",
                //"draggingTool.verticalGuidelineColor": "blue",
                //"draggingTool.centerGuidelineColor": "green",
                //"draggingTool.guidelineWidth": 1,
                //
                //"draggingTool.isGridSnapEnabled": true,
                //"resizingTool.isGridSnapEnabled": true,
                // notice whenever the selection may have changed
                "ChangedSelection": enableAll,  // defined below, to enable/disable commands

                // notice when the Paste command may need to be reenabled
                "ClipboardChanged": enableAll,

                // notice when an object has been dropped from the palette
                "ExternalObjectsDropped": function(e) {
                    var nodex;
                    e.subject.each(function (node) {
                        console.log(node.data.key);
                        if (node.data.key == 'car')
                            nodex = node;
                    });
                    if (nodex) {
                        myDiagram.remove(nodex);
                        //var cod = '69';
                        //var cco = myDiagram.findNodeForKey('016903');
                        //var coo1 = myDiagram.findNodeForKey('017103');
                        //var ll  = (go.Point.parse(cco.data.loc).x + go.Point.parse(coo1.data.loc).x) / 2;
                        //var ly  = (go.Point.parse(cco.data.loc).y + go.Point.parse(coo1.data.loc).y) / 2;
                        //var loc = go.Point.stringify(new go.Point(ll,ly))
                        var ops1 = {key:"016803",color:"red",width:40};
                        var a = new createObj();
                        a.cntr(ops1);

                        //alert(go.Point.parse("121 20").x);
                        //myDiagram.remove(cco);
                        //cco.data.loc="100 200";
                       // myDiagram.model.setDataProperty(cco.data, "color", "red");
                        //console.log(cco);
                    }
                }

            });



    // change the title to indicate that the diagram has been modified
//    myDiagram.addDiagramListener("Modified", function(e) {
//        var currentFile = document.getElementById("currentFile");
//        var idx = currentFile.textContent.indexOf("*");
//        if (myDiagram.isModified) {
//            if (idx < 0) currentFile.textContent = currentFile.textContent + "*";
//        } else {
//            if (idx >= 0) currentFile.textContent = currentFile.textContent.substr(0, idx);
//        }
//    });
//the Layers

    myDiagram.addLayer(yardlay);
    myDiagram.addLayer(cntrlay);
 // the Template
    myDiagram.nodeTemplate= myPaletteTp;
    myDiagram.groupTemplateMap.add("yardGroup",groupTp);
    myDiagram.nodeTemplateMap.add('yardTitle',nodeTpYardTitle);
    myDiagram.nodeTemplateMap.add('yardShape',nodeTpYardShape);
    myDiagram.nodeTemplateMap.add('yardText',nodeTpYardText);
    myDiagram.nodeTemplateMap.add('cntr',nodeTpCntr);
    myDiagram.nodeTemplate.contextMenu =contextTp;


    // default structures and furniture
    myPalette =
        $AJ(go.Palette, "myPaletteDiv",
            {
                nodeTemplate:myDiagram.nodeTemplate,  // shared with the main Diagram
                "contextMenuTool.isEnabled": false,  // but disable context menus
                allowZoom: false,
                //allowDragOut:false,
                layout: $AJ(go.GridLayout, { cellSize: new go.Size(1, 1), spacing: new go.Size(5, 5) }),
                // initialize the Palette with a few furniture and structure nodes
                model: $AJ(go.GraphLinksModel,
                    {
                        nodeDataArray: [
                            {
                                key: "yardtp",
                                //geo: "F1 M0 0 L5,0 5,40 0,40 0,0z x M5,0 a40,40 0 0,1 40,40 ",
                                fig:"InternalStorage",
                                color: "lightgreen"
                            },
                            {
                                key: "car",
                                geo: "F1 M0 0 L30 0 30 30 0 30 z",
                                color: "red"
                            }
                        ]  // end nodeDataArray
                    })  // end model
            });  // end Palette


    // the Overview


    myOverview =
        $AJ(go.Overview, "myOverviewDiv",
            { observed: myDiagram, maxScale: 0.5 });

    // change color of viewport border in Overview
    myOverview.box.elt(0).stroke = "dodgerblue";


    // start off with an empty document
    myDiagram.isModified = false;
//    newDocument();
    var ops = {name:"01",text:"yard01",row:8,bay:40,tile:5,rowSeq:"A",baySeq:"L"};

    var a = new createObj();
    a.yard(ops);

    myDiagram.addDiagramListener("ChangedSelection",
        function(e) {
              var newdata = getBay();
              if (newdata.bayno.length > 0)
                  window.open('bay.html?bayno=' + newdata.bayno);
        }
    );

} // end init



