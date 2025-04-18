import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';

async function fetchAndIterateModels() {
    try {
        const response = await axios.get('http://127.0.0.1:7860/sdapi/v1/sd-models');
        const models = response.data;
        const validModels = [];
        const ignoredModels = ['riffusionTxt2audio']

        if (Array.isArray(models)) {
            for (const model of models) {
                const jsonFilePath = model.filename.replace('.safetensors', '.json');
                const civitaiInfoFilePath = model.filename.replace('.safetensors', '.civitai.info');
                
                let jsonContent = null;
                let civitaiInfoContent = null;

                try {
                    jsonContent = await fs.readFile(jsonFilePath, 'utf-8');
                    model.json = JSON.parse(jsonContent)
                    delete model.json["description"];
                    delete model.json["notes"];
                } catch (error) {
                    console.error(`Error reading JSON file for model ${model.model_name}:`, error.message);
                }

                try {
                    civitaiInfoContent = await fs.readFile(civitaiInfoFilePath, 'utf-8');
                    model.civitaiInfo = JSON.parse(civitaiInfoContent);
                    delete model.civitaiInfo["description"];
                    delete model.civitaiInfo.model["description"];
                    delete model.civitaiInfo["files"];
                    for (const i in model.civitaiInfo["images"]) {
                        delete model.civitaiInfo["images"][i]["meta"];
                    }
                } catch (error) {
                    console.error(`Error reading Civitai info file for model ${model.model_name}:`, error.message);
                }

                if (jsonContent && civitaiInfoContent && !ignoredModels.includes(model.model_name)) {
                    validModels.push(model);
                }
            }
            const sortedModels = validModels.sort((a, b) => a.civitaiInfo.model.name.localeCompare(b.civitaiInfo.model.name))

            // Save valid models array to src/data/models.json
            const outputFilePath = path.join('src', 'data', 'models.json');
            try {
                await fs.writeFile(outputFilePath, JSON.stringify(sortedModels, null, 2), 'utf-8');
                console.log(`Models data saved to ${outputFilePath}`);
            } catch (error) {
                console.error(`Error saving models data to file:`, error.message);
            }
        } else {
            console.error('Unexpected response format:', models);
        }
    } catch (error) {
        console.error('Error fetching models:', error.message);
    }
}

async function fetchAndIterateLoras() {
    try {
        const response = await axios.get('http://127.0.0.1:7860/sdapi/v1/loras');
        const models = response.data;
        const validModels = [];
        const ignoredModels = [
            'lit', 'LowRA', 'LCMTurboMix_LCM_Sampler', 'LCM_LoRA_Weights_SD15', 'LCMTurboMix_Euler_A_fix',
            'v2_lora_PanDown', 'v2_lora_PanLeft', 'v2_lora_PanRight', 'v2_lora_PanUp', 'v2_lora_ZoomIn', 'v2_lora_ZoomOut']

        if (Array.isArray(models)) {
            for (const model of models) {
                if (ignoredModels.includes(model.name)) {
                    continue
                }
                delete model["metadata"];
                const jsonFilePath = model.path.replace('.safetensors', '.json');
                const civitaiInfoFilePath = model.path.replace('.safetensors', '.civitai.info');
                
                let jsonContent = null;
                let civitaiInfoContent = null;

                try {
                    jsonContent = await fs.readFile(jsonFilePath, 'utf-8');
                    model.json = JSON.parse(jsonContent)
                    delete model.json["description"];
                    delete model.json["notes"];
                } catch (error) {
                    console.error(`Error reading JSON file for model ${model.name}:`, error.message);
                }

                try {
                    civitaiInfoContent = await fs.readFile(civitaiInfoFilePath, 'utf-8');
                    model.civitaiInfo = JSON.parse(civitaiInfoContent);
                    delete model.civitaiInfo["description"];
                    delete model.civitaiInfo.model["description"];
                    delete model.civitaiInfo["files"];
                    for (const i in model.civitaiInfo["images"]) {
                        delete model.civitaiInfo["images"][i]["meta"];
                    }
                } catch (error) {
                    console.error(`Error reading Civitai info file for model ${model.name}:`, error.message);
                }

                if (jsonContent && civitaiInfoContent) {
                    validModels.push(model);
                }
            }
            const sortedModels = validModels.sort((a, b) => a.civitaiInfo.model.name.localeCompare(b.civitaiInfo.model.name))

            // Save valid models array to src/data/models.json
            const outputFilePath = path.join('src', 'data', 'loras.json');
            try {
                await fs.writeFile(outputFilePath, JSON.stringify(sortedModels, null, 2), 'utf-8');
                console.log(`Models data saved to ${outputFilePath}`);
            } catch (error) {
                console.error(`Error saving models data to file:`, error.message);
            }
        } else {
            console.error('Unexpected response format:', models);
        }
    } catch (error) {
        console.error('Error fetching models:', error.message);
    }
}


// Call the function
fetchAndIterateModels();
fetchAndIterateLoras()
