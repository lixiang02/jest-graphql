import { TypeKind } from 'graphql';

export function typeCheck(type, schmaType) {
  const typeKey = String(type).toLowerCase();
  schmaType = removeNotNull(schmaType);
  switch (typeKey) {
    case 'number':
    case 'float':
      if (!schmaType || schmaType.name !== 'Float' || schmaType.kind !== TypeKind.SCALAR) {
        return false;
      }
      break;
    case 'int':
      if (!schmaType || schmaType.name !== 'Int' || schmaType.kind !== TypeKind.SCALAR) {
        return false;
      }
      break;
    case 'string':
    case 'boolean':
      if (!schmaType || String(schmaType.name).toLowerCase() !== typeKey || schmaType.kind !== TypeKind.SCALAR) {
        return false;
      }
      break;
    // eslint-disable-next-line no-case-declarations
    default:
      const leftIndex = type.indexOf('[');
      const rightIndex = type.indexOf(']');
      if (leftIndex !== -1 && rightIndex !== -1 && leftIndex < rightIndex) {
        // LIST
        if (!schmaType || schmaType.kind !== 'LIST') {
          return false;
        }
      } else {
        // CUSTOM
        if (type !== schmaType.name) {
          return false;
        }
      }

      // custom

      break;
  }
  return true;
}

export function removeNotNull(type) {
  if (type.kind === 'NON_NULL' && !type.name) {
    type = type.ofType;
  }
  return type;
}

export function getReturnResultList(list) {
  const result = {};
  for (const { key = '', pass = false, message = '' } of list) {
    if ((key && message && typeof key === 'string', typeof pass === 'boolean' && typeof message === 'string')) {
      result[key] = {
        pass,
        message: () => message
      };
    }
  }

  return result;
}

export function getField(introspection, typeName, fieldName) {
  return getTypeByName(getTypeFields(introspection, typeName), fieldName);
}

export function formatField(fieldName, type) {
  const result = { fieldName, type };

  if (result.type.fieldName && typeof result.type.fieldName === 'string') {
    result.fieldName = result.type.fieldName;
  }

  // type
  if (result.type.type) {
    result.type = result.type.type;
  }
  result.type = formatType(result.type);
  return result;
}

export function formatType(type) {
  if (type && typeof type !== 'string') {
    if (type.name) {
      type = type.name;
    }
    if (Array.isArray(type) && type.length === 1 && type[0].name) {
      if (typeof type[0] !== 'string') {
        type = type[0].name.concat('[]');
      } else {
        type = type[0];
      }
    }
  }
  return type;
}

export function getSchema(introspection) {
  if (introspection && introspection.data && introspection.data.__schema) {
    return introspection.data.__schema;
  }
  return null;
}

export function getSchemaTypes(introspection) {
  const schema = getSchema(introspection);
  if (schema && schema.types) {
    return schema.types;
  }
  return null;
}

export function getType(introspection, typeName) {
  if (introspection) {
    return getTypeByName(getSchemaTypes(introspection), typeName);
  }
  return null;
}

export function getTypeFields(introspection, typeName) {
  return (getType(introspection, typeName) || {}).fields;
}

export function getTypeFieldsLen(introspection, typeName) {
  const fields = getTypeFields(introspection, typeName);
  let len = 0;
  if (fields && fields.length) {
    len = fields.length;
  }
  return len;
}

export function getQueryType(introspection) {
  const schema = getSchema(introspection);
  if (schema && schema.queryType) {
    return schema.queryType;
  }
  return null;
}

export function getTypeByName(list = [], itemName = '') {
  if (Array.isArray(list) && typeof itemName === 'string') {
    return list.find(item => item.name === itemName);
  }
  return null;
}
