const fs= require ('fs');
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
yargs.command({
    command:'complete',
    describe:'Mark a task as completed',
    builder:{
        id:{
            describe:'Task Id',
            demandOption:true,
            type:'number'
        }
    },
    handler(argv){
        const tasks= readTasks();
        const task = tasks.find(task => task.id === argv.id);
        if(!task){
            console.log(chalk.red(`Task with ID ${argv.id} not found.`));
            return;
        }
        if(task.completed){
            console.log(chalk.yellow(`Task with ID ${argv.id} is already completed.`));
            return;
        }
        task.completed = true;
        SaveTasks(tasks);
        console.log(chalk.green(`Task with ID ${argv.id} marked as completed.`));
    }
});
yargs.command({
    command:'remove',
    describe:'Remove a task',
    builder:{
        id:{
            describe:'Task Id',
            demandOption:true,
            type:'number'
        }
    },

handler(argv){
    const tasks =readTasks();
    const taskIndex = tasks.findIndex(task => task.id === argv.id);
    if(taskIndex === -1){
        console.log(chalk.red(`Task with ID ${argv.id} not found.`));
        return;
    }
    const removedTask = tasks.splice(taskIndex, 1)[0];
    SaveTasks(tasks);
    console.log(chalk.green(`Task removed: ${removedTask.title}`));
}

});
yargs.command({
    command:'clear',
    describe:'Clear all tasks',
    handler(){
        SaveTasks([]);
        console.log(chalk.green('All tasks cleared.'));
    }
});


    yargs
  .strict()
  .demandCommand()
  .help()
  .parse();

