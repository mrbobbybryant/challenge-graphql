const { GraphQLScalarType } = require('graphql');
import Validator from 'validatorjs';

export default new GraphQLScalarType({
  name: 'Time',
  description: 'Time Graphql Type',
  serialize(value) {
    let validation = new Validator(
      {
        time: value,
      },
      {
        time: ['required', 'regex:/^\\d{2}[:]\\d{2}[:]\\d{2}$/'],
      },
    );

    if (validation.passes()) {
      return value;
    }

    throw new Error('Invalid Time Format. Should be military time 09:30:00');
  },
  parseValue(value) {
    let validation = new Validator(
      {
        time: value,
      },
      {
        time: ['required', 'regex:/^\\d{2}[:]\\d{2}[:]\\d{2}$/'],
      },
    );

    if (validation.passes()) {
      return value;
    }

    throw new Error('Invalid Time Format. Should be military time 09:30:00');
  },
  parseLiteral(ast) {
    let validation = new Validator(
      {
        time: ast.value,
      },
      {
        time: ['required', 'regex:/^\\d{2}[:]\\d{2}[:]\\d{2}$/'],
      },
    );

    if (validation.passes()) {
      return ast.value;
    }

    throw new Error('Invalid Time Format. Should be military time 09:30:00');
  },
});
