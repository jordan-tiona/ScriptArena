const RobotVM = require('./src/robot-vm');
const Robot = require('./src/robot');
const ivm = require('isolated-vm');

let myRobot = new RobotVM();

myRobot.loadModule('./bot-examples/', 'my-first-robot.js');
myRobot.installGlobals()
    .then(() => {
        myRobot.isLoaded = true;
        let reference = myRobot.modules['./bot-examples/my-first-robot.js'].namespace;
        let loop = reference.getSync('default');

        let me = new Robot();
        myRobot.context.global.setSync('me', new ivm.ExternalCopy(me).copyInto());

        loop.applySync(null);

        me = myRobot.context.global.getSync('me').getSync('author');
        console.log(me);
    })
    .catch((err) => {
        console.error(err);
    });