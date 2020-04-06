class OpenWorld {
  constructor() {}
  moveCharacter(currentX, currentY, direction) {
    let proposedNewX = currentX;
    let proposedNewY = currentY;
    if (direction === 'left') {
      proposedNewX -= speed;
    } else if (direction === 'right') {
      proposedNewX += speed;
    } else if (direction === 'up') {
      proposedNewY -= speed;
    } else if (direction === 'down') {
      proposedNewY += speed;
    }
    openWorld.updateFrame(proposedNewX, proposedNewY, direction);
  }

  checkBoundary(x, y, boundaryZone) {
    let inBoundaryZone;
    boundaryZone.forEach((zone) => {
      const { xmin, xmax, ymin, ymax } = zone;
      if (x >= xmin && x <= xmax && y >= ymin && y <= ymax) {
        inBoundaryZone = true;
      }
    });
    return inBoundaryZone;
  }

  checkValidMove(
    canvasHeight,
    canvasWidth,
    boundaryZones,
    x,
    y,
    spriteWidth,
    spriteHeight
  ) {
    if (
      x < 0 ||
      y < 0 ||
      x > canvasWidth - spriteWidth ||
      y > canvasHeight - spriteHeight
    ) {
      return true;
    }
    const validMove = openWorld.checkBoundary(x, y, boundaryZones.outOfBounds);
    return validMove;
  }

  renderSpriteRow(direction, inBattleZone) {
    let inZone = 0;
    if (inBattleZone) {
      inZone = 4;
    }
    if (direction === 'left') {
      return (spriteRowLeft + inZone) * spriteHeight;
    } else if (direction === 'right') {
      return (spriteRowRight + inZone) * spriteHeight;
    } else if (direction === 'up') {
      return (spriteRowUp + inZone) * spriteHeight;
    } else if (direction === 'down') {
      return (spriteRowDown + inZone) * spriteHeight;
    }
  }

  draw() {
    ctx.drawImage(
      character,
      spriteXPosition,
      spriteYPosition,
      spriteWidth,
      spriteHeight,
      xPosition,
      yPosition,
      spriteWidth,
      spriteHeight
    );
  }

  battle(inBattleZone, battleInteractionCoefficient) {
    if (inBattleZone === 'enterFinalBattle') {
      openWorld.battleInitiation(gridDimensions);
      return;
    }
    if (!inBattleZone || numberOfBattles > 2) {
      return;
    }
    if (Math.random() < battleInteractionCoefficient) {
      openWorld.battleInitiation(gridDimensions);
      if (numberOfBattles > 2) {
        inBattleZone = false;
      } else {
        numberOfBattles += 1;
      }
    }
  }

  fillPath(xPosition, yPosition) {
    let travelledPath = new Path2D();
    let padding = 12;
    travelledPath.moveTo(xPosition - padding, yPosition - padding);
    travelledPath.lineTo(
      xPosition + spriteWidth + padding,
      yPosition - padding
    );
    travelledPath.lineTo(
      xPosition + spriteWidth + padding,
      yPosition + spriteHeight + padding
    );
    travelledPath.lineTo(
      xPosition - padding,
      yPosition + spriteHeight + padding
    );
    travelledPath.closePath();
    ctx.fill(travelledPath, 'evenodd');
  }

  updateFrame(proposedNewX, proposedNewY, direction) {
    if (proposedNewX > 550) {
      battleInteractionCoefficient = 0.5;
    }
    const hittingBoundary = openWorld.checkValidMove(
      canvasHeight,
      canvasWidth,
      boundaryZones,
      proposedNewX,
      proposedNewY,
      spriteWidth,
      spriteHeight
    );
    if (!hittingBoundary) {
      xPosition = proposedNewX;
      yPosition = proposedNewY;
    }
    const inBattleZone = openWorld.checkBoundary(
      xPosition,
      yPosition,
      boundaryZones.battleZones
    );
    ctx.clearRect(xPosition, yPosition, spriteWidth, spriteHeight);
    currentFrame = ++currentFrame % cols;
    spriteXPosition = currentFrame * spriteWidth;
    spriteYPosition = openWorld.renderSpriteRow(direction, inBattleZone);
    openWorld.fillPath(xPosition, yPosition);
    openWorld.draw();
    if (xPosition === 500 && yPosition >= 30 && yPosition <= 130) {
      openWorld.battle('enterFinalBattle', battleInteractionCoefficient);
    } else {
      openWorld.battle(inBattleZone, battleInteractionCoefficient);
    }
  }

  getGridDimensionsForBattleAnimation(x, y, canvasHeight, canvasWidth, grid) {
    if (canvasWidth < 0 || canvasHeight < 0) {
      return;
    }
    const squareSize = 50;
    let rows = canvasHeight / squareSize;
    let columns = canvasWidth / squareSize;
    for (let i = 0; i < rows; i++) {
      ctx.fillStyle = '#000';
      grid.push([x, y]);
      y += 50;
    }
    rows -= 1;
    y -= 50;

    for (let i = 0; i < columns; i++) {
      ctx.fillStyle = '#000';
      grid.push([x, y]);
      x += 50;
    }
    columns -= 1;
    x -= squareSize;

    for (let i = rows; i >= 0; i--) {
      ctx.fillStyle = '#000';
      grid.push([x, y]);
      y -= squareSize;
    }

    y += squareSize;
    for (let i = columns; i >= 0; i--) {
      ctx.fillStyle = '#000';
      grid.push([x, y]);
      x -= squareSize;
    }
    x += squareSize;
    canvasHeight -= 2 * squareSize;
    canvasWidth -= 2 * squareSize;
    x += squareSize;
    y += squareSize;
    openWorld.getGridDimensionsForBattleAnimation(
      x,
      y,
      canvasHeight,
      canvasWidth,
      grid
    );
    return grid;
  }

  delayAnimation(ms) {
    return new Promise((res) => setTimeout(res, ms));
  }

  async battleInitiation(arr) {
    stopAnimating();
    keyNavigationDisabled = true;
    for (var i = 0; i < arr.length; i++) {
      ctx.clearRect(arr[i][0], arr[i][1], 50, 50);
      ctx.fillStyle = '#000';
      ctx.fillRect(arr[i][0], arr[i][1], 50, 50);
      ctx.fillStyle = '#000';
      await openWorld.delayAnimation(7);
    }
    const gameDiv = document.querySelector('#canvasDiv');
    gameDiv.hidden = true;
    const battleDiv = document.querySelector('.wrapper');
    battleDiv.style.display = 'grid';
  }
}
