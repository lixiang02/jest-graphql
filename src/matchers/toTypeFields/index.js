import { getReturnResultList, formatType, getType, formatField, getField, typeCheck } from '../../utils';

export default {
  toTypeFields(introspection, type, fields) {
    const list = [
      {
        key: 'pass',
        pass: true,
        message: 'expected type field is correct'
      },
      {
        key: 'fail',
        message: 'unexpected type field is incorrect'
      },
      {
        key: 'typeNotFound',
        message: 'unexpected type is not found'
      },
      {
        key: 'fieldsNotFound',
        message: 'unexpected fields is not found'
      },
      {
        key: 'fieldSchemaNotFound',
        message: 'unexpected field schema is not found'
      },
      {
        key: 'schemaNotFound',
        message: 'unexpected field schema is not found'
      },
      {
        key: 'fieldParamsError',
        message: 'unexpected fields params is error'
      },
      {
        key: 'fieldParamsNotFound',
        message: 'unexpected fields params is not found'
      },
      {
        key: 'fieldTypeisError',
        message: 'unexpected field type is error'
      }
    ];
    const result = getReturnResultList(list);

    // type
    type = formatType(type);
    if (!type) {
      return result['typeNotFound'];
    }

    // types
    const schemaType = getType(introspection, type);
    if (!schemaType) {
      return result['schemaNotFound'];
    }

    // fields
    fields = Object.keys(fields)
      .map(fieldKey => formatField(fieldKey, fields[fieldKey]))
      .filter(e => e);
    if (!fields) {
      return result['fieldsNotFound'];
    }

    for (let field of fields) {
      const fieldName = field.name || field.fieldName;
      const fieldType = field.type || field.fieldType;
      const fieldSchema = getField(introspection, type, fieldName);
      if (!fieldSchema) {
        return result['fieldSchemaNotFound'];
      } else if (!fieldName || !fieldType) {
        return result['fieldParamsNotFound'];
      }
      if (!typeCheck(fieldType, fieldSchema.type)) {
        return result['fieldTypeisError'];
      }
    }
    return result['pass'];
  }
};
