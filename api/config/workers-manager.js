//core
const { fork } = require('child_process');

//config
const workersPath = "/../app/workers/";
const registeredWorkers = [
	"notificator"
];

module.exports.load = function(app)
{
	//registering workers as separate processes
	app.workers = {};
	createWorkers(app);
}

function createWorkers(app)
{
	registeredWorkers.forEach(workerName => {

		let childProcess = fork(__dirname + workersPath + workerName + ".js", { shell: true,  stdio: 'inherit' });
		childProcess.on('error', () => console.log(`child process error`));

		//reload workers on error
		childProcess.on('close', (code) => {
			console.log(`child process exited with code ${code}`)
			createWorkers(app);
		});

		app.workers[workerName] = childProcess;
	});
}
