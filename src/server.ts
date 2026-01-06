import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs-extra';
import crypto from 'crypto';
import path from 'path';
import { Listr } from 'listr2';
import queryString from 'query-string';
import { clipboard } from 'clipboard-sys';

// Import existing modules - reusing logic
import PresetHandlerModule from './modules/preset-handler.module.js';
import FileHandlerModule from './modules/file-handler.module.js';
import DownloadModule from './modules/download.module.js';
import RendererModule from './modules/renderer.module.js';
import transformToQueryParams from './utils/transform-to-query-params.util.js';
import readFileAsync from './utils/read-file-async.util.js';
import {
  CARBON_URL,
  CARBON_CUSTOM_THEME,
} from './helpers/carbon/constants.helper.js';

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const PRESETS_FILE = 'presets.json';

// Initialize presets file if it doesn't exist
if (!fs.existsSync(PRESETS_FILE)) {
  fs.writeJsonSync(PRESETS_FILE, {});
}

// --- Presets Endpoints ---

app.post('/presets', async (req, res) => {
  try {
    const settings = req.body;
    const id = uuidv4();

    const presets = await fs.readJson(PRESETS_FILE);
    presets[id] = settings;
    await fs.writeJson(PRESETS_FILE, presets);

    res.status(201).json({ id, ...settings });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

app.get('/presets/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const presets = await fs.readJson(PRESETS_FILE);

    if (presets[id]) {
      res.status(200).json(presets[id]);
    } else {
      res.status(404).json({ error: 'Preset not found' });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

app.get('/presets', (req, res) => {
  res.status(403).send('Forbidden');
});

// --- Image Generation Endpoint ---

app.post('/image', async (req, res) => {
  try {
    const { code, presetId, filename, ...overrides } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Code is required' });
    }

    // 1. Prepare Settings
    const PresetHandler = new PresetHandlerModule();

    // Load default settings (automatically done in PresetHandler constructor)

    // Load Preset if provided
    if (presetId) {
      const presets = await fs.readJson(PRESETS_FILE);
      if (presets[presetId]) {
        PresetHandler.mergeSettings(presets[presetId]);
      } else {
        return res.status(404).json({ error: 'Preset ID not found' });
      }
    }

    // Load Overrides
    PresetHandler.mergeSettings(overrides);

    const settings = PresetHandler.getSettings;

    // 2. Determine Filename
    let finalFilename = filename;
    if (!finalFilename) {
      // Generate hash of ALL parameters including code and final settings
      const hashParams = { code, settings };
      finalFilename = crypto.createHash('sha256').update(JSON.stringify(hashParams)).digest('hex');
    }

    // 3. Prepare Renderer and Logic
    // We can reuse some of the logic from cli.ts but we need to adapt it since cli.ts uses Listr and direct FileHandler interacting with stdin/files.
    // We have the code string directly.

    // Encode Content
    const encodedContent = encodeURIComponent(code);

    // Prepare URL
    const preparedURL = `${CARBON_URL}?${queryString.stringify(
      transformToQueryParams({
        ...settings,
        code: encodedContent,
        ...(settings.custom && { t: CARBON_CUSTOM_THEME }),
      }),
    )}`;

    // Initialize Renderer
    const engine = overrides.engine || 'chromium'; // Default to chromium if not specified
    const disableHeadless = overrides.disableHeadless || false;
    const type = settings.type || 'png';

    const Renderer = await RendererModule.create(
      engine as any, // Cast to any/enum
      disableHeadless as boolean,
      type as any
    );

    if (settings.custom) {
      await Renderer.setCustomTheme(
        settings.custom as any,
        CARBON_CUSTOM_THEME,
      );
    }

    // Set download directory to a temp folder
    const saveDirectory = path.join(process.cwd(), 'temp');
    await fs.ensureDir(saveDirectory);

    // Download
    await Renderer.download(
      preparedURL,
      saveDirectory,
      finalFilename
    );

    // Read file
    const filePath = path.join(saveDirectory, `${finalFilename}.${type}`);
    const fileBuffer = await fs.readFile(filePath);
    const base64Content = fileBuffer.toString('base64');

    // Determine MimeType
    const mimeType = type === 'svg' ? 'image/svg+xml' : 'image/png';

    // Cleanup
    await fs.remove(filePath);

    // Return Response
    res.json({
      filename: finalFilename,
      content: base64Content,
      mimetype: mimeType
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: (error as Error).message });
  }
});

app.listen(port, () => {
  console.log(`Carbon API listening on port ${port}`);
});
