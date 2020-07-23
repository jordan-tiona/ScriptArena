class Robot {

    constructor() {
        this.x = 0.0;
        this.y = 0.0;

        this.heading = 0;
        this.turretHeading = 0;

        this.name = 'MyFirstRobot';
        this.author = 'Default';

        this.hp = 100.0;
        this.energy = 100.0;

        this.reloadTimer = 0;

        this.actionStack = [];
    }

    onMatchStart() {

    }

    moveForward(distance) {
        this.actionStack.push({
            action: MOVE_FORWARD,
            
        })
    }

    moveBackward(distance) {

    }

    turnRight(angle) {

    }

    turnLeft(angle) {

    }

    fireRound() {

    }
}

module.exports = Robot;