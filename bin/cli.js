#!/usr/bin/env node
const { Command } = require('commander');
const inquirer = require('inquirer').createPromptModule();;
const { createNewModule } = require('../src/commands/module');
const { createProject } = require('../src/commands/project');
const pkg = require('../package.json');

const program = new Command();

program.version(pkg.version).description('Event Project Generator CLI');

// Create Project Command
program
    .command('new <name>')
    .description('Create a new project')
    .option('-g, --git', 'Initialize git repository')
    .action(async (projectTitle, options) => {
        try {
            let gitInit = options.git ?? false;
            let openCode = options.openCode ?? false;
            let installPackages = options.installPackages ?? false;

            // Ask for Git if not specified
            if (options.git === undefined) {
                const answers = await inquirer([
                    {
                        type: 'confirm',
                        name: 'git',
                        message: 'Initialize a git repository ?',
                        default: false
                    },
                    {
                        type: 'confirm',
                        name: 'openCode',
                        message: 'Open project in VS Code ?',
                        default: false
                    },
                    {
                        type: 'confirm',
                        name: 'installPackages',
                        message: 'Do you want to install npm packages ?',
                        default: false
                    }
                ]);
                gitInit = answers.git;
                openCode = answers.openCode;
                installPackages = answers.installPackages;
            }

            const config = { git: gitInit, openCode: openCode, installPackages: installPackages };

            console.log('🔧 Creating project with options:', config);

            const result = await createProject(projectTitle, config);

            if (result.success) {
                console.log('✅ Project created successfully!');
            } else {
                console.error('❌ Failed to create project:', result.message);
            }
        } catch (error) {
            console.error('🚨 Error creating project:', error.message);
            if (error.error) console.error(error.error);
        }
    });

// Create Module Command
program
    .command('module <project> <module>')
    .description('Create a new module in a project')
    .action(async (project, module, options) => {
        try {
            const spinner = ora('Creating module...').start();
            let gitInit = options.git ?? false;

            const config = { git: gitInit };

            const result = await createNewModule(project, module, config);

            if (result.success) {
                console.log('✅ Module created successfully!');
            } else {
                console.error('❌ Failed to generate module:', result.message);
            }
        } catch (error) {
            console.error('🚨 Error generating module:', error.message);
            if (error.error) console.error(error.error);
        }
    });

// Parse CLI arguments
program.parse(process.argv);

// Show help if no arguments provided
if (!process.argv.slice(2).length) {
    program.outputHelp();
}
