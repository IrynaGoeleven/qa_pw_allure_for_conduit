import { camelCaseToPhrase, capitalize } from './stringHelpers';

export function parseTestTreeHierarchy(fileName, logger) {
  const normalizedPath = fileName.replace(/\\/g, '/');
  const testFolder = 'tests/';
  const testsIndex = normalizedPath.indexOf(testFolder);

  if (testsIndex === -1) {
    logger.debug(`Could not parse hierarchy from path: ${fileName}`);
    return [];
  }

  const attributesCamelCase = normalizedPath
    .substring(testsIndex + testFolder.length)
    .split('/')
    .filter(Boolean);

  let attributes = attributesCamelCase.map(attribute =>
    capitalize(camelCaseToPhrase(attribute.replace(/\.spec\.[a-z]+$/i, ''))),
  );

  if (
    attributes.length > 0 &&
    attributes[attributes.length - 1].includes('.spec')
  ) {
    attributes = attributes.slice(0, -1);
  }

  if (
    attributes.length > 0 &&
    attributes[attributes.length - 1].includes('.spec.js')
  ) {
    attributes = attributes.slice(0, -1);
  }

  logger.debug(`Parsed test hierarchy: ${JSON.stringify(attributes)}`);

  return attributes;
}
