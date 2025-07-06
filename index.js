const fs= reqquire ('fs');
const yargs=require('yargs');
const chalk=require('chalk');

const tasksFile = 'tasks.json';

const readTasks =() =>{
    try{
        const data =fs.readFileSync(tasksFile,'utf8');
        return JSON.parse(data);

    }
    catch{
        return [];
    }

};
const SaveTasks=(tasks) =>{
    fs.writeFileSync(tasksFile,JSON.stringify(tasks,null,2),'utf8');

};
const getNextId =(tasks)=>{
    const ids = tasks.map(task => task.id);
    return ids.length > 0 ? Math.max(...ids) + 1 : 1
}
yargs.command({

command:'add',
describe:'Add a new task',
builder:{
    title:{
        describe:'Task title',
        demandOption:true,
        type:'string'
    },
    description:{
        describe:'Task description',
        demandOption:false,
        type:'string'
    }
},
handler(argv){
    const tasks= readTasks();
    const newTask={
        id:getNextId(tasks),
        title:argv.title,
        description:argv.description || '',
        completed:false,
    };
    tasks.push(newTask);
    SaveTasks(tasks);
    console.log(chalk.green(`Task added: ${newTask.title}`));
}


});
yargs.command({
    command:'list',
    describe:'List all tasks',
    handler(){
        const tasks =readTasks();
        if(tasks.length===0){
            console.log(chalk.yellow('No tasks found.'));
            return;
        }
        console.log(chalk.blue.bold('\n Task List:\n'));
        tasks.forEach(task =>{
           const status = task.completed ? chalk.green('✔') : chalk.red('✘');
            console.log(`${status} ${chalk.cyan(task.id)}: ${chalk.white(task.title)} - ${chalk.gray(task.description)}`);
        
        });
    }


});


