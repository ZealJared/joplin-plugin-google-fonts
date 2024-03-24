import joplin from 'api';
import { ToolbarButtonLocation } from 'api/types';

joplin.plugins.register({
	onStart: async function () {

		const installDir = await joplin.plugins.installationDir();
		const cssFilePath = installDir + '/google-fonts.css';
		await (joplin as any).window.loadNoteCssFile(cssFilePath);

		// Create a function to apply the font styles
		async function applyFont(fontFamily) {
			const selectedText = await joplin.commands.execute('selectedText');
			if (!selectedText?.length) {
				alert('Select text to apply font.');
				return;
			}
			const newSelection = `<span style="font-family: '${fontFamily}'">${selectedText}</span>`;
			await joplin.commands.execute('replaceSelection', newSelection);
		}

		const googleFonts = [
			'Roboto',
			'Dancing Script',
			'Edu NSW ACT Foundation',
			'Nanum Brush Script',
			'Pacifico',
			'Workbench'
		];

		const dialogId = 'googleFontsDialog';

		// Render the custom dialog
		const dialogHandle = await joplin.views.dialogs.create(dialogId);

		const dialogHtml = `
			<form id="fontSelector" name="fontSelector">
				<select id="selectedFont" name="selectedFont">
					${googleFonts.map(font => `<option value="${font}">${font}</option>`).join('')}
				</select>
                <div id="fontPreview" style="font-size: 2rem; margin-top: 1rem;">Font Preview</div>
			</form>
        `;

		await joplin.views.dialogs.setHtml(dialogHandle, dialogHtml);

		// Add a script to the dialog for font preview
		await joplin.views.dialogs.addScript(dialogHandle, './google-fonts.css');
		await joplin.views.dialogs.addScript(dialogHandle, './fontPreviewScript.js');

		// Handle the "ok" button click event
		await joplin.views.dialogs.setButtons(dialogHandle, [
			{
				id: 'cancel',
				title: 'Cancel'
			},
			{
				id: 'ok',
				title: 'Apply Font'
			}
		]);

		await joplin.commands.register({
			name: 'googleFonts',
			label: 'Google Fonts',
			iconName: 'fas fa-font',
			execute: async () => {
				const result = await joplin.views.dialogs.open(dialogHandle);
				if (result.id === 'ok') {
					const font = result.formData.fontSelector.selectedFont;
					await applyFont(font);
				}
			}
		});

		await joplin.views.toolbarButtons.create('googleFonts', 'googleFonts', ToolbarButtonLocation.EditorToolbar);
	},
});
