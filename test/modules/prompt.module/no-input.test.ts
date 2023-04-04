import Prompt from '../../../src/modules/prompt.module.js';

jest.mock('get-stdin');

it('Should end the process if no input source is found', async () => {
	// https://stackoverflow.com/a/51448240
	const processExitMock = jest
		.spyOn(process, 'exit')
		.mockImplementation((number) => number as never);
	await Prompt.create();
	expect(processExitMock).toHaveBeenCalled();
	expect(processExitMock).toHaveBeenCalledWith(1);
	processExitMock.mockRestore();
});
