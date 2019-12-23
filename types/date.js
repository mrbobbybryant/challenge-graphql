const { GraphQLScalarType } = require('graphql');
import Validator from 'validatorjs';

export default new GraphQLScalarType({
  name: 'Date',
  description: 'Date Graphql Type',
  serialize(value) {
    let validation = new Validator(
      {
        date: value,
      },
      {
        date: ['required', 'regex:/^\\d{1,2}[\\/-]\\d{1,2}[\\/-]\\d{4}$/'],
      },
    );

    if (validation.passes()) {
      return value;
    }

    throw new Error('Invalid Date Format');
  },
  parseValue(value) {
    let validation = new Validator(
      {
        date: value,
      },
      {
        date: ['required', 'regex:/^\\d{1,2}[\\/-]\\d{1,2}[\\/-]\\d{4}$/'],
      },
    );

    if (validation.passes()) {
      return value;
    }

    throw new Error('Invalid Date Format');
  },
  parseLiteral(ast) {
    let validation = new Validator(
      {
        date: ast.value,
      },
      {
        date: ['required', 'regex:/^\\d{1,2}[\\/-]\\d{1,2}[\\/-]\\d{4}$/'],
      },
    );

    if (validation.passes()) {
      return ast.value;
    }

    throw new Error('Invalid Date Format');
  },
});
