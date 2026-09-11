/**
 * @param {string} packageName
 * @param {string} configFile
 * @param {string[]} files
 * @returns {string[]}
 */
const toEslintCommand = (packageName, configFile, files) => {
  if (files.length === 0) {
    return [];
  }

  const eslintBin = `${packageName}/node_modules/.bin/eslint`;
  const fileArgs = files.map((file) => `"${file}"`).join(' ');

  return [
    `${eslintBin} --config ${configFile} --max-warnings=0 ${fileArgs}`,
  ];
};

/** @type {import('lint-staged').Configuration} */
export default {
  'api/**/*.{js,ts}': (files) =>
    toEslintCommand('api', 'api/eslint.config.mjs', files),
  'frontend/**/*.{js,jsx,ts,tsx}': (files) =>
    toEslintCommand('frontend', 'frontend/eslint.config.js', files),
};
