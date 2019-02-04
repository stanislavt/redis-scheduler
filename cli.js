const program = require('commander');
const publisher = require('./src/publisher');

program
  .version('1.0.0')
  .usage('[...options] ')
  .option('-t, --time', 'Particular time')
  .option('-m, --message', 'Message');

program
  .command('setup <time> <message>')
  .description('Schedule a new job in particular time')
  .action(publisher);

program.parse(process.argv);
