import { getReturnResultList, formatType, getTypeFieldsLen } from '../../utils';

export default {
  toTypeChildLen(introspection, type, expectLength = 0) {
    const result = getReturnResultList([
      {
        key: 'pass',
        pass: true,
        message: 'expected type field length is correct'
      },
      {
        key: 'fail',
        pass: false,
        message: 'unexpected type field length is incorrect'
      }
    ]);
    type = formatType(type);
    const fieldsLen = getTypeFieldsLen(introspection, type);
    if (fieldsLen === Math.round(Number(expectLength))) {
      return result['pass'];
    }

    return result['fail'];
  }
};
