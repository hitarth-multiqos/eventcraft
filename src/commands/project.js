const path = require('path');
const helper = require('../helpers/helper');
const simpleGit = require('simple-git');
const modelService = require('../services/model.service');
const { generateDependencies, generatePackageJSON, generateENV, generateREADME, generateGitIgnore, generateSwagger } = require('../services/other.service');
const { exec, execSync } = require('child_process');
const fs = require('fs');

// Create Project
module.exports.createProject = async (projectTitle, config) => {
    return new Promise(async (resolve, reject) => {
        try {

            // const projectPath = path.join(__dirname, '../../', "generated_projects", projectTitle);
            const projectPath = path.join(process.cwd(), projectTitle);
            // const zipFileName = `${projectTitle}.zip`;
            // const zipFilePath = path.join(__dirname, '../../', 'generated_projects', zipFileName);

            const sourceFolder = path.join(__dirname, '../../', 'templates/eventTemplate');
            const destinationFolder = projectPath
            await helper.copyFolder(sourceFolder, destinationFolder);
            let pathToConfigFile = path.join(__dirname, '../../', 'eventschema.json')

            // Create Event Model
            let eventModel = modelService.createEventSchema('event', pathToConfigFile, true);
            helper.writeProjectFile(`${projectPath}/src`, 'models', 'event.model.js', eventModel);

            helper.writeProjectFile(`${projectPath}`, '', 'dependencies.js', generateDependencies());
            helper.writeProjectFile(`${projectPath}`, '', 'package.json', generatePackageJSON(projectTitle));
            helper.writeProjectFile(`${projectPath}`, '', '.env', generateENV(projectTitle));
            helper.writeProjectFile(`${projectPath}`, '', 'README.md', generateREADME(projectTitle));
            helper.writeProjectFile(`${projectPath}`, 'src', 'app.js', generateSwagger(projectTitle));

            // await helper.createZipFile(projectPath, zipFilePath);

            // Initialize git if requested
            if (config.git) {
                const git = simpleGit(projectPath);
                await git.init();
                helper.writeProjectFile(`${projectPath}`, '', '.gitignore', generateGitIgnore());

                // await git.add('.');
                // await git.commit('Initial commit');
            }

            // Open project in VS Code if requested
            if (config.openCode) {
                exec(`cd ${projectPath} && code .`)
            }

            // Install npm packages if requested
            if (config.installPackages) {
                execSync(`cd ${projectPath} && npm run deps && npm run swagger`)
                fs.unlinkSync(`${projectPath}/`, 'dependencies.js');
            }

            // setTimeout(() => {
            //     helper.deleteFile({ name: projectTitle, folderName: 'generated_projects' });
            //     helper.deleteFile({ name: `${projectTitle}.zip`, folderName: 'generated_projects' });
            // }, 60000)
            resolve({
                success: true,
                message: 'Project created successfully',
            });

        } catch (err) {
            console.log('Error(createProject)', err);
            reject({
                success: false,
                message: 'Something went wrong, please try again',
                error: err
            });
        }
    });
}