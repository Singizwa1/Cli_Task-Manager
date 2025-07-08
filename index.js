import fs from 'fs';
import yargs  from 'yargs';
import { hideBin } from 'yargs/helpers';
import chalk from 'chalk';

const tasksFile = 'tasks.json';

const readTasks = () => {
  try {
    const data = fs.readFileSync(tasksFile, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
};

const saveTasks = (tasks) => {
  fs.writeFileSync(tasksFile, JSON.stringify(tasks, null, 2), 'utf8');
};

const getNextId = (tasks) => {
  const ids = tasks.map((task) => task.id);
  return ids.length > 0 ? Math.max(...ids) + 1 : 1;
};

yargs(hideBin(process.argv))
  .command(
    'add',
    'Add a new task',
    (yargs) =>
      yargs.option('title', {
        describe: 'Task title',
        demandOption: true,
        type: 'string',
      }).option('description', {
        describe: 'Task description',
        demandOption: false,
        type: 'string',
      }),
    (argv) => {
      const tasks = readTasks();
      const newTask = {
        id: getNextId(tasks),
        title: argv.title,
        description: argv.description || '',
        completed: false,
        startedAt: new Date().toISOString(),
        completedAt: null,
      };
      tasks.push(newTask);
      saveTasks(tasks);
      console.log(chalk.green(`Task added: ${newTask.title}`));
    }
  )
  .command(
    'list',
    'List all tasks',
    () => {},
    () => {
      const tasks = readTasks();
      if (tasks.length === 0) {
        console.log(chalk.yellow('No tasks found.'));
        return;
      }
      console.log(chalk.blue.bold('\n Task List:\n'));
     tasks.forEach((task) => {
  const status = task.completed ? chalk.green('✔') : chalk.red('✘');
  const start = new Date(task.startAt).toLocaleString();
  const completed = task.completedDate
    ? `✅ Completed: ${new Date(task.completedDate).toLocaleString()}`
    : '';

  console.log(
    `${status} ${chalk.cyan(task.id)}: ${chalk.white(task.title)} - ${chalk.gray(task.description)}`
  );
  console.log(chalk.gray(`📅 Started: ${start}`));
  if (completed) {
    console.log(chalk.gray(completed));
  }
  console.log(); 
});

    }
  )
  .command(
    'complete',
    'Mark a task as completed',
    (yargs) =>
      yargs.option('id', {
        describe: 'Task Id',
        demandOption: true,
        type: 'number',
      }),
    (argv) => {
      const tasks = readTasks();
      const task = tasks.find((t) => t.id === argv.id);
      if (!task) {
        console.log(chalk.red(`Task with ID ${argv.id} not found.`));
        return;
      }
      if (task.completed) {
        console.log(chalk.yellow(`Task with ID ${argv.id} is already completed.`));
        return;
      }
      task.completed = true;
      task.completedAt = new Date().toISOString();
      saveTasks(tasks);
      console.log(chalk.green(`Task with ID ${argv.id} marked as completed.`));
    }
  )
  .command(
    'remove',
    'Remove a task',
    (yargs) =>
      yargs.option('id', {
        describe: 'Task Id',
        demandOption: true,
        type: 'number',
      }),
    (argv) => {
      const tasks = readTasks();
      const taskIndex = tasks.findIndex((task) => task.id === argv.id);
      if (taskIndex === -1) {
        console.log(chalk.red(`Task with ID ${argv.id} not found.`));
        return;
      }
      const removedTask = tasks.splice(taskIndex, 1)[0];
      saveTasks(tasks);
      console.log(chalk.green(`Task removed: ${removedTask.title}`));
    }
  )
  .command(
    'update',
    'update a task',
    (yargs) =>
      yargs
        .option('id', {
          describe: 'Task Id',
          demandOption: true,
          type: 'number',
        })
        .option('title', {
          describe: 'New task title',
          demandOption: false,
          type: 'string',
        })
        .option('description', {
          describe: 'New task description',
          demandOption: false,
          type: 'string',
        }),
    (argv) => {
      const tasks = readTasks();
      const task = tasks.find((t) => t.id === argv.id);
      if (!task) {
        console.log(chalk.red(`Task with ID ${argv.id} not found.`));
        return;
      }
      if (argv.title) task.title = argv.title;
      if (argv.description) task.description = argv.description;
        if (!task.startedAt) {
      task.startedAt = new Date().toISOString();
    }

    task.updatedAt = new Date().toISOString();
      saveTasks(tasks);
      console.log(chalk.green(`Task with ID ${argv.id} updated.`));
    }

  )
  .command(
    'clear',
    'Clear all tasks',
    () => {},
    () => {
      saveTasks([]);
      console.log(chalk.green('All tasks cleared.'));
    }
  )

  .strict()
  .demandCommand()
  .help()
  .parse();
