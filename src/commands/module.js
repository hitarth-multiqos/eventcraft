
const path = require('path');
const helper = require('../helpers/helper');
const simpleGit = require('simple-git');
const { generateNewModuleService } = require('../services/module.service');

module.exports.createNewModule = async (projectTitle, moduleName, config) => {
    return new Promise(async (resolve, reject) => {
        try {

            moduleName = moduleName.split(',');
            console.log('moduleName', moduleName);
            let moduleGenerated = new Array(moduleName.length).fill(false);
            for (let i = 0; i < moduleName.length; i++) {
                const element = moduleName[i];
                let isModuleGenerated = await generateNewModuleService(projectTitle, element)
                moduleGenerated[i] = isModuleGenerated;
            }

            if (moduleGenerated.some(x => !x)) {
                resolve({
                    success: false,
                    message: 'Error in generating module'
                });
                return;
            }

            const projectPath = path.join(__dirname, '../../', "generated_projects", projectTitle);
            const zipFileName = `${projectTitle}.zip`;
            const zipFilePath = path.join(__dirname, '../../', 'generated_projects', zipFileName);

            // Create ZIP file
            // await helper.createZipFile(projectPath, zipFilePath);

            // await helper.deleteFile({ name: projectTitle, folderName: 'generated_projects' });
            resolve({
                success: true,
                message: 'Module created successfully',
            });
        } catch (err) {
            console.log(`Error(createNewModule)`, err);
            reject({
                success: false,
                message: 'Something went wrong, please try again',
                error: err
            });
        }
    });
}