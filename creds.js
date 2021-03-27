const inquirer = require('inquirer');
const { Octokit } = require("@octokit/rest");
const Configstore = require('configstore');
const packageJson = require('./package.json');

// Create a Configstore instance
const config = new Configstore(packageJson.name);
const path = require('path');

async function authenticate(){
    let token = config.get('github_token');
    if(token){
        try{
            const octokit = new Octokit({
                auth: token,
            }); 
            return octokit;
       }catch (error){
        throw error;
       }
    }else{
        const question = [
            {
                name: 'token',
                type: 'input',
                message: 'Enter your Github personal access token.',
                validate: function(value) {
                    if (value.length == 40) {
                        return true;
                    } else return 'Please enter a valid token.';
                }
            }
        ];
        const answer = await inquirer.prompt(question);
        try{
            const octokit = new Octokit({
                auth: answer.token,
            }); 
            config.set('github_token', answer.token);
            return octokit;
        }catch (error){
            console.log("Something is wrong at authenticate", error)
        }
    }
}

module.exports = {authenticate, config};