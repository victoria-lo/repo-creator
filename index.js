#! /usr/bin/env node
const app = require('commander');
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const inquirer = require('inquirer');
const repo = require('./new_repo');
const auth = require('./creds');

app.command('init')
	.description('Run CLI tool')
	.action(async() => {
		clear();
		console.log(
			chalk.magentaBright(
				figlet.textSync('Repo Create', { horizontalLayout: 'full' })
			)
		);
        console.log("Welcome to the GitHub repo creator tool.\nThis tool is built for a tutorial at "
					+ chalk.yellow("https://lo-victoria.com")+ ". Do check out her blog! ^^");

		const question = [
			{
				name: 'proceed',
				type: 'input',
				message: 'Proceed to push this project to a Github remote repo?',
				choices: ['Yes', 'No'],
            	default: 'Yes'
			}
		];
	   const answer = await inquirer.prompt(question);

		if(answer.proceed == "Yes"){
			console.log(chalk.gray("Authenticating..."));
			const octokit = await auth.authenticate();
			console.log(chalk.gray("Initializing new remote repo..."));
			const url = await repo.newRepo(octokit);

			console.log(chalk.gray("Remote repo created. Choose files to ignore."));
			await repo.ignoreFiles();

			console.log(chalk.gray("Committing files to GitHub at: " + chalk.yellow(url)));
			const commit = await repo.initialCommit(url);
			if(commit){
				console.log(chalk.green("Your project has been successfully committed to Github!"));
			}	
		}else{
			console.log(chalk.gray("Okay, bye."))
		}
	  
});

app.command('token')
	.description('Delete github token')
	.action(async() => {
		clear();
		console.log(
			chalk.magentaBright(
				figlet.textSync('Repo Create', { horizontalLayout: 'full' })
			)
		);
        console.log("Welcome to the GitHub repo creator tool. This tool is built for a tutorial at "
					+ chalk.yellow("https://lo-victoria.com")+ ". Do check out her blog! ^^");
		
		console.log(chalk.gray("Checking for stored token..."))
		let token = auth.config.get('github_token');
    	if(token){
			console.log("A token is stored in configstore.");
			const question = [
				{
					name: 'proceed',
					type: 'input',
					message: 'Proceed to delete stored token?',
					choices: ['Yes', 'No'],
					default: 'Yes'
				}
			];
		   const answer = await inquirer.prompt(question);
		   if(answer.proceed == "Yes"){
			auth.config.delete('github_token');
			console.log(chalk.gray("Token is deleted."))
		   }else{
			console.log(chalk.gray("Okay, bye."))
		   }
		}else{
			console.log(chalk.gray("No token is found."))
		}
		
	})

app.parse(process.argv);

if (!app.args.length) {
	app.help();
}