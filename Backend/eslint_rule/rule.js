const ECMA_VERSION = 12;
const INDENTATION_SPACES = 2;
const INDENTATION_SWITCH_CASES = 1;
const MAX_LINES = 400;
const MAX_STATEMENTS = 25;
const MAX_PARAMS = 4;

module.exports = {
  env: {
    es6: true,
    node: true,
    mocha: true
  },
  plugins: [
    'node',
    'security',
    'import',
    'promise'
  ],
  extends: [
    'airbnb-base',
    'plugin:node/recommended',
    'plugin:security/recommended',
    'plugin:import/recommended',
    'plugin:promise/recommended'
  ],
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: ECMA_VERSION
  },
  rules: {
    // Node plugin rules
    'node/no-unpublished-require': 'off',
    // Import plugin rules
    'import/no-extraneous-dependencies': 'off',
    // Custom Jenius 2.0 rules
    'import/order': [
      'error', {
        alphabetize: {
          order: 'asc',
          caseInsensitive: true
        },
        groups: [
          'builtin',
          'external',
          'parent',
          'sibling',
          'index'
        ],
        'newlines-between': 'always',
        pathGroups: [{
          pattern: '{@jenius/ms-chassis,@jenius2/j2-newrelic,newrelic}',
          group: 'builtin',
          position: 'before'
        }, {
          pattern: '{@jenius/**,@jenius2/**}',
          group: 'external',
          position: 'after'
        }],
        pathGroupsExcludedImportTypes: []
      }
    ],
    'object-shorthand': 'off',
    'block-scoped-var': 'off',
    'padded-blocks': 'off',
    'no-underscore-dangle': 'off',
    'arrow-body-style': ['off', 'as-needed', {
      requireReturnForObjectLiteral: true
    }],
    'class-methods-use-this': 'off',
    'security/detect-object-injection': 'off',
    // switch off ForOfStatement
    'no-restricted-syntax': [
      'error',
      {
        selector: 'ForInStatement',
        message: 'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.'
      },
      {
        selector: 'LabeledStatement',
        message: 'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.'
      },
      {
        selector: 'WithStatement',
        message: '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.'
      }
    ],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    indent: ['error', INDENTATION_SPACES, {
      SwitchCase: INDENTATION_SWITCH_CASES,
      MemberExpression: 'off'
    }],
    'comma-dangle': ['error', 'never'],
    'linebreak-style': ['error', 'unix'],
    'no-debugger': 'error',
    'no-restricted-modules': ['error', {
      paths: [{
        name: '@jenius2/j2-kafka-client',
        message: 'Please use @jenius2/j2-kafka instead.'
      },
      {
        name: 'jest',
        message: 'Please use mocha instead.'
      }]
    }],
    'padding-line-between-statements': ['error', {
      blankLine: 'always',
      prev: '*',
      next: 'return'
    }],
    'func-names': ['warn', 'always'],
    'no-console': 'warn',
    'no-alert': 'warn',
    'no-shadow': 'warn',
    'max-lines': ['warn', MAX_LINES],
    'max-statements': ['warn', MAX_STATEMENTS],
    'max-params': ['warn', MAX_PARAMS],
    'no-invalid-this': 'warn',
    camelcase: 'warn',
    'func-name-matching': ['warn', 'always'],
    curly: ['warn', 'all'],
    'no-warning-comments': ['warn', {
      terms: ['todo', 'fixme', 'fix me'],
      location: 'anywhere'
    }],
    // Jsdocs related rules
    'valid-jsdoc': ['warn', {
      prefer: {
        arg: 'param',
        argument: 'param',
        constructor: 'class',
        return: 'returns'
      },
      preferType: {
        Boolean: 'boolean',
        Number: 'number',
        String: 'string',
        Function: 'function',
        Promise: 'promise',
        Array: 'array'
      },
      requireReturn: false,
      requireReturnType: true,
      matchDescription: '.+',
      requireParamDescription: true,
      requireReturnDescription: true
    }],
    'require-jsdoc': ['warn', {
      require: {
        FunctionDeclaration: true,
        MethodDefinition: true,
        ClassDeclaration: true,
        ArrowFunctionExpression: true,
        FunctionExpression: true
      }
    }],
    'promise/prefer-await-to-then': 'warn'
  },
  overrides: [{
    files: '*.spec.js',
    rules: {
      'no-unused-expressions': 'off',
      'no-restricted-properties': ['error', {
        object: 'describe',
        property: 'only'
      }, {
        object: 'it',
        property: 'only'
      }]
    },
    globals: {
      chai: true,
      expect: true,
      sinon: true
    }
  }]
};
