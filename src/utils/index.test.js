import {
  typeCheck,
  removeNotNull,
  getReturnResultList,
  getField,
  formatField,
  formatType,
  getSchema,
  getSchemaTypes,
  getType,
  getTypeFields,
  getTypeFieldsLen,
  getQueryType,
  getTypeByName
} from './index';
import { TypeKind } from 'graphql';

describe('utils test', () => {
  it('typeCheck Number success', () => {
    const result = typeCheck('Number', {
      kind: TypeKind.SCALAR,
      name: 'Float',
      ofType: null
    });
    expect(result).toEqual(true);
  });
  it('typeCheck Number fail', () => {
    const result = typeCheck('Number', {
      kind: TypeKind.SCALAR,
      name: 'Int',
      ofType: null
    });
    expect(result).toEqual(false);
  });
});
